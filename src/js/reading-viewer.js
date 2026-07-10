(function () {
  const pages = [
    {
      src: "reading/img1-sumario.png",
      label: "Sumário",
    },
    {
      src: "./public/assets/reading/reading-o-trono-das-decisoes.png",
      label: "Introdução",
    },
    {
      src: "./public/assets/reading/reading-cap1.png",
      label: "Capítulo 1",
    },
    {
      src: "reading/trono.png",
      label: "O Trono das Decisões",
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
    const dotsContainer = viewer.querySelector("[data-reading-dots]");
    const previousButton = viewer.querySelector("[data-reading-prev]");
    const nextButton = viewer.querySelector("[data-reading-next]");

    if (!book || !dotsContainer || !previousButton || !nextButton) {
      return;
    }

    let pageFlip = null;
    let currentPage = 0;

    const dots = pages.map((page, index) => {
      const dot = document.createElement("button");
      dot.className = "reading-dot";
      dot.type = "button";
      dot.setAttribute(
        "aria-label",
        `Mostrar página ${index + 1}: ${page.label}`,
      );
      dot.addEventListener("click", () => goToPage(index));
      dotsContainer.append(dot);
      return dot;
    });

    function setCurrentPage(index) {
      currentPage = clampPage(index);

      dots.forEach((dot, dotIndex) => {
        dot.setAttribute(
          "aria-current",
          dotIndex === currentPage ? "true" : "false",
        );
      });

      previousButton.disabled = currentPage === 0;
      nextButton.disabled = currentPage === pages.length - 1;
    }

    function disableReader() {
      pageFlip = null;
      viewer.classList.add("is-unavailable");
      previousButton.disabled = true;
      nextButton.disabled = true;
      dots.forEach((dot) => {
        dot.disabled = true;
      });
    }

    function goToPage(index) {
      const nextPage = clampPage(index);

      if (!pageFlip) {
        return;
      }

      pageFlip.turnToPage(nextPage);
      setCurrentPage(nextPage);
    }

    previousButton.addEventListener("click", () => goToPage(currentPage - 1));
    nextButton.addEventListener("click", () => goToPage(currentPage + 1));

    try {
      if (!window.St || !window.St.PageFlip) {
        disableReader();
        return;
      }

      pageFlip = new window.St.PageFlip(book, {
        width: 420,
        height: 588,
        minWidth: 260,
        maxWidth: 480,
        minHeight: 364,
        maxHeight: 672,
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
        const initialPage =
          event && event.data ? Number(event.data.page) || 0 : 0;
        setCurrentPage(initialPage);
      });
    } catch (error) {
      disableReader();
    }

    setCurrentPage(0);
  }

  window.initReadingViewer = initReadingViewer;
})();
