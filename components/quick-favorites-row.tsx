"use client";

import { useEffect, useState } from "react";
import MovieRow from "@/components/movie-row";
import { FAVORITES_KEY, itemToMovie, readList, type MediaListItem } from "@/lib/media-lists";

export default function QuickFavoritesRow() {
  const [items, setItems] = useState<MediaListItem[] | null>(null);

  useEffect(() => {
    const refresh = () => setItems(readList(FAVORITES_KEY));
    refresh();

    const onCustom = (e: Event) => {
      if ((e as CustomEvent).detail === FAVORITES_KEY) refresh();
    };
    const onStorage = (e: StorageEvent) => {
      if (e.key === FAVORITES_KEY) refresh();
    };

    window.addEventListener("nileflix:lists", onCustom);
    window.addEventListener("storage", onStorage);
    return () => {
      window.removeEventListener("nileflix:lists", onCustom);
      window.removeEventListener("storage", onStorage);
    };
  }, []);

  if (!items || items.length === 0) return null;

  return (
    <MovieRow
      title="Your Favorites"
      movies={items.slice(0, 12).map(itemToMovie)}
      hrefPrefix="/dashboard"
    />
  );
}
