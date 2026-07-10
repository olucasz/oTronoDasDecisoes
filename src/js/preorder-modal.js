(function () {
  const MERCADO_PAGO_LINK_SEM_FRETE = "#";
  const MERCADO_PAGO_LINK_COM_FRETE = "#";
  const PREORDER_ENDPOINT = "/api/preorder";

  const DELIVERY_OPTIONS = {
    julho: {
      label: "Retirar no Julho para Jesus",
      summary: "Retirar no Julho para Jesus (sem frete)",
      paymentLink: MERCADO_PAGO_LINK_SEM_FRETE,
      freight: false,
    },
    casa: {
      label: "Receber em casa",
      summary: "Receber em casa (com frete)",
      paymentLink: MERCADO_PAGO_LINK_COM_FRETE,
      freight: true,
    },
    autor: {
      label: "Retirar com o autor",
      summary: "Retirar com o autor (sem frete)",
      paymentLink: MERCADO_PAGO_LINK_SEM_FRETE,
      freight: false,
    },
  };

  const ADDRESS_FIELDS = [
    "cep",
    "street",
    "city",
  ];

  const REQUIRED_ADDRESS_FIELDS = [
    "cep",
    "street",
    "city",
  ];

  function onlyDigits(value) {
    return value.replace(/\D/g, "");
  }

  function formatPhone(value) {
    const digits = onlyDigits(value).slice(0, 11);

    if (digits.length <= 2) {
      return digits.length ? `(${digits}` : "";
    }

    if (digits.length <= 6) {
      return `(${digits.slice(0, 2)}) ${digits.slice(2)}`;
    }

    if (digits.length <= 10) {
      return `(${digits.slice(0, 2)}) ${digits.slice(2, 6)}-${digits.slice(6)}`;
    }

    return `(${digits.slice(0, 2)}) ${digits.slice(2, 7)}-${digits.slice(7)}`;
  }

  function formatCep(value) {
    const digits = onlyDigits(value).slice(0, 8);

    if (digits.length <= 5) {
      return digits;
    }

    return `${digits.slice(0, 5)}-${digits.slice(5)}`;
  }

  function initPreorderModal() {
    const modal = document.querySelector("[data-preorder-modal]");

    if (!modal || modal.dataset.preorderReady === "true") {
      return;
    }

    modal.dataset.preorderReady = "true";

    const form = modal.querySelector("[data-preorder-form]");
    const dialog = modal.querySelector(".preorder-modal__dialog");
    const overlay = modal.querySelector("[data-preorder-overlay]");
    const closeButtons = modal.querySelectorAll("[data-preorder-close]");
    const backButton = modal.querySelector("[data-preorder-back]");
    const continueButton = modal.querySelector("[data-preorder-continue]");
    const paymentButton = modal.querySelector("[data-preorder-payment]");
    const stepLabel = modal.querySelector("[data-preorder-step-label]");
    const stepPanels = Array.from(modal.querySelectorAll("[data-preorder-step]"));
    const progressDots = Array.from(modal.querySelectorAll("[data-preorder-progress-dot]"));
    const addressBlock = modal.querySelector("[data-preorder-address]");
    const submitError = modal.querySelector("[data-preorder-submit-error]");
    const shippingGroup = modal.querySelector("[data-preorder-shipping]");
    const summaryAddressRow = modal.querySelector("[data-preorder-summary-address-row]");
    const summaryTargets = modal.querySelectorAll("[data-preorder-summary]");
    const preorderTitle = modal.querySelector("#preorder-title");
    const confirmTitle = modal.querySelector("#preorder-confirm-title");
    const errors = modal.querySelectorAll("[data-preorder-error]");

    const field = (name) => modal.querySelector(`[data-preorder-field="${name}"]`);
    const fields = {
      fullName: field("fullName"),
      whatsapp: field("whatsapp"),
      authorization: field("authorization"),
      cep: field("cep"),
      street: field("street"),
      city: field("city"),
    };

    const summary = Array.from(summaryTargets).reduce((items, target) => {
      items[target.dataset.preorderSummary] = target;
      return items;
    }, {});

    let activeStep = 1;
    let lastFocusedElement = null;
    let scrollPosition = 0;
    let closeTimer = 0;
    let isSubmitting = false;

    function setupDescribedBy() {
      errors.forEach((error) => {
        const name = error.dataset.preorderError;
        const input = fields[name];

        if (input && error.id) {
          input.setAttribute("aria-describedby", error.id);
        }
      });

      shippingGroup.setAttribute("aria-describedby", "preorder-delivery-error");
      fields.authorization.setAttribute("aria-describedby", "preorder-authorization-error");
    }

    function getSelectedDeliveryInput() {
      return modal.querySelector('input[name="deliveryMethod"]:checked');
    }

    function getSelectedDelivery() {
      const selected = getSelectedDeliveryInput();
      return selected ? DELIVERY_OPTIONS[selected.value] : null;
    }

    function getErrorElement(name) {
      return modal.querySelector(`[data-preorder-error="${name}"]`);
    }

    function clearError(name) {
      const error = getErrorElement(name);
      const input = fields[name];

      if (error) {
        error.textContent = "";
      }

      if (input) {
        input.removeAttribute("aria-invalid");
      }

      if (name === "deliveryMethod") {
        shippingGroup.removeAttribute("aria-invalid");
      }
    }

    function setError(name, message) {
      const error = getErrorElement(name);
      const input = fields[name];

      if (error) {
        error.textContent = message;
      }

      if (input) {
        input.setAttribute("aria-invalid", "true");
      }

      if (name === "deliveryMethod") {
        shippingGroup.setAttribute("aria-invalid", "true");
      }
    }

    function clearAllErrors() {
      errors.forEach((error) => {
        error.textContent = "";
      });

      Object.values(fields).forEach((input) => {
        if (input) {
          input.removeAttribute("aria-invalid");
        }
      });

      shippingGroup.removeAttribute("aria-invalid");

      if (submitError) {
        submitError.hidden = true;
      }
    }

    function getFieldValue(name) {
      const input = fields[name];
      return input ? input.value.trim() : "";
    }

    function isHomeDeliverySelected() {
      const selected = getSelectedDeliveryInput();
      return selected ? selected.value === "casa" : false;
    }

    function updateShippingSelection() {
      const selected = getSelectedDeliveryInput();

      modal.querySelectorAll(".preorder-shipping__option").forEach((option) => {
        const radio = option.querySelector('input[type="radio"]');
        option.classList.toggle("is-selected", Boolean(radio && selected === radio));
      });
    }

    function updateAddressVisibility() {
      const shouldShowAddress = isHomeDeliverySelected();

      addressBlock.classList.toggle("is-open", shouldShowAddress);
      addressBlock.setAttribute("aria-hidden", String(!shouldShowAddress));

      ADDRESS_FIELDS.forEach((name) => {
        const input = fields[name];

        if (input) {
          input.disabled = !shouldShowAddress;
          input.required = shouldShowAddress && REQUIRED_ADDRESS_FIELDS.includes(name);

          if (!shouldShowAddress) {
            input.removeAttribute("aria-invalid");
            clearError(name);
          }
        }
      });
    }

    function setStep(nextStep, options = {}) {
      activeStep = nextStep;

      stepPanels.forEach((panel) => {
        const isActive = panel.dataset.preorderStep === String(nextStep);
        panel.hidden = !isActive;
        panel.classList.toggle("is-active", isActive);
      });

      stepLabel.textContent = `Passo ${nextStep} de 2`;

      const hideBackButton = nextStep === 1;
      backButton.classList.toggle("is-hidden", hideBackButton);
      backButton.setAttribute("aria-hidden", String(hideBackButton));
      backButton.tabIndex = hideBackButton ? -1 : 0;

      progressDots.forEach((dot) => {
        const dotStep = Number(dot.dataset.preorderProgressDot);
        dot.classList.toggle("is-active", dotStep <= nextStep);
      });

      if (options.focus !== false) {
        window.requestAnimationFrame(() => {
          if (nextStep === 1) {
            fields.fullName.focus();
            return;
          }

          confirmTitle.setAttribute("tabindex", "-1");
          confirmTitle.focus({ preventScroll: true });
        });
      }
    }

    function resetForm() {
      form.reset();
      clearAllErrors();
      setLoading(false);
      updateShippingSelection();
      updateAddressVisibility();
      setStep(1, { focus: false });
    }

    function lockScroll() {
      scrollPosition = window.scrollY || document.documentElement.scrollTop || 0;
      document.body.style.setProperty("--preorder-scroll-y", `-${scrollPosition}px`);
      document.body.classList.add("preorder-modal-open");
    }

    function unlockScroll() {
      document.body.classList.remove("preorder-modal-open");
      document.body.style.removeProperty("--preorder-scroll-y");
      window.scrollTo(0, scrollPosition);
    }

    function getFocusableElements() {
      return Array.from(
        modal.querySelectorAll(
          'a[href], button:not([disabled]), input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])'
        )
      ).filter((element) => element.offsetParent !== null);
    }

    function focusFirstField() {
      window.requestAnimationFrame(() => {
        fields.fullName.focus();
      });
    }

    function openModal(trigger) {
      window.clearTimeout(closeTimer);
      lastFocusedElement = trigger || document.activeElement;
      resetForm();
      modal.hidden = false;
      lockScroll();

      window.requestAnimationFrame(() => {
        modal.classList.add("is-open");
        focusFirstField();
      });
    }

    function closeModal() {
      if (isSubmitting) {
        return;
      }

      modal.classList.remove("is-open");
      closeTimer = window.setTimeout(() => {
        modal.hidden = true;
        unlockScroll();

        if (lastFocusedElement && typeof lastFocusedElement.focus === "function") {
          lastFocusedElement.focus({ preventScroll: true });
        }
      }, 180);
    }

    function hasFilledData() {
      const hasText = [
        fields.fullName,
        fields.whatsapp,
        fields.cep,
        fields.street,
        fields.city,
      ].some((input) => input && input.value.trim());

      return Boolean(
        hasText ||
          getSelectedDeliveryInput() ||
          fields.authorization.checked
      );
    }

    function focusInvalidField(invalidFields) {
      const firstInvalid = invalidFields[0];

      if (!firstInvalid) {
        return;
      }

      if (firstInvalid === "deliveryMethod") {
        const firstRadio = modal.querySelector('input[name="deliveryMethod"]');
        firstRadio.focus();
        return;
      }

      const input = fields[firstInvalid];

      if (input) {
        input.focus();
      }
    }

    function validateStepOne(options = {}) {
      const invalidFields = [];
      const fullName = getFieldValue("fullName");
      const whatsappDigits = onlyDigits(getFieldValue("whatsapp"));
      const selectedDelivery = getSelectedDeliveryInput();

      clearAllErrors();

      if (!fullName) {
        invalidFields.push("fullName");
        setError("fullName", "Informe seu nome completo.");
      }

      if (whatsappDigits.length < 10) {
        invalidFields.push("whatsapp");
        setError("whatsapp", "Informe um WhatsApp válido com DDD.");
      }

      if (!selectedDelivery) {
        invalidFields.push("deliveryMethod");
        setError("deliveryMethod", "Escolha uma forma de envio.");
      }

      if (isHomeDeliverySelected()) {
        REQUIRED_ADDRESS_FIELDS.forEach((name) => {
          const value = getFieldValue(name);
          const isCep = name === "cep";

          if (!value || (isCep && onlyDigits(value).length !== 8)) {
            invalidFields.push(name);
            setError(name, getAddressErrorMessage(name));
          }
        });
      }

      if (!fields.authorization.checked) {
        invalidFields.push("authorization");
        setError(
          "authorization",
          "Confirme a autorização de contato pelo WhatsApp."
        );
      }

      if (invalidFields.length && options.focus !== false) {
        focusInvalidField(invalidFields);
      }

      return invalidFields.length === 0;
    }

    function getAddressErrorMessage(name) {
      const messages = {
        cep: "Informe um CEP válido.",
        street: "Informe rua, número e bairro.",
        city: "Informe a cidade.",
      };

      return messages[name] || "Preencha este campo.";
    }

    function formatAddressSummary() {
      const lineOne = getFieldValue("street");
      const lineTwo = getFieldValue("city");
      const lineThree = `CEP: ${getFieldValue("cep")}`;

      return `${lineOne}\n${lineTwo}\n${lineThree}`;
    }

    function updateSummary() {
      const selectedInput = getSelectedDeliveryInput();
      const delivery = getSelectedDelivery();

      summary.fullName.textContent = getFieldValue("fullName");
      summary.whatsapp.textContent = getFieldValue("whatsapp");
      summary.deliveryMethod.textContent = delivery ? delivery.summary : "";

      const hasAddress = selectedInput && selectedInput.value === "casa";

      summaryAddressRow.hidden = !hasAddress;

      if (hasAddress) {
        summary.address.textContent = formatAddressSummary();
      }
    }

    function buildPayload() {
      const selectedInput = getSelectedDeliveryInput();
      const delivery = getSelectedDelivery();
      const paymentLink = delivery ? delivery.paymentLink : "#";
      const hasAddress = selectedInput && selectedInput.value === "casa";

      return {
        nomeCompleto: getFieldValue("fullName"),
        whatsapp: getFieldValue("whatsapp"),
        formaEnvio: delivery
          ? {
              codigo: selectedInput.value,
              nome: delivery.label,
              frete: delivery.freight,
            }
          : null,
        endereco: hasAddress
          ? {
              cep: getFieldValue("cep"),
              endereco: getFieldValue("street"),
              cidade: getFieldValue("city"),
            }
          : null,
        linkPagamento: paymentLink,
        autorizacaoWhatsApp: fields.authorization.checked,
        dataHora: new Date().toISOString(),
        paginaOrigem: window.location.href,
        userAgent: navigator.userAgent,
        status: "redirect_to_payment",
      };
    }

    async function sendPreorder(payload) {
      // O endpoint deve ser implementado no backend/serverless. Nao coloque
      // tokens, SMTP ou credenciais no front-end.
      const response = await fetch(PREORDER_ENDPOINT, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        throw new Error(`Preorder endpoint failed with status ${response.status}`);
      }

      const contentType = response.headers.get("content-type") || "";

      if (!contentType.includes("application/json")) {
        return {};
      }

      return response.json();
    }

    function setLoading(loading) {
      isSubmitting = loading;
      paymentButton.disabled = loading;
      paymentButton.setAttribute("aria-busy", String(loading));

      const label = paymentButton.querySelector("span");

      if (label) {
        label.textContent = loading
          ? "Registrando seus dados"
          : "Ir para pagamento seguro";
      }
    }

    async function handlePaymentSubmit() {
      if (!validateStepOne({ focus: false })) {
        setStep(1);
        return;
      }

      const payload = buildPayload();

      submitError.hidden = true;
      setLoading(true);

      try {
        const result = await sendPreorder(payload);
        window.location.assign(result.paymentLink || payload.linkPagamento);
      } catch (error) {
        submitError.hidden = false;
        setLoading(false);
      }
    }

    function handleTriggerClick(event) {
      const trigger = event.target.closest("[data-preorder-trigger]");

      if (!trigger) {
        return;
      }

      event.preventDefault();
      openModal(trigger);
    }

    function handleKeydown(event) {
      if (modal.hidden) {
        return;
      }

      if (event.key === "Escape") {
        event.preventDefault();
        closeModal();
        return;
      }

      if (event.key !== "Tab") {
        return;
      }

      const focusableElements = getFocusableElements();

      if (!focusableElements.length) {
        event.preventDefault();
        return;
      }

      const firstElement = focusableElements[0];
      const lastElement = focusableElements[focusableElements.length - 1];

      if (event.shiftKey && document.activeElement === firstElement) {
        event.preventDefault();
        lastElement.focus();
        return;
      }

      if (!event.shiftKey && document.activeElement === lastElement) {
        event.preventDefault();
        firstElement.focus();
      }
    }

    function bindFieldEvents() {
      fields.whatsapp.addEventListener("input", () => {
        fields.whatsapp.value = formatPhone(fields.whatsapp.value);
        clearError("whatsapp");
      });

      fields.cep.addEventListener("input", () => {
        fields.cep.value = formatCep(fields.cep.value);
        clearError("cep");
      });

      [fields.fullName, fields.street, fields.city].forEach((input) => {
        input.addEventListener("input", () => clearError(input.dataset.preorderField));
        input.addEventListener("change", () => clearError(input.dataset.preorderField));
      });

      fields.authorization.addEventListener("change", () => {
        clearError("authorization");
      });

      modal.querySelectorAll('input[name="deliveryMethod"]').forEach((radio) => {
        radio.addEventListener("change", () => {
          clearError("deliveryMethod");
          updateShippingSelection();
          updateAddressVisibility();
        });
      });
    }

    setupDescribedBy();
    bindFieldEvents();
    updateAddressVisibility();

    document.addEventListener("click", handleTriggerClick);
    document.addEventListener("keydown", handleKeydown);

    closeButtons.forEach((button) => {
      button.addEventListener("click", closeModal);
    });

    overlay.addEventListener("click", () => {
      if (!hasFilledData()) {
        closeModal();
      }
    });

    backButton.addEventListener("click", () => {
      setStep(1);
    });

    continueButton.addEventListener("click", () => {
      if (!validateStepOne()) {
        return;
      }

      updateSummary();
      setStep(2);
    });

    form.addEventListener("submit", (event) => {
      event.preventDefault();

      if (activeStep === 1) {
        continueButton.click();
        return;
      }

      handlePaymentSubmit();
    });

    preorderTitle.setAttribute("tabindex", "-1");
  }

  window.initPreorderModal = initPreorderModal;
})();
