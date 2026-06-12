"use client";

import { useEffect, useState } from "react";
import { Heart, Bookmark, Clock, Play } from "lucide-react";
import { FAVORITES_KEY, WATCHLIST_KEY, readList } from "@/lib/media-lists";
import { readRecentlySeen } from "@/lib/recently-seen";

export default function ProfileStats() {
  const [stats, setStats] = useState<{
    favorites: number;
    watchlist: number;
    recent: number;
    estimatedHours: string;
  } | null>(null);

  function formatWatchTime(seconds: number) {
    const mins = Math.round(seconds / 60);
    if (mins <= 0) return "0m";
    if (mins < 60) return `${mins}m`;
    const h = Math.floor(mins / 60);
    const m = mins % 60;
    return m > 0 ? `${h}h ${m}m` : `${h}h`;
  }

  useEffect(() => {
    const refresh = () => {
      const favs = readList(FAVORITES_KEY).length;
      const watch = readList(WATCHLIST_KEY).length;
      const recent = readRecentlySeen();
      const seconds = recent.reduce(
        (acc, item) => acc + (item.watchedSeconds ?? 0),
        0,
      );
      setStats({
        favorites: favs,
        watchlist: watch,
        recent: recent.length,
        estimatedHours: formatWatchTime(seconds),
      });
    };

    refresh();
    window.addEventListener("nileflix:lists", refresh);
    return () => window.removeEventListener("nileflix:lists", refresh);
  }, []);

  if (!stats) {
    return (
      <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <div
            key={i}
            className="animate-pulse rounded-sm border border-border/60 bg-card/60 p-4"
          >
            <div className="mb-2 h-4 w-12 rounded-sm bg-muted" />
            <div className="h-8 w-16 rounded-sm bg-muted" />
          </div>
        ))}
      </div>
    );
  }

  const statItems = [
    { label: "Favorites", value: stats.favorites, icon: Heart },
    { label: "Watchlist", value: stats.watchlist, icon: Bookmark },
    { label: "Watched", value: stats.recent, icon: Play },
    { label: "Watch Hours", value: stats.estimatedHours, icon: Clock },
  ];

  return (
    <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
      {statItems.map(({ label, value, icon: Icon }) => (
        <div
          key={label}
          className="flex flex-col items-center gap-2 rounded-sm  bg-card/60 p-5 text-center shadow-sm backdrop-blur transition-all duration-200 hover:border-border hover:shadow-md"
        >
          <div className="flex size-10 items-center justify-center rounded-sm text-primary">
            <Icon className="size-5" />
          </div>
          <div>
            <p className="text-2xl font-bold tabular-nums">
              {typeof value === "number" ? value.toLocaleString() : value}
            </p>
            <p className="text-xs uppercase tracking-[0.2em] text-muted-foreground">
              {label}
            </p>
          </div>
        </div>
      ))}
    </div>
  );
}
