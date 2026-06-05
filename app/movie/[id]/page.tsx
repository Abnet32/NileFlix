import MovieDetail from "@/components/movie-detail";
import {
  getContentTitle,
  getMovie,
  getMovieVideos,
  getTrailerVideo,
} from "@/lib/tmdb";

type MoviePageProps = {
  params: Promise<{ id: string }>;
};

export default async function MoviePage({ params }: MoviePageProps) {
  const { id } = await params;
  const [movie, videos] = await Promise.all([getMovie(id), getMovieVideos(id)]);
  const trailer = getTrailerVideo(videos.results);

  return (
    <MovieDetail
      movie={movie}
      trailerKey={trailer?.key ?? null}
      backHref="/"
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
