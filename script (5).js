/* ==========================================================================
   Shubhkiran Quality Forum (SQF) — Complete Interactive Logic (script.js)
   Handles URL Hash Routing, Mobile Drawer, Live Search, Lightbox & WhatsApp
   ========================================================================== */

const WHATSAPP_NUMBER = "917875556748";

const STANDARDS_CATALOG = [
  {
    code: "Pinnacle Excellence (Top Tier)",
    category: "Enterprise Transformation Partner",
    description: "Flagship multi-standard IMS rollout, custom in-house core tools academy, second-party supplier audits, and year-round executive advisory led by Mr. Vilas Shinde."
  },
  {
    code: "ISO 9001",
    category: "Quality Management",
    description: "Practical quality management systems focused on process consistency, customer satisfaction, and continual improvement."
  },
  {
    code: "IATF 16949",
    category: "Automotive Quality",
    description: "Automotive quality management system implementation, core tools (APQP, PPAP, FMEA, MSA, SPC), and supplier readiness."
  },
  {
    code: "ISO 14001",
    category: "Environmental Management",
    description: "Environmental compliance, resource efficiency, waste reduction, and operational sustainability controls."
  },
  {
    code: "ISO 45001",
    category: "Occupational Health & Safety",
    description: "Workplace hazard identification, risk assessment (HIRA), safety culture, and incident prevention systems."
  },
  {
    code: "ISO 22000 & HACCP",
    category: "Food Safety",
    description: "Food safety management, hazard analysis critical control points (HACCP), FSSC 22000, and BRCGS readiness."
  },
  {
    code: "ISO/IEC 27001",
    category: "Information Security",
    description: "Information security management systems (ISMS), risk controls, data protection, and audit preparation."
  },
  {
    code: "SA 8000 & SEDEX",
    category: "Social Accountability",
    description: "Ethical workplace standards, social compliance audits (SMETA), labour standards, and responsible supply chains."
  },
  {
    code: "CE Marking & RoHS",
    category: "Product Compliance",
    description: "Guidance on European and international product directives, technical file preparation, testing, and conformity readiness."
  },
  {
    code: "ISO/IEC 17025",
    category: "Laboratory Competence",
    description: "Testing and calibration laboratory management systems, method validation, and NABL readiness support."
  }
];

const VALID_VIEWS = ["home", "about", "services", "training", "audits", "clients", "contact"];

document.addEventListener("DOMContentLoaded", () => {
  const navTriggers = document.querySelectorAll("[data-nav]");
  const desktopPills = document.querySelectorAll(".nav-pill");
  const mobileLinks = document.querySelectorAll(".mobile-nav-link");
  const views = document.querySelectorAll(".page-view");
  const menuToggle = document.getElementById("menuToggle");
  const mobileDrawer = document.getElementById("mobileDrawer");

  // 1. View Switching + Browser History Hash Support
  function navigateTo(viewName, options = {}) {
    const cleanName = VALID_VIEWS.includes(viewName) ? viewName : "home";
    const targetView = document.getElementById(`view-${cleanName}`);
    if (!targetView) return;

    views.forEach((v) => v.classList.remove("active"));
    targetView.classList.add("active");

    desktopPills.forEach((pill) => {
      pill.classList.toggle("active", pill.getAttribute("data-nav") === cleanName);
    });

    mobileLinks.forEach((link) => {
      link.classList.toggle("active", link.getAttribute("data-nav") === cleanName);
    });

    // Close mobile menu if open
    if (menuToggle && mobileDrawer) {
      menuToggle.setAttribute("aria-expanded", "false");
      mobileDrawer.classList.remove("open");
      mobileDrawer.setAttribute("aria-hidden", "true");
    }

    // Update URL hash without jumping
    if (!options.skipHash) {
      history.pushState(null, "", `#${cleanName}`);
    }

    // Pre-select service on Contact page if passed
    if (options.service) {
      const serviceSelect = document.getElementById("serviceArea");
      if (serviceSelect) {
        for (const opt of serviceSelect.options) {
          if (opt.value.toLowerCase().includes(options.service.toLowerCase())) {
            serviceSelect.value = opt.value;
            break;
          }
        }
      }
    }

    // Filter standards on Services page if passed
    if (options.filter !== undefined) {
      const filterInput = document.getElementById("servicesFilterInput");
      if (filterInput) {
        filterInput.value = options.filter;
        renderStandardsGrid(options.filter);
      }
    }

    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  // Handle initial URL hash or back/forward buttons
  function syncFromHash() {
    const rawHash = window.location.hash.replace("#", "").toLowerCase();
    if (VALID_VIEWS.includes(rawHash)) {
      navigateTo(rawHash, { skipHash: true });
    }
  }

  window.addEventListener("popstate", syncFromHash);
  syncFromHash();

  // Bind navigation clicks
  navTriggers.forEach((trigger) => {
    trigger.addEventListener("click", (e) => {
      e.preventDefault();
      const target = trigger.getAttribute("data-nav");
      const service = trigger.getAttribute("data-service") || "";
      const filter = trigger.getAttribute("data-filter");
      navigateTo(target, { service, filter });
    });
  });

  // 2. Mobile Hamburger Drawer Toggle
  if (menuToggle && mobileDrawer) {
    menuToggle.addEventListener("click", () => {
      const isExpanded = menuToggle.getAttribute("aria-expanded") === "true";
      const nextState = !isExpanded;
      menuToggle.setAttribute("aria-expanded", String(nextState));
      mobileDrawer.classList.toggle("open", nextState);
      mobileDrawer.setAttribute("aria-hidden", String(!nextState));
    });
  }

  // 3. Populate & Filter Standards Directory on Services Page
  const standardsGrid = document.getElementById("standardsGrid");
  const servicesFilterInput = document.getElementById("servicesFilterInput");

  function renderStandardsGrid(query = "") {
    if (!standardsGrid) return;
    const normalized = query.trim().toLowerCase();
    const matches = STANDARDS_CATALOG.filter(
      (item) =>
        item.code.toLowerCase().includes(normalized) ||
        item.category.toLowerCase().includes(normalized) ||
        item.description.toLowerCase().includes(normalized)
    );

    if (matches.length === 0) {
      standardsGrid.innerHTML = `
        <div class="standard-card" style="grid-column: 1 / -1;">
          <h3>No matching standard found for "${query}"</h3>
          <p class="body-copy" style="margin-top:6px;">Contact SQF directly on WhatsApp to discuss your specific compliance or training requirement.</p>
          <a
            href="https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(
              `Hello SQF, I am looking for assistance with ${query}.`
            )}"
            target="_blank"
            rel="noopener noreferrer"
            class="text-link"
          >
            Ask SQF on WhatsApp &#8599;
          </a>
        </div>
      `;
      return;
    }

    standardsGrid.innerHTML = matches
      .map(
        (item) => `
        <div class="standard-card">
          <div>
            <span class="standard-tag">${item.category}</span>
            <h3>${item.code}</h3>
            <p class="body-copy" style="margin-top:8px; font-size:0.88rem;">${item.description}</p>
          </div>
          <div>
            <a
              href="https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(
                `Hello SQF, I would like to discuss ${item.code} (${item.category}) requirements.`
              )}"
              target="_blank"
              rel="noopener noreferrer"
              class="text-link"
              style="font-size:0.86rem;"
            >
              Enquire on WhatsApp &#8599;
            </a>
          </div>
        </div>
      `
      )
      .join("");
  }

  renderStandardsGrid();

  if (servicesFilterInput) {
    servicesFilterInput.addEventListener("input", (e) => {
      renderStandardsGrid(e.target.value);
    });
  }

  // 4. Hero Search Bar & Live Autocomplete Dropdown
  const searchForm = document.getElementById("standardSearchForm");
  const searchInput = document.getElementById("standardSearchInput");
  const searchDropdown = document.getElementById("searchResultsDropdown");

  if (searchInput && searchDropdown) {
    searchInput.addEventListener("input", () => {
      const q = searchInput.value.trim().toLowerCase();
      if (!q) {
        searchDropdown.hidden = true;
        return;
      }

      const results = STANDARDS_CATALOG.filter(
        (s) =>
          s.code.toLowerCase().includes(q) ||
          s.category.toLowerCase().includes(q) ||
          s.description.toLowerCase().includes(q)
      );

      if (results.length === 0) {
        searchDropdown.innerHTML = `
          <div class="search-result-item" data-custom="${searchInput.value.trim()}">
            <span>Ask SQF about "<strong>${searchInput.value.trim()}</strong>" on WhatsApp</span>
            <span>&#8599;</span>
          </div>
        `;
      } else {
        searchDropdown.innerHTML = results
          .map(
            (r) => `
            <div class="search-result-item" data-code="${r.code}">
              <div>
                <strong>${r.code}</strong> · <span style="color:#5B6472; font-size:0.85rem;">${r.category}</span>
              </div>
              <span style="font-size:0.82rem; font-weight:600; color:#C81E2B;">Explore &#8594;</span>
            </div>
          `
          )
          .join("");
      }
      searchDropdown.hidden = false;
    });

    searchDropdown.addEventListener("click", (e) => {
      const item = e.target.closest(".search-result-item");
      if (!item) return;
      const code = item.getAttribute("data-code");
      const custom = item.getAttribute("data-custom");

      searchDropdown.hidden = true;
      if (code) {
        navigateTo("services", { filter: code });
      } else if (custom) {
        const url = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(
          `Hello SQF, I am looking for assistance with ${custom}.`
        )}`;
        window.open(url, "_blank", "noopener,noreferrer");
      }
    });

    // Close dropdown when clicking outside
    document.addEventListener("click", (e) => {
      if (!e.target.closest(".search-wrapper")) {
        searchDropdown.hidden = true;
      }
    });
  }

  if (searchForm) {
    searchForm.addEventListener("submit", (e) => {
      e.preventDefault();
      const query = searchInput ? searchInput.value.trim() : "";
      if (searchDropdown) searchDropdown.hidden = true;
      navigateTo("services", { filter: query });
    });
  }

  // 5. Lightbox Modal for Workshop & Training Photographs
  const lightboxModal = document.getElementById("lightboxModal");
  const lightboxImg = document.getElementById("lightboxImg");
  const lightboxCaption = document.getElementById("lightboxCaption");
  const lightboxClose = document.getElementById("lightboxClose");
  const lightboxBackdrop = document.getElementById("lightboxBackdrop");

  function openLightbox(imgEl) {
    if (!lightboxModal || !lightboxImg) return;
    lightboxImg.src = imgEl.src;
    lightboxImg.alt = imgEl.alt || "SQF Training photograph";
    const figcap = imgEl.closest("figure")?.querySelector("figcaption");
    if (lightboxCaption) {
      lightboxCaption.textContent = figcap ? figcap.textContent : imgEl.alt;
    }
    lightboxModal.hidden = false;
  }

  function closeLightbox() {
    if (!lightboxModal) return;
    lightboxModal.hidden = true;
    if (lightboxImg) lightboxImg.src = "";
  }

  document.querySelectorAll(".lightbox-trigger").forEach((img) => {
    img.addEventListener("click", () => openLightbox(img));
  });

  if (lightboxClose) lightboxClose.addEventListener("click", closeLightbox);
  if (lightboxBackdrop) lightboxBackdrop.addEventListener("click", closeLightbox);
  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape" && lightboxModal && !lightboxModal.hidden) {
      closeLightbox();
    }
  });

  // 6. Contact Form -> Direct WhatsApp Message Builder
  const enquiryForm = document.getElementById("enquiryForm");
  if (enquiryForm) {
    enquiryForm.addEventListener("submit", (e) => {
      e.preventDefault();
      const name = document.getElementById("clientName").value.trim();
      const company = document.getElementById("companyName").value.trim();
      const phone = document.getElementById("clientPhone").value.trim();
      const service = document.getElementById("serviceArea").value;
      const details = document.getElementById("clientMessage").value.trim();

      const messageLines = [
        "Hello SQF, I would like to discuss our requirements:",
        `• Name: ${name}`,
        `• Organization: ${company}`,
        `• Phone: ${phone}`,
        `• Requirement: ${service}`
      ];
      if (details) {
        messageLines.push(`• Details: ${details}`);
      }

      const whatsappUrl = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(
        messageLines.join("\n")
      )}`;
      window.open(whatsappUrl, "_blank", "noopener,noreferrer");
    });
  }
});
