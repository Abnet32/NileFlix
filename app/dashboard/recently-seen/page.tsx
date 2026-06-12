import SavedMediaGrid from "@/components/saved-media-grid";
import { RECENT_KEY } from "@/lib/media-lists";

export default function RecentlySeenPage() {
  return (
    <SavedMediaGrid
      listKey={RECENT_KEY}
      title="Recently Seen"
      description="Titles from your watch history."
      emptyText="Nothing watched yet. Play a movie or show and it'll appear here."
    />
  );
}
