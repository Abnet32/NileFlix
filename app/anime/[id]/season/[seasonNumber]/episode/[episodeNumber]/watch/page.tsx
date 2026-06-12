import { buttonVariants } from "@/components/ui/button";
import VideoPlayer from "@/components/view-movie";
import AdblockNotice from "@/components/adblock-notice";
import { getContentTitle, getSeries, getSeriesEpisode } from "@/lib/tmdb";
import { ArrowLeft, Clapperboard, Play, Tv2 } from "lucide-react";
import Link from "next/link";

type EpisodeWatchPageProps = {
  params: Promise<{ id: string; seasonNumber: string; episodeNumber: string }>;
};

export default async function EpisodeWatchPage({
  params,
}: EpisodeWatchPageProps) {
  const { id, seasonNumber, episodeNumber } = await params;
  const [series, episode] = await Promise.all([
    getSeries(id),
    getSeriesEpisode(id, seasonNumber, episodeNumber),
  ]);
  const showTitle = getContentTitle(series);

  return (
    <main className="min-h-dvh bg-background text-foreground">
      <AdblockNotice />
      <div className="mx-auto flex min-h-dvh w-full max-w-6xl flex-col gap-3 px-3 py-3 sm:gap-4 sm:px-6 sm:py-6 lg:px-8 lg:py-8">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between sm:gap-4">
          <div className="min-w-0 space-y-2">
            <p className="text-[10px] uppercase tracking-[0.35em] text-muted-foreground">
              Now playing
            </p>
            <h1 className="truncate font-heading text-xl font-medium sm:text-3xl lg:text-4xl">
              {showTitle}
            </h1>
            <p className="flex flex-wrap items-center gap-2 text-xs text-muted-foreground sm:text-sm">
              <span className="inline-flex items-center gap-2 border border-border bg-muted px-3 py-1">
                <Tv2 className="size-3.5" />
                Season {seasonNumber}
              </span>
              <span className="inline-flex items-center gap-2  border border-border bg-muted px-3 py-1">
                <Clapperboard className="size-3.5" />
                Episode {episodeNumber}
              </span>
              <span className="inline-flex items-center gap-2 border border-border bg-muted px-3 py-1">
                <Play className="size-3.5" />
                {episode.name}
              </span>
            </p>
          </div>

          <Link
            href={`/anime/${id}/season/${seasonNumber}/episode/${episodeNumber}`}
            className={
              buttonVariants({ size: "sm" }) +
              " w-full justify-center rounded-sm sm:w-auto"
            }
          >
            <ArrowLeft />
            Back to episode
          </Link>
        </div>

        <div className="min-h-0 flex-1">
          <VideoPlayer
            id={series.id.toString()}
            title={`${showTitle} - S${seasonNumber}E${episodeNumber}`}
            contentType="tv"
            seasonNumber={seasonNumber}
            episodeNumber={episodeNumber}
            autoplay
            showTitle
          />
        </div>
      </div>
    </main>
  );
}
