import MediaGrid from "@/components/media-grid";
import { discoverMovies } from "@/lib/tmdb";
import { notFound } from "next/navigation";
import GenreSort from "./genre-sort";

type GenrePageProps = {
  params: Promise<{ genre: string }>;
  searchParams: Promise<{ sort?: string }>;
};

const GENRES: Record<string, { id: number; title: string }> = {
  action: { id: 28, title: "Action Movies" },
  adventure: { id: 12, title: "Adventure Movies" },
  animation: { id: 16, title: "Animation Movies" },
  comedy: { id: 35, title: "Comedy Movies" },
  crime: { id: 80, title: "Crime Movies" },
  documentary: { id: 99, title: "Documentaries" },
  drama: { id: 18, title: "Drama Movies" },
  family: { id: 10751, title: "Family Movies" },
  fantasy: { id: 14, title: "Fantasy Movies" },
  history: { id: 36, title: "History Movies" },
  horror: { id: 27, title: "Horror Movies" },
  music: { id: 10402, title: "Music Movies" },
  mystery: { id: 9648, title: "Mystery Movies" },
  romance: { id: 10749, title: "Romance Movies" },
  scifi: { id: 878, title: "Sci-Fi Movies" },
  thriller: { id: 53, title: "Thriller Movies" },
  war: { id: 10752, title: "War Movies" },
  western: { id: 37, title: "Western Movies" },
  "tv-movie": { id: 10770, title: "TV Movies" },
};

const SORT_OPTIONS: Record<string, { label: string; value: string }> = {
  "popularity.desc": { label: "Popularity", value: "popularity.desc" },
  "vote_average.desc": { label: "Top Rated", value: "vote_average.desc" },
  "release_date.desc": { label: "Release Date", value: "release_date.desc" },
  "revenue.desc": { label: "Box Office", value: "revenue.desc" },
};

export default async function GenrePage({ params, searchParams }: GenrePageProps) {
  const { genre } = await params;
  const { sort } = await searchParams;
  const config = GENRES[genre as keyof typeof GENRES];

  if (!config) {
    notFound();
  }

  const sortBy = sort && SORT_OPTIONS[sort] ? sort : "popularity.desc";
  const data = await discoverMovies({
    with_genres: String(config.id),
    sort_by: sortBy,
    "vote_count.gte": "50",
  });

  const currentSort = SORT_OPTIONS[sortBy]?.label ?? "Popularity";

  return (
    <>
      <MediaGrid
        title={config.title}
        description={`Sorted by ${currentSort.toLowerCase()}.`}
        items={data.results}
        contentType="movie"
        hrefPrefix="/dashboard"
      />
      <GenreSort currentSort={sortBy} />
    </>
  );
}
