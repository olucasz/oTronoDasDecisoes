(function () {
  function initNavigation() {
    const header = document.querySelector("[data-header]");
    const toggle = document.querySelector("[data-menu-toggle]");
    const label = document.querySelector("[data-menu-label]");
    const nav = document.querySelector("[data-nav]");

    if (!header || !toggle || !nav) {
      return;
    }

    const setOpen = (isOpen) => {
      header.classList.toggle("is-nav-open", isOpen);
      document.body.classList.toggle("nav-open", isOpen);
      toggle.setAttribute("aria-expanded", String(isOpen));

      if (label) {
        label.textContent = isOpen ? "Fechar menu" : "Abrir menu";
      }
    };

    toggle.addEventListener("click", () => {
      const isOpen = toggle.getAttribute("aria-expanded") === "true";
      setOpen(!isOpen);
    });

    nav.addEventListener("click", (event) => {
      if (event.target.closest("a")) {
        setOpen(false);
      }
    });

    document.addEventListener("keydown", (event) => {
      if (event.key === "Escape") {
        setOpen(false);
      }
    });

    window.addEventListener("resize", () => {
      if (window.matchMedia("(min-width: 64rem)").matches) {
        setOpen(false);
      }
    });
  }

  window.initNavigation = initNavigation;
})();
