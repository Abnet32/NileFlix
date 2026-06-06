const SEARCH_HISTORY_KEY = "nileflix:search-history";
const MAX_HISTORY = 20;

export function getSearchHistory(): string[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = window.localStorage.getItem(SEARCH_HISTORY_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

export function addSearchTerm(term: string): void {
  if (typeof window === "undefined") return;
  if (!term.trim()) return;
  try {
    const history = getSearchHistory().filter((t) => t.toLowerCase() !== term.toLowerCase());
    history.unshift(term.trim());
    window.localStorage.setItem(SEARCH_HISTORY_KEY, JSON.stringify(history.slice(0, MAX_HISTORY)));
  } catch {
    // Ignore quota errors
  }
}

export function clearSearchHistory(): void {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.removeItem(SEARCH_HISTORY_KEY);
  } catch {
    // Ignore
  }
}
