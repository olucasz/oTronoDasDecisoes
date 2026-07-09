(function () {
  const pages = [
    {
      src: "./public/assets/reading/reading-page-01.webp",
      label: "Introdução",
    },
    {
      src: "./public/assets/reading/reading-page-02.webp",
      label: "Sumário",
    },
    {
      src: "./public/assets/reading/reading-page-03.webp",
      label: "Capítulo 1",
    },
  ];

  function clampPage(index) {
    return Math.max(0, Math.min(index, pages.length - 1));
  }

  function initReadingViewer() {
    const viewer = document.querySelector("[data-reading-viewer]");

    if (!viewer) {
      return;
    }

    const book = viewer.querySelector("[data-reading-book]");
    const fallback = viewer.querySelector("[data-reading-fallback]");
    const dotsContainer = viewer.querySelector("[data-reading-dots]");
    const previousButton = viewer.querySelector("[data-reading-prev]");
    const nextButton = viewer.querySelector("[data-reading-next]");

    if (!book || !fallback || !dotsContainer || !previousButton || !nextButton) {
      return;
    }

    let pageFlip = null;
    let currentPage = 0;
    let scrollRaf = null;

    const dots = pages.map((page, index) => {
      const dot = document.createElement("button");
      dot.className = "reading-dot";
      dot.type = "button";
      dot.setAttribute("aria-label", `Mostrar página ${index + 1}: ${page.label}`);
      dot.addEventListener("click", () => goToPage(index));
      dotsContainer.append(dot);
      return dot;
    });

    function setCurrentPage(index, options = {}) {
      currentPage = clampPage(index);

      dots.forEach((dot, dotIndex) => {
        dot.setAttribute("aria-current", dotIndex === currentPage ? "true" : "false");
      });

      previousButton.disabled = currentPage === 0;
      nextButton.disabled = currentPage === pages.length - 1;

      if (options.syncFallback && viewer.classList.contains("is-fallback")) {
        const targetPage = fallback.children[currentPage];

        if (targetPage) {
          targetPage.scrollIntoView({
            block: "nearest",
            inline: "center",
            behavior: options.instant ? "auto" : "smooth",
          });
        }
      }
    }

    function activateFallback() {
      pageFlip = null;
      viewer.classList.add("is-fallback");
      fallback.removeAttribute("aria-hidden");
      book.setAttribute("aria-hidden", "true");
      setCurrentPage(currentPage, { syncFallback: true, instant: true });
    }

    function goToPage(index) {
      const nextPage = clampPage(index);

      if (pageFlip) {
        pageFlip.turnToPage(nextPage);
      }

      setCurrentPage(nextPage, { syncFallback: true });
    }

    function syncFallbackPageFromScroll() {
      scrollRaf = null;

      if (!viewer.classList.contains("is-fallback")) {
        return;
      }

      const fallbackRect = fallback.getBoundingClientRect();
      const fallbackCenter = fallbackRect.left + fallbackRect.width / 2;
      let closestIndex = currentPage;
      let closestDistance = Number.POSITIVE_INFINITY;

      Array.from(fallback.children).forEach((child, index) => {
        const childRect = child.getBoundingClientRect();
        const childCenter = childRect.left + childRect.width / 2;
        const distance = Math.abs(childCenter - fallbackCenter);

        if (distance < closestDistance) {
          closestDistance = distance;
          closestIndex = index;
        }
      });

      setCurrentPage(closestIndex);
    }

    previousButton.addEventListener("click", () => goToPage(currentPage - 1));
    nextButton.addEventListener("click", () => goToPage(currentPage + 1));

    fallback.addEventListener(
      "scroll",
      () => {
        if (scrollRaf !== null) {
          return;
        }

        scrollRaf = window.requestAnimationFrame(syncFallbackPageFromScroll);
      },
      { passive: true },
    );

    try {
      if (!window.St || !window.St.PageFlip) {
        activateFallback();
        return;
      }

      pageFlip = new window.St.PageFlip(book, {
        width: 420,
        height: 590,
        minWidth: 280,
        maxWidth: 500,
        minHeight: 392,
        maxHeight: 700,
        size: "stretch",
        autoSize: true,
        drawShadow: true,
        flippingTime: 650,
        maxShadowOpacity: 0.24,
        mobileScrollSupport: true,
        showCover: false,
        startZIndex: 1,
        swipeDistance: 24,
        useMouseEvents: true,
        usePortrait: true,
      });

      pageFlip.loadFromImages(pages.map((page) => page.src));
      pageFlip.on("flip", (event) => setCurrentPage(Number(event.data) || 0));
      pageFlip.on("init", (event) => {
        const initialPage = event && event.data ? Number(event.data.page) || 0 : 0;
        setCurrentPage(initialPage);
      });
    } catch (error) {
      activateFallback();
    }

    setCurrentPage(0, { syncFallback: true, instant: true });
  }

  window.initReadingViewer = initReadingViewer;
})();
