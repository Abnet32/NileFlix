import EpisodeDetail from "@/components/episode-detail";
import {
  getSeasonHref,
  getSeries,
  getSeriesEpisode,
  getSeriesSeason,
  getSeriesVideos,
  getTrailerVideo,
} from "@/lib/tmdb";

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

  return (
    <EpisodeDetail
      series={series}
      season={season}
      episode={episode}
      trailerKey={trailer?.key ?? null}
      seasonNumber={seasonNumber}
      episodeNumber={episodeNumber}
      seasonHref={getSeasonHref(id, seasonNumber)}
      showHref={`/tv/${id}`}
      watchHref={`/tv/${id}/season/${seasonNumber}/episode/${episodeNumber}/watch`}
    />
  );
}
