import { Badge } from "@/components/ui/badge";
import { buttonVariants } from "@/components/ui/button";
import { getSeries, getSeriesSeason } from "@/lib/tmdb";
import { formatRuntime, cn } from "@/lib/utils";
import {
  ArrowLeft,
  CalendarRange,
  Clapperboard,
  Layers3,
  PlayCircle,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";

type TvPageProps = {
  params: Promise<{ id: string }>;
};

export default async function TvPage({ params }: TvPageProps) {
  const { id } = await params;
  const [series, firstSeason] = await Promise.all([
    getSeries(id),
    getSeriesSeason(id, "1"),
  ]);

  const episodes = firstSeason.episodes ?? [];
  const heroImage = series.backdrop_path ?? series.poster_path;

  return (
    <main className="container mx-auto px-4 py-10">
      <div className="mb-4 flex justify-end">
        <Link
          href="/"
          className={cn(
            buttonVariants({ variant: "ghost", size: "sm" }),
            "gap-2 rounded-full border border-border/70 bg-background/80 px-4 backdrop-blur",
          )}
        >
          <ArrowLeft className="size-4" />
          Back
        </Link>
      </div>

      <section className="grid gap-8 lg:grid-cols-[minmax(0,0.9fr)_minmax(0,1.1fr)] lg:items-start">
        <div className="overflow-hidden border border-foreground/10 bg-card shadow-2xl shadow-black/10">
          <div className="relative aspect-[2/3] sm:aspect-[4/5] lg:aspect-[5/6]">
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
              <Badge variant="secondary">TV Show</Badge>
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
          </div>

          <p className="max-w-2xl text-sm leading-6 text-muted-foreground sm:text-base">
            {series.overview}
          </p>

          <div className="grid gap-3 sm:grid-cols-2">
            {series.seasons
              .filter((season) => season.season_number > 0)
              .slice(0, 4)
              .map((season) => (
                <div
                  key={season.id}
                  className="border border-foreground/10 bg-card/70 p-4"
                >
                  <p className="text-xs uppercase tracking-[0.3em] text-muted-foreground">
                    Season {season.season_number}
                  </p>
                  <h2 className="mt-2 text-lg font-medium">{season.name}</h2>
                  <p className="mt-1 text-sm text-muted-foreground">
                    {season.episode_count} episodes
                  </p>
                </div>
              ))}
          </div>
        </div>
      </section>

      <section className="mt-12 space-y-4">
        <div className="flex items-center justify-between gap-3">
          <div>
            <p className="text-xs uppercase tracking-[0.35em] text-muted-foreground">
              Episodes
            </p>
            <h2 className="mt-2 text-2xl font-semibold">Season 1</h2>
          </div>
          <Badge variant="secondary">{episodes.length} episodes</Badge>
        </div>

        {episodes.length ? (
          <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
            {episodes.map((episode) => (
              <article
                key={episode.id}
                className="overflow-hidden border border-foreground/10 bg-card shadow-lg shadow-black/5"
              >
                <div className="relative aspect-video bg-muted">
                  {episode.still_path ? (
                    <Image
                      src={`https://image.tmdb.org/t/p/w780${episode.still_path}`}
                      alt={episode.name}
                      fill
                      className="object-cover"
                    />
                  ) : (
                    <div className="flex h-full items-center justify-center text-xs uppercase tracking-[0.3em] text-muted-foreground">
                      No still image
                    </div>
                  )}
                </div>

                <div className="space-y-3 p-4">
                  <div className="flex items-center justify-between gap-3">
                    <h3 className="text-base font-medium">
                      {episode.episode_number}. {episode.name}
                    </h3>
                    <Badge variant="outline">
                      {episode.runtime ? formatRuntime(episode.runtime) : "-"}
                    </Badge>
                  </div>
                  <p className="text-xs text-muted-foreground">
                    {episode.air_date || "Air date unavailable"} •{" "}
                    {episode.vote_average.toFixed(1)}
                  </p>
                  <p className="line-clamp-4 text-sm leading-6 text-muted-foreground">
                    {episode.overview || "No episode summary available."}
                  </p>
                </div>
              </article>
            ))}
          </div>
        ) : (
          <div className="border border-dashed border-border p-6 text-sm text-muted-foreground">
            Episode information is not available for this title.
          </div>
        )}
      </section>

      <div className="mt-10 flex justify-center">
        <Link
          href="/"
          className={cn(
            buttonVariants({ variant: "default", size: "lg" }),
            "rounded-full px-6",
          )}
        >
          <PlayCircle className="size-5" />
          Explore more titles
        </Link>
      </div>
    </main>
  );
}
