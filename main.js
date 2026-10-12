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
  // Projects grid of <details> cards (inline fallback when the modal is unavailable)
  wireExclusiveDetails("#projects .projects-grid");

  // ---- Projects: open details in a modal instead of expanding inline ----
  const modal = document.getElementById("project-modal");
  const modalContent = document.getElementById("project-modal-content");
  if (modal && modalContent && typeof modal.showModal === "function") {
    document.querySelectorAll("#projects .project-card").forEach((card) => {
      const summary = card.querySelector("summary");
      summary.addEventListener("click", (e) => {
        e.preventDefault();
        const cover = card.querySelector(".project-cover img");
        const title = card.querySelector(".project-body h3");
        const blurb = card.querySelector(".project-body p");
        const cat = card.querySelector(".project-cat");
        const body = card.querySelector(":scope > div");
        modalContent.innerHTML = "";
        if (cover) {
          const hero = document.createElement("div");
          hero.className = "modal-hero";
          hero.appendChild(cover.cloneNode(true));
          modalContent.appendChild(hero);
        }
        const head = document.createElement("div");
        head.className = "modal-head";
        head.innerHTML =
          (cat ? '<span class="font-technical-code text-label-caps text-secondary uppercase tracking-widest">' + cat.textContent + "</span>" : "") +
          '<h3 id="project-modal-title" class="font-headline-md text-headline-md font-semibold text-on-surface mt-1"></h3>' +
          '<p class="font-body-md text-body-md text-on-surface-variant mt-2"></p>';
        head.querySelector("h3").textContent = title ? title.textContent.trim() : "";
        head.querySelector("p").textContent = blurb ? blurb.textContent.trim() : "";
        modalContent.appendChild(head);
        if (body) {
          const wrap = document.createElement("div");
          wrap.className = "modal-body";
          wrap.appendChild(body.cloneNode(true));
          modalContent.appendChild(wrap);
        }
        modal.showModal();
        modal.scrollTop = 0;
      });
    });
    modal.addEventListener("click", (e) => {
      // close on backdrop click or the close button
      if (e.target === modal || e.target.closest("[data-close]")) modal.close();
    });
  }

  // ---- Mobile menu ----
  const menuBtn = document.getElementById("menu-toggle");
  const menu = document.getElementById("mobile-menu");
  if (menuBtn && menu) {
    const setOpen = (open) => {
      menu.hidden = !open;
      menuBtn.setAttribute("aria-expanded", String(open));
      menuBtn.querySelector(".material-symbols-outlined").textContent = open ? "close" : "menu";
    };
    menuBtn.addEventListener("click", () => setOpen(menu.hidden));
    menu.addEventListener("click", (e) => {
      if (e.target.closest("a")) setOpen(false);
    });
  }

  // ---- Scroll progress bar ----
  const bar = document.getElementById("scroll-progress-bar");
  if (bar) {
    const update = () => {
      const max = document.documentElement.scrollHeight - window.innerHeight;
      bar.style.width = (max > 0 ? (window.scrollY / max) * 100 : 0) + "%";
    };
    window.addEventListener("scroll", update, { passive: true });
    update();
  }

  // ---- Reveal sections' blocks as they scroll into view ----
  const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  if (!reduceMotion && "IntersectionObserver" in window) {
    const blocks = document.querySelectorAll("main section[id] > *");
    const revealer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("is-visible");
            revealer.unobserve(entry.target);
          }
        });
      },
      { rootMargin: "0px 0px -8% 0px", threshold: 0.05 }
    );
    blocks.forEach((el) => {
      // skip anything already on screen so the first view never flickers
      if (el.getBoundingClientRect().top < window.innerHeight) return;
      el.classList.add("reveal");
      revealer.observe(el);
    });
  }

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
