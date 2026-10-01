/**
 * ShareLink Multi-Theme Engine
 * Supported Themes: teams, whatsapp, zoom
 */
const SUPPORTED_THEMES = ["teams", "whatsapp", "zoom"];

function detectTheme() {
  const urlParams = new URLSearchParams(window.location.search);
  const paramTheme = urlParams.get("theme");
  if (paramTheme && SUPPORTED_THEMES.includes(paramTheme.toLowerCase())) {
    return paramTheme.toLowerCase();
  }
  const savedTheme = localStorage.getItem("sharelink_theme");
  if (savedTheme && SUPPORTED_THEMES.includes(savedTheme)) {
    return savedTheme;
  }
  return "teams";
}

function setTheme(theme) {
  if (!SUPPORTED_THEMES.includes(theme)) return;
  document.documentElement.setAttribute("data-theme", theme);
  localStorage.setItem("sharelink_theme", theme);

  // Update theme select if present
  const select = document.querySelector("#theme-select");
  if (select && select.value !== theme) {
    select.value = theme;
  }

  // Update brand icon/letter
  const brandIcon = document.querySelector(".brand-logo-icon");
  if (brandIcon) {
    if (theme === "teams") brandIcon.textContent = "T";
    else if (theme === "whatsapp") brandIcon.textContent = "W";
    else if (theme === "zoom") brandIcon.textContent = "Z";
  }
}

// Initialise theme immediately to avoid flash of unstyled content
const initialTheme = detectTheme();
document.documentElement.setAttribute("data-theme", initialTheme);

document.addEventListener("DOMContentLoaded", () => {
  setTheme(initialTheme);
  const select = document.querySelector("#theme-select");
  if (select) {
    select.value = initialTheme;
    select.addEventListener("change", (e) => setTheme(e.target.value));
  }
});
