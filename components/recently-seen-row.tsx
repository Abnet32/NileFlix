"use client";

import { useEffect, useState } from "react";
import MovieRow from "@/components/movie-row";
import {
  readRecentlySeen,
  recentToMovie,
  type RecentItem,
} from "@/lib/recently-seen";

/**
 * Renders the "Recently seen" row from localStorage. Renders nothing until
 * mounted (avoids hydration mismatch) and when the history is empty.
 */
export default function RecentlySeenRow() {
  const [items, setItems] = useState<RecentItem[] | null>(null);

  useEffect(() => {
    setItems(readRecentlySeen());
  }, []);

  if (!items || items.length === 0) return null;

  return (
    <MovieRow
      title="Recently Seen"
      movies={items.map(recentToMovie)}
      hrefPrefix="/dashboard"
    />
  );
}
