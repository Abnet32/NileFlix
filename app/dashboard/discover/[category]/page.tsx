import DashboardSearch from "@/components/dashboard-search";
import MediaGrid from "@/components/media-grid";
import {
  getOnTheAirSeries,
  getPopularMovies,
  getPopularSeries,
  getTopRatedMovies,
  getTopRatedSeries,
  getTrendingAll,
  getUpcomingMovies,
  type TMDBMovie,
} from "@/lib/tmdb";
import { notFound } from "next/navigation";

type DiscoverPageProps = {
  params: Promise<{ category: string }>;
};

function tag(items: TMDBMovie[], media_type: "movie" | "tv"): TMDBMovie[] {
  return items.map((item) => ({ ...item, media_type }));
}

/** Interleave two media lists so the grid mixes movies and TV evenly. */
function interleave(a: TMDBMovie[], b: TMDBMovie[]): TMDBMovie[] {
  const out: TMDBMovie[] = [];
  const max = Math.max(a.length, b.length);
  for (let i = 0; i < max; i++) {
    if (a[i]) out.push(a[i]);
    if (b[i]) out.push(b[i]);
  }
  return out;
}

async function combine(
  movies: () => Promise<{ results: TMDBMovie[] }>,
  series: () => Promise<{ results: TMDBMovie[] }>,
): Promise<TMDBMovie[]> {
  const [m, s] = await Promise.all([movies(), series()]);
  return interleave(tag(m.results, "movie"), tag(s.results, "tv"));
}

const DISCOVER = {
  trending: {
    title: "Trending This Week",
    description: "The movies and shows everyone is watching right now.",
    fetch: async () =>
      (await getTrendingAll()).results.filter(
        (item) => item.media_type === "movie" || item.media_type === "tv",
      ),
  },
  popular: {
    title: "Popular",
    description: "Crowd favorites across movies and TV.",
    fetch: () => combine(getPopularMovies, getPopularSeries),
  },
  "top-rated": {
    title: "Top Rated",
    description: "The highest rated movies and shows of all time.",
    fetch: () => combine(getTopRatedMovies, getTopRatedSeries),
  },
  upcoming: {
    title: "Upcoming & On The Air",
    description: "Coming soon to theaters and currently airing series.",
    fetch: () => combine(getUpcomingMovies, getOnTheAirSeries),
  },
} satisfies Record<
  string,
  {
    title: string;
    description: string;
    fetch: () => Promise<TMDBMovie[]>;
  }
>;

export default async function DiscoverPage({ params }: DiscoverPageProps) {
  const { category } = await params;
  const config = DISCOVER[category as keyof typeof DISCOVER];

  if (!config) {
    notFound();
  }

  const items = await config.fetch();

  return (
    <>
      <DashboardSearch />
      <MediaGrid
        title={config.title}
        description={config.description}
        items={items}
        hrefPrefix="/dashboard"
      />
    </>
  );
}
