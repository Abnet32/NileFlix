import RecentlySeenTracker from "@/components/recently-seen-tracker";
import WatchScreen from "@/components/watch-screen";
import { getSeries } from "@/lib/tmdb";

type WatchPageProps = {
  params: Promise<{ id: string }>;
};

export default async function DashboardAnimeWatchPage({
  params,
}: WatchPageProps) {
  const { id } = await params;
  const series = await getSeries(id);

  return (
    <>
      <RecentlySeenTracker
        item={{
          id: series.id,
          media_type: "tv",
          title: series.name,
          poster_path: series.poster_path,
          vote_average: series.vote_average,
          date: series.first_air_date,
        }}
      />
      <WatchScreen
        id={series.id.toString()}
        title={series.name}
        contentType="tv"
        backHref={`/dashboard/anime/${series.id}`}
      />
    </>
  );
}
