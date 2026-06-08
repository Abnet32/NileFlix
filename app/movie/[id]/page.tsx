import MovieDetail from "@/components/movie-detail";
import {
  getContentTitle,
  getMovie,
  getMovieVideos,
  getTrailerVideo,
} from "@/lib/tmdb";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";

type MoviePageProps = {
  params: Promise<{ id: string }>;
};

export default async function MoviePage({ params }: MoviePageProps) {
  const { id } = await params;
  const [movie, videos, session] = await Promise.all([
    getMovie(id),
    getMovieVideos(id),
    auth.api.getSession({ headers: await headers() }),
  ]);
  const trailer = getTrailerVideo(videos.results);

  return (
    <MovieDetail
      movie={movie}
      trailerKey={trailer?.key ?? null}
      backHref="/"
      isAuthenticated={!!session}
      listItem={{
        id: movie.id,
        media_type: "movie",
        title: getContentTitle(movie),
        poster_path: movie.poster_path,
        vote_average: movie.vote_average,
        date: movie.release_date,
      }}
    />
  );
}
