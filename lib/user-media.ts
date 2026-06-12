import "server-only";
import client from "./db";
import type { MediaListItem } from "./media-lists";

export type ListName = "favorites" | "watchlist";

type Doc = {
  userId: string;
  id: number;
  media_type: "movie" | "tv";
  title: string;
  poster_path: string | null;
  vote_average: number;
  date?: string;
  watchedSeconds?: number;
  duration?: number;
  createdAt: Date;
  updatedAt: Date;
};

const COLLECTIONS = {
  favorites: "favorites",
  watchlist: "watchlist",
  history: "watch_history",
} as const;

function collection(name: keyof typeof COLLECTIONS) {
  return client.db().collection<Doc>(COLLECTIONS[name]);
}

/** Collapse to one entry per title (id + media_type), keeping the first seen. */
function dedupe(items: MediaListItem[]): MediaListItem[] {
  const seen = new Set<string>();
  const out: MediaListItem[] = [];
  for (const item of items) {
    const key = `${item.media_type}-${item.id}`;
    if (seen.has(key)) continue;
    seen.add(key);
    out.push(item);
  }
  return out;
}

function toItem(doc: Doc): MediaListItem {
  return {
    id: doc.id,
    media_type: doc.media_type,
    title: doc.title,
    poster_path: doc.poster_path,
    vote_average: doc.vote_average,
    date: doc.date,
    watchedSeconds: doc.watchedSeconds,
    duration: doc.duration,
  };
}

export async function getUserLists(userId: string): Promise<{
  favorites: MediaListItem[];
  watchlist: MediaListItem[];
  history: MediaListItem[];
}> {
  const [favorites, watchlist, history] = await Promise.all([
    collection("favorites")
      .find({ userId })
      .sort({ updatedAt: -1 })
      .limit(200)
      .toArray(),
    collection("watchlist")
      .find({ userId })
      .sort({ updatedAt: -1 })
      .limit(200)
      .toArray(),
    collection("history")
      .find({ userId })
      .sort({ updatedAt: -1 })
      .limit(50)
      .toArray(),
  ]);

  return {
    favorites: dedupe(favorites.map(toItem)),
    watchlist: dedupe(watchlist.map(toItem)),
    history: dedupe(history.map(toItem)),
  };
}

/** Toggle membership in favorites/watchlist. Returns true when now in the list. */
export async function toggleListItem(
  userId: string,
  list: ListName,
  item: MediaListItem,
): Promise<boolean> {
  const col = collection(list);
  const key = { userId, id: item.id, media_type: item.media_type };
  const existing = await col.findOne(key);

  if (existing) {
    await col.deleteOne(key);
    return false;
  }

  const now = new Date();
  await col.insertOne({
    ...key,
    title: item.title,
    poster_path: item.poster_path,
    vote_average: item.vote_average,
    date: item.date,
    createdAt: now,
    updatedAt: now,
  });
  return true;
}

/**
 * Record (or refine) a watch. A view is registered the first time this is
 * called for a title; later calls update the real watched seconds / duration.
 */
export async function recordWatch(
  userId: string,
  item: MediaListItem,
  watchedSeconds = 0,
  duration = 0,
): Promise<void> {
  const col = collection("history");
  const key = { userId, id: item.id, media_type: item.media_type };
  const now = new Date();

  await col.updateOne(
    key,
    {
      $max: {
        watchedSeconds: Math.max(0, Math.round(watchedSeconds)),
        duration: Math.max(0, Math.round(duration)),
      },
      $set: {
        title: item.title,
        poster_path: item.poster_path,
        vote_average: item.vote_average,
        date: item.date,
        updatedAt: now,
      },
      $setOnInsert: { ...key, createdAt: now },
    },
    { upsert: true },
  );
}
