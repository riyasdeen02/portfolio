// Progressive enhancements for the portfolio. All optional — the site works without JS.
(function () {
  "use strict";

  // ---- Active nav link highlighting via IntersectionObserver ----
  const sections = document.querySelectorAll("main section[id]");
  const navLinks = Array.from(document.querySelectorAll('nav a[href^="#"]'));
  const linkFor = (id) => navLinks.find((a) => a.getAttribute("href") === "#" + id);

  if ("IntersectionObserver" in window && sections.length) {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          const link = linkFor(entry.target.id);
          if (!link) return;
          if (entry.isIntersecting) {
            navLinks.forEach((a) => a.classList.remove("nav-active"));
            link.classList.add("nav-active");
          }
        });
      },
      // trigger around the point just below the fixed 80px header
      { rootMargin: "-30% 0px -60% 0px", threshold: 0 }
    );
    sections.forEach((s) => observer.observe(s));
  }

  // ---- Accordion: close sibling project/award panels when one opens ----
  // Grouped so only one entry in a given container stays open at a time.
  function wireExclusiveDetails(containerSelector) {
    document.querySelectorAll(containerSelector).forEach((group) => {
      const items = group.querySelectorAll(":scope > details");
      items.forEach((d) => {
        d.addEventListener("toggle", () => {
          if (d.open) {
            items.forEach((other) => {
              if (other !== d) other.open = false;
            });
          }
        });
      });
    });
  }
  // Projects list is a single flex column of <details>
  wireExclusiveDetails("#projects .flex.flex-col.gap-space-md");

  // ---- Awards: expanding one card expands its whole visual row ----
  // The grid is responsive (1 / 2 / 3 columns), so "row" is determined at
  // runtime by grouping tiles that share the same vertical offset.
  const awardsGrid = document.getElementById("awards-grid");
  if (awardsGrid) {
    const cards = Array.from(awardsGrid.querySelectorAll(":scope > details"));
    let syncing = false;

    // How many columns the grid currently renders (1, 2, or 3).
    function columnCount() {
      const cols = getComputedStyle(awardsGrid).gridTemplateColumns;
      return cols ? cols.split(" ").filter(Boolean).length : 1;
    }

    // Cards in the same row as `card`, derived from DOM order + column count.
    // This stays correct even after rows below shift when a card expands.
    function rowMates(card) {
      const cols = columnCount();
      if (cols <= 1) return [card];
      const idx = cards.indexOf(card);
      const rowStart = Math.floor(idx / cols) * cols;
      return cards.slice(rowStart, rowStart + cols);
    }

    cards.forEach((card) => {
      card.addEventListener("toggle", () => {
        if (syncing) return;
        syncing = true;
        const shouldOpen = card.open;
        rowMates(card).forEach((mate) => {
          if (mate !== card) mate.open = shouldOpen;
        });
        syncing = false;
      });
    });
  }
})();
