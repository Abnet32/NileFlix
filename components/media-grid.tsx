import MovieCard from "@/components/movie-card";
import { type TMDBMovie } from "@/lib/tmdb";

type MediaGridProps = {
  title: string;
  description?: string;
  items: TMDBMovie[];
  contentType?: "movie" | "tv" | "anime";
  hrefPrefix?: string;
};

export default function MediaGrid({
  title,
  description,
  items,
  contentType,
  hrefPrefix,
}: MediaGridProps) {
  return (
    <main className="flex-1 px-4 py-6 sm:px-6">
      <header className="mb-5 space-y-1">
        <h1 className="text-2xl font-semibold tracking-tight sm:text-3xl">
          {title}
        </h1>
        {description ? (
          <p className="text-sm text-muted-foreground">{description}</p>
        ) : null}
      </header>

      {items.length === 0 ? (
        <p className="text-sm text-muted-foreground">Nothing to show here yet.</p>
      ) : (
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 sm:gap-4 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6">
          {items.map((movie) => (
            <MovieCard
              key={movie.id}
              movie={movie}
              contentType={contentType}
              hrefPrefix={hrefPrefix}
            />
          ))}
        </div>
      )}
    </main>
  );
}
