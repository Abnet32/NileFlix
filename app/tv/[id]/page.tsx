import SeriesDetail from "@/components/series-detail";
import {
  getSeasonHref,
  getSeries,
  getSeriesVideos,
  getTrailerVideo,
} from "@/lib/tmdb";

type TvPageProps = {
  params: Promise<{ id: string }>;
};

export default async function TvPage({ params }: TvPageProps) {
  const { id } = await params;
  const [series, videos] = await Promise.all([
    getSeries(id),
    getSeriesVideos(id),
  ]);

  const trailer = getTrailerVideo(videos.results);
  const seasons = series.seasons.filter((season) => season.season_number > 0);
  const firstPlayableSeason = seasons[0]?.season_number ?? 1;

  return (
    <SeriesDetail
      series={series}
      trailerKey={trailer?.key ?? null}
      label="TV Show"
      backHref="/"
      playHref={getSeasonHref(id, firstPlayableSeason)}
      playLabel="Open first season"
      seasonHref={(seasonNumber) => getSeasonHref(id, seasonNumber)}
      listItem={{
        id: series.id,
        media_type: "tv",
        title: series.name,
        poster_path: series.poster_path,
        vote_average: series.vote_average,
        date: series.first_air_date,
      }}
    />
  );
}
