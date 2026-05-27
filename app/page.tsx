import MovieCard from "@/components/movie-card";

import { getTrendingMovies } from "@/lib/tmdb";

export default async function Home() {
  const { results } = await getTrendingMovies();
  const movies = results.slice(0, 8);

  return (
    <main className="container mx-auto px-4 py-10">
      <div className="mb-8 space-y-2">
        <p className="text-xs uppercase tracking-[0.35em] text-muted-foreground">
          NileFlix
        </p>
        <h1 className="font-heading text-3xl font-medium text-balance sm:text-5xl">
          Trending movies from TMDB
        </h1>
        <p className="max-w-2xl text-sm text-muted-foreground sm:text-base">
          Explore the latest trending titles, open a detail page, and jump
          straight into the video embed when you are ready to watch.
        </p>
      </div>

      <div className="grid gap-6 sm:grid-cols-2 xl:grid-cols-4">
        {movies.map((movie) => (
          <MovieCard key={movie.id} movie={movie} />
        ))}
      </div>
    </main>
  );
}
