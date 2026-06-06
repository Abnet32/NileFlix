"use client";

import MovieCard from "@/components/movie-card";
import { TMDBMovie } from "@/lib/tmdb";
import { useEffect, useRef, useState } from "react";

type MovieRowProps = {
  title: string;
  movies: TMDBMovie[];
  contentType?: "movie" | "tv" | "anime";
  hrefPrefix?: string;
  viewAllHref?: string;
};

export default function MovieRow({
  title,
  movies,
  contentType,
  hrefPrefix,
  viewAllHref,
}: MovieRowProps) {
  const scrollerRef = useRef<HTMLDivElement | null>(null);
  const [scrollProgress, setScrollProgress] = useState(0);

  useEffect(() => {
    const scroller = scrollerRef.current;
    if (!scroller) return;

    const updateProgress = () => {
      const maxScroll = scroller.scrollWidth - scroller.clientWidth;
      if (maxScroll <= 0) {
        setScrollProgress(100);
        return;
      }

      const progress = (scroller.scrollLeft / maxScroll) * 100;
      setScrollProgress(Math.min(100, Math.max(0, progress)));
    };

    updateProgress();
    scroller.addEventListener("scroll", updateProgress, { passive: true });
    window.addEventListener("resize", updateProgress);

    return () => {
      scroller.removeEventListener("scroll", updateProgress);
      window.removeEventListener("resize", updateProgress);
    };
  }, [movies]);

  return (
    <section className="mb-6 sm:mb-8">
      <div className="mb-2 flex items-center justify-between px-2 sm:mb-3">
        <h2 className="text-base font-medium sm:text-lg">{title}</h2>
        {viewAllHref ? (
          <a
            href={viewAllHref}
            className="text-xs font-medium text-primary transition-colors hover:text-primary/80"
          >
            View All →
          </a>
        ) : null}
      </div>
      <progress
        className="mb-2 block h-0.5 w-full overflow-hidden appearance-none rounded-full accent-primary transition-opacity duration-200"
        value={scrollProgress}
        max={100}
        aria-label={`${title} scroll progress`}
      />
      <div className="-mx-2 overflow-x-auto px-2 scroll-pl-4 snap-x snap-mandatory scrollbar-hide">
        <div className="flex items-stretch gap-3 sm:gap-4">
          {movies.slice(0, 12).map((movie) => (
            <div
              key={movie.id}
              className="w-36 shrink-0 snap-start sm:w-44 md:w-52 lg:w-60"
            >
              <MovieCard
                movie={movie}
                contentType={contentType}
                hrefPrefix={hrefPrefix}
              />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
