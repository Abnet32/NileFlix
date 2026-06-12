import type { TMDBMovie } from "@/lib/tmdb";

export type MediaListKey =
  | "nileflix:favorites"
  | "nileflix:watchlist"
  | "nileflix:recent";

export const FAVORITES_KEY: MediaListKey = "nileflix:favorites";
export const WATCHLIST_KEY: MediaListKey = "nileflix:watchlist";
export const RECENT_KEY: MediaListKey = "nileflix:recent";

export type MediaListItem = {
  id: number;
  media_type: "movie" | "tv";
  title: string;
  poster_path: string | null;
  vote_average: number;
  date?: string;
  /** Real seconds watched (history items only). */
  watchedSeconds?: number;
  /** Total runtime in seconds reported by the player (history items only). */
  duration?: number;
};

type CacheField = "favorites" | "watchlist" | "recent";

const KEY_TO_FIELD: Record<MediaListKey, CacheField> = {
  "nileflix:favorites": "favorites",
  "nileflix:watchlist": "watchlist",
  "nileflix:recent": "recent",
};

// Server list name for the API (favorites/watchlist only).
const KEY_TO_LIST: Partial<Record<MediaListKey, "favorites" | "watchlist">> = {
  "nileflix:favorites": "favorites",
  "nileflix:watchlist": "watchlist",
};

type Cache = Record<CacheField, MediaListItem[]>;

const cache: Cache = { favorites: [], watchlist: [], recent: [] };
let hydrated = false;
let hydrating: Promise<void> | null = null;

function notify(key: MediaListKey) {
  if (typeof window === "undefined") return;
  window.dispatchEvent(new CustomEvent("nileflix:lists", { detail: key }));
}

function notifyAll() {
  notify(FAVORITES_KEY);
  notify(WATCHLIST_KEY);
  notify(RECENT_KEY);
}

/** Load the user's lists from the database once (client-side). */
export function ensureHydrated(): Promise<void> {
  if (typeof window === "undefined") return Promise.resolve();
  if (hydrated) return Promise.resolve();
  if (hydrating) return hydrating;

  hydrating = fetch("/api/lists", { credentials: "same-origin" })
    .then((res) => (res.ok ? res.json() : null))
    .then((data) => {
      if (data) {
        cache.favorites = Array.isArray(data.favorites) ? data.favorites : [];
        cache.watchlist = Array.isArray(data.watchlist) ? data.watchlist : [];
        cache.recent = Array.isArray(data.history) ? data.history : [];
      }
      hydrated = true;
      notifyAll();
    })
    .catch(() => {
      hydrated = true;
    })
    .finally(() => {
      hydrating = null;
    });

  return hydrating;
}

export function readList(key: MediaListKey): MediaListItem[] {
  void ensureHydrated();
  return cache[KEY_TO_FIELD[key]];
}

function sameItem(a: MediaListItem, id: number, media_type: "movie" | "tv") {
  return a.id === id && a.media_type === media_type;
}

export function isInList(
  key: MediaListKey,
  id: number,
  media_type: "movie" | "tv",
): boolean {
  return readList(key).some((entry) => sameItem(entry, id, media_type));
}

/** Toggle favorite/watchlist membership; returns the new membership state. */
export function toggleItem(key: MediaListKey, item: MediaListItem): boolean {
  const field = KEY_TO_FIELD[key];
  const list = KEY_TO_LIST[key];
  if (!list) return isInList(key, item.id, item.media_type);

  const exists = cache[field].some((e) =>
    sameItem(e, item.id, item.media_type),
  );
  const nowIn = !exists;

  // Optimistic local update.
  cache[field] = exists
    ? cache[field].filter((e) => !sameItem(e, item.id, item.media_type))
    : [item, ...cache[field]];
  notify(key);

  if (typeof window !== "undefined") {
    fetch("/api/lists", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      credentials: "same-origin",
      body: JSON.stringify({ list, item }),
    })
      .then((res) => {
        if (!res.ok) throw new Error("toggle failed");
      })
      .catch(() => {
        // Re-sync from the server on failure.
        hydrated = false;
        void ensureHydrated();
      });
  }

  return nowIn;
}

export function removeItem(
  key: MediaListKey,
  id: number,
  media_type: "movie" | "tv",
) {
  if (isInList(key, id, media_type)) {
    toggleItem(key, {
      id,
      media_type,
      title: "",
      poster_path: null,
      vote_average: 0,
    });
  }
}

/** Optimistically add/refresh a recently-watched item in the local cache. */
export function cacheRecent(item: MediaListItem) {
  cache.recent = [
    item,
    ...cache.recent.filter((e) => !sameItem(e, item.id, item.media_type)),
  ];
  notify(RECENT_KEY);
}

export function getFavoritesIds(): number[] {
  return readList(FAVORITES_KEY).map((item) => item.id);
}

export function getWatchlistIds(): number[] {
  return readList(WATCHLIST_KEY).map((item) => item.id);
}

/** Adapt a stored item into the shape MovieCard/MovieRow expect. */
export function itemToMovie(item: MediaListItem): TMDBMovie {
  return {
    id: item.id,
    title: item.media_type === "movie" ? item.title : undefined,
    name: item.media_type === "tv" ? item.title : undefined,
    overview: "",
    backdrop_path: null,
    poster_path: item.poster_path,
    vote_average: item.vote_average,
    release_date: item.media_type === "movie" ? item.date : undefined,
    first_air_date: item.media_type === "tv" ? item.date : undefined,
    media_type: item.media_type,
  };
}
