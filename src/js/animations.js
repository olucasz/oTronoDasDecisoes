(function () {
  function initReveals() {
    const revealItems = document.querySelectorAll("[data-reveal]");

    if (!revealItems.length) {
      return;
    }

    document.documentElement.classList.add("reveal-ready");

    function revealHashTarget() {
      const targetId = window.location.hash.slice(1);

      if (!targetId) {
        return;
      }

      const target = document.getElementById(decodeURIComponent(targetId));

      if (!target) {
        return;
      }

      if (target.matches("[data-reveal]")) {
        target.classList.add("is-visible");
      }

      target
        .querySelectorAll("[data-reveal]")
        .forEach((item) => item.classList.add("is-visible"));
    }

    if (!("IntersectionObserver" in window)) {
      revealItems.forEach((item) => item.classList.add("is-visible"));
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("is-visible");
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.2 }
    );

    revealItems.forEach((item) => {
      const rect = item.getBoundingClientRect();
      const isInitiallyVisible = rect.top < window.innerHeight && rect.bottom > 0;

      if (isInitiallyVisible) {
        item.classList.add("is-visible");
        return;
      }

      observer.observe(item);
    });

    revealHashTarget();
    window.addEventListener("hashchange", revealHashTarget);
  }

  window.initReveals = initReveals;
})();
