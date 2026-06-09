/* eslint-disable react-hooks/set-state-in-effect */
"use client";

import { useEffect, useState } from "react";
import MovieRow from "@/components/movie-row";
import { readRecentlySeen, recentToMovie, type RecentItem } from "@/lib/recently-seen";

export default function ContinueWatchingRow() {
  const [items, setItems] = useState<RecentItem[] | null>(null);

  useEffect(() => {
    const recent = readRecentlySeen();
    if (recent.length > 0) {
      setItems(recent.slice(0, 12));
    } else {
      setItems([]);
    }
  }, []);

  if (!items || items.length === 0) return null;

  return (
    <MovieRow
      title="Continue Watching"
      movies={items.map(recentToMovie)}
      hrefPrefix="/dashboard"
    />
  );
}
