const FAV_KEY = 'ltw_th2_favorites';
const THEME_KEY = 'ltw_th2_theme';

export function getFavoriteIds() {
  try {
    const raw = localStorage.getItem(FAV_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

export function saveFavoriteIds(ids) {
  localStorage.setItem(FAV_KEY, JSON.stringify(ids));
}

export function getSavedTheme() {
  return localStorage.getItem(THEME_KEY) || 'light';
}

export function saveTheme(theme) {
  localStorage.setItem(THEME_KEY, theme);
}
