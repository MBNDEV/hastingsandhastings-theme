/**
 * theme.js
 * --------
 * Lightweight theme manager.
 * - Reads/writes data-theme on <html>
 * - Persists choice to localStorage under key 'site-theme'
 * - Designed to work standalone on the hero block and scale
 *   to the full page as other blocks are added.
 *
 * Usage in other blocks: just include this same script once
 * at the bottom of the page; it will apply the saved theme
 * to <html> on load automatically.
 */

(function () {
  const STORAGE_KEY = 'site-theme';
  const THEMES = ['light', 'dark'];
  const DEFAULT_THEME = 'light';

  /** Read the saved theme or fall back to default */
  function getSavedTheme() {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      return THEMES.includes(saved) ? saved : DEFAULT_THEME;
    } catch (_) {
      return DEFAULT_THEME;
    }
  }

  /** Apply a theme to <html> and save it */
  function applyTheme(theme) {
    document.documentElement.setAttribute('data-theme', theme);
    try {
      localStorage.setItem(STORAGE_KEY, theme);
    } catch (_) {}
  }

  /** Wire up all [data-theme-toggle] buttons */
  function bindButtons() {
    document.querySelectorAll('[data-theme-toggle]').forEach(function (btn) {
      btn.addEventListener('click', function () {
        const target = btn.getAttribute('data-theme-toggle');
        if (THEMES.includes(target)) {
          applyTheme(target);
        }
      });
    });
  }

  /* ── Init ── */
  applyTheme(getSavedTheme());

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', bindButtons);
  } else {
    bindButtons();
  }
})();
