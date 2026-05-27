"use client";

import { buttonVariants } from "@/components/ui/button";
import type { TMDBMovie } from "@/lib/tmdb";
import { Info, Play, RefreshCw } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useMemo, useState } from "react";

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
  const [hero, setHero] = useState<TMDBMovie | null>(() => {
    if (initialHero) return initialHero;
    if (heroMovies.length === 0) return null;

    const idx = Math.floor(Math.random() * heroMovies.length);
    return heroMovies[idx];
  });

  if (!hero) {
    return null;
  }

  const heroImage = hero.backdrop_path || hero.poster_path;

  return (
    <section className="relative mb-8 h-[60vh] w-full overflow-hidden sm:h-[70vh] lg:h-[85vh]">
      {heroImage ? (
        <Image
          src={`https://image.tmdb.org/t/p/original${heroImage}`}
          alt={hero.title}
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

      <div className="absolute inset-0 bg-linear-to-t from-black/90 via-transparent to-transparent" />
      <div className="absolute inset-y-0 left-0 w-1/3 bg-linear-to-r from-black/80 via-black/35 to-transparent" />
      <div className="absolute inset-y-0 right-0 w-1/3 bg-linear-to-l from-black/80 via-black/35 to-transparent" />
      <div className="absolute inset-x-0 bottom-0 h-1/3 bg-linear-to-t from-black/95 via-black/55 to-transparent" />
      <div className="absolute bottom-12 left-6 right-6 max-w-5xl space-y-4 text-white">
        <p className="text-xs uppercase tracking-[0.35em] text-muted-foreground">
          NileFlix
        </p>
        <h2 className="text-3xl font-heading font-bold leading-tight md:text-5xl">
          {hero.title}
        </h2>

        <div className="flex flex-wrap items-center gap-3 text-sm text-white/90">
          {hero.release_date ? (
            <span className="font-medium">
              {new Date(hero.release_date).getFullYear()}
            </span>
          ) : null}
          {hero.genre_ids?.length ? (
            <span className="inline-block">•</span>
          ) : null}
          <span className="text-white/80">
            {hero.genre_ids?.slice(0, 3).join(" · ")}
          </span>
        </div>

        <p className="max-w-2xl text-base text-white/90 line-clamp-3">
          {hero.overview}
        </p>

        <div className="flex flex-wrap items-center gap-4 pt-1">
          <Link
            href={`/movie/${hero.id}/watch`}
            className={
              buttonVariants({ variant: "default", size: "lg" }) +
              " min-w-48 text-center"
            }
          >
            <Play />
            Play
          </Link>
          <Link
            href={`/movie/${hero.id}`}
            className={
              buttonVariants({ variant: "secondary", size: "lg" }) +
              " min-w-48 text-center"
            }
          >
            <Info />
            Details
          </Link>
          <button
            type="button"
            onClick={() => {
              if (heroMovies.length === 0) return;
              const idx = Math.floor(Math.random() * heroMovies.length);
              setHero(heroMovies[idx]);
            }}
            className={buttonVariants({ variant: "ghost", size: "lg" })}
            aria-label="Refresh hero"
          >
            <RefreshCw />
          </button>
        </div>
      </div>
    </section>
  );
}
