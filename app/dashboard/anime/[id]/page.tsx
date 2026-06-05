import RecentlySeenTracker from "@/components/recently-seen-tracker";
import SeriesDetail from "@/components/series-detail";
import {
  getAnimeSeasonHref,
  getSeries,
  getSeriesVideos,
  getTrailerVideo,
} from "@/lib/tmdb";

type AnimePageProps = {
  params: Promise<{ id: string }>;
};

export default async function DashboardAnimePage({ params }: AnimePageProps) {
  const { id } = await params;
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
        label="Anime"
        backHref="/dashboard"
        playHref={`/dashboard/anime/${id}/watch`}
        playLabel="Watch now"
        seasonHref={(seasonNumber) => getAnimeSeasonHref(id, seasonNumber)}
        listItem={listItem}
      />
    </>
  );
}
