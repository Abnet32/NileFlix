// Recently-seen is the user's watch history, persisted per-user in the
// database. This module keeps the original API names used by
// recently-seen-row.tsx / recently-seen-tracker.tsx while delegating to the
// database-backed store in lib/media-lists.ts.
import {
  RECENT_KEY,
  cacheRecent,
  itemToMovie,
  readList,
  type MediaListItem,
} from "@/lib/media-lists";

export type RecentItem = MediaListItem;

export function readRecentlySeen(): RecentItem[] {
  return readList(RECENT_KEY);
}

/**
 * Record a watch: a view the first time it's called for a title, then refined
 * with real watched seconds / duration on later calls. Updates the local cache
 * optimistically and persists to the database.
 */
export function pushRecentlySeen(
  item: RecentItem,
  progress?: { watchedSeconds?: number; duration?: number },
) {
  const watchedSeconds = progress?.watchedSeconds ?? item.watchedSeconds ?? 0;
  const duration = progress?.duration ?? item.duration ?? 0;

  cacheRecent({ ...item, watchedSeconds, duration });

  if (typeof window === "undefined") return;
  void fetch("/api/watch", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    credentials: "same-origin",
    body: JSON.stringify({ item, watchedSeconds, duration }),
  }).catch(() => {});
}

export const recentToMovie = itemToMovie;
