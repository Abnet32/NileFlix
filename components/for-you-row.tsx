"use client";

import { useEffect, useState } from "react";
import MovieRow from "@/components/movie-row";
import { getRuleBasedRecommendations, getRecentlySeenIds } from "@/lib/recommendations";
import { type TMDBMovie } from "@/lib/tmdb";

export default function ForYouRow() {
  const [items, setItems] = useState<TMDBMovie[] | null>(null);

  useEffect(() => {
    let cancelled = false;

    async function fetchRecs() {
      try {
        const excludeIds = getRecentlySeenIds();
        const recs = await getRuleBasedRecommendations(excludeIds);
        if (!cancelled) setItems(recs);
      } catch {
        if (!cancelled) setItems([]);
      }
    }

    fetchRecs();
    return () => { cancelled = true; };
  }, []);

  if (!items || items.length === 0) return null;

  return (
    <MovieRow
      title="For You"
      movies={items}
      contentType="movie"
      hrefPrefix="/dashboard"
    />
  );
}
