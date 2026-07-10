(function () {
  document.documentElement.classList.add("js");

  window.addEventListener("DOMContentLoaded", () => {
    if (typeof window.initNavigation === "function") {
      window.initNavigation();
    }

    if (typeof window.initReveals === "function") {
      window.initReveals();
    }

    if (typeof window.initUniverseCarousel === "function") {
      window.initUniverseCarousel();
    }

    if (typeof window.initReadingViewer === "function") {
      window.initReadingViewer();
    }

    if (typeof window.initOfferGallery === "function") {
      window.initOfferGallery();
    }

    if (typeof window.initPreorderModal === "function") {
      window.initPreorderModal();
    }
  });
})();
