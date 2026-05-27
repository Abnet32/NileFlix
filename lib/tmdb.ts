const API_KEY = process.env.TMDB_API_KEY;
const BASE_URL = "https://api.themoviedb.org/3";

export type TMDBMovie = {
  id: number;
  title: string;
  overview: string;
  backdrop_path: string | null;
  poster_path: string | null;
  vote_average: number;
  release_date: string;
  genre_ids?: number[];
};

export type TMDBGenre = {
  id: number;
  name: string;
};

export type TMDBMovieDetails = TMDBMovie & {
  runtime: number | null;
  genres: TMDBGenre[];
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
