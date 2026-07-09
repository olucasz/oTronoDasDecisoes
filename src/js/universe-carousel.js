(function () {
  const mobileQuery = window.matchMedia("(max-width: 63.9375rem)");

  function initUniverseCarousel() {
    const carousel = document.querySelector("[data-universe-carousel]");

    if (!carousel) {
      return;
    }

    const track = carousel.querySelector("[data-universe-track]");
    const cards = Array.from(carousel.querySelectorAll("[data-universe-card]"));
    const prevButton = carousel.querySelector("[data-universe-prev]");
    const nextButton = carousel.querySelector("[data-universe-next]");
    const dotsContainer = carousel.parentElement.querySelector("[data-universe-dots]");

    if (!track || cards.length === 0 || !dotsContainer) {
      return;
    }

    let activeIndex = cards.findIndex((card) => card.hasAttribute("data-universe-initial"));
    let scrollFrame = 0;
    const dots = [];

    if (activeIndex < 0) {
      activeIndex = 0;
    }

    const normalize = (index) => (index + cards.length) % cards.length;

    const getRelativeIndex = (index) => {
      let relative = index - activeIndex;
      const midpoint = cards.length / 2;

      if (relative > midpoint) {
        relative -= cards.length;
      }

      if (relative < -midpoint) {
        relative += cards.length;
      }

      return relative;
    };

    const getPositionClass = (relative) => {
      if (relative === 0) {
        return "is-active";
      }

      if (relative === -1) {
        return "is-near-left";
      }

      if (relative === 1) {
        return "is-near-right";
      }

      if (relative === -2) {
        return "is-left";
      }

      if (relative === 2) {
        return "is-right";
      }

      return relative < 0 ? "is-far-left" : "is-far-right";
    };

    const updateState = () => {
      cards.forEach((card, index) => {
        const positionClass = getPositionClass(getRelativeIndex(index));
        const isActive = index === activeIndex;

        card.classList.remove(
          "is-active",
          "is-near-left",
          "is-near-right",
          "is-left",
          "is-right",
          "is-far-left",
          "is-far-right"
        );
        card.classList.add(positionClass);
        if (isActive) {
          card.setAttribute("aria-current", "true");
        } else {
          card.removeAttribute("aria-current");
        }
      });

      dots.forEach((dot, index) => {
        const isActive = index === activeIndex;

        if (isActive) {
          dot.setAttribute("aria-current", "true");
        } else {
          dot.removeAttribute("aria-current");
        }
      });
    };

    const scrollToActiveCard = (smooth = true) => {
      if (!mobileQuery.matches) {
        return;
      }

      const activeCard = cards[activeIndex];

      if (!activeCard) {
        return;
      }

      const left = activeCard.offsetLeft - (track.clientWidth - activeCard.clientWidth) / 2;

      track.scrollTo({
        left,
        behavior: smooth ? "smooth" : "auto",
      });
    };

    const goTo = (index, shouldScroll = true) => {
      activeIndex = normalize(index);
      updateState();

      if (shouldScroll) {
        scrollToActiveCard();
      }
    };

    const syncFromScroll = () => {
      if (!mobileQuery.matches) {
        return;
      }

      const trackCenter = track.scrollLeft + track.clientWidth / 2;
      let nearestIndex = activeIndex;
      let nearestDistance = Number.POSITIVE_INFINITY;

      cards.forEach((card, index) => {
        const cardCenter = card.offsetLeft + card.clientWidth / 2;
        const distance = Math.abs(cardCenter - trackCenter);

        if (distance < nearestDistance) {
          nearestDistance = distance;
          nearestIndex = index;
        }
      });

      if (nearestIndex !== activeIndex) {
        activeIndex = nearestIndex;
        updateState();
      }
    };

    cards.forEach((card, index) => {
      card.addEventListener("click", () => goTo(index));
    });

    prevButton?.addEventListener("click", () => goTo(activeIndex - 1));
    nextButton?.addEventListener("click", () => goTo(activeIndex + 1));

    cards.forEach((card, index) => {
      const dot = document.createElement("button");
      const title = card.dataset.universeTitle || `Item ${index + 1}`;

      dot.className = "universe-carousel__dot";
      dot.type = "button";
      dot.setAttribute("aria-label", `Mostrar ${title}`);
      dot.addEventListener("click", () => goTo(index));
      dotsContainer.append(dot);
      dots.push(dot);
    });

    track.addEventListener("scroll", () => {
      window.cancelAnimationFrame(scrollFrame);
      scrollFrame = window.requestAnimationFrame(syncFromScroll);
    });

    const handleViewportChange = () => {
      updateState();
      scrollToActiveCard(false);
    };

    if (typeof mobileQuery.addEventListener === "function") {
      mobileQuery.addEventListener("change", handleViewportChange);
    } else if (typeof mobileQuery.addListener === "function") {
      mobileQuery.addListener(handleViewportChange);
    }

    updateState();
    window.requestAnimationFrame(() => scrollToActiveCard(false));
  }

  window.initUniverseCarousel = initUniverseCarousel;
})();
