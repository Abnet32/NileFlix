"use client";

import { useEffect, useRef } from "react";
import { pushRecentlySeen, type RecentItem } from "@/lib/recently-seen";

const VIDLINK_ORIGIN = "https://vidlink.pro";
// How often (ms) to persist progress while actively watching.
const FLUSH_INTERVAL = 15_000;

type Progress = { watchedSeconds: number; duration: number };

function extractProgress(data: unknown, id: number): Progress | null {
  if (!data || typeof data !== "object") return null;
  const map = data as Record<string, unknown>;
  const entry = (map[String(id)] ?? Object.values(map)[0]) as
    | Record<string, unknown>
    | undefined;
  const progress = entry?.progress as
    | { watched?: unknown; duration?: unknown }
    | undefined;
  if (!progress) return null;

  const watchedSeconds =
    typeof progress.watched === "number" ? progress.watched : 0;
  const duration =
    typeof progress.duration === "number" ? progress.duration : 0;
  if (watchedSeconds <= 0 && duration <= 0) return null;

  return { watchedSeconds, duration };
}

/**
 * Records a watch into the user's history (persisted in the database).
 *
 * Mounted only on watch/play pages, so a title counts as a real view when the
 * user presses Play — not when they merely open a detail page. While the
 * embedded player reports progress, the real watched seconds are persisted on
 * top of the initial view.
 */
export default function RecentlySeenTracker({ item }: { item: RecentItem }) {
  const latest = useRef<Progress | null>(null);
  const flushed = useRef<Progress | null>(null);

  useEffect(() => {
    // Count the view immediately on Play.
    pushRecentlySeen(item);
    latest.current = null;
    flushed.current = null;

    const flush = () => {
      const p = latest.current;
      if (!p) return;
      if (
        flushed.current &&
        flushed.current.watchedSeconds === p.watchedSeconds &&
        flushed.current.duration === p.duration
      ) {
        return;
      }
      flushed.current = p;
      pushRecentlySeen(item, p);
    };

    const onMessage = (event: MessageEvent) => {
      if (event.origin !== VIDLINK_ORIGIN) return;
      if (event.data?.type !== "MEDIA_DATA") return;
      const p = extractProgress(event.data.data, item.id);
      if (p) latest.current = p;
    };

    const onHidden = () => {
      if (document.visibilityState === "hidden") flush();
    };

    window.addEventListener("message", onMessage);
    window.addEventListener("pagehide", flush);
    document.addEventListener("visibilitychange", onHidden);
    const interval = window.setInterval(flush, FLUSH_INTERVAL);

    return () => {
      window.removeEventListener("message", onMessage);
      window.removeEventListener("pagehide", flush);
      document.removeEventListener("visibilitychange", onHidden);
      window.clearInterval(interval);
      flush();
    };
    // Re-run only when the tracked title changes.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [item.id, item.media_type]);

  return null;
}
