"use client";

import { useEffect, useState } from "react";
import MovieRow from "@/components/movie-row";
import {
  readRecentlySeen,
  recentToMovie,
  type RecentItem,
} from "@/lib/recently-seen";

/**
 * Renders the "Recently seen" row from the user's watch history. Renders
 * nothing until mounted (avoids hydration mismatch) and when history is empty.
 */
export default function RecentlySeenRow() {
  const [items, setItems] = useState<RecentItem[] | null>(null);

  useEffect(() => {
    const refresh = () => setItems(readRecentlySeen());
    refresh();
    window.addEventListener("nileflix:lists", refresh);
    return () => window.removeEventListener("nileflix:lists", refresh);
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
