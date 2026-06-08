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
    <main className="flex-1 px-3 py-4 sm:px-5">
      <header className="mb-4 space-y-0.5">
        <h1 className="text-xl font-semibold tracking-tight sm:text-2xl">
          {title}
        </h1>
        {description ? (
          <p className="text-sm text-muted-foreground">{description}</p>
        ) : null}
      </header>

      {items.length === 0 ? (
        <p className="text-sm text-muted-foreground">Nothing to show here yet.</p>
      ) : (
        <div className="grid grid-cols-3 gap-2.5 sm:grid-cols-4 sm:gap-3 md:grid-cols-5 lg:grid-cols-6 xl:grid-cols-7">
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
