// In-dashboard TV episode watch route. `[category]` carries the series id (see
// the tv/[category]/page.tsx for why the segment keeps that name).
import RecentlySeenTracker from "@/components/recently-seen-tracker";
import WatchScreen from "@/components/watch-screen";
import { getContentTitle, getSeries } from "@/lib/tmdb";

type EpisodeWatchPageProps = {
  params: Promise<{
    category: string;
    seasonNumber: string;
    episodeNumber: string;
  }>;
};

export default async function DashboardEpisodeWatchPage({
  params,
}: EpisodeWatchPageProps) {
  const { category: id, seasonNumber, episodeNumber } = await params;
  const series = await getSeries(id);
  const showTitle = getContentTitle(series);

  return (
    <>
      <RecentlySeenTracker
        item={{
          id: series.id,
          media_type: "tv",
          title: series.name,
          poster_path: series.poster_path,
          vote_average: series.vote_average,
          date: series.first_air_date,
        }}
      />
      <WatchScreen
        id={series.id.toString()}
        title={`${showTitle} — S${seasonNumber}E${episodeNumber}`}
        contentType="tv"
        seasonNumber={seasonNumber}
        episodeNumber={episodeNumber}
        backHref={`/dashboard/tv/${id}/season/${seasonNumber}/episode/${episodeNumber}`}
      />
    </>
  );
}
