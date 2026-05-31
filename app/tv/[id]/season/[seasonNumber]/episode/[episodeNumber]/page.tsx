import { Badge } from "@/components/ui/badge";
import { buttonVariants } from "@/components/ui/button";
import {
  getSeasonHref,
  getSeries,
  getSeriesEpisode,
  getSeriesSeason,
  getSeriesVideos,
  getTrailerVideo,
} from "@/lib/tmdb";
import { cn, formatRuntime } from "@/lib/utils";
import {
  ArrowLeft,
  CalendarRange,
  Clapperboard,
  Play,
  Tv2,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";

type EpisodePageProps = {
  params: Promise<{ id: string; seasonNumber: string; episodeNumber: string }>;
};

export default async function EpisodePage({ params }: EpisodePageProps) {
  const { id, seasonNumber, episodeNumber } = await params;
  const [series, season, episode, videos] = await Promise.all([
    getSeries(id),
    getSeriesSeason(id, seasonNumber),
    getSeriesEpisode(id, seasonNumber, episodeNumber),
    getSeriesVideos(id),
  ]);

  const trailer = getTrailerVideo(videos.results);
  const heroImage =
    episode.still_path ??
    season.poster_path ??
    series.backdrop_path ??
    series.poster_path;

  return (
    <main className="container mx-auto px-4 py-10">
      <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
        <Link
          href={getSeasonHref(id, seasonNumber)}
          className={cn(
            buttonVariants({ variant: "ghost", size: "sm" }),
            "gap-2 border border-border/70 bg-background/80 px-4 backdrop-blur",
          )}
        >
          <ArrowLeft className="size-4" />
          Back to season
        </Link>

        <Link
          href={`/tv/${id}`}
          className={cn(
            buttonVariants({ variant: "outline", size: "sm" }),
            "gap-2 px-4",
          )}
        >
          <Tv2 className="size-4" />
          Show detail
        </Link>
      </div>

      <section className="grid gap-8 lg:grid-cols-[minmax(0,0.9fr)_minmax(0,1.1fr)] lg:items-start">
        <div className="overflow-hidden border border-foreground/10 bg-card shadow-2xl shadow-black/10">
          <div className="relative aspect-2/3 bg-muted sm:aspect-4/5 lg:aspect-5/6">
            {heroImage ? (
              <Image
                src={`https://image.tmdb.org/t/p/w780${heroImage}`}
                alt={episode.name}
                fill
                className="object-cover"
                priority
              />
            ) : (
              <div className="flex h-full w-full items-center justify-center text-xs uppercase tracking-[0.35em] text-muted-foreground">
                No artwork
              </div>
            )}
          </div>
        </div>

        <div className="flex flex-col gap-6">
          <div className="space-y-3">
            <div className="flex flex-wrap items-center gap-2">
              <Badge variant="secondary">Season {seasonNumber}</Badge>
              <Badge variant="outline">Episode {episodeNumber}</Badge>
              <Badge variant="outline">
                {episode.runtime
                  ? formatRuntime(episode.runtime)
                  : "Runtime unavailable"}
              </Badge>
            </div>

            <h1 className="font-heading text-3xl font-medium text-balance sm:text-5xl">
              {episode.name}
            </h1>

            <p className="flex flex-wrap items-center gap-3 text-sm text-muted-foreground sm:text-base">
              <span className="inline-flex items-center gap-2">
                <CalendarRange className="size-4" />
                {episode.air_date || "Air date unavailable"}
              </span>
              <span className="inline-flex items-center gap-2">
                <Clapperboard className="size-4" />
                {episode.vote_average.toFixed(1)} rating
              </span>
            </p>

            <div className="flex flex-wrap gap-3 pt-2">
              <Link
                href={`/tv/${id}/season/${seasonNumber}/episode/${episodeNumber}/watch`}
                className={cn(
                  buttonVariants({ variant: "default", size: "sm" }),
                  "gap-2 px-4",
                )}
              >
                <Play className="size-4" />
                Watch episode
              </Link>
              {trailer ? (
                <a
                  href={`https://www.youtube.com/watch?v=${trailer.key}`}
                  target="_blank"
                  rel="noreferrer"
                  className={cn(
                    buttonVariants({ variant: "secondary", size: "sm" }),
                    "gap-2 px-4",
                  )}
                >
                  <Play className="size-4" />
                  Play trailer
                </a>
              ) : null}
            </div>
          </div>

          <p className="max-w-2xl text-sm leading-6 text-muted-foreground sm:text-base">
            {episode.overview || "No episode summary available."}
          </p>
        </div>
      </section>

    </main>
  );
}
