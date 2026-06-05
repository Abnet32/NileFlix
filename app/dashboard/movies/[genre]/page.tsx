import MediaGrid from "@/components/media-grid";
import { getMoviesByGenre } from "@/lib/tmdb";
import { notFound } from "next/navigation";

type GenrePageProps = {
  params: Promise<{ genre: string }>;
};

const GENRES = {
  action: { id: 28, title: "Action Movies" },
  comedy: { id: 35, title: "Comedy Movies" },
  drama: { id: 18, title: "Drama Movies" },
  scifi: { id: 878, title: "Sci-Fi Movies" },
} satisfies Record<string, { id: number; title: string }>;

export default async function GenrePage({ params }: GenrePageProps) {
  const { genre } = await params;
  const config = GENRES[genre as keyof typeof GENRES];

  if (!config) {
    notFound();
  }

  const data = await getMoviesByGenre(config.id);

  return (
    <MediaGrid
      title={config.title}
      description="Sorted by popularity."
      items={data.results}
      contentType="movie"
      hrefPrefix="/dashboard"
    />
  );
}
