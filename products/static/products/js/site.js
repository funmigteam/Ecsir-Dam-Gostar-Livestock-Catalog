(() => {
  const root = document.documentElement;
  const body = document.body;
  const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const finePointer = window.matchMedia("(pointer: fine)").matches;
  const PERSIAN = "۰۱۲۳۴۵۶۷۸۹";
  const toPersianDigits = (value) => String(value).replace(/\d/g, (d) => PERSIAN[Number(d)]);
  const toEnglishDigits = (value) =>
    String(value)
      .replace(/[۰-۹]/g, (d) => String(PERSIAN.indexOf(d)))
      .replace(/[٠-٩]/g, (d) => String("٠١٢٣٤٥٦٧٨٩".indexOf(d)));
  const normalize = (value) =>
    toEnglishDigits(value)
      .replace(/[يى]/g, "ی")
      .replace(/ك/g, "ک")
      .replace(/‌/g, " ")
      .toLocaleLowerCase("fa");
  const storage = {
    get(key) {
      try { return localStorage.getItem(key); } catch (e) { return null; }
    },
    set(key, value) {
      try { localStorage.setItem(key, value); } catch (e) { }
    },
  };

  const markLoaded = () => body.classList.add("is-loaded");
  if (document.readyState === "complete") markLoaded();
  else window.addEventListener("load", () => setTimeout(markLoaded, 250));
  setTimeout(markLoaded, 2500);

  const toastEl = document.querySelector(".toast");
  let toastTimer;
  const toast = (message) => {
    if (!toastEl) return;
    toastEl.textContent = message;
    toastEl.classList.add("is-visible");
    clearTimeout(toastTimer);
    toastTimer = setTimeout(() => toastEl.classList.remove("is-visible"), 2200);
  };

  const themeButton = document.querySelector(".theme-toggle");
  const systemDark = window.matchMedia("(prefers-color-scheme: dark)");
  const currentTheme = () => root.dataset.theme || (systemDark.matches ? "dark" : "light");
  if (themeButton) {
    themeButton.addEventListener("click", () => {
      const next = currentTheme() === "dark" ? "light" : "dark";
      root.dataset.theme = next;
      storage.set("ecsir-theme", next);
    });
  }

  const menuButton = document.querySelector(".menu-toggle");
  const navMenu = document.getElementById("nav-menu");
  const setMenu = (open) => {
    body.classList.toggle("menu-open", open);
    if (menuButton) menuButton.setAttribute("aria-expanded", String(open));
  };
  if (menuButton && navMenu) {
    menuButton.addEventListener("click", () => setMenu(!body.classList.contains("menu-open")));
    navMenu.addEventListener("click", (event) => {
      if (event.target.closest("a")) setMenu(false);
    });
    document.addEventListener("click", (event) => {
      if (!body.classList.contains("menu-open")) return;
      if (!event.target.closest(".nav-menu, .menu-toggle")) setMenu(false);
    });
  }

  const progressBar = document.querySelector(".scroll-progress");
  const backToTop = document.querySelector(".back-to-top");
  const processWrap = document.querySelector(".process-wrap");
  const navLinks = [...document.querySelectorAll('.nav-menu a[href^="#"]')];
  const sections = navLinks
    .map((link) => document.querySelector(link.getAttribute("href")))
    .filter(Boolean);
  let ticking = false;

  const onScroll = () => {
    ticking = false;
    const y = window.scrollY;
    const max = document.documentElement.scrollHeight - window.innerHeight;
    const progress = max > 0 ? Math.min(y / max, 1) : 0;
    if (progressBar) progressBar.style.setProperty("--progress", progress.toFixed(4));
    if (backToTop) backToTop.style.setProperty("--progress", progress.toFixed(4));
    body.classList.toggle("is-scrolled", y > 30);
    body.classList.toggle("show-floating", y > window.innerHeight * 0.6);

    if (processWrap) {
      const rect = processWrap.getBoundingClientRect();
      const ratio = (window.innerHeight * 0.75 - rect.top) / rect.height;
      processWrap.style.setProperty("--line-progress", Math.max(0, Math.min(ratio, 1)).toFixed(3));
    }

    if (sections.length) {
      let current = null;
      sections.forEach((section) => {
        if (section.getBoundingClientRect().top < window.innerHeight * 0.4) current = section;
      });
      navLinks.forEach((link) => {
        link.classList.toggle("is-current", current && link.getAttribute("href") === `#${current.id}`);
      });
    }
  };
  window.addEventListener(
    "scroll",
    () => {
      if (!ticking) {
        ticking = true;
        requestAnimationFrame(onScroll);
      }
    },
    { passive: true }
  );
  onScroll();

  if (backToTop) {
    backToTop.addEventListener("click", (event) => {
      event.preventDefault();
      window.scrollTo({ top: 0, behavior: reducedMotion ? "auto" : "smooth" });
    });
  }

  const revealItems = document.querySelectorAll(".reveal");
  if (reducedMotion || !("IntersectionObserver" in window)) {
    revealItems.forEach((item) => item.classList.add("is-visible"));
  } else {
    const revealObserver = new IntersectionObserver(
      (entries, observer) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;
          entry.target.classList.add("is-visible");
          observer.unobserve(entry.target);
        });
      },
      { threshold: 0.12, rootMargin: "0px 0px -40px 0px" }
    );
    revealItems.forEach((item) => revealObserver.observe(item));
  }

  const animateCounter = (element) => {
    const target = Number(toEnglishDigits(element.dataset.count));
    if (!Number.isFinite(target)) {
      element.textContent = element.dataset.count;
      return;
    }
    if (reducedMotion) {
      element.textContent = toPersianDigits(target);
      return;
    }
    const startedAt = performance.now();
    const duration = 1600;
    const update = (now) => {
      const progress = Math.min((now - startedAt) / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 4);
      element.textContent = toPersianDigits(Math.round(target * eased));
      if (progress < 1) requestAnimationFrame(update);
    };
    requestAnimationFrame(update);
  };
  const counters = document.querySelectorAll("[data-count]");
  if ("IntersectionObserver" in window) {
    const counterObserver = new IntersectionObserver(
      (entries, observer) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;
          animateCounter(entry.target);
          observer.unobserve(entry.target);
        });
      },
      { threshold: 0.6 }
    );
    counters.forEach((counter) => counterObserver.observe(counter));
  } else {
    counters.forEach(animateCounter);
  }

  const rotator = document.querySelector(".rotator-word");
  if (rotator) {
    const words = (rotator.dataset.words || "")
      .split(/[،,]/)
      .map((w) => w.trim())
      .filter(Boolean);
    if (words.length) {
      if (reducedMotion || words.length === 1) {
        rotator.textContent = words[0];
      } else {
        let wordIndex = 0;
        let charIndex = 0;
        let deleting = false;
        const tick = () => {
          const word = words[wordIndex];
          charIndex += deleting ? -1 : 1;
          rotator.textContent = word.slice(0, charIndex);
          let delay = deleting ? 35 : 75;
          if (!deleting && charIndex === word.length) {
            deleting = true;
            delay = 1900;
          } else if (deleting && charIndex === 0) {
            deleting = false;
            wordIndex = (wordIndex + 1) % words.length;
            delay = 350;
          }
          setTimeout(tick, delay);
        };
        setTimeout(tick, 900);
      }
    }
  }

  const marquee = document.querySelector(".marquee-track");
  if (marquee) {
    const items = (marquee.dataset.items || "")
      .split(/[،,]/)
      .map((w) => w.trim())
      .filter(Boolean);
    if (!items.length) {
      marquee.parentElement.remove();
    } else {
      const fragment = document.createDocumentFragment();
      for (let copy = 0; copy < 2; copy += 1) {
        for (let r = 0; r < 3; r += 1) {
          items.forEach((text) => {
            const span = document.createElement("span");
            span.textContent = text;
            fragment.appendChild(span);
          });
        }
      }
      marquee.appendChild(fragment);
    }
  }

  document.querySelectorAll(".hero-canvas").forEach((canvas) => {
    if (reducedMotion || !canvas.getContext) return;
    const ctx = canvas.getContext("2d");
    const host = canvas.parentElement;
    let width = 0;
    let height = 0;
    let dpr = 1;
    let particles = [];
    let running = false;
    let frame;
    const mouse = { x: -9999, y: -9999 };

    const resize = () => {
      dpr = Math.min(window.devicePixelRatio || 1, 2);
      width = host.clientWidth;
      height = host.clientHeight;
      canvas.width = width * dpr;
      canvas.height = height * dpr;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      const count = Math.round(Math.min(90, (width * height) / 16000));
      particles = Array.from({ length: count }, () => ({
        x: Math.random() * width,
        y: Math.random() * height,
        vx: (Math.random() - 0.5) * 0.35,
        vy: (Math.random() - 0.5) * 0.35,
        r: Math.random() * 1.8 + 0.6,
      }));
    };

    const draw = () => {
      ctx.clearRect(0, 0, width, height);
      const linkDist = 130;
      for (let i = 0; i < particles.length; i += 1) {
        const p = particles[i];
        p.x += p.vx;
        p.y += p.vy;
        if (p.x < 0 || p.x > width) p.vx *= -1;
        if (p.y < 0 || p.y > height) p.vy *= -1;

        const mdx = p.x - mouse.x;
        const mdy = p.y - mouse.y;
        const md = Math.hypot(mdx, mdy);
        if (md < 140 && md > 0) {
          p.x += (mdx / md) * 1.2;
          p.y += (mdy / md) * 1.2;
        }

        ctx.beginPath();
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        ctx.fillStyle = "rgba(236, 215, 166, 0.75)";
        ctx.fill();

        for (let j = i + 1; j < particles.length; j += 1) {
          const q = particles[j];
          const d = Math.hypot(p.x - q.x, p.y - q.y);
          if (d < linkDist) {
            ctx.beginPath();
            ctx.moveTo(p.x, p.y);
            ctx.lineTo(q.x, q.y);
            ctx.strokeStyle = `rgba(201, 163, 90, ${(1 - d / linkDist) * 0.35})`;
            ctx.lineWidth = 0.8;
            ctx.stroke();
          }
        }
      }
      frame = requestAnimationFrame(draw);
    };

    const start = () => {
      if (running) return;
      running = true;
      frame = requestAnimationFrame(draw);
    };
    const stop = () => {
      running = false;
      cancelAnimationFrame(frame);
    };

    resize();
    let resizeTimer;
    window.addEventListener("resize", () => {
      clearTimeout(resizeTimer);
      resizeTimer = setTimeout(resize, 200);
    });
    host.addEventListener("mousemove", (event) => {
      const rect = canvas.getBoundingClientRect();
      mouse.x = event.clientX - rect.left;
      mouse.y = event.clientY - rect.top;
    });
    host.addEventListener("mouseleave", () => {
      mouse.x = mouse.y = -9999;
    });

    if ("IntersectionObserver" in window) {
      new IntersectionObserver((entries) => {
        entries.forEach((entry) => (entry.isIntersecting ? start() : stop()));
      }).observe(host);
    } else {
      start();
    }
    document.addEventListener("visibilitychange", () => (document.hidden ? stop() : start()));
  });

  if (!reducedMotion && finePointer) {
    const glow = document.querySelector(".cursor-glow");
    if (glow) {
      window.addEventListener(
        "mousemove",
        (event) => {
          body.classList.add("has-cursor");
          glow.style.setProperty("--cx", `${event.clientX}px`);
          glow.style.setProperty("--cy", `${event.clientY}px`);
        },
        { passive: true }
      );
      document.addEventListener("mouseleave", () => body.classList.remove("has-cursor"));
    }

    document.querySelectorAll(".hero-visual[data-tilt]").forEach((card) => {
      const logoCard = card.querySelector(".hero-logo-card");
      card.addEventListener("mousemove", (event) => {
        const rect = card.getBoundingClientRect();
        const x = (event.clientX - rect.left) / rect.width;
        const y = (event.clientY - rect.top) / rect.height;
        card.style.transform = `perspective(1000px) rotateY(${(x - 0.5) * 8}deg) rotateX(${(0.5 - y) * 8}deg)`;
        if (logoCard) {
          const r = logoCard.getBoundingClientRect();
          logoCard.style.setProperty("--mouse-x", `${event.clientX - r.left}px`);
          logoCard.style.setProperty("--mouse-y", `${event.clientY - r.top}px`);
        }
      });
      card.addEventListener("mouseleave", () => {
        card.style.transform = "";
      });
    });

    document.querySelectorAll(".product-card, .value-card, .category-card").forEach((card) => {
      card.addEventListener("mousemove", (event) => {
        const rect = card.getBoundingClientRect();
        card.style.setProperty("--mouse-x", `${event.clientX - rect.left}px`);
        card.style.setProperty("--mouse-y", `${event.clientY - rect.top}px`);
      });
    });

    document.querySelectorAll(".magnetic").forEach((button) => {
      button.addEventListener("mousemove", (event) => {
        const rect = button.getBoundingClientRect();
        const x = event.clientX - rect.left - rect.width / 2;
        const y = event.clientY - rect.top - rect.height / 2;
        button.style.transform = `translate(${x * 0.18}px, ${y * 0.28}px)`;
      });
      button.addEventListener("mouseleave", () => {
        button.style.transform = "";
      });
    });
  }

  const faqItems = [...document.querySelectorAll(".faq-item")];
  faqItems.forEach((item) => {
    item.addEventListener("toggle", () => {
      if (!item.open) return;
      faqItems.forEach((other) => {
        if (other !== item) other.open = false;
      });
    });
  });

  const searchInput = document.getElementById("product-search");
  const grid = document.querySelector(".product-grid");
  if (searchInput && grid) {
    const cards = [...grid.querySelectorAll(".product-card")];
    const emptyState = document.querySelector(".empty-state");
    const resultCount = document.querySelector(".result-count b");
    const filterGroup = document.querySelector(".category-filters");
    const indicator = filterGroup && filterGroup.querySelector(".filter-indicator");
    const categoryButtons = [...document.querySelectorAll(".category-filter")];
    const sortSelect = document.getElementById("product-sort");
    const viewButtons = [...document.querySelectorAll(".view-toggle button")];
    const highlightTargets = cards.map((card) =>
      [...card.querySelectorAll(".hl")].map((el) => ({ el, text: el.textContent }))
    );
    let activeCategory = "all";

    const escapeHtml = (value) =>
      value.replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[c]);

    const highlight = (query) => {
      highlightTargets.forEach((targets) => {
        targets.forEach(({ el, text }) => {
          if (!query) {
            el.textContent = text;
            return;
          }
          const normalized = normalize(text);
          const index = normalized.indexOf(query);
          if (index === -1 || normalized.length !== text.length) {
            el.textContent = text;
            return;
          }
          el.innerHTML =
            escapeHtml(text.slice(0, index)) +
            "<mark>" + escapeHtml(text.slice(index, index + query.length)) + "</mark>" +
            escapeHtml(text.slice(index + query.length));
        });
      });
    };

    const moveIndicator = () => {
      if (!indicator) return;
      const active = categoryButtons.find((b) => b.classList.contains("is-active"));
      if (!active) return;
      if (!indicator.dataset.placed) {
        indicator.style.transition = "none";
        requestAnimationFrame(() => requestAnimationFrame(() => {
          indicator.style.transition = "";
          indicator.dataset.placed = "1";
        }));
      }
      indicator.style.width = `${active.offsetWidth}px`;
      indicator.style.height = `${active.offsetHeight}px`;
      indicator.style.transform = `translate(${active.offsetLeft}px, ${active.offsetTop}px)`;
    };

    const filterProducts = () => {
      const query = normalize(searchInput.value.trim());
      let visibleCount = 0;
      cards.forEach((card) => {
        const matchesSearch = !query || normalize(card.dataset.product).includes(query);
        const matchesCategory = activeCategory === "all" || card.dataset.category === activeCategory;
        const isVisible = matchesSearch && matchesCategory;
        card.hidden = !isVisible;
        if (isVisible) {
          visibleCount += 1;
          card.classList.add("is-visible");
        }
      });
      highlight(query);
      if (resultCount) resultCount.textContent = toPersianDigits(visibleCount);
      if (emptyState) emptyState.hidden = visibleCount !== 0;
    };

    const setCategory = (category, { scroll = false } = {}) => {
      const button = categoryButtons.find((b) => b.dataset.category === category);
      if (!button) return;
      activeCategory = category;
      categoryButtons.forEach((item) => {
        const isActive = item === button;
        item.classList.toggle("is-active", isActive);
        item.setAttribute("aria-pressed", String(isActive));
      });
      moveIndicator();
      filterProducts();
      const url = new URL(window.location.href);
      if (category === "all") url.searchParams.delete("cat");
      else url.searchParams.set("cat", category);
      history.replaceState(null, "", url.pathname + url.search + url.hash);
      if (scroll) document.getElementById("product-list").scrollIntoView({ behavior: reducedMotion ? "auto" : "smooth" });
    };

    let searchTimer;
    searchInput.addEventListener("input", () => {
      clearTimeout(searchTimer);
      searchTimer = setTimeout(filterProducts, 80);
    });
    categoryButtons.forEach((button) => {
      button.addEventListener("click", () => setCategory(button.dataset.category));
    });
    document.querySelectorAll("[data-jump-category]").forEach((pill) => {
      pill.addEventListener("click", () => setCategory(pill.dataset.jumpCategory, { scroll: true }));
    });
    const clearButton = document.querySelector(".clear-filters");
    if (clearButton) {
      clearButton.addEventListener("click", () => {
        searchInput.value = "";
        setCategory("all");
        searchInput.focus();
      });
    }

    document.addEventListener("keydown", (event) => {
      const tag = (event.target.tagName || "").toLowerCase();
      if (event.key === "/" && !["input", "textarea", "select"].includes(tag)) {
        event.preventDefault();
        searchInput.focus();
      }
    });

    if (sortSelect) {
      sortSelect.addEventListener("change", () => {
        const sorted = [...cards];
        if (sortSelect.value === "alpha") {
          sorted.sort((a, b) => a.dataset.title.localeCompare(b.dataset.title, "fa"));
        } else {
          sorted.sort((a, b) => Number(a.dataset.index) - Number(b.dataset.index));
        }
        sorted.forEach((card) => grid.appendChild(card));
      });
    }

    const setView = (view) => {
      grid.classList.toggle("is-list", view === "list");
      viewButtons.forEach((b) => {
        const isActive = b.dataset.view === view;
        b.classList.toggle("is-active", isActive);
        b.setAttribute("aria-pressed", String(isActive));
      });
      storage.set("ecsir-view", view);
    };
    viewButtons.forEach((b) => b.addEventListener("click", () => setView(b.dataset.view)));
    if (storage.get("ecsir-view") === "list") setView("list");

    window.addEventListener("resize", moveIndicator);
    if (document.fonts && document.fonts.ready) document.fonts.ready.then(moveIndicator);

    const initial = new URLSearchParams(window.location.search).get("cat");
    setCategory(initial && categoryButtons.some((b) => b.dataset.category === initial) ? initial : "all");
    requestAnimationFrame(moveIndicator);
  }

  const modal = document.getElementById("product-modal");
  if (modal) {
    const overlay = document.getElementById("product-modal-overlay");
    const closeButton = document.getElementById("product-modal-close");
    const title = modal.querySelector(".modal-title");
    const badge = modal.querySelector(".modal-badge");
    const subtitle = modal.querySelector(".modal-subtitle");
    const description = modal.querySelector(".modal-description");
    const featureList = modal.querySelector(".modal-feature-list");
    const symbolUse = modal.querySelector(".modal-symbol use");
    const prevButton = modal.querySelector(".modal-prev");
    const nextButton = modal.querySelector(".modal-next");
    const position = modal.querySelector(".modal-position");
    const copyButton = modal.querySelector(".modal-copy");
    const categoryColors = ["vaccine", "medicine", "canned", "food"];
    let lastFocusedElement;
    let currentCard = null;

    const visibleCards = () => [...document.querySelectorAll(".product-grid .product-card:not([hidden])")];

    const fill = (card) => {
      currentCard = card;
      const data = card.querySelector(".product-detail-data");
      const category = card.dataset.category;
      title.textContent = data.querySelector("h5").textContent;
      badge.textContent = data.querySelector(".detail-badge").textContent;
      subtitle.textContent = data.querySelector(".detail-subtitle").textContent;
      description.textContent = data.querySelector(".detail-description").textContent;
      featureList.replaceChildren(
        ...[...data.querySelectorAll(".detail-feature-list li")].map((source) => {
          const item = document.createElement("li");
          item.textContent = source.textContent;
          return item;
        })
      );
      if (symbolUse) symbolUse.setAttribute("href", `#i-${category}`);
      modal.style.setProperty("--c", categoryColors.includes(category) ? `var(--c-${category})` : "var(--gold)");

      const list = visibleCards();
      const index = list.indexOf(card);
      prevButton.disabled = index <= 0;
      nextButton.disabled = index === -1 || index >= list.length - 1;
      position.textContent = index === -1 ? "" : `${toPersianDigits(index + 1)} / ${toPersianDigits(list.length)}`;
      history.replaceState(null, "", `${window.location.pathname}${window.location.search}#${card.id}`);
    };

    const openModal = (card, trigger) => {
      lastFocusedElement = trigger || document.activeElement;
      fill(card);
      overlay.hidden = false;
      modal.hidden = false;
      modal.scrollTop = 0;
      body.style.overflow = "hidden";
      closeButton.focus();
    };

    const closeModal = () => {
      if (modal.hidden) return;
      modal.hidden = true;
      overlay.hidden = true;
      body.style.overflow = "";
      history.replaceState(null, "", `${window.location.pathname}${window.location.search}`);
      if (lastFocusedElement) lastFocusedElement.focus();
    };

    const step = (direction) => {
      const list = visibleCards();
      const target = list[list.indexOf(currentCard) + direction];
      if (target) fill(target);
    };

    document.querySelectorAll(".product-detail-btn").forEach((button) => {
      button.addEventListener("click", () => openModal(button.closest(".product-card"), button));
    });
    prevButton.addEventListener("click", () => step(-1));
    nextButton.addEventListener("click", () => step(1));
    closeButton.addEventListener("click", closeModal);
    overlay.addEventListener("click", closeModal);

    if (copyButton) {
      copyButton.addEventListener("click", async () => {
        const url = window.location.href;
        try {
          await navigator.clipboard.writeText(url);
        } catch (e) {
          const temp = document.createElement("textarea");
          temp.value = url;
          document.body.appendChild(temp);
          temp.select();
          try { document.execCommand("copy"); } catch (err) { }
          temp.remove();
        }
        toast(copyButton.dataset.copied);
      });
    }

    document.addEventListener("keydown", (event) => {
      if (modal.hidden) return;
      if (event.key === "Escape") closeModal();
      if (event.key === "ArrowLeft") step(1);
      if (event.key === "ArrowRight") step(-1);
      if (event.key === "Tab") {
        const focusable = [...modal.querySelectorAll("a[href], button:not([disabled])")];
        const first = focusable[0];
        const last = focusable[focusable.length - 1];
        if (event.shiftKey && document.activeElement === first) {
          event.preventDefault();
          last.focus();
        } else if (!event.shiftKey && document.activeElement === last) {
          event.preventDefault();
          first.focus();
        }
      }
    });

    const hashMatch = window.location.hash.match(/^#(p-\d+)$/);
    if (hashMatch) {
      const card = document.getElementById(hashMatch[1]);
      if (card && !card.hidden) {
        card.scrollIntoView({ block: "center" });
        card.classList.add("is-target");
        setTimeout(() => openModal(card, card.querySelector(".product-detail-btn")), 500);
      }
    }
  }
})();
