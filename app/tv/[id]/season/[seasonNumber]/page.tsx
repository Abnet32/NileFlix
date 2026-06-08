import SeasonDetail from "@/components/season-detail";
import {
  getEpisodeHref,
  getSeries,
  getSeriesSeason,
  getSeriesVideos,
  getTrailerVideo,
} from "@/lib/tmdb";

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

  return (
    <SeasonDetail
      series={series}
      season={season}
      trailerKey={trailer?.key ?? null}
      backHref={`/tv/${id}`}
      episodeHref={(episodeNumber) =>
        getEpisodeHref(id, seasonNumber, episodeNumber)
      }
    />
  );
}
