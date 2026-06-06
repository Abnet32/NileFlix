import MovieRow from "@/components/movie-row";
import { type TMDBMovie } from "@/lib/tmdb";

type SimilarTitlesProps = {
  title: string;
  items: TMDBMovie[];
  contentType?: "movie" | "tv" | "anime";
  hrefPrefix?: string;
};

export default function SimilarTitles({
  title,
  items,
  contentType,
  hrefPrefix = "/dashboard",
}: SimilarTitlesProps) {
  if (!items || items.length === 0) return null;

  return (
    <section className="mt-12">
      <MovieRow
        title={title}
        movies={items.slice(0, 12)}
        contentType={contentType}
        hrefPrefix={hrefPrefix}
      />
    </section>
  );
}
