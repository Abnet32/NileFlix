"use client";

import { useEffect, useState } from "react";
import { Heart, Bookmark, Clock, Play } from "lucide-react";
import { FAVORITES_KEY, WATCHLIST_KEY, readList } from "@/lib/media-lists";
import { readRecentlySeen } from "@/lib/recently-seen";

export default function DashboardStatsBar() {
  const [stats, setStats] = useState<{
    favorites: number;
    watchlist: number;
    recent: number;
    estimatedMinutes: number;
  } | null>(null);

  useEffect(() => {
    const favs = readList(FAVORITES_KEY).length;
    const watch = readList(WATCHLIST_KEY).length;
    const recent = readRecentlySeen();
    // Rough estimate: 90min per movie, 45min per TV episode
    const minutes = recent.reduce((acc, item) => {
      return acc + (item.media_type === "movie" ? 90 : 45);
    }, 0);

    setStats({ favorites: favs, watchlist: watch, recent: recent.length, estimatedMinutes: minutes });
  }, []);

  if (!stats) return null;

  const formatHours = (mins: number) => {
    if (mins < 60) return `${mins}m`;
    const h = Math.floor(mins / 60);
    const m = mins % 60;
    return m > 0 ? `${h}h ${m}m` : `${h}h`;
  };

  const statItems = [
    { label: "Favorites", value: stats.favorites, icon: Heart },
    { label: "Watchlist", value: stats.watchlist, icon: Bookmark },
    { label: "Recently Seen", value: stats.recent, icon: Play },
    { label: "Est. Watch Time", value: formatHours(stats.estimatedMinutes), icon: Clock },
  ];

  return (
    <div className="mb-6 grid grid-cols-2 gap-3 sm:grid-cols-4">
      {statItems.map(({ label, value, icon: Icon }) => (
        <div
          key={label}
          className="flex items-center gap-3 rounded-xl border border-border/60 bg-card/60 px-4 py-3 shadow-sm backdrop-blur transition-all duration-200 hover:border-border hover:shadow-md"
        >
          <div className="flex size-9 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary">
            <Icon className="size-4" />
          </div>
          <div className="min-w-0">
            <p className="text-[11px] uppercase tracking-[0.2em] text-muted-foreground">
              {label}
            </p>
            <p className="text-lg font-semibold tabular-nums text-foreground">
              {typeof value === "number" ? value.toLocaleString() : value}
            </p>
          </div>
        </div>
      ))}
    </div>
  );
}
