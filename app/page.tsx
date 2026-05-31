import HeroBanner from "@/components/hero-banner";
import MovieSearch from "@/components/movie-search";
import MovieRow from "@/components/movie-row";
import {
  getTrendingMovies,
  getPopularMovies,
  getTopRatedMovies,
  getUpcomingMovies,
  getNowPlayingMovies,
  getTrendingSeries,
  getPopularSeries,
  getTopRatedSeries,
  getAiringTodaySeries,
  getOnTheAirSeries,
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

  const [
    trending,
    popular,
    topRated,
    upcoming,
    nowPlaying,
    trendingSeries,
    popularSeries,
    topRatedSeries,
    airingTodaySeries,
    onTheAirSeries,
  ] = await Promise.all([
    getTrendingMovies(),
    getPopularMovies(),
    getTopRatedMovies(),
    getUpcomingMovies(),
    getNowPlayingMovies(),
    getTrendingSeries(),
    getPopularSeries(),
    getTopRatedSeries(),
    getAiringTodaySeries(),
    getOnTheAirSeries(),
  ]);

  const movieRows = [
    { title: "Trending This Week", movies: trending.results.slice(0, 15) },
    { title: "Popular", movies: popular.results.slice(0, 15) },
    { title: "Top Rated", movies: topRated.results.slice(0, 15) },
    { title: "Upcoming", movies: upcoming.results.slice(0, 15) },
    { title: "Now Playing", movies: nowPlaying.results.slice(0, 15) },
  ];

  const tvRows = [
    {
      title: "Trending This Week",
      movies: trendingSeries.results.slice(0, 15),
    },
    { title: "Popular", movies: popularSeries.results.slice(0, 15) },
    { title: "Top Rated", movies: topRatedSeries.results.slice(0, 15) },
    { title: "Airing Today", movies: airingTodaySeries.results.slice(0, 15) },
    { title: "On The Air", movies: onTheAirSeries.results.slice(0, 15) },
  ];

  const initialHero = trending.results[0] ?? null;

  return (
    <>
      <HeroBanner
        movies={trending.results.slice(0, 15)}
        initialHero={initialHero}
      />

      <main className="container mx-auto isolate px-4 py-8">
        <section className="relative z-40 mb-8 p-4 sm:p-6">
          <MovieSearch initialQuery={initialQuery} />
        </section>
        <section id="movies" className="relative z-0 space-y-6 scroll-mt-28">
          <div className="flex items-end justify-between gap-4 px-2">
            <div>
              <p className="text-xs uppercase tracking-[0.35em] text-muted-foreground">
                Movies
              </p>
            </div>
            <a
              href="#tv-shows"
              className="text-xs uppercase tracking-[0.3em] text-muted-foreground transition-colors hover:text-foreground"
            >
              Jump to TV
            </a>
          </div>

          {movieRows.map((row) => (
            <MovieRow
              key={row.title}
              title={row.title}
              movies={row.movies}
              contentType="movie"
            />
          ))}
        </section>

        <section
          id="tv-shows"
          className="relative z-0 space-y-6 scroll-mt-28 pt-8"
        >
          <div className="flex items-end justify-between gap-4 px-2">
            <div>
              <p className="text-xs uppercase tracking-[0.35em] text-muted-foreground">
                TV Shows
              </p>
            </div>
            <a
              href="#movies"
              className="text-xs uppercase tracking-[0.3em] text-muted-foreground transition-colors hover:text-foreground"
            >
              Jump to Movies
            </a>
          </div>

          {tvRows.map((row) => (
            <MovieRow
              key={row.title}
              title={row.title}
              movies={row.movies}
              contentType="tv"
            />
          ))}
        </section>
      </main>
      <Footer />
    </>
  );
}
