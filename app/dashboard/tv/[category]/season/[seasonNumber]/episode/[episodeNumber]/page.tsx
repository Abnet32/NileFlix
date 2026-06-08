// In-dashboard TV episode route. `[category]` carries the series id (see the
// tv/[category]/page.tsx for why the segment keeps that name).
import EpisodeDetail from "@/components/episode-detail";
import {
  getSeries,
  getSeriesEpisode,
  getSeriesSeason,
  getSeriesVideos,
  getTrailerVideo,
} from "@/lib/tmdb";

type EpisodePageProps = {
  params: Promise<{
    category: string;
    seasonNumber: string;
    episodeNumber: string;
  }>;
};

export default async function DashboardEpisodePage({
  params,
}: EpisodePageProps) {
  const { category: id, seasonNumber, episodeNumber } = await params;
  const [series, season, episode, videos] = await Promise.all([
    getSeries(id),
    getSeriesSeason(id, seasonNumber),
    getSeriesEpisode(id, seasonNumber, episodeNumber),
    getSeriesVideos(id),
  ]);

  const trailer = getTrailerVideo(videos.results);

  return (
    <EpisodeDetail
      series={series}
      season={season}
      episode={episode}
      trailerKey={trailer?.key ?? null}
      seasonNumber={seasonNumber}
      episodeNumber={episodeNumber}
      seasonHref={`/dashboard/tv/${id}/season/${seasonNumber}`}
      showHref={`/dashboard/tv/${id}`}
      watchHref={`/dashboard/tv/${id}/season/${seasonNumber}/episode/${episodeNumber}/watch`}
    />
  );
}
