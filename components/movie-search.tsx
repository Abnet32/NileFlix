"use client";

import { Card } from "@/components/ui/card";
import type { TMDBMovie } from "@/lib/tmdb";
import { Search, X } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useMemo, useRef, useState } from "react";

type SearchResponse = {
  results: TMDBMovie[];
};

type MovieSearchProps = {
  initialQuery?: string;
};

export default function MovieSearch({ initialQuery = "" }: MovieSearchProps) {
  const wrapperRef = useRef<HTMLDivElement | null>(null);
  const requestIdRef = useRef(0);
  const [query, setQuery] = useState(initialQuery);
  const [results, setResults] = useState<TMDBMovie[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isOpen, setIsOpen] = useState(false);

  const trimmedQuery = useMemo(() => query.trim(), [query]);

  const runSearch = async (searchTerm: string) => {
    const requestId = ++requestIdRef.current;
    setIsLoading(true);

    try {
      const response = await fetch(
        `/api/search?query=${encodeURIComponent(searchTerm)}`,
      );

      if (!response.ok) {
        throw new Error("Failed to search movies");
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
  };

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

    const timeoutId = window.setTimeout(async () => {
      void runSearch(trimmedQuery);
    }, 200);

    return () => {
      window.clearTimeout(timeoutId);
    };
  }, [trimmedQuery]);

  return (
    <div ref={wrapperRef} className="relative">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-end">
        <div className="relative flex-1 space-y-2">
          {/* <label
            htmlFor="movie-search"
            className="text-xs uppercase tracking-[0.35em] text-muted-foreground"
          >
            Search movies
          </label> */}
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
              placeholder="search movies..."
              autoComplete="off"
              className="h-12 w-full rounded-none border border-input bg-background pl-11 pr-12 text-sm outline-none transition-colors placeholder:text-muted-foreground focus:border-primary focus:ring-1 focus:ring-primary/30"
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
          <button
            type="button"
            onClick={() => {
              if (!trimmedQuery) return;
              void runSearch(trimmedQuery);
            }}
            className="inline-flex h-12 items-center justify-center gap-2 rounded-none border border-transparent bg-primary px-5 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90 disabled:cursor-not-allowed disabled:opacity-60"
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
            <div className="flex items-center justify-between border-b border-border px-4 py-3">
              {/* <div>
                <p className="text-xs uppercase tracking-[0.35em] text-muted-foreground">
                  Live results
                </p>
                <p className="text-sm text-muted-foreground">
                  Showing matches for "{trimmedQuery}".
                </p>
              </div> */}
              <p className="text-xs text-muted-foreground">
                {isLoading ? "Loading" : `${results.length} found`}
              </p>
            </div>

            {results.length ? (
              <div className="max-h-[60vh] overflow-y-auto p-2">
                {results.map((movie) => {
                  const imagePath = movie.poster_path ?? movie.backdrop_path;
                  const releaseYear = movie.release_date
                    ? new Date(movie.release_date).getFullYear()
                    : null;

                  return (
                    <Link
                      key={movie.id}
                      href={`/movie/${movie.id}`}
                      onClick={() => setIsOpen(false)}
                      className="flex items-center gap-3 rounded-none p-2 transition-colors hover:bg-muted"
                    >
                      <div className="relative h-16 w-12 shrink-0 overflow-hidden bg-muted">
                        {imagePath ? (
                          <Image
                            src={`https://image.tmdb.org/t/p/w342${imagePath}`}
                            alt={movie.title}
                            fill
                            className="object-cover"
                            sizes="48px"
                          />
                        ) : null}
                      </div>
                      <div className="min-w-0 flex-1">
                        <p className="truncate text-sm font-medium text-foreground">
                          {movie.title}
                        </p>
                        <p className="truncate text-xs text-muted-foreground">
                          {releaseYear ?? "Unknown year"} •{" "}
                          {movie.vote_average.toFixed(1)}
                        </p>
                        <p className="line-clamp-2 text-xs text-muted-foreground">
                          {movie.overview || "No description available."}
                        </p>
                      </div>
                    </Link>
                  );
                })}
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
