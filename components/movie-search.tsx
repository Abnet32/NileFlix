"use client";

import { Card } from "@/components/ui/card";
import {
  getContentHref,
  getContentTitle,
  getContentYear,
  type TMDBSearchResult,
} from "@/lib/tmdb";
import { Badge } from "@/components/ui/badge";
import { Search, X, ChevronDown } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";

type SearchResponse = {
  results: TMDBSearchResult[];
};

type MovieSearchProps = {
  initialQuery?: string;
};

export default function MovieSearch({ initialQuery = "" }: MovieSearchProps) {
  const wrapperRef = useRef<HTMLDivElement | null>(null);
  const requestIdRef = useRef(0);
  const [query, setQuery] = useState(initialQuery);
  const [results, setResults] = useState<TMDBSearchResult[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [scope, setScope] = useState<"all" | "movie" | "tv" | "anime">("all");

  const trimmedQuery = useMemo(() => query.trim(), [query]);

  const runSearch = useCallback(
    async (searchTerm: string) => {
      const requestId = ++requestIdRef.current;
      setIsLoading(true);

      try {
        const params = new URLSearchParams();
        params.set("query", searchTerm);
        if (scope && scope !== "all") params.set("type", scope);

        const response = await fetch(`/api/search?${params.toString()}`);

        if (!response.ok) {
          throw new Error("Failed to search titles");
        }

        if (requestId !== requestIdRef.current) return;

        const data = (await response.json()) as SearchResponse;
        setResults(data.results);
        setIsOpen(true);
      } catch {
        if (requestId === requestIdRef.current) {
          setResults([]);
          setIsOpen(true);
        }
      } finally {
        if (requestId === requestIdRef.current) {
          setIsLoading(false);
        }
      }
    },
    [scope],
  );

  useEffect(() => {
    const handlePointerDown = (event: PointerEvent) => {
      if (!wrapperRef.current?.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener("pointerdown", handlePointerDown);

    return () => {
      document.removeEventListener("pointerdown", handlePointerDown);
    };
  }, []);

  useEffect(() => {
    if (!trimmedQuery) return;

    const timeoutId = window.setTimeout(() => {
      void runSearch(trimmedQuery);
    }, 200);

    return () => {
      window.clearTimeout(timeoutId);
    };
  }, [trimmedQuery, runSearch]);

  return (
    <div ref={wrapperRef} className="relative">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-end">
        <div className="relative flex-1 space-y-2">
          <div className="relative">
            <Search className="pointer-events-none absolute left-4 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
            <input
              id="movie-search"
              value={query}
              onChange={(event) => {
                const nextQuery = event.target.value;
                setQuery(nextQuery);
                setIsOpen(true);

                if (!nextQuery.trim()) {
                  setResults([]);
                  setIsLoading(false);
                }
              }}
              onFocus={() => {
                if (trimmedQuery) {
                  setIsOpen(true);
                }
              }}
              placeholder="search movies, tv shows, or anime..."
              autoComplete="off"
              className="h-11 w-full rounded-none border border-input bg-background pl-11 pr-12 text-sm outline-none transition-colors placeholder:text-muted-foreground focus:border-primary focus:ring-1 focus:ring-primary/30 sm:h-12"
            />

            {query ? (
              <button
                type="button"
                onClick={() => {
                  setQuery("");
                  setResults([]);
                  setIsOpen(false);
                }}
                className="absolute right-3 top-1/2 inline-flex size-7 -translate-y-1/2 items-center justify-center rounded-none text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
                aria-label="Clear search"
              >
                <X className="size-4" />
              </button>
            ) : null}
          </div>
        </div>

        <div className="flex items-center gap-3">
          <div className="relative">
            <select
              value={scope}
              onChange={(e) =>
                setScope(e.target.value as "all" | "movie" | "tv" | "anime")
              }
              className="h-11 rounded-none border border-input bg-background pl-3 pr-10 text-sm outline-none appearance-none sm:h-12"
              aria-label="Search scope"
            >
              <option value="all">All</option>
              <option value="movie">Movies</option>
              <option value="tv">TV Shows</option>
              <option value="anime">Anime</option>
            </select>

            <ChevronDown
              className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground"
              aria-hidden="true"
            />
          </div>

          <button
            type="button"
            onClick={() => {
              if (!trimmedQuery) return;
              void runSearch(trimmedQuery);
            }}
            className="inline-flex h-11 items-center justify-center gap-2 rounded-none border border-transparent bg-primary px-5 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90 disabled:cursor-not-allowed disabled:opacity-60 sm:h-12"
            disabled={!trimmedQuery || isLoading}
          >
            <Search className="size-4" />
            Search
          </button>
        </div>
      </div>

      {isOpen && trimmedQuery ? (
        <div className="absolute left-0 right-0 top-full z-50 mt-3">
          <Card className="overflow-hidden border-border/70 bg-card/95 shadow-2xl shadow-black/15 backdrop-blur">
            <div className="flex items-center justify-between border-b border-border px-3 py-2.5 sm:px-4 sm:py-3">
              <p className="text-xs text-muted-foreground">
                {isLoading ? "Loading" : `${results.length} found`}
              </p>
            </div>

            {results.length ? (
              <div className="max-h-[60vh] overflow-y-auto p-1.5 sm:p-2">
                {results.map((item) =>
                  (() => {
                    const imagePath = item.poster_path ?? item.backdrop_path;
                    const year = getContentYear(item);
                    const title = getContentTitle(item);
                    const href = getContentHref(item);
                    const contentType =
                      item.media_type === "tv" ? "TV Show" : "Movie";

                    return (
                      <Link
                        key={`${item.media_type}-${item.id}`}
                        href={href}
                        onClick={() => setIsOpen(false)}
                        className="flex items-center gap-3 rounded-none p-2 transition-colors hover:bg-muted"
                      >
                        <div className="relative h-14 w-10 shrink-0 overflow-hidden bg-muted sm:h-16 sm:w-12">
                          {imagePath ? (
                            <Image
                              src={`https://image.tmdb.org/t/p/w342${imagePath}`}
                              alt={title}
                              fill
                              className="object-cover"
                              sizes="40px"
                            />
                          ) : null}
                        </div>
                        <div className="min-w-0 flex-1">
                          <div className="mb-1 flex items-center gap-2">
                            <p className="truncate text-sm font-medium text-foreground sm:text-[15px]">
                              {title}
                            </p>
                            <Badge
                              variant="secondary"
                              className="h-5 rounded-full px-2 text-[10px] uppercase tracking-[0.2em]"
                            >
                              {contentType}
                            </Badge>
                          </div>
                          <p className="truncate text-[11px] text-muted-foreground sm:text-xs">
                            {year ?? "Unknown year"} •{" "}
                            {item.vote_average.toFixed(1)}
                          </p>
                          <p className="line-clamp-2 text-[11px] text-muted-foreground sm:text-xs">
                            {item.overview || "No description available."}
                          </p>
                        </div>
                      </Link>
                    );
                  })(),
                )}
              </div>
            ) : isLoading ? (
              <div className="p-4 text-sm text-muted-foreground">
                Fetching matches...
              </div>
            ) : (
              <div className="p-4 text-sm text-muted-foreground">
                No matches yet. Try a different word or title.
              </div>
            )}
          </Card>
        </div>
      ) : null}
    </div>
  );
}
