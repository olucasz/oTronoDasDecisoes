const fs = require("fs");
const http = require("http");
const path = require("path");
const nodemailer = require("nodemailer");

const ROOT_DIR = __dirname;

loadLocalEnv();

const PORT = Number(process.env.PORT || 5173);
const MAX_BODY_BYTES = 64 * 1024;
const RATE_LIMIT_WINDOW_MS = Number(process.env.RATE_LIMIT_WINDOW_MS || 10 * 60 * 1000);
const RATE_LIMIT_MAX = Number(process.env.RATE_LIMIT_MAX || 10);
const WHATSAPP_COUNTRY_CODE = process.env.WHATSAPP_COUNTRY_CODE || "55";

const DELIVERY_OPTIONS = {
  julho: {
    label: "Retirar no Julho para Jesus",
    summary: "Retirar no Julho para Jesus (sem frete)",
    paymentEnv: "MERCADO_PAGO_LINK_SEM_FRETE",
    fallbackPaymentEnv: "PAYMENT_LINK_SEM_FRETE",
    requiresAddress: false,
  },
  casa: {
    label: "Receber em casa",
    summary: "Receber em casa (com frete)",
    paymentEnv: "MERCADO_PAGO_LINK_COM_FRETE",
    fallbackPaymentEnv: "PAYMENT_LINK_COM_FRETE",
    requiresAddress: true,
  },
  autor: {
    label: "Retirar com o autor",
    summary: "Retirar com o autor (sem frete)",
    paymentEnv: "MERCADO_PAGO_LINK_SEM_FRETE",
    fallbackPaymentEnv: "PAYMENT_LINK_SEM_FRETE",
    requiresAddress: false,
  },
};

const MIME_TYPES = {
  ".css": "text/css; charset=utf-8",
  ".gif": "image/gif",
  ".html": "text/html; charset=utf-8",
  ".ico": "image/x-icon",
  ".jpeg": "image/jpeg",
  ".jpg": "image/jpeg",
  ".js": "text/javascript; charset=utf-8",
  ".json": "application/json; charset=utf-8",
  ".otf": "font/otf",
  ".pdf": "application/pdf",
  ".png": "image/png",
  ".svg": "image/svg+xml",
  ".ttf": "font/ttf",
  ".txt": "text/plain; charset=utf-8",
  ".webp": "image/webp",
};

const rateLimitBuckets = new Map();

function loadLocalEnv() {
  const envPath = path.join(ROOT_DIR, ".env");
  let content;

  try {
    content = fs.readFileSync(envPath, "utf8");
  } catch (error) {
    if (error.code !== "ENOENT") {
      console.warn("[env] Nao foi possivel ler .env:", error.message);
    }
    return;
  }

  content.split(/\r?\n/).forEach((line) => {
    const trimmed = line.trim();

    if (!trimmed || trimmed.startsWith("#")) {
      return;
    }

    const separatorIndex = trimmed.indexOf("=");

    if (separatorIndex === -1) {
      return;
    }

    const key = trimmed.slice(0, separatorIndex).trim();
    let value = trimmed.slice(separatorIndex + 1).trim();

    if (!key || process.env[key] !== undefined) {
      return;
    }

    if (
      (value.startsWith('"') && value.endsWith('"')) ||
      (value.startsWith("'") && value.endsWith("'"))
    ) {
      value = value.slice(1, -1);
    }

    process.env[key] = value;
  });
}

function onlyDigits(value) {
  return String(value || "").replace(/\D/g, "");
}

function parseBooleanEnv(value, fallback = false) {
  if (value === undefined || value === null || value === "") {
    return fallback;
  }

  return ["1", "true", "yes", "on"].includes(String(value).toLowerCase());
}

function parsePortEnv(value, fallback) {
  const parsed = Number(value);

  if (!Number.isInteger(parsed) || parsed <= 0 || parsed > 65535) {
    return fallback;
  }

  return parsed;
}

function splitRecipientList(value) {
  return String(value || "")
    .split(",")
    .map((item) => item.trim())
    .filter(Boolean);
}

function extractEmailAddress(value) {
  const trimmed = String(value || "").trim();

  if (!trimmed) {
    return "";
  }

  const angleMatch = trimmed.match(/<([^>]+)>/);

  if (angleMatch && angleMatch[1]) {
    return angleMatch[1].trim();
  }

  const plainMatch = trimmed.match(/[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}/i);

  return plainMatch ? plainMatch[0] : trimmed;
}

function hasEmailAddress(value) {
  return /[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}/i.test(String(value || ""));
}

function redactEmailAddress(value) {
  const email = extractEmailAddress(value);

  if (!email || !email.includes("@")) {
    return "missing";
  }

  const [localPart, domainPart] = email.split("@");
  const visibleLocal = localPart.slice(0, 2) || "**";

  return `${visibleLocal}***@${domainPart}`;
}

function compactText(value, maxLength = 240) {
  return String(value || "")
    .replace(/\s+/g, " ")
    .trim()
    .slice(0, maxLength);
}

function escapeHtml(value) {
  return String(value || "")
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}

function createHttpError(statusCode, publicMessage, details) {
  const error = new Error(details || publicMessage);
  error.statusCode = statusCode;
  error.publicMessage = publicMessage;
  return error;
}

function sendJson(res, statusCode, payload) {
  const body = JSON.stringify(payload);

  res.writeHead(statusCode, {
    "Content-Type": "application/json; charset=utf-8",
    "Content-Length": Buffer.byteLength(body),
    "Cache-Control": "no-store",
  });
  res.end(body);
}

function getRequestIp(req) {
  const forwardedFor = req.headers["x-forwarded-for"];

  if (typeof forwardedFor === "string" && forwardedFor.trim()) {
    return forwardedFor.split(",")[0].trim();
  }

  return req.socket.remoteAddress || "unknown";
}

function isRateLimited(ip) {
  const now = Date.now();
  const current = rateLimitBuckets.get(ip);

  if (!current || now - current.startedAt > RATE_LIMIT_WINDOW_MS) {
    rateLimitBuckets.set(ip, { count: 1, startedAt: now });
    return false;
  }

  current.count += 1;
  return current.count > RATE_LIMIT_MAX;
}

async function readJsonBody(req) {
  const chunks = [];
  let totalBytes = 0;

  for await (const chunk of req) {
    totalBytes += chunk.length;

    if (totalBytes > MAX_BODY_BYTES) {
      throw createHttpError(413, "Dados enviados sao muito grandes.");
    }

    chunks.push(chunk);
  }

  if (!chunks.length) {
    throw createHttpError(400, "Nenhum dado foi enviado.");
  }

  try {
    return JSON.parse(Buffer.concat(chunks).toString("utf8"));
  } catch (error) {
    throw createHttpError(400, "Formato dos dados invalido.", error.message);
  }
}

function normalizePreorder(rawPayload) {
  const deliveryCode = compactText(rawPayload && rawPayload.formaEnvio && rawPayload.formaEnvio.codigo, 40);
  const delivery = DELIVERY_OPTIONS[deliveryCode];

  if (!delivery) {
    throw createHttpError(400, "Escolha uma forma de envio valida.");
  }

  const fullName = compactText(rawPayload.nomeCompleto, 160);
  const whatsapp = compactText(rawPayload.whatsapp, 40);
  const whatsappDigits = onlyDigits(whatsapp);
  const authorization = rawPayload.autorizacaoWhatsApp === true;

  if (!fullName) {
    throw createHttpError(400, "Informe seu nome completo.");
  }

  if (whatsappDigits.length < 10) {
    throw createHttpError(400, "Informe um WhatsApp valido com DDD.");
  }

  if (!authorization) {
    throw createHttpError(400, "Confirme a autorizacao de contato pelo WhatsApp.");
  }

  const address = delivery.requiresAddress
    ? {
        cep: compactText(rawPayload.endereco && rawPayload.endereco.cep, 20),
        endereco: compactText(rawPayload.endereco && rawPayload.endereco.endereco, 240),
        cidade: compactText(rawPayload.endereco && rawPayload.endereco.cidade, 120),
      }
    : null;

  if (delivery.requiresAddress) {
    if (onlyDigits(address.cep).length !== 8 || !address.endereco || !address.cidade) {
      throw createHttpError(400, "Informe CEP, endereco e cidade.");
    }
  }

  return {
    fullName,
    whatsapp,
    whatsappDigits,
    deliveryCode,
    delivery,
    address,
    pageOrigin: compactText(rawPayload.paginaOrigem, 500),
    userAgent: compactText(rawPayload.userAgent, 500),
    submittedAt: rawPayload.dataHora || new Date().toISOString(),
  };
}

function getPaymentLink(preorder, rawPayload, dryRun) {
  const paymentLink =
    process.env[preorder.delivery.paymentEnv] ||
    process.env[preorder.delivery.fallbackPaymentEnv] ||
    compactText(rawPayload.linkPagamento, 500);

  if (dryRun) {
    return paymentLink || "#";
  }

  if (!paymentLink || paymentLink === "#" || !/^https?:\/\//i.test(paymentLink)) {
    throw createHttpError(500, "Link de pagamento nao configurado.");
  }

  return paymentLink;
}

function buildSmtpTransport() {
  const smtpHost = process.env.SMTP_HOST || "smtp.gmail.com";
  const smtpPort = parsePortEnv(process.env.SMTP_PORT, 465);
  const smtpSecure =
    process.env.SMTP_SECURE !== undefined
      ? parseBooleanEnv(process.env.SMTP_SECURE, smtpPort === 465)
      : smtpPort === 465;
  const smtpUser =
    process.env.SMTP_USER ||
    (hasEmailAddress(process.env.EMAIL_FROM)
      ? extractEmailAddress(process.env.EMAIL_FROM)
      : "");
  const smtpPass = process.env.SMTP_PASS;

  if (!smtpUser || !smtpPass) {
    throw new Error("SMTP_USER (ou EMAIL_FROM) e SMTP_PASS precisam estar configurados.");
  }

  return nodemailer.createTransport({
    host: smtpHost,
    port: smtpPort,
    secure: smtpSecure,
    auth: {
      user: smtpUser,
      pass: smtpPass,
    },
  });
}

function getWhatsappNumber(digits) {
  const countryCode = onlyDigits(WHATSAPP_COUNTRY_CODE) || "55";

  if (digits.startsWith(countryCode) && digits.length >= countryCode.length + 10) {
    return digits;
  }

  return `${countryCode}${digits}`;
}

function getAddressLines(address) {
  if (!address) {
    return [];
  }

  return [
    `CEP: ${address.cep}`,
    `Endereço: ${address.endereco}`,
    `Cidade: ${address.cidade}`,
  ];
}

function buildBuyerWhatsappMessage(preorder) {
  const addressLines = getAddressLines(preorder.address);
  const lines = [
    `Olá, ${preorder.fullName}! Obrigado pela compra do livro O Trono das Decisões.`,
    "",
    "Recebemos seus dados e vamos confirmar as informações por aqui:",
    `Nome: ${preorder.fullName}`,
    `WhatsApp: ${preorder.whatsapp}`,
    `Forma de entrega: ${preorder.delivery.summary}`,
    ...addressLines,
    "",
    "Assim que o pagamento for confirmado, seguimos com a próxima etapa.",
  ];

  return lines.join("\n");
}

function buildAuthorEmail(preorder, paymentLink, whatsappLink) {
  const addressLines = getAddressLines(preorder.address);
  const submittedAt = new Date(preorder.submittedAt);
  const submittedAtText = Number.isNaN(submittedAt.getTime())
    ? preorder.submittedAt
    : submittedAt.toLocaleString("pt-BR", { timeZone: "America/Sao_Paulo" });

  const fields = [
    ["Nome", preorder.fullName],
    ["WhatsApp", preorder.whatsapp],
    ["Forma de entrega", preorder.delivery.summary],
    ...addressLines.map((line) => {
      const [label, ...value] = line.split(": ");
      return [label, value.join(": ")];
    }),
    ["Link de pagamento", paymentLink],
    ["Pagina de origem", preorder.pageOrigin || "Nao informado"],
    ["Data e hora", submittedAtText],
  ];

  const text = [
    "Nova intenção de compra - O Trono das Decisões",
    "",
    "Uma pessoa clicou para comprar e foi redirecionada para o pagamento.",
    "",
    ...fields.map(([label, value]) => `${label}: ${value}`),
    "",
    "Mensagem pronta para WhatsApp:",
    buildBuyerWhatsappMessage(preorder),
    "",
    `Abrir conversa: ${whatsappLink}`,
  ].join("\n");

  const rows = fields
    .map(
      ([label, value]) => `
        <tr>
          <th style="padding:10px 12px;text-align:left;border-bottom:1px solid #eadfce;color:#5e4632;width:180px;">${escapeHtml(label)}</th>
          <td style="padding:10px 12px;border-bottom:1px solid #eadfce;color:#241b14;">${escapeHtml(value)}</td>
        </tr>`
    )
    .join("");

  const html = `
    <div style="font-family:Verdana,Geneva,sans-serif;background:#f7f1e7;padding:24px;color:#241b14;">
      <div style="max-width:680px;margin:0 auto;background:#fffaf2;border:1px solid #eadfce;border-radius:12px;overflow:hidden;">
        <div style="padding:22px 24px;background:#241b14;color:#fffaf2;">
          <p style="margin:0 0 6px;font-size:13px;letter-spacing:.08em;text-transform:uppercase;color:#d5b26d;">Pré-venda</p>
          <h1 style="margin:0;font-size:24px;line-height:1.25;">Nova intenção de compra</h1>
        </div>
        <div style="padding:24px;">
          <p style="margin:0 0 18px;font-size:16px;line-height:1.5;">Uma pessoa clicou para comprar <strong>O Trono das Decisões</strong> e foi redirecionada para o pagamento.</p>
          <table style="width:100%;border-collapse:collapse;background:#fff;border:1px solid #eadfce;border-radius:8px;overflow:hidden;">${rows}</table>
          <div style="margin-top:22px;padding:18px;background:#f7f1e7;border-radius:8px;">
            <h2 style="margin:0 0 10px;font-size:18px;">Mensagem pronta para WhatsApp</h2>
            <pre style="white-space:pre-wrap;margin:0;font-family:Verdana,Geneva,sans-serif;font-size:14px;line-height:1.5;color:#241b14;">${escapeHtml(buildBuyerWhatsappMessage(preorder))}</pre>
          </div>
          <p style="margin:22px 0 0;">
            <a href="${escapeHtml(whatsappLink)}" style="display:inline-block;background:#1f8f55;color:#fff;text-decoration:none;padding:12px 18px;border-radius:8px;font-weight:bold;">Abrir conversa no WhatsApp</a>
          </p>
        </div>
      </div>
    </div>`;

  return {
    subject: "Nova intenção de compra - O Trono das Decisões",
    text,
    html,
  };
}

async function sendEmail(email) {
  const dryRun = process.env.EMAIL_DRY_RUN === "true";
  const authorEmail = process.env.AUTHOR_EMAIL;
  const emailReplyTo = process.env.EMAIL_REPLY_TO;
  const smtpUser =
    process.env.SMTP_USER ||
    (hasEmailAddress(process.env.EMAIL_FROM)
      ? extractEmailAddress(process.env.EMAIL_FROM)
      : "");
  const smtpPass = process.env.SMTP_PASS;
  const emailFrom = hasEmailAddress(process.env.EMAIL_FROM) ? process.env.EMAIL_FROM : smtpUser;

  if (dryRun) {
    console.info("[preorder:dry-run]", {
      from: redactEmailAddress(emailFrom || smtpUser),
      to: redactEmailAddress(authorEmail),
      subject: email.subject,
    });
    return { messageId: "dry-run" };
  }

  if (!authorEmail || !smtpUser || !smtpPass) {
    throw new Error("AUTHOR_EMAIL, SMTP_USER (ou EMAIL_FROM) e SMTP_PASS precisam estar configurados.");
  }

  const transporter = buildSmtpTransport();
  const emailPayload = {
    from: emailFrom,
    to: splitRecipientList(authorEmail),
    subject: email.subject,
    html: email.html,
    text: email.text,
  };

  if (emailReplyTo) {
    const replyTo = splitRecipientList(emailReplyTo);

    if (replyTo.length === 1) {
      emailPayload.replyTo = replyTo[0];
    } else if (replyTo.length > 1) {
      emailPayload.replyTo = replyTo;
    }
  }

  const result = await transporter.sendMail(emailPayload);

  return {
    messageId: result.messageId || null,
  };
}

async function handlePreorder(req, res) {
  if (req.method !== "POST") {
    res.writeHead(405, { Allow: "POST" });
    res.end();
    return;
  }

  if (!String(req.headers["content-type"] || "").includes("application/json")) {
    throw createHttpError(415, "Envie os dados em JSON.");
  }

  const ip = getRequestIp(req);

  if (isRateLimited(ip)) {
    throw createHttpError(429, "Muitas tentativas. Tente novamente em alguns minutos.");
  }

  const rawPayload = await readJsonBody(req);
  const preorder = normalizePreorder(rawPayload);
  const dryRun = process.env.EMAIL_DRY_RUN === "true";
  const paymentLink = getPaymentLink(preorder, rawPayload, dryRun);
  const whatsappNumber = getWhatsappNumber(preorder.whatsappDigits);
  const whatsappMessage = buildBuyerWhatsappMessage(preorder);
  const whatsappLink = `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(whatsappMessage)}`;
  const email = buildAuthorEmail(preorder, paymentLink, whatsappLink);

  const delivery = await sendEmail(email);

  sendJson(res, 200, {
    ok: true,
    dryRun,
    paymentLink,
    messageId: delivery.messageId || null,
  });
}

function getSafeStaticPath(pathname) {
  let decodedPathname;

  try {
    decodedPathname = decodeURIComponent(pathname);
  } catch (error) {
    throw createHttpError(400, "Caminho invalido.");
  }

  const normalizedPathname = path.posix.normalize(decodedPathname);
  const isAllowedPath =
    normalizedPathname === "/" ||
    normalizedPathname === "/index.html" ||
    normalizedPathname.startsWith("/reading/") ||
    normalizedPathname.startsWith("/public/") ||
    normalizedPathname.startsWith("/src/");

  if (!isAllowedPath) {
    return null;
  }

  const relativePath = normalizedPathname === "/" ? "index.html" : normalizedPathname.slice(1);
  const segments = relativePath.split("/").filter(Boolean);

  if (segments.some((segment) => segment.startsWith("."))) {
    return null;
  }

  const filePath = path.join(ROOT_DIR, relativePath);
  const relativeToRoot = path.relative(ROOT_DIR, filePath);

  if (relativeToRoot.startsWith("..") || path.isAbsolute(relativeToRoot)) {
    return null;
  }

  return filePath;
}

async function serveStatic(req, res, pathname) {
  if (req.method !== "GET" && req.method !== "HEAD") {
    res.writeHead(405, { Allow: "GET, HEAD" });
    res.end();
    return;
  }

  const filePath = getSafeStaticPath(pathname);

  if (!filePath) {
    res.writeHead(404, { "Content-Type": "text/plain; charset=utf-8" });
    res.end("Nao encontrado.");
    return;
  }

  let stat;

  try {
    stat = await fs.promises.stat(filePath);
  } catch (error) {
    res.writeHead(404, { "Content-Type": "text/plain; charset=utf-8" });
    res.end("Nao encontrado.");
    return;
  }

  if (!stat.isFile()) {
    res.writeHead(404, { "Content-Type": "text/plain; charset=utf-8" });
    res.end("Nao encontrado.");
    return;
  }

  const extension = path.extname(filePath).toLowerCase();
  const headers = {
    "Content-Type": MIME_TYPES[extension] || "application/octet-stream",
    "Content-Length": stat.size,
    "X-Content-Type-Options": "nosniff",
  };

  if (extension === ".html") {
    headers["Cache-Control"] = "no-store";
  } else {
    headers["Cache-Control"] = "public, max-age=3600";
  }

  res.writeHead(200, headers);

  if (req.method === "HEAD") {
    res.end();
    return;
  }

  fs.createReadStream(filePath).pipe(res);
}

const server = http.createServer(async (req, res) => {
  try {
    const requestUrl = new URL(req.url, `http://${req.headers.host || "localhost"}`);

    if (requestUrl.pathname === "/api/preorder") {
      await handlePreorder(req, res);
      return;
    }

    await serveStatic(req, res, requestUrl.pathname);
  } catch (error) {
    const statusCode = error.statusCode || 500;

    if (statusCode >= 500) {
      console.error("[preorder:error]", error);
    }

    sendJson(res, statusCode, {
      error: error.publicMessage || "Nao foi possivel registrar seus dados agora.",
    });
  }
});

server.listen(PORT, () => {
  console.info(`Servidor iniciado em http://localhost:${PORT}`);
});
