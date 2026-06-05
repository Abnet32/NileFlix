"use client";

import { useEffect, useState } from "react";
import { Heart, Bookmark } from "lucide-react";
import { cn } from "@/lib/utils";
import {
  FAVORITES_KEY,
  WATCHLIST_KEY,
  isInList,
  toggleItem,
  type MediaListItem,
} from "@/lib/media-lists";

export default function MediaActions({ item }: { item: MediaListItem }) {
  const [mounted, setMounted] = useState(false);
  const [fav, setFav] = useState(false);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    setMounted(true);
    setFav(isInList(FAVORITES_KEY, item.id, item.media_type));
    setSaved(isInList(WATCHLIST_KEY, item.id, item.media_type));
  }, [item.id, item.media_type]);

  const baseClass =
    "inline-flex items-center gap-2 rounded-md border px-4 py-2 text-sm font-medium transition-colors";

  return (
    <div className="flex flex-wrap items-center gap-3">
      <button
        type="button"
        aria-pressed={fav}
        disabled={!mounted}
        onClick={() => setFav(toggleItem(FAVORITES_KEY, item))}
        className={cn(
          baseClass,
          fav
            ? "border-transparent bg-accent text-accent-foreground"
            : "border-border bg-background hover:bg-muted",
        )}
      >
        <Heart className={cn("size-4", fav && "fill-current")} />
        {fav ? "Favorited" : "Favorite"}
      </button>

      <button
        type="button"
        aria-pressed={saved}
        disabled={!mounted}
        onClick={() => setSaved(toggleItem(WATCHLIST_KEY, item))}
        className={cn(
          baseClass,
          saved
            ? "border-transparent bg-primary text-primary-foreground"
            : "border-border bg-background hover:bg-muted",
        )}
      >
        <Bookmark className={cn("size-4", saved && "fill-current")} />
        {saved ? "In Watchlist" : "Watchlist"}
      </button>
    </div>
  );
}
