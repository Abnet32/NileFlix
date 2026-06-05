import RecentlySeenTracker from "@/components/recently-seen-tracker";
import WatchScreen from "@/components/watch-screen";
import { getContentTitle, getMovie } from "@/lib/tmdb";

type WatchPageProps = {
  params: Promise<{ id: string }>;
};

export default async function DashboardMovieWatchPage({
  params,
}: WatchPageProps) {
  const { id } = await params;
  const movie = await getMovie(id);
  const title = getContentTitle(movie);

  return (
    <>
      <RecentlySeenTracker
        item={{
          id: movie.id,
          media_type: "movie",
          title,
          poster_path: movie.poster_path,
          vote_average: movie.vote_average,
          date: movie.release_date,
        }}
      />
      <WatchScreen
        id={movie.id.toString()}
        title={title}
        contentType="movie"
        backHref={`/dashboard/movie/${movie.id}`}
      />
    </>
  );
}
