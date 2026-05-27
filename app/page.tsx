import HeroBanner from "@/components/hero-banner";
import MovieCard from "@/components/movie-card";
import MovieRow from "@/components/movie-row";
import {
  getTrendingMovies,
  getPopularMovies,
  getTopRatedMovies,
  getUpcomingMovies,
  getNowPlayingMovies,
  searchMovies,
} from "@/lib/tmdb";
import Link from "next/link";

type HomeProps = {
  searchParams: Promise<{ query?: string | string[] }>;
};

export default async function Home({ searchParams }: HomeProps) {
  const resolvedSearchParams = await searchParams;
  const queryValue = resolvedSearchParams.query;
  const searchQuery = Array.isArray(queryValue)
    ? (queryValue[0]?.trim() ?? "")
    : (queryValue?.trim() ?? "");

  const searchResultsPromise = searchQuery
    ? searchMovies(searchQuery)
    : Promise.resolve(null);

  const [trending, popular, topRated, upcoming, nowPlaying, searchResults] =
    await Promise.all([
      getTrendingMovies(),
      getPopularMovies(),
      getTopRatedMovies(),
      getUpcomingMovies(),
      getNowPlayingMovies(),
      searchResultsPromise,
    ]);

  const featuredMovies =
    searchQuery && searchResults?.results.length
      ? searchResults.results
      : trending.results;

  const rows = [
    { title: "Trending This Week", movies: trending.results.slice(0, 12) },
    { title: "Popular", movies: popular.results.slice(0, 12) },
    { title: "Top Rated", movies: topRated.results.slice(0, 12) },
    { title: "Upcoming", movies: upcoming.results.slice(0, 12) },
    { title: "Now Playing", movies: nowPlaying.results.slice(0, 12) },
  ];

  return (
    <>
      <HeroBanner
        movies={featuredMovies.slice(0, 12)}
        initialHero={featuredMovies[0] ?? null}
      />

      <main className="container mx-auto px-4 py-8">
        <section className="mb-8 rounded-2xl border border-border/70 bg-card/80 p-4 shadow-lg shadow-black/5 backdrop-blur sm:p-6">
          <form
            action="/"
            method="get"
            className="flex flex-col gap-3 sm:flex-row"
          >
            <div className="flex-1 space-y-2">
              <label
                htmlFor="movie-search"
                className="text-xs uppercase tracking-[0.35em] text-muted-foreground"
              >
                Search movies
              </label>
              <input
                id="movie-search"
                name="query"
                defaultValue={searchQuery}
                placeholder="Try one word like action, love, or batman"
                autoComplete="off"
                className="h-12 w-full rounded-none border border-input bg-background px-4 text-sm outline-none transition-colors placeholder:text-muted-foreground focus:border-primary focus:ring-1 focus:ring-primary/30"
              />
            </div>
            <div className="flex items-end gap-3">
              <button
                type="submit"
                className="h-12 rounded-none border border-transparent bg-primary px-5 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90"
              >
                Search
              </button>
              {searchQuery ? (
                <Link
                  href="/"
                  className="inline-flex h-12 items-center rounded-none border border-border px-5 text-sm font-medium text-foreground transition-colors hover:bg-muted"
                >
                  Clear
                </Link>
              ) : null}
            </div>
          </form>
          <p className="mt-3 text-sm text-muted-foreground">
            {searchQuery
              ? `Showing TMDB results for "${searchQuery}".`
              : "Search by title or a single keyword to see matching movies."}
          </p>
        </section>

        {searchQuery ? (
          <section className="mb-10 space-y-4">
            <div className="flex items-end justify-between gap-4">
              <div>
                <p className="text-xs uppercase tracking-[0.35em] text-muted-foreground">
                  Search results
                </p>
                <h2 className="font-heading text-2xl font-medium sm:text-3xl">
                  {searchResults?.results.length
                    ? `${searchResults.results.length} matching movies`
                    : "No matches found"}
                </h2>
              </div>
            </div>

            {searchResults?.results.length ? (
              <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
                {searchResults.results.slice(0, 20).map((movie) => (
                  <MovieCard key={movie.id} movie={movie} />
                ))}
              </div>
            ) : (
              <div className="rounded-2xl border border-border bg-muted/40 p-6 text-sm text-muted-foreground">
                Try a shorter word, a different title, or a genre-like keyword.
              </div>
            )}
          </section>
        ) : null}

        <div className="space-y-6">
          {rows.map((row) => (
            <MovieRow key={row.title} title={row.title} movies={row.movies} />
          ))}
        </div>
      </main>
    </>
  );
}
