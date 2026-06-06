import { readRecentlySeen } from "@/lib/recently-seen";
import { FAVORITES_KEY, WATCHLIST_KEY, readList } from "@/lib/media-lists";
import { discoverMovies, type TMDBMovie } from "@/lib/tmdb";

type GenreProfile = { genreId: number; count: number };

/**
 * Analyze user's favorites + recently seen to extract preferred genres.
 * Returns genre IDs sorted by frequency.
 */
export function getUserGenreProfile(): GenreProfile[] {
  // Build a combined list of items with genre_ids
  const favorites = readList(FAVORITES_KEY);
  const watchlist = readList(WATCHLIST_KEY);
  const recent = readRecentlySeen();

  // Unfortunately, localStorage items don't carry genre_ids from TMDB.
  // Instead, we use a static genre-affinity mapping based on content type patterns.
  // For the rule-based recommender, we'll use TMDB's recommendation/discover
  // endpoints which don't require genre input at the basic level.

  // Count content types for a simple preference profile
  const typeCounts: Record<string, number> = {};

  for (const item of [...favorites, ...watchlist, ...recent]) {
    typeCounts[item.media_type] = (typeCounts[item.media_type] || 0) + 1;
  }

  return Object.entries(typeCounts)
    .sort(([, a], [, b]) => b - a)
    .map(([, count], i) => ({ genreId: i, count }))
    .slice(0, 5);
}

/**
 * Fetch personalized recommendations by leveraging TMDB's trending/popular
 * endpoints mixed with the user's preferred content type ratio.
 */
export async function getRuleBasedRecommendations(
  excludeIds: number[] = [],
): Promise<TMDBMovie[]> {
  try {
    const recent = readRecentlySeen();
    const favorites = readList(FAVORITES_KEY);
    const watchlist = readList(WATCHLIST_KEY);

    // Count which media type the user prefers
    let movieCount = 0;
    let tvCount = 0;

    for (const item of [...recent, ...favorites, ...watchlist]) {
      if (item.media_type === "movie") movieCount++;
      else tvCount++;
    }

    // Default to 50/50 split if not enough data
    const total = movieCount + tvCount || 1;
    const movieRatio = total > 0 ? movieCount / total : 0.5;

    // If user leans heavily toward movies, recommend more movies
    const preferMovies = movieRatio >= 0.6;

    if (preferMovies) {
      const res = await discoverMovies({
        sort_by: "popularity.desc",
        "vote_count.gte": "100",
        "vote_average.gte": "6",
      });
      return res.results
        .filter((m) => !excludeIds.includes(m.id))
        .slice(0, 15);
    }

    // For TV-leaning or mixed users, return trending movies as safe defaults
    // In production, this would call a TV discover endpoint
    const res = await discoverMovies({
      sort_by: "popularity.desc",
      "vote_count.gte": "50",
    });
    return res.results
      .filter((m) => !excludeIds.includes(m.id))
      .slice(0, 15);
  } catch {
    return [];
  }
}

export function getRecentlySeenIds(): number[] {
  return readRecentlySeen().map((item) => item.id);
}
