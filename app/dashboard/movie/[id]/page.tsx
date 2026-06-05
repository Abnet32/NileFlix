import MovieDetail from "@/components/movie-detail";
import RecentlySeenTracker from "@/components/recently-seen-tracker";
import {
  getContentTitle,
  getMovie,
  getMovieVideos,
  getTrailerVideo,
} from "@/lib/tmdb";

type MoviePageProps = {
  params: Promise<{ id: string }>;
};

export default async function DashboardMoviePage({ params }: MoviePageProps) {
  const { id } = await params;
  const [movie, videos] = await Promise.all([getMovie(id), getMovieVideos(id)]);
  const trailer = getTrailerVideo(videos.results);
  const listItem = {
    id: movie.id,
    media_type: "movie" as const,
    title: getContentTitle(movie),
    poster_path: movie.poster_path,
    vote_average: movie.vote_average,
    date: movie.release_date,
  };

  return (
    <>
      <RecentlySeenTracker
        item={{
          id: movie.id,
          media_type: "movie",
          title: getContentTitle(movie),
          poster_path: movie.poster_path,
          vote_average: movie.vote_average,
          date: movie.release_date,
        }}
      />
      <MovieDetail
        movie={movie}
        trailerKey={trailer?.key ?? null}
        backHref="/dashboard"
        basePath="/dashboard/movie"
        listItem={listItem}
      />
    </>
  );
}
