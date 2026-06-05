// Recently-seen is one of the localStorage media lists. This module keeps the
// original API names used by recently-seen-row.tsx / recently-seen-tracker.tsx
// while delegating to the generalized lib/media-lists.ts implementation.
import {
  RECENT_KEY,
  itemToMovie,
  pushItem,
  readList,
  type MediaListItem,
} from "@/lib/media-lists";

export type RecentItem = MediaListItem;

export function readRecentlySeen(): RecentItem[] {
  return readList(RECENT_KEY);
}

export function pushRecentlySeen(item: RecentItem) {
  pushItem(RECENT_KEY, item);
}

export const recentToMovie = itemToMovie;
