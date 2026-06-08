// In-dashboard TV season route. `[category]` carries the series id (see the
// tv/[category]/page.tsx for why the segment keeps that name).
import SeasonDetail from "@/components/season-detail";
import {
  getSeries,
  getSeriesSeason,
  getSeriesVideos,
  getTrailerVideo,
} from "@/lib/tmdb";

type SeasonPageProps = {
  params: Promise<{ category: string; seasonNumber: string }>;
};

export default async function DashboardSeasonPage({ params }: SeasonPageProps) {
  const { category: id, seasonNumber } = await params;
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
      backHref={`/dashboard/tv/${id}`}
      episodeHref={(episodeNumber) =>
        `/dashboard/tv/${id}/season/${seasonNumber}/episode/${episodeNumber}`
      }
    />
  );
}
