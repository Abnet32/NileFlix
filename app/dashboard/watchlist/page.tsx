// import DashboardSearch from "@/components/dashboard-search";
import SavedMediaGrid from "@/components/saved-media-grid";
import { WATCHLIST_KEY } from "@/lib/media-lists";

export default function WatchlistPage() {
  return (
    <>
      {/* <DashboardSearch /> */}
      <SavedMediaGrid
        listKey={WATCHLIST_KEY}
        title="Watchlist"
        description="Titles you've saved to watch later."
        emptyText="Your watchlist is empty. Use the Watchlist button on any title to save it."
      />
    </>
  );
}
