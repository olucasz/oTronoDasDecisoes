(function () {
  function initOfferGallery() {
    const galleries = document.querySelectorAll("[data-offer-gallery]");

    galleries.forEach((gallery) => {
      const mainImage = gallery.querySelector("[data-offer-main-image]");
      const thumbs = Array.from(gallery.querySelectorAll("[data-offer-thumb]"));

      if (!mainImage || thumbs.length === 0) {
        return;
      }

      thumbs.forEach((thumb) => {
        thumb.addEventListener("click", () => {
          const src = thumb.dataset.offerSrc;
          const alt = thumb.dataset.offerAlt || mainImage.alt;

          if (!src || mainImage.getAttribute("src") === src) {
            return;
          }

          thumbs.forEach((item) => {
            item.setAttribute("aria-current", item === thumb ? "true" : "false");
          });

          mainImage.classList.add("is-switching");

          window.setTimeout(() => {
            mainImage.src = src;
            mainImage.alt = alt;
            mainImage.classList.remove("is-switching");
          }, 120);
        });
      });
    });
  }

  window.initOfferGallery = initOfferGallery;
})();
