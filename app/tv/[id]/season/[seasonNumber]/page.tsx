import { Badge } from "@/components/ui/badge";
import { buttonVariants } from "@/components/ui/button";
import {
  getEpisodeHref,
  getSeries,
  getSeriesSeason,
  getSeriesVideos,
  getTrailerVideo,
} from "@/lib/tmdb";
import { cn, formatRuntime } from "@/lib/utils";
import { ArrowLeft, CalendarRange, Play } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

type SeasonPageProps = {
  params: Promise<{ id: string; seasonNumber: string }>;
};

export default async function SeasonPage({ params }: SeasonPageProps) {
  const { id, seasonNumber } = await params;
  const [series, season, videos] = await Promise.all([
    getSeries(id),
    getSeriesSeason(id, seasonNumber),
    getSeriesVideos(id),
  ]);

  const trailer = getTrailerVideo(videos.results);
  const episodes = season.episodes ?? [];
  const heroImage =
    season.poster_path ?? series.backdrop_path ?? series.poster_path;
  const accentColors = [
    "bg-emerald-500/80",
    "bg-amber-500/80",
    "bg-sky-500/80",
    "bg-rose-500/80",
    "bg-violet-500/80",
    "bg-teal-500/80",
  ];

  return (
    <main className="container mx-auto px-4 py-10">
      <div className="mb-4 flex flex-wrap justify-between gap-3">
        <Link
          href={`/tv/${id}`}
          className={cn(
            buttonVariants({ variant: "ghost", size: "sm" }),
            "gap-2 border border-border/70 bg-background/80 px-4 backdrop-blur",
          )}
        >
          <ArrowLeft className="size-4" />
          Back to show
        </Link>
      </div>

      <section className="grid gap-8 lg:grid-cols-[minmax(0,0.9fr)_minmax(0,1.1fr)] lg:items-center">
        <div className="overflow-hidden border border-foreground/10 bg-card shadow-2xl shadow-black/10">
          <div className="relative aspect-2/3 sm:aspect-4/5 lg:aspect-5/6">
            {heroImage ? (
              <Image
                src={`https://image.tmdb.org/t/p/w780${heroImage}`}
                alt={season.name}
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
              <Badge variant="secondary">Season {season.season_number}</Badge>
              <Badge variant="outline">{season.episode_count} episodes</Badge>
              {season.air_date ? (
                <Badge variant="outline">
                  <CalendarRange className="size-3" />
                  {season.air_date}
                </Badge>
              ) : null}
            </div>

            <h1 className="font-heading text-3xl font-medium text-balance sm:text-5xl">
              {season.name}
            </h1>
          </div>

          <p className="max-w-2xl text-sm leading-6 text-muted-foreground sm:text-base">
            {season.overview || series.overview}
          </p>

          <div className="flex flex-wrap gap-3 pt-2">
            <Link
              href={getEpisodeHref(id, seasonNumber, "1")}
              className={cn(
                buttonVariants({ variant: "default", size: "sm" }),
                "gap-2 px-4",
              )}
            >
              <Play className="size-4" />
              Open first episode
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
      </section>

      <section className="mt-12 space-y-4">
        <div>
          <p className="text-xs uppercase tracking-[0.35em] text-muted-foreground">
            Episodes
          </p>
          <h2 className="mt-2 text-2xl font-semibold">
            Season {season.season_number}
          </h2>
        </div>

        <div className="grid gap-3 sm:grid-cols-4">
          {episodes.map((episode, index) => {
            const accent = accentColors[index % accentColors.length];

            return (
              <Link
                key={episode.id}
                href={getEpisodeHref(id, seasonNumber, episode.episode_number)}
                className={cn(
                  "group flex overflow-hidden border border-foreground/10 bg-card/70 shadow-sm transition-transform duration-200 hover:-translate-y-0.5 hover:shadow-lg",
                )}
              >
                <div className={cn("w-2 shrink-0", accent)} />
                <div className="flex-1 p-3.5">
                  <p className="text-[10px] uppercase tracking-[0.35em] text-muted-foreground">
                    Episode {episode.episode_number}
                  </p>
                  <h2 className="mt-2 text-base font-medium leading-tight group-hover:text-foreground">
                     {episode.name}
                  </h2>
                  <p className="mt-1 text-xs text-muted-foreground">
                    {episode.runtime
                      ? formatRuntime(episode.runtime)
                      : "Runtime unavailable"}
                  </p>
                </div>
              </Link>
            );
          })}
        </div>
      </section>
    </main>
  );
}
