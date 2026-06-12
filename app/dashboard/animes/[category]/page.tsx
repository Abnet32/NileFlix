import DashboardSearch from "@/components/dashboard-search";
import MediaGrid from "@/components/media-grid";
import {
  getPopularAnime,
  getTopRatedAnime,
  getTrendingAnime,
  type TMDBMovie,
} from "@/lib/tmdb";
import { notFound } from "next/navigation";

type AnimePageProps = {
  params: Promise<{ category: string }>;
};

const ANIME = {
  popular: {
    title: "Popular Anime",
    description: "The anime everyone is watching right now.",
    fetch: getPopularAnime,
  },
  "top-rated": {
    title: "Top Rated Anime",
    description: "The highest rated anime of all time.",
    fetch: getTopRatedAnime,
  },
  trending: {
    title: "Trending Anime",
    description: "Anime trending this week.",
    fetch: getTrendingAnime,
  },
} satisfies Record<
  string,
  {
    title: string;
    description: string;
    fetch: () => Promise<{ results: TMDBMovie[] }>;
  }
>;

export default async function AnimePage({ params }: AnimePageProps) {
  const { category } = await params;
  const config = ANIME[category as keyof typeof ANIME];

  if (!config) {
    notFound();
  }

  const data = await config.fetch();

  return (
    <>
      <DashboardSearch scope="anime" />
      <MediaGrid
        title={config.title}
        description={config.description}
        items={data.results}
        contentType="anime"
        hrefPrefix="/dashboard"
      />
    </>
  );
}
