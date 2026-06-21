
import { Business, SearchSession } from './types';

const FAVORITES_KEY = 'spicescout_favorites';
const HISTORY_KEY = 'spicescout_history';

export function getFavorites(): Business[] {
  if (typeof window === 'undefined') return [];
  const data = localStorage.getItem(FAVORITES_KEY);
  return data ? JSON.parse(data) : [];
}

export function toggleFavorite(business: Business) {
  const favorites = getFavorites();
  const index = favorites.findIndex(b => b.id === business.id);
  
  if (index > -1) {
    favorites.splice(index, 1);
  } else {
    favorites.push({ ...business, isFavorite: true });
  }
  
  localStorage.setItem(FAVORITES_KEY, JSON.stringify(favorites));
  return favorites;
}

export function getSearchHistory(): SearchSession[] {
  if (typeof window === 'undefined') return [];
  const data = localStorage.getItem(HISTORY_KEY);
  return data ? JSON.parse(data) : [];
}

export function addToHistory(session: SearchSession) {
  const history = getSearchHistory();
  history.unshift(session);
  localStorage.setItem(HISTORY_KEY, JSON.stringify(history.slice(0, 20))); // Keep last 20
  return history;
}
