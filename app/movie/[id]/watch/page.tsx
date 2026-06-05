import WatchScreen from "@/components/watch-screen";
import { getContentTitle, getMovie } from "@/lib/tmdb";

type WatchPageProps = {
  params: Promise<{ id: string }>;
};

export default async function WatchPage({ params }: WatchPageProps) {
  const { id } = await params;
  const movie = await getMovie(id);
  const title = getContentTitle(movie);

  return (
    <WatchScreen
      id={movie.id.toString()}
      title={title}
      contentType="movie"
      backHref={`/movie/${movie.id}`}
    />
  );
}
