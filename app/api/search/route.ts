import { searchContent } from "@/lib/tmdb";
import { NextResponse } from "next/server";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const query = searchParams.get("query")?.trim() ?? "";
  const type = searchParams.get("type") ?? "all";

  if (!query) {
    return NextResponse.json({ results: [] });
  }
  // strict type-specific searches
  if (type === "movie") {
    const res = await fetch(
      `https://api.themoviedb.org/3/search/movie?query=${encodeURIComponent(query)}&language=en-US&api_key=${process.env.TMDB_API_KEY}`,
    );

    if (!res.ok) return NextResponse.json({ results: [] });

    const data = await res.json();
    const mapped = (data.results as any[]).map((r) => ({
      ...r,
      media_type: "movie",
    }));
    return NextResponse.json({ results: mapped });
  }

  if (type === "tv") {
    const res = await fetch(
      `https://api.themoviedb.org/3/search/tv?query=${encodeURIComponent(query)}&language=en-US&api_key=${process.env.TMDB_API_KEY}`,
    );

    if (!res.ok) return NextResponse.json({ results: [] });

    const data = await res.json();
    const mapped = (data.results as any[]).map((r) => ({
      ...r,
      media_type: "tv",
    }));
    return NextResponse.json({ results: mapped });
  }

  if (type === "anime") {
    // Search TV shows and filter to Animation genre or Japanese language
    const res = await fetch(
      `https://api.themoviedb.org/3/search/tv?query=${encodeURIComponent(query)}&language=en-US&api_key=${process.env.TMDB_API_KEY}`,
    );

    if (!res.ok) {
      return NextResponse.json({ results: [] });
    }

    const data = await res.json();

    const filtered = (data.results as any[]).filter(
      (r) =>
        (r.genre_ids && r.genre_ids.includes(16)) ||
        r.original_language === "ja",
    );

    return NextResponse.json({
      results: filtered.map((r) => ({ ...r, media_type: "tv" })),
    });
  }

  // default: multi-search (movies + tv)
  const { results } = await searchContent(query);

  return NextResponse.json({
    results: results.filter(
      (item) => item.media_type === "movie" || item.media_type === "tv",
    ),
  });
}
