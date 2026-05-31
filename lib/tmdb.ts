const API_KEY = process.env.TMDB_API_KEY;
const BASE_URL = "https://api.themoviedb.org/3";

export type TMDBMovie = {
  id: number;
  title?: string;
  name?: string;
  overview: string;
  backdrop_path: string | null;
  poster_path: string | null;
  vote_average: number;
  release_date?: string;
  first_air_date?: string;
  media_type?: "movie" | "tv" | "person";
  genre_ids?: number[];
};

export type TMDBSearchResult = TMDBMovie & {
  media_type: "movie" | "tv";
};

export type TMDBGenre = {
  id: number;
  name: string;
};

export type TMDBMovieDetails = TMDBMovie & {
  runtime: number | null;
  genres: TMDBGenre[];
};

export type TMDBEpisode = {
  id: number;
  name: string;
  overview: string;
  episode_number: number;
  season_number?: number;
  still_path: string | null;
  air_date: string;
  runtime: number | null;
  vote_average: number;
};

export type TMDBSeason = {
  id: number;
  name: string;
  overview: string;
  season_number: number;
  episode_count: number;
  poster_path: string | null;
  air_date: string;
  episodes?: TMDBEpisode[];
};

export type TMDBSeriesDetails = TMDBMovie & {
  name: string;
  first_air_date: string;
  last_air_date: string;
  number_of_seasons: number;
  number_of_episodes: number;
  status: string;
  genres: TMDBGenre[];
  episode_run_time: number[];
  seasons: TMDBSeason[];
};

export type TMDBVideo = {
  id: string;
  key: string;
  name: string;
  site: string;
  type: string;
  official: boolean;
};

type TMDBResponse<T> = {
  results: T[];
};

type TMDBSeasonResponse = TMDBSeason;

function assertApiKey() {
  if (!API_KEY) {
    throw new Error("TMDB_API_KEY is missing");
  }
}

async function tmdbFetch<T>(path: string) {
  assertApiKey();

  const response = await fetch(`${BASE_URL}${path}&api_key=${API_KEY}`, {
    next: { revalidate: 60 * 60 },
  });

  if (!response.ok) {
    throw new Error(`Failed to fetch TMDB data for ${path}`);
  }

  return response.json() as Promise<T>;
}

export function getContentTitle(content: Pick<TMDBMovie, "title" | "name">) {
  return content.title ?? content.name ?? "Untitled";
}

export function getContentYear(
  content: Pick<TMDBMovie, "release_date" | "first_air_date">,
) {
  const date = content.release_date ?? content.first_air_date;
  return date ? new Date(date).getFullYear() : null;
}

export function getContentHref(content: Pick<TMDBMovie, "id" | "media_type">) {
  return content.media_type === "tv"
    ? `/tv/${content.id}`
    : `/movie/${content.id}`;
}

export function getSeasonHref(id: string, seasonNumber: number | string) {
  return `/tv/${id}/season/${seasonNumber}`;
}

export function getEpisodeHref(
  id: string,
  seasonNumber: number | string,
  episodeNumber: number | string,
) {
  return `/tv/${id}/season/${seasonNumber}/episode/${episodeNumber}`;
}

export async function getTrendingMovies() {
  return tmdbFetch<TMDBResponse<TMDBMovie>>(
    "/trending/movie/week?language=en-US",
  );
}

export async function searchMovies(query: string) {
  return tmdbFetch<TMDBResponse<TMDBMovie>>(
    `/search/movie?query=${encodeURIComponent(query)}&language=en-US`,
  );
}

export async function searchContent(query: string) {
  return tmdbFetch<TMDBResponse<TMDBSearchResult>>(
    `/search/multi?query=${encodeURIComponent(query)}&language=en-US`,
  );
}

export async function getMovie(id: string) {
  return tmdbFetch<TMDBMovieDetails>(`/movie/${id}?language=en-US`);
}

export async function getMovieVideos(id: string) {
  return tmdbFetch<TMDBResponse<TMDBVideo>>(
    `/movie/${id}/videos?language=en-US`,
  );
}

export function getTrailerVideo(videos: TMDBVideo[]) {
  return videos.find(
    (video) =>
      video.site === "YouTube" && video.type === "Trailer" && video.key,
  );
}

export async function getPopularMovies() {
  return tmdbFetch<TMDBResponse<TMDBMovie>>(`/movie/popular?language=en-US`);
}

export async function getTopRatedMovies() {
  return tmdbFetch<TMDBResponse<TMDBMovie>>(`/movie/top_rated?language=en-US`);
}

export async function getUpcomingMovies() {
  return tmdbFetch<TMDBResponse<TMDBMovie>>(`/movie/upcoming?language=en-US`);
}

export async function getNowPlayingMovies() {
  return tmdbFetch<TMDBResponse<TMDBMovie>>(
    `/movie/now_playing?language=en-US`,
  );
}

export async function getGenres() {
  return tmdbFetch<{ genres: TMDBGenre[] }>(`/genre/movie/list?language=en-US`);
}

export function getTrendingSeries() {
  return tmdbFetch<TMDBResponse<TMDBMovie>>("/trending/tv/week?language=en-US");
}

export async function getSeries(id: string) {
  return tmdbFetch<TMDBSeriesDetails>(`/tv/${id}?language=en-US`);
}

export async function getSeriesVideos(id: string) {
  return tmdbFetch<TMDBResponse<TMDBVideo>>(`/tv/${id}/videos?language=en-US`);
}

export async function getSeriesSeason(id: string, seasonNumber: string) {
  return tmdbFetch<TMDBSeasonResponse>(
    `/tv/${id}/season/${seasonNumber}?language=en-US`,
  );
}

export async function getSeriesEpisode(
  id: string,
  seasonNumber: string,
  episodeNumber: string,
) {
  return tmdbFetch<TMDBEpisode>(
    `/tv/${id}/season/${seasonNumber}/episode/${episodeNumber}?language=en-US`,
  );
}

export async function getPopularSeries() {
  return tmdbFetch<TMDBResponse<TMDBMovie>>(`/tv/popular?language=en-US`);
}

export async function getTopRatedSeries() {
  return tmdbFetch<TMDBResponse<TMDBMovie>>(`/tv/top_rated?language=en-US`);
}

export async function getAiringTodaySeries() {
  return tmdbFetch<TMDBResponse<TMDBMovie>>(`/tv/airing_today?language=en-US`);
}

export async function getOnTheAirSeries() {
  return tmdbFetch<TMDBResponse<TMDBMovie>>(`/tv/on_the_air?language=en-US`);
}
