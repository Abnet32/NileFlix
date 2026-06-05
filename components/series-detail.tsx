import { Badge } from "@/components/ui/badge";
import { buttonVariants } from "@/components/ui/button";
import MediaActions from "@/components/media-actions";
import { type TMDBSeriesDetails } from "@/lib/tmdb";
import type { MediaListItem } from "@/lib/media-lists";
import { cn } from "@/lib/utils";
import {
  ArrowLeft,
  CalendarRange,
  Clapperboard,
  Layers3,
  Play,
  Video,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";

type SeriesDetailProps = {
  series: TMDBSeriesDetails;
  trailerKey: string | null;
  /** Category label shown in the lead badge. */
  label: string;
  /** Where the "Back" button goes. */
  backHref: string;
  /** Primary play button target + label. */
  playHref: string;
  playLabel: string;
  /** Builds a link for each season card. */
  seasonHref: (seasonNumber: number) => string;
  /** When provided, renders Favorite/Watchlist toggle buttons. */
  listItem?: MediaListItem;
};

const SEASON_COLORS = [
  "bg-emerald-500/80",
  "bg-amber-500/80",
  "bg-sky-500/80",
  "bg-rose-500/80",
  "bg-violet-500/80",
  "bg-teal-500/80",
];

export default function SeriesDetail({
  series,
  trailerKey,
  label,
  backHref,
  playHref,
  playLabel,
  seasonHref,
  listItem,
}: SeriesDetailProps) {
  const heroImage = series.backdrop_path ?? series.poster_path;
  const seasons = series.seasons.filter((season) => season.season_number > 0);

  return (
    <main className="container mx-auto px-4 py-10">
      <div className="mb-4 flex justify-end">
        <Link
          href={backHref}
          className={cn(
            buttonVariants({ variant: "ghost", size: "sm" }),
            "gap-2 border border-border/70 bg-background/80 px-4 backdrop-blur",
          )}
        >
          <ArrowLeft className="size-4" />
          Back
        </Link>
      </div>

      <section className="grid gap-8 lg:grid-cols-[minmax(0,0.9fr)_minmax(0,1.1fr)] lg:items-center">
        <div className="overflow-hidden border border-foreground/10 bg-card shadow-2xl shadow-black/10">
          <div className="relative aspect-2/3 sm:aspect-4/5 lg:aspect-5/6">
            {heroImage ? (
              <Image
                src={`https://image.tmdb.org/t/p/w780${heroImage}`}
                alt={series.name}
                fill
                className="object-cover"
                priority
              />
            ) : (
              <div className="flex h-full w-full items-center justify-center bg-linear-to-br from-muted via-background to-muted text-xs uppercase tracking-[0.35em] text-muted-foreground">
                No poster
              </div>
            )}
          </div>
        </div>

        <div className="flex flex-col gap-6">
          <div className="space-y-3">
            <div className="flex flex-wrap items-center gap-2">
              <Badge variant="secondary">{label}</Badge>
              <Badge variant="outline">{series.status}</Badge>
              <Badge variant="outline">
                {series.vote_average.toFixed(1)} ⭐
              </Badge>
            </div>

            <h1 className="font-heading text-3xl font-medium text-balance sm:text-5xl">
              {series.name}
            </h1>

            <p className="flex flex-wrap items-center gap-3 text-sm text-muted-foreground sm:text-base">
              <span className="inline-flex items-center gap-2">
                <CalendarRange className="size-4" />
                {series.first_air_date || "Release date unavailable"}
              </span>
              <span className="inline-flex items-center gap-2">
                <Layers3 className="size-4" />
                {series.number_of_seasons} seasons
              </span>
              <span className="inline-flex items-center gap-2">
                <Clapperboard className="size-4" />
                {series.number_of_episodes} episodes
              </span>
            </p>

            <div className="flex flex-wrap gap-2">
              {series.genres.map((genre) => (
                <Badge key={genre.id} variant="outline">
                  {genre.name}
                </Badge>
              ))}
            </div>

            <div className="flex flex-wrap items-center gap-4 pt-1">
              <Link
                href={playHref}
                className={cn(
                  buttonVariants({ variant: "default", size: "lg" }),
                  "min-w-48 justify-center gap-2 text-center",
                )}
              >
                <Play className="size-4" />
                {playLabel}
              </Link>
              {trailerKey ? (
                <a
                  href={`https://www.youtube.com/watch?v=${trailerKey}`}
                  target="_blank"
                  rel="noreferrer"
                  className={cn(
                    buttonVariants({ variant: "secondary", size: "lg" }),
                    "min-w-48 justify-center gap-2 text-center",
                  )}
                >
                  <Video className="size-4" />
                  Play trailer
                </a>
              ) : null}
            </div>
          </div>

          <p className="max-w-2xl text-sm leading-6 text-muted-foreground sm:text-base">
            {series.overview}
          </p>

          {listItem ? <MediaActions item={listItem} /> : null}
        </div>
      </section>

      <section className="mt-12 space-y-4">
        <div>
          <p className="text-xs uppercase tracking-[0.35em] text-muted-foreground">
            Seasons
          </p>
          <h2 className="mt-2 text-2xl font-semibold">All Seasons</h2>
        </div>

        <div className="grid gap-3 sm:grid-cols-3 xl:grid-cols-4">
          {seasons.map((season, index) => (
            <Link
              key={season.id}
              href={seasonHref(season.season_number)}
              className="group flex overflow-hidden border border-foreground/10 bg-card/70 shadow-sm transition-transform duration-200 hover:-translate-y-0.5 hover:shadow-lg"
            >
              <div
                className={cn(
                  "w-2 shrink-0",
                  SEASON_COLORS[index % SEASON_COLORS.length],
                )}
              />
              <div className="flex-1 p-3.5">
                <p className="text-[10px] uppercase tracking-[0.35em] text-muted-foreground">
                  Season {season.season_number}
                </p>
                <h2 className="mt-2 text-base font-medium leading-tight group-hover:text-foreground">
                  {season.name}
                </h2>
                <p className="mt-1 text-xs text-muted-foreground">
                  {season.episode_count} episodes
                </p>
              </div>
            </Link>
          ))}
        </div>
      </section>
    </main>
  );
}
