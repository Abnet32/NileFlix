"use client";

import Header from "@/components/header";
import { buttonVariants } from "@/components/ui/button";
import { getContentTitle, type TMDBMovie } from "@/lib/tmdb";
import { Info, Play } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useMemo, useState, useEffect } from "react";

type HeroBannerProps = {
  movies: TMDBMovie[];
  initialHero?: TMDBMovie | null;
};

export default function HeroBanner({
  movies,
  initialHero = null,
}: HeroBannerProps) {
  const heroMovies = useMemo(
    () => movies.filter((movie) => movie.backdrop_path || movie.poster_path),
    [movies],
  );
  const [hero, setHero] = useState<TMDBMovie | null>(
    initialHero ?? heroMovies[0] ?? null,
  );

  // Pick a random hero only on the client after hydration so the server
  // rendered HTML matches the initial render and avoids hydration mismatches.
  useEffect(() => {
    if (heroMovies.length === 0) return;

    const idx = Math.floor(Math.random() * heroMovies.length);
    const id = window.setTimeout(() => setHero(heroMovies[idx]), 0);
    return () => window.clearTimeout(id);
  }, [heroMovies]);

  if (!hero) {
    return null;
  }

  const heroImage = hero.backdrop_path || hero.poster_path;
  const heroTitle = getContentTitle(hero);

  return (
    <section className="relative mb-10 w-full overflow-hidden rounded-none bg-black sm:mb-12">
      {heroImage ? (
        <Image
          src={`https://image.tmdb.org/t/p/original${heroImage}`}
          alt={heroTitle}
          fill
          sizes="100vw"
          className="object-cover"
          priority
        />
      ) : (
        <div className="absolute inset-0 flex items-center justify-center bg-muted text-sm text-muted-foreground">
          No artwork
        </div>
      )}

      <div className="absolute inset-0 bg-linear-to-t from-black/95 via-black/50 to-black/20" />
      <div className="absolute inset-y-0 left-0 w-full bg-linear-to-r from-black/85 via-black/35 to-transparent lg:w-2/3" />
      <div className="absolute inset-x-0 bottom-0 h-2/5 bg-linear-to-t from-black/95 via-black/60 to-transparent" />

      <div className="relative z-10">
        <Header />

        <div className="mx-auto flex min-h-112 max-w-7xl items-end px-4 py-8 sm:min-h-128 sm:px-6 lg:min-h-144 lg:px-8 lg:py-10">
          <div className="max-w-3xl space-y-5 text-white">
            <div className="flex flex-wrap items-center gap-3 text-xs  tracking-[0.35em] text-white/70">
              <span>Featured</span>
              <span className="h-px w-10 bg-white/35" />
              <span>
                {hero.release_date
                  ? new Date(hero.release_date).getFullYear()
                  : "Now"}
              </span>
            </div>

            <h2 className="text-4xl font-heading font-bold leading-[0.95] text-balance sm:text-5xl lg:text-7xl">
              {heroTitle}
            </h2>

            <p className="max-w-2xl text-base leading-7 text-white/85 sm:text-lg sm:leading-8 line-clamp-4">
              {hero.overview}
            </p>

            <div className="flex flex-wrap items-center gap-3 pt-2 sm:gap-4">
              <Link
                href={`/movie/${hero.id}/watch`}
                className={
                  buttonVariants({ variant: "default", size: "lg" }) +
                  " min-w-40 justify-center text-center"
                }
              >
                <Play />
                Play
              </Link>
              <Link
                href={`/movie/${hero.id}`}
                className={
                  buttonVariants({ variant: "secondary", size: "lg" }) +
                  " min-w-40 justify-center text-center"
                }
              >
                <Info />
                Details
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
