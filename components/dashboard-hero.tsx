"use client";

import { buttonVariants } from "@/components/ui/button";
import { getContentTitle, type TMDBMovie } from "@/lib/tmdb";
import { Info, Play } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useMemo, useState } from "react";

type DashboardHeroProps = {
  movies: TMDBMovie[];
};

export default function DashboardHero({ movies }: DashboardHeroProps) {
  const heroMovies = useMemo(
    () => movies.filter((movie) => movie.backdrop_path || movie.poster_path),
    [movies],
  );
  const [hero, setHero] = useState<TMDBMovie | null>(heroMovies[0] ?? null);

  // Pick a random hero only after hydration to avoid SSR/client mismatch.
  useEffect(() => {
    if (heroMovies.length === 0) return;
    const idx = Math.floor(Math.random() * heroMovies.length);
    const id = window.setTimeout(() => setHero(heroMovies[idx]), 0);
    return () => window.clearTimeout(id);
  }, [heroMovies]);

  if (!hero) return null;

  const heroImage = hero.backdrop_path || hero.poster_path;
  const heroTitle = getContentTitle(hero);
  const basePath = hero.media_type === "tv" ? "/dashboard/tv" : "/dashboard/movie";

  return (
    <section className="relative mb-8 w-full overflow-hidden rounded-xl bg-black">
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

      <div className="relative z-10 flex min-h-72 items-end px-5 py-6 sm:min-h-96 sm:px-8 sm:py-8 lg:min-h-[28rem]">
        <div className="max-w-2xl space-y-4 text-white">
          <div className="flex flex-wrap items-center gap-3 text-xs tracking-[0.35em] text-white/70">
            <span>FEATURED</span>
            <span className="h-px w-10 bg-white/35" />
            <span>
              {hero.release_date || hero.first_air_date
                ? new Date(
                    (hero.release_date ?? hero.first_air_date) as string,
                  ).getFullYear()
                : "Now"}
            </span>
            <span className="rounded-full bg-white/15 px-2 py-0.5 text-[10px]">
              {hero.media_type === "tv" ? "TV" : "Movie"}
            </span>
          </div>

          <h2 className="text-3xl font-heading font-bold leading-[0.95] text-balance sm:text-5xl lg:text-6xl">
            {heroTitle}
          </h2>

          <p className="max-w-xl text-sm leading-6 text-white/85 sm:text-base sm:leading-7 line-clamp-3">
            {hero.overview}
          </p>

          <div className="flex flex-wrap items-center gap-3 pt-1">
            <Link
              href={`${basePath}/${hero.id}/watch`}
              className={
                buttonVariants({ variant: "default", size: "lg" }) +
                " min-w-36 justify-center text-center"
              }
            >
              <Play />
              Play
            </Link>
            <Link
              href={`${basePath}/${hero.id}`}
              className={
                buttonVariants({ variant: "secondary", size: "lg" }) +
                " min-w-36 justify-center text-center"
              }
            >
              <Info />
              Details
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
