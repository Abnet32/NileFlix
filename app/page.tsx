import HeroBanner from "@/components/hero-banner";
import MovieSearch from "@/components/movie-search";
import MovieRow from "@/components/movie-row";
import {
  getTrendingMovies,
  getPopularMovies,
  getTopRatedMovies,
  getUpcomingMovies,
  getNowPlayingMovies,
} from "@/lib/tmdb";
import Footer from "@/components/footer";

type HomeProps = {
  searchParams: Promise<{ query?: string | string[] }>;
};

export default async function Home({ searchParams }: HomeProps) {
  const resolvedSearchParams = await searchParams;
  const queryValue = resolvedSearchParams.query;
  const initialQuery = Array.isArray(queryValue)
    ? (queryValue[0]?.trim() ?? "")
    : (queryValue?.trim() ?? "");

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
    { title: "Trending This Week", movies: trending.results.slice(0, 15) },
    { title: "Popular", movies: popular.results.slice(0, 15) },
    { title: "Top Rated", movies: topRated.results.slice(0, 15) },
    { title: "Upcoming", movies: upcoming.results.slice(0, 15) },
    { title: "Now Playing", movies: nowPlaying.results.slice(0, 15) },
  ];

  const initialHero = trending.results[0] ?? null;

  return (
    <>
      <HeroBanner
        movies={trending.results.slice(0, 15)}
        initialHero={initialHero}
      />

      <main className="container mx-auto isolate px-4 py-8">
        <section className="relative z-40 mb-8 bg-card/80 p-4 shadow-lg shadow-black/5 backdrop-blur sm:p-6">
          <MovieSearch initialQuery={initialQuery} />
          {/* <p className="mt-3 text-sm text-muted-foreground">
            Type one letter and results will pop up as suggestions. Pick one to
            open the movie page.
          </p> */}
        </section>
        <div className="relative z-0 space-y-6">
          {rows.map((row) => (
            <MovieRow key={row.title} title={row.title} movies={row.movies} />
          ))}
        </div>
      </main>
      <Footer />
    </>
  );
}
