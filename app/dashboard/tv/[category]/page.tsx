// NOTE: This folder is the in-dashboard TV *detail* route. The dynamic segment
// is named `[category]` for historical reasons (it previously hosted the TV
// category list, which now lives at `/dashboard/tv-shows/[category]`); here it
// carries the series id. MovieCard links TV titles to `/dashboard/tv/<id>`.
import SeriesDetail from "@/components/series-detail";
import SimilarTitles from "@/components/similar-titles";
import {
  getSeries,
  getSeriesVideos,
  getSimilarSeries,
  getTrailerVideo,
} from "@/lib/tmdb";

type TvDetailPageProps = {
  params: Promise<{ category: string }>;
};

export default async function DashboardTvPage({ params }: TvDetailPageProps) {
  const { category: id } = await params;
  const [series, videos, similar] = await Promise.all([
    getSeries(id),
    getSeriesVideos(id),
    getSimilarSeries(id),
  ]);

  const trailer = getTrailerVideo(videos.results);
  const listItem = {
    id: series.id,
    media_type: "tv" as const,
    title: series.name,
    poster_path: series.poster_path,
    vote_average: series.vote_average,
    date: series.first_air_date,
  };

  return (
    <>
      <SeriesDetail
        series={series}
        trailerKey={trailer?.key ?? null}
        label="TV Show"
        backHref="/dashboard"
        playHref={`/dashboard/tv/${id}/watch`}
        playLabel="Watch now"
        seasonHref={(seasonNumber) =>
          `/dashboard/tv/${id}/season/${seasonNumber}`
        }
        listItem={listItem}
      />
      <div className="container mx-auto px-4 pb-10">
        <SimilarTitles
          title="Similar Shows"
          items={similar.results}
          contentType="tv"
        />
      </div>
    </>
  );
}
