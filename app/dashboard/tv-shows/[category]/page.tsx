import DashboardSearch from "@/components/dashboard-search";
import MediaGrid from "@/components/media-grid";
import {
  getAiringTodaySeries,
  getPopularSeries,
  getTopRatedSeries,
  type TMDBMovie,
} from "@/lib/tmdb";
import { notFound } from "next/navigation";

type TvPageProps = {
  params: Promise<{ category: string }>;
};

const TV = {
  popular: {
    title: "Popular Shows",
    description: "The TV series everyone is talking about.",
    fetch: getPopularSeries,
  },
  "top-rated": {
    title: "Top Rated Shows",
    description: "The highest rated series of all time.",
    fetch: getTopRatedSeries,
  },
  "airing-today": {
    title: "Airing Today",
    description: "Episodes hitting the air today.",
    fetch: getAiringTodaySeries,
  },
} satisfies Record<
  string,
  {
    title: string;
    description: string;
    fetch: () => Promise<{ results: TMDBMovie[] }>;
  }
>;

export default async function TvPage({ params }: TvPageProps) {
  const { category } = await params;
  const config = TV[category as keyof typeof TV];

  if (!config) {
    notFound();
  }

  const data = await config.fetch();

  return (
    <>
      <DashboardSearch scope="tv" />
      <MediaGrid
        title={config.title}
        description={config.description}
        items={data.results}
        contentType="tv"
        hrefPrefix="/dashboard"
      />
    </>
  );
}
