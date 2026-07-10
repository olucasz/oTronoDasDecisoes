# O Trono das Decisões

Landing page de pré-venda do livro **O Trono das Decisões**, de Mateus Chaves Generoso.

## Como executar

Instale as dependências:

```bash
npm install
```

Execute em modo local. Nesse modo o envio de email fica em `dry-run`, sem chamar o SMTP:

```bash
npm run dev
```

Depois acesse:

```txt
http://localhost:5173
```

## Envio do modal de compra

O modal envia os dados para `POST /api/preorder`. O servidor Node registra a intenção de compra enviando um email formatado para o autor via SMTP e devolve o link de pagamento correto para o redirecionamento.

Sem a API oficial da Meta, o WhatsApp não é enviado automaticamente para o comprador. O email recebido pelo autor inclui um botão com link `wa.me` que abre a conversa com a mensagem já preenchida, pronta para revisar e enviar.

Variáveis necessárias em produção:

```bash
PORT=5173
EMAIL_DRY_RUN=false
SMTP_HOST=smtp.gmail.com
SMTP_PORT=465
SMTP_SECURE=true
SMTP_USER=seuemail@gmail.com
SMTP_PASS=sua_senha_de_app_do_gmail
EMAIL_FROM="O Trono <seuemail@gmail.com>"
AUTHOR_EMAIL=autor@seudominio.com
EMAIL_REPLY_TO=seuemail@gmail.com
MERCADO_PAGO_LINK_SEM_FRETE=https://www.mercadopago.com.br/seu-link-sem-frete
MERCADO_PAGO_LINK_COM_FRETE=https://www.mercadopago.com.br/seu-link-com-frete
WHATSAPP_COUNTRY_CODE=55
```

Na Hostinger, configure essas variáveis no painel da aplicação Node. Para Gmail, use `SMTP_PASS` como senha de app e não a senha normal da conta. `EMAIL_FROM` deve ser o mesmo Gmail usado em `SMTP_USER` ou um alias autorizado pelo provedor.

Comandos para produção:

```bash
npm install
npm start
```

## Checklist para Hostinger

Aplicação Node.js:

```txt
Arquivo de entrada: server.js
Comando de instalação: npm install --omit=dev
Comando de inicialização: npm start
Versão do Node: 18 ou superior
```

Antes de apontar o domínio:

- Configure as variáveis do `.env.example` no painel da aplicação Node da Hostinger.
- Troque `SITE_URL`, `robots.txt`, `sitemap.xml` e as metas em `index.html` se o domínio final não for `https://otronodasdecisoes.com.br/`.
- Confirme os links reais do Mercado Pago em `MERCADO_PAGO_LINK_SEM_FRETE` e `MERCADO_PAGO_LINK_COM_FRETE`.
- Mantenha `EMAIL_DRY_RUN=false` em produção.
- Faça um teste completo do modal e confirme se o email chegou para `AUTHOR_EMAIL`.

Arquivos necessários no deploy:

- `index.html`
- `server.js`
- `package.json`
- `package-lock.json`
- `.env.example` apenas como referência, sem subir `.env` real se a Hostinger já guarda variáveis no painel
- `public/`
- `src/`
- `robots.txt`
- `sitemap.xml`
- `llms.txt`

Não é necessário subir pastas de referência, arquivos `.DS_Store`, `.tmp`, PRDs antigos ou `node_modules/`.

## Estrutura

- `server.js` — servidor Node, endpoint `/api/preorder` e arquivos estáticos.
- `index.html` — landing page e modal de compra.
- `docs/PROJECT_CONTEXT.md` — contexto visual, decisões e direção técnica.
- `docs/ASSET_MANIFEST.md` — inventário dos assets principais.
- `public/assets/` — assets organizados para uso na landing.
- `src/styles/` — CSS dividido por tokens, base, layout, componentes e seções.
- `src/js/` — JavaScript da landing, interações e modal de compra.
