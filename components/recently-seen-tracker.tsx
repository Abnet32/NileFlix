"use client";

import { useEffect } from "react";
import { pushRecentlySeen, type RecentItem } from "@/lib/recently-seen";

/**
 * Records a title into the browser's "recently seen" list on mount.
 * Rendered from dashboard detail/watch pages.
 */
export default function RecentlySeenTracker({ item }: { item: RecentItem }) {
  useEffect(() => {
    pushRecentlySeen(item);
    // Re-run only when the tracked title changes.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [item.id, item.media_type]);

  return null;
}
