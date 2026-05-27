import HeroBanner from "@/components/hero-banner";
import MovieRow from "@/components/movie-row";
import {
  getTrendingMovies,
  getPopularMovies,
  getTopRatedMovies,
  getUpcomingMovies,
  getNowPlayingMovies,
} from "@/lib/tmdb";

export default async function Home() {
  const [trending, popular, topRated, upcoming, nowPlaying] = await Promise.all(
    [
      getTrendingMovies(),
      getPopularMovies(),
      getTopRatedMovies(),
      getUpcomingMovies(),
      getNowPlayingMovies(),
    ],
  );

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
        movies={trending.results.slice(0, 12)}
        initialHero={trending.results[0] ?? null}
      />

      <main className="container mx-auto px-4 py-8">
        {/* <div className="mb-6"> */}
          {/* <p className="text-xs uppercase tracking-[0.35em] text-muted-foreground">
            NileFlix
          </p> */}
          {/* <h1 className="font-heading text-3xl font-medium sm:text-4xl">
            Browse by category
          </h1> */}
        {/* </div> */}

        <div className="space-y-6">
          {rows.map((row) => (
            <MovieRow key={row.title} title={row.title} movies={row.movies} />
          ))}
        </div>
      </main>
    </>
  );
}
