/**
 * Progressive enhancement only — every section, link and the menu content
 * remain usable without this script.
 */

// ---- Theme toggle -------------------------------------------------------
const root = document.documentElement;
const media = window.matchMedia("(prefers-color-scheme: dark)");

const currentTheme = () =>
  (root.dataset.theme as "light" | "dark" | undefined) ?? (media.matches ? "dark" : "light");

function syncThemeButtons() {
  const isDark = currentTheme() === "dark";
  document.querySelectorAll<HTMLButtonElement>("[data-theme-toggle]").forEach((btn) => {
    btn.setAttribute("aria-pressed", String(isDark));
    btn.setAttribute("aria-label", isDark ? "Switch to light theme" : "Switch to dark theme");
  });
}

document.querySelectorAll<HTMLButtonElement>("[data-theme-toggle]").forEach((btn) => {
  btn.addEventListener("click", () => {
    const next = currentTheme() === "dark" ? "light" : "dark";
    root.dataset.theme = next;
    try {
      localStorage.setItem("theme", next);
    } catch {
      /* storage unavailable — theme still applies for this page */
    }
    syncThemeButtons();
  });
});
media.addEventListener("change", syncThemeButtons);
syncThemeButtons();

// ---- Mobile menu ---------------------------------------------------------
const menuButton = document.querySelector<HTMLButtonElement>("[data-menu-toggle]");
const menu = document.getElementById("site-menu");

function setMenu(open: boolean) {
  if (!menuButton || !menu) return;
  menuButton.setAttribute("aria-expanded", String(open));
  menu.dataset.open = String(open);
  document.body.style.overflow = open ? "hidden" : "";
}

menuButton?.addEventListener("click", () => setMenu(menuButton.getAttribute("aria-expanded") !== "true"));
menu?.querySelectorAll("a").forEach((a) => a.addEventListener("click", () => setMenu(false)));
document.addEventListener("keydown", (e) => {
  if (e.key === "Escape" && menuButton?.getAttribute("aria-expanded") === "true") {
    setMenu(false);
    menuButton.focus();
  }
});
window.matchMedia("(min-width: 960px)").addEventListener("change", (e) => e.matches && setMenu(false));

// ---- Header state on scroll ---------------------------------------------
const header = document.querySelector<HTMLElement>(".site-header");
const onScroll = () => header?.toggleAttribute("data-scrolled", window.scrollY > 8);
window.addEventListener("scroll", onScroll, { passive: true });
onScroll();

// ---- Reveal on scroll ----------------------------------------------------
const revealables = document.querySelectorAll<HTMLElement>("[data-reveal]");
if ("IntersectionObserver" in window) {
  const io = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("is-visible");
          io.unobserve(entry.target);
        }
      });
    },
    { rootMargin: "0px 0px -8% 0px", threshold: 0.05 }
  );
  revealables.forEach((el) => io.observe(el));
} else {
  revealables.forEach((el) => el.classList.add("is-visible"));
}

// ---- Active section in nav ----------------------------------------------
const navLinks = new Map<string, HTMLAnchorElement[]>();
document.querySelectorAll<HTMLAnchorElement>("[data-nav-link]").forEach((a) => {
  const id = a.hash.slice(1);
  if (!id || window.location.pathname !== "/") return;
  navLinks.set(id, [...(navLinks.get(id) ?? []), a]);
});
// The active section is the lowest one whose top has passed 40% of the
// viewport. Sections sharing a row (Skills | Experience) tie; the first wins.
const sections = [...navLinks.keys()]
  .map((id) => document.getElementById(id))
  .filter((el): el is HTMLElement => el !== null);
let spyQueued = false;
// A clicked link stays highlighted until the visitor scrolls on their own,
// otherwise side-by-side sections would steal the highlight.
let pinned: string | undefined;

function setActive(active: string | undefined) {
  navLinks.forEach((links, id) =>
    links.forEach((l) => (id === active ? l.setAttribute("aria-current", "true") : l.removeAttribute("aria-current")))
  );
}
function updateActive() {
  spyQueued = false;
  if (pinned) return setActive(pinned);
  const line = window.innerHeight * 0.4;
  let active: string | undefined;
  let activeTop = -Infinity;
  for (const section of sections) {
    const top = Math.round(section.getBoundingClientRect().top);
    if (top <= line && top > activeTop) {
      active = section.id;
      activeTop = top;
    }
  }
  setActive(active);
}
if (sections.length) {
  navLinks.forEach((links, id) =>
    links.forEach((l) =>
      l.addEventListener("click", () => {
        pinned = id;
        setActive(id);
      })
    )
  );
  const unpin = () => {
    if (pinned) {
      pinned = undefined;
      updateActive();
    }
  };
  ["wheel", "touchmove"].forEach((type) => window.addEventListener(type, unpin, { passive: true }));
  window.addEventListener("keydown", (e) => {
    if (["ArrowUp", "ArrowDown", "PageUp", "PageDown", "Home", "End", " "].includes(e.key)) unpin();
  });
  window.addEventListener(
    "scroll",
    () => {
      if (!spyQueued) {
        spyQueued = true;
        requestAnimationFrame(updateActive);
      }
    },
    { passive: true }
  );
  updateActive();
}

// ---- Copy email ----------------------------------------------------------
document.querySelectorAll<HTMLButtonElement>("[data-copy]").forEach((btn) => {
  const label = btn.querySelector<HTMLElement>("[data-copy-label]");
  const original = label?.textContent ?? "";
  btn.addEventListener("click", async () => {
    try {
      await navigator.clipboard.writeText(btn.dataset.copy ?? "");
      if (label) label.textContent = "Copied";
    } catch {
      if (label) label.textContent = "Copy failed";
    }
    window.setTimeout(() => label && (label.textContent = original), 1800);
  });
});
