(function () {
  function initOfferGallery() {
    const galleries = document.querySelectorAll("[data-offer-gallery]");

    galleries.forEach((gallery) => {
      const mainImage = gallery.querySelector("[data-offer-main-image]");
      const slides = Array.from(gallery.querySelectorAll("[data-offer-slide]"));
      const controls = Array.from(gallery.querySelectorAll("[data-offer-direction]"));

      if (!mainImage || slides.length === 0) {
        return;
      }

      let currentIndex = slides.findIndex(
        (slide) => slide.getAttribute("aria-current") === "true"
      );

      if (currentIndex < 0) {
        currentIndex = 0;
      }

      let switchTimer;

      function showSlide(nextIndex) {
        const index = (nextIndex + slides.length) % slides.length;
        const slide = slides[index];
        const src = slide.dataset.offerSrc;
        const alt = slide.dataset.offerAlt || mainImage.alt;

        if (!src || index === currentIndex) {
          return;
        }

        slides.forEach((item, itemIndex) => {
          item.setAttribute("aria-current", itemIndex === index ? "true" : "false");
        });

        currentIndex = index;
        mainImage.classList.add("is-switching");
        window.clearTimeout(switchTimer);

        switchTimer = window.setTimeout(() => {
          mainImage.src = src;
          mainImage.alt = alt;
          mainImage.classList.remove("is-switching");
        }, 120);
      }

      slides.forEach((slide, index) => {
        slide.addEventListener("click", () => {
          showSlide(index);
        });
      });

      controls.forEach((control) => {
        control.addEventListener("click", () => {
          const step = control.dataset.offerDirection === "prev" ? -1 : 1;
          showSlide(currentIndex + step);
        });
      });
    });
  }

  window.initOfferGallery = initOfferGallery;
})();
