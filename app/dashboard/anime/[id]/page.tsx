import RecentlySeenTracker from "@/components/recently-seen-tracker";
import SeriesDetail from "@/components/series-detail";
import SimilarTitles from "@/components/similar-titles";
import {
  getAnimeSeasonHref,
  getSeries,
  getSeriesVideos,
  getSimilarSeries,
  getTrailerVideo,
} from "@/lib/tmdb";

type AnimePageProps = {
  params: Promise<{ id: string }>;
};

export default async function DashboardAnimePage({ params }: AnimePageProps) {
  const { id } = await params;
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
      <div className="container mx-auto px-4 pb-10">
        <SimilarTitles
          title="Similar Anime"
          items={similar.results}
          contentType="anime"
        />
      </div>
    </>
  );
}
