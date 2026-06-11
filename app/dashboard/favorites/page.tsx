// import DashboardSearch from "@/components/dashboard-search";
import SavedMediaGrid from "@/components/saved-media-grid";
import { FAVORITES_KEY } from "@/lib/media-lists";

export default function FavoritesPage() {
  return (
    <>
      {/* <DashboardSearch /> */}
      <SavedMediaGrid
        listKey={FAVORITES_KEY}
        title="Favorites"
        description="Titles you've marked as favorites."
        emptyText="No favorites yet. Tap the heart on any movie or show to add it here."
      />
    </>
  );
}
