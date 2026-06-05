import type { TMDBMovie } from "@/lib/tmdb";

export type MediaListKey =
  | "nileflix:favorites"
  | "nileflix:watchlist"
  | "nileflix:recent";

export const FAVORITES_KEY: MediaListKey = "nileflix:favorites";
export const WATCHLIST_KEY: MediaListKey = "nileflix:watchlist";
export const RECENT_KEY: MediaListKey = "nileflix:recent";

const CAPS: Record<MediaListKey, number> = {
  "nileflix:favorites": 100,
  "nileflix:watchlist": 100,
  "nileflix:recent": 20,
};

export type MediaListItem = {
  id: number;
  media_type: "movie" | "tv";
  title: string;
  poster_path: string | null;
  vote_average: number;
  date?: string;
};

export function readList(key: MediaListKey): MediaListItem[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = window.localStorage.getItem(key);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? (parsed as MediaListItem[]) : [];
  } catch {
    return [];
  }
}

function writeList(key: MediaListKey, items: MediaListItem[]) {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.setItem(key, JSON.stringify(items.slice(0, CAPS[key])));
    // Notify same-tab listeners (storage event only fires cross-tab).
    window.dispatchEvent(new CustomEvent("nileflix:lists", { detail: key }));
  } catch {
    // ignore quota / serialization errors
  }
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

/** Add to the front of a list (dedup, capped, newest-first). */
export function pushItem(key: MediaListKey, item: MediaListItem) {
  const existing = readList(key).filter(
    (entry) => !sameItem(entry, item.id, item.media_type),
  );
  writeList(key, [item, ...existing]);
}

export function removeItem(
  key: MediaListKey,
  id: number,
  media_type: "movie" | "tv",
) {
  writeList(
    key,
    readList(key).filter((entry) => !sameItem(entry, id, media_type)),
  );
}

/** Toggle membership; returns the new membership state (true = now in list). */
export function toggleItem(key: MediaListKey, item: MediaListItem): boolean {
  if (isInList(key, item.id, item.media_type)) {
    removeItem(key, item.id, item.media_type);
    return false;
  }
  pushItem(key, item);
  return true;
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
