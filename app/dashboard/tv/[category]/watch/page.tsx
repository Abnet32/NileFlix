// In-dashboard TV watch route. `[category]` carries the series id (see the
// sibling page.tsx for why the segment keeps that name).
import RecentlySeenTracker from "@/components/recently-seen-tracker";
import WatchScreen from "@/components/watch-screen";
import { getSeries } from "@/lib/tmdb";

type WatchPageProps = {
  params: Promise<{ category: string }>;
};

export default async function DashboardTvWatchPage({ params }: WatchPageProps) {
  const { category: id } = await params;
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
        backHref={`/dashboard/tv/${series.id}`}
      />
    </>
  );
}
