import DashboardHero from "@/components/dashboard-hero";
import MovieRow from "@/components/movie-row";
import RecentlySeenRow from "@/components/recently-seen-row";
import {
  getTrendingAll,
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
  getTrendingAnime,
  getPopularAnime,
  getTopRatedAnime,
  getAiringTodayAnime,
} from "@/lib/tmdb";

export default async function DashboardPage() {
  const [
    trendingAll,
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
    trendingAnime,
    popularAnime,
    topRatedAnime,
    airingTodayAnime,
  ] = await Promise.all([
    getTrendingAll(),
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
    getTrendingAnime(),
    getPopularAnime(),
    getTopRatedAnime(),
    getAiringTodayAnime(),
  ]);

  const heroPool = trendingAll.results
    .filter((item) => item.media_type === "movie" || item.media_type === "tv")
    .slice(0, 8);

  const movieRows = [
    { title: "Trending This Week", movies: trending.results.slice(0, 15) },
    { title: "Popular", movies: popular.results.slice(0, 15) },
    { title: "Top Rated", movies: topRated.results.slice(0, 15) },
    { title: "Upcoming", movies: upcoming.results.slice(0, 15) },
    { title: "Now Playing", movies: nowPlaying.results.slice(0, 15) },
  ];

  const tvRows = [
    { title: "Trending This Week", movies: trendingSeries.results.slice(0, 15) },
    { title: "Popular", movies: popularSeries.results.slice(0, 15) },
    { title: "Top Rated", movies: topRatedSeries.results.slice(0, 15) },
    { title: "Airing Today", movies: airingTodaySeries.results.slice(0, 15) },
    { title: "On The Air", movies: onTheAirSeries.results.slice(0, 15) },
  ];

  const animeRows = [
    { title: "Trending This Week", movies: trendingAnime.results.slice(0, 15) },
    { title: "Popular", movies: popularAnime.results.slice(0, 15) },
    { title: "Top Rated", movies: topRatedAnime.results.slice(0, 15) },
    { title: "Airing Today", movies: airingTodayAnime.results.slice(0, 15) },
  ];

  return (
    <main className="flex-1 px-4 py-6 sm:px-6">
      <DashboardHero movies={heroPool} />

      <RecentlySeenRow />

      <Section id="movies" label="Movies">
        {movieRows.map((row) => (
          <MovieRow
            key={row.title}
            title={row.title}
            movies={row.movies}
            contentType="movie"
            hrefPrefix="/dashboard"
          />
        ))}
      </Section>

      <Section id="tv-shows" label="TV Shows">
        {tvRows.map((row) => (
          <MovieRow
            key={row.title}
            title={row.title}
            movies={row.movies}
            contentType="tv"
            hrefPrefix="/dashboard"
          />
        ))}
      </Section>

      <Section id="anime" label="Anime">
        {animeRows.map((row) => (
          <MovieRow
            key={row.title}
            title={row.title}
            movies={row.movies}
            contentType="anime"
            hrefPrefix="/dashboard"
          />
        ))}
      </Section>
    </main>
  );
}

function Section({
  id,
  label,
  children,
}: {
  id: string;
  label: string;
  children: React.ReactNode;
}) {
  return (
    <section id={id} className="space-y-6 pt-6">
      <p className="px-2 text-xs uppercase tracking-[0.35em] text-muted-foreground">
        {label}
      </p>
      {children}
    </section>
  );
}
