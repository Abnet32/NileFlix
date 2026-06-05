// NOTE: This folder is the in-dashboard TV *detail* route. The dynamic segment
// is named `[category]` for historical reasons (it previously hosted the TV
// category list, which now lives at `/dashboard/tv-shows/[category]`); here it
// carries the series id. MovieCard links TV titles to `/dashboard/tv/<id>`.
import RecentlySeenTracker from "@/components/recently-seen-tracker";
import SeriesDetail from "@/components/series-detail";
import {
  getSeasonHref,
  getSeries,
  getSeriesVideos,
  getTrailerVideo,
} from "@/lib/tmdb";

type TvDetailPageProps = {
  params: Promise<{ category: string }>;
};

export default async function DashboardTvPage({ params }: TvDetailPageProps) {
  const { category: id } = await params;
  const [series, videos] = await Promise.all([
    getSeries(id),
    getSeriesVideos(id),
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
      <SeriesDetail
        series={series}
        trailerKey={trailer?.key ?? null}
        label="TV Show"
        backHref="/dashboard"
        playHref={`/dashboard/tv/${id}/watch`}
        playLabel="Watch now"
        seasonHref={(seasonNumber) => getSeasonHref(id, seasonNumber)}
        listItem={listItem}
      />
    </>
  );
}
