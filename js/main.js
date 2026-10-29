const nav = document.querySelector(".nav");
const toggle = document.querySelector(".menu-toggle");
const modal = document.querySelector("#modal");
const title = document.querySelector("#modal-title");
const form = document.querySelector("#lead-form");
const status = document.querySelector(".form-status");
const modalIntro = document.querySelector(".modal-intro");
const modalClose = document.querySelector(".modal-close");
let lastModalTrigger = null;

const closeModal = () => {
  if (!modal) return;
  modal.hidden = true;
  lastModalTrigger?.focus();
};

toggle?.addEventListener("click", () => {
  const open = nav.classList.toggle("open");
  toggle.setAttribute("aria-expanded", String(open));
});

const menuButtons = [...document.querySelectorAll(".menu > button[aria-expanded]")];
const desktopHover = window.matchMedia("(hover: hover) and (min-width: 901px)");

const closeOtherMenus = (activeButton) => {
  menuButtons.forEach((otherButton) => {
    if (otherButton !== activeButton) {
      otherButton.setAttribute("aria-expanded", "false");
      otherButton.parentElement.classList.remove("open");
    }
  });
};

menuButtons.forEach((button) => {
  const menu = button.parentElement;

  button.addEventListener("click", () => {
    const open = desktopHover.matches || button.getAttribute("aria-expanded") !== "true";
    closeOtherMenus(button);

    button.setAttribute("aria-expanded", String(open));
    menu.classList.toggle("open", open);
  });

  menu.addEventListener("pointerenter", (event) => {
    if (event.pointerType !== "mouse" || !desktopHover.matches) return;

    closeOtherMenus(button);
    button.setAttribute("aria-expanded", "true");
    menu.classList.add("open");
  });

  menu.addEventListener("pointerleave", (event) => {
    if (event.pointerType !== "mouse" || !desktopHover.matches) return;

    button.setAttribute("aria-expanded", "false");
    menu.classList.remove("open");
  });
});

document.addEventListener("click", (event) => {
  if (!(event.target instanceof Element) || event.target.closest(".menu")) return;

  document.querySelectorAll(".menu.open").forEach((menu) => {
    menu.classList.remove("open");
    menu.querySelector(":scope > button[aria-expanded]")?.setAttribute("aria-expanded", "false");
  });
});

document.addEventListener("keydown", (event) => {
  if (event.key !== "Escape") return;

  document.querySelectorAll(".menu.open").forEach((menu) => {
    menu.classList.remove("open");
    menu.querySelector(":scope > button[aria-expanded]")?.setAttribute("aria-expanded", "false");
  });
  closeModal();
});

document.querySelector(".banner-close")?.addEventListener("click", () => {
  document.querySelector(".banner")?.remove();
});

document.querySelectorAll("[data-open-modal]").forEach((button) => {
  button.addEventListener("click", () => {
    const mode = button.getAttribute("data-open-modal");
    const modalCopy = {
      demo: ["Talk to our team", "Share a little context and we will help you explore the right workflow.", "Send inquiry"],
      login: ["Workspace sign-in", "Workspace accounts are not connected in this local preview.", "Continue in preview"],
      admin: ["Admin access", "Admin access is not connected in this local preview.", "Continue in preview"],
    }[mode] ?? ["Talk to our team", "Share a little context and we will help you explore the right workflow.", "Send inquiry"];

    lastModalTrigger = button;
    title.textContent = modalCopy[0];
    modalIntro.textContent = modalCopy[1];
    form.querySelector('[type="submit"]').textContent = modalCopy[2];
    form.dataset.mode = mode;
    status.textContent = "";
    modal.hidden = false;
    modalClose.focus();
  });
});

modalClose?.addEventListener("click", closeModal);

modal?.addEventListener("click", (event) => {
  if (event.target === modal) closeModal();
});

form?.addEventListener("submit", (event) => {
  event.preventDefault();
  const mode = form.dataset.mode;
  status.textContent = mode === "login"
    ? "No workspace is connected to this preview. Nothing was sent."
    : mode === "admin"
      ? "Admin access is unavailable in this preview. Nothing was sent."
      : "Thanks. Your inquiry is shown in this local demo only; nothing was sent.";
  form.reset();
});

const previewContent = {
  matter: {
    title: "Meridian acquisition",
    note: "A shared view of the people, documents, and open work for this matter.",
  },
  research: {
    title: "Research desk",
    note: "Collect source material and keep useful citations close to your analysis.",
  },
  documents: {
    title: "Document library",
    note: "Organize the working set and find details across related documents.",
  },
  contracts: {
    title: "Contract review",
    note: "Compare drafts and keep open language questions visible to reviewers.",
  },
};

const previewTitle = document.querySelector("#preview-title");
const dashboardNote = document.querySelector("#dashboard-note");
const peerToggle = document.querySelector("#peer-toggle");

document.querySelectorAll("[data-preview-view]").forEach((button) => {
  button.addEventListener("click", () => {
    const view = button.dataset.previewView;
    const content = previewContent[view];
    previewTitle.textContent = content.title;
    dashboardNote.textContent = content.note;

    document.querySelectorAll("[data-preview-view]").forEach((otherButton) => {
      const active = otherButton === button;
      otherButton.classList.toggle("active", active);
      otherButton.setAttribute("aria-pressed", String(active));
    });
  });
});

peerToggle?.addEventListener("change", () => {
  document.querySelector(".dashboard").dataset.peerMode = peerToggle.checked ? "on" : "off";
  dashboardNote.textContent = peerToggle.checked
    ? "Comparison view is on. " + previewContent[document.querySelector("[data-preview-view].active").dataset.previewView].note
    : "Comparison view is off. " + previewContent[document.querySelector("[data-preview-view].active").dataset.previewView].note;
});

document.querySelector("[data-ask-alder]")?.addEventListener("click", () => {
  dashboardNote.textContent = "Alder can help trace a clause, compare drafts, or find context in this sample workspace. The assistant is not connected in this preview.";
});

const platformFeatureContent = {
  assistants: {
    title: "Agents",
    label: "AGENT WORKFLOW",
    tag: "MERIDIAN / REVIEW",
    document: "Change of control provisions",
    note: "Three agreements use different notice periods. Review the cited passages before deciding on a position.",
  },
  spaces: {
    title: "Spaces",
    label: "SHARED MATTER",
    tag: "ACME / CLIENT SPACE",
    document: "Diligence room overview",
    note: "The latest issue list and draft are available to the matter team in one shared space.",
  },
  vault: {
    title: "Vault",
    label: "DOCUMENT LIBRARY",
    tag: "MERIDIAN / DOCUMENTS",
    document: "Search across 248 documents",
    note: "Relevant passages are grouped by source so reviewers can open and verify the original text.",
  },
  contracts: {
    title: "Contract Intelligence",
    label: "CONTRACT REVIEW",
    tag: "AGREEMENT / REDLINE",
    document: "Indemnity and liability terms",
    note: "This draft changes the liability cap. Compare the marked language with your team's review notes.",
  },
  operations: {
    title: "Command Center",
    label: "PRACTICE OVERVIEW",
    tag: "TEAM / ACTIVITY",
    document: "Open work by practice group",
    note: "Review workload and activity trends together before choosing where to focus next.",
  },
  research: {
    title: "Research",
    label: "RESEARCH DESK",
    tag: "RESEARCH / SOURCES",
    document: "Authority and source notes",
    note: "Each point links back to source material, giving the reviewer context to assess the analysis.",
  },
};

const platformTabs = [...document.querySelectorAll("[data-platform-tab]")];
const platformPreview = document.querySelector("#platform-preview");

const selectPlatformTab = (button) => {
  const feature = platformFeatureContent[button.dataset.platformTab];
  if (!feature) return;

  platformTabs.forEach((tab) => {
    const selected = tab === button;
    tab.classList.toggle("active", selected);
    tab.parentElement.classList.toggle("active", selected);
    tab.setAttribute("aria-selected", String(selected));
    tab.tabIndex = selected ? 0 : -1;
  });

  platformPreview.setAttribute("aria-labelledby", button.id);
  platformPreview.dataset.feature = button.dataset.platformTab;
  document.querySelector("#product-window-label").textContent = feature.label;
  document.querySelector("#product-document-tag").textContent = feature.tag;
  document.querySelector("#product-document-title").textContent = feature.document;
  document.querySelector("#product-assistant-note").textContent = feature.note;
};

platformTabs.forEach((button, index) => {
  button.tabIndex = button.getAttribute("aria-selected") === "true" ? 0 : -1;
  button.addEventListener("click", () => selectPlatformTab(button));
  button.addEventListener("keydown", (event) => {
    const directions = { ArrowRight: 1, ArrowDown: 1, ArrowLeft: -1, ArrowUp: -1 };
    const direction = directions[event.key];
    if (direction === undefined) return;

    event.preventDefault();
    const nextIndex = (index + direction + platformTabs.length) % platformTabs.length;
    platformTabs[nextIndex].focus();
    selectPlatformTab(platformTabs[nextIndex]);
  });
});

const audienceGrid = document.querySelector(".audience-grid");
const audienceHoverEnabled = window.matchMedia("(hover: hover) and (min-width: 601px)");
const audiencePanels = [...(audienceGrid?.querySelectorAll(".solution-panel") ?? [])];

const focusAudiencePanel = (activePanel) => {
  audienceGrid.dataset.focusedPanel = activePanel.id;
  audiencePanels.forEach((panel) => {
    const art = panel.querySelector(".solution-art");
    const active = panel === activePanel;
    panel.classList.toggle("is-focused", active);
    panel.classList.toggle("is-dimmed", !active);
    panel.style.transform = active ? "scale(1.06)" : "scale(0.94)";
    art.style.opacity = active ? "1" : "0.34";
    art.style.filter = active ? "saturate(1)" : "saturate(0.7)";
  });
};

const clearAudiencePanelFocus = (panel) => {
  if (audienceGrid.dataset.focusedPanel !== panel.id) return;

  delete audienceGrid.dataset.focusedPanel;
  audiencePanels.forEach((item) => {
    const art = item.querySelector(".solution-art");
    item.classList.remove("is-focused", "is-dimmed");
    item.style.removeProperty("transform");
    art.style.removeProperty("opacity");
    art.style.removeProperty("filter");
  });
};

audiencePanels.forEach((panel) => {
  panel.addEventListener("pointerenter", (event) => {
    if (event.pointerType === "mouse" && audienceHoverEnabled.matches) {
      focusAudiencePanel(panel);
    }
  });

  panel.addEventListener("pointerleave", (event) => {
    if (event.pointerType === "mouse") clearAudiencePanelFocus(panel);
  });

  panel.addEventListener("focusin", () => {
    if (audienceHoverEnabled.matches) focusAudiencePanel(panel);
  });

  panel.addEventListener("focusout", (event) => {
    if (!panel.contains(event.relatedTarget)) clearAudiencePanelFocus(panel);
  });
});
