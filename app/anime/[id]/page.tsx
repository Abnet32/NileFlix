import SeriesDetail from "@/components/series-detail";
import {
  getAnimeSeasonHref,
  getSeries,
  getSeriesVideos,
  getTrailerVideo,
} from "@/lib/tmdb";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";

type AnimePageProps = {
  params: Promise<{ id: string }>;
};

export default async function AnimePage({ params }: AnimePageProps) {
  const { id } = await params;
  const [series, videos, session] = await Promise.all([
    getSeries(id),
    getSeriesVideos(id),
    auth.api.getSession({ headers: await headers() }),
  ]);

  const trailer = getTrailerVideo(videos.results);
  const seasons = series.seasons.filter((season) => season.season_number > 0);
  const firstPlayableSeason = seasons[0]?.season_number ?? 1;

  return (
    <SeriesDetail
      series={series}
      trailerKey={trailer?.key ?? null}
      label="Anime"
      backHref="/"
      isAuthenticated={!!session}
      playHref={getAnimeSeasonHref(id, firstPlayableSeason)}
      playLabel="Open first season"
      seasonHref={(seasonNumber) => getAnimeSeasonHref(id, seasonNumber)}
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
