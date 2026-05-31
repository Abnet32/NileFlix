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

  const rows = [
    { title: "Trending This Week", movies: trending.results.slice(0, 15) },
    { title: "Popular", movies: popular.results.slice(0, 15) },
    { title: "Top Rated", movies: topRated.results.slice(0, 15) },
    { title: "Upcoming", movies: upcoming.results.slice(0, 15) },
    { title: "Now Playing", movies: nowPlaying.results.slice(0, 15) },
    { title: "Trending Series", movies: trendingSeries.results.slice(0, 15) },
    { title: "Popular Series", movies: popularSeries.results.slice(0, 15) },
    { title: "Top Rated Series", movies: topRatedSeries.results.slice(0, 15) },
    { title: "Airing Today", movies: airingTodaySeries.results.slice(0, 15) },
    { title: "On The Air", movies: onTheAirSeries.results.slice(0, 15) },
  ];

  const movieRows = rows.slice(0, 5);
  const tvShowRows = rows.slice(5);

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
          {tvShowRows.map((row) => (
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
