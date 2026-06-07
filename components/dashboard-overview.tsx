"use client";

import { useEffect, useState } from "react";
import {
  Bookmark,
  Clock,
  Film,
  Heart,
  Play,
  Sparkles,
  Tv,
} from "lucide-react";
import { FAVORITES_KEY, WATCHLIST_KEY, readList } from "@/lib/media-lists";
import { readRecentlySeen } from "@/lib/recently-seen";

type Overview = {
  favorites: number;
  watchlist: number;
  watched: number;
  estimatedMinutes: number;
  movieCount: number;
  tvCount: number;
  topTitle: { title: string; vote: number } | null;
};

function formatHours(mins: number) {
  if (mins <= 0) return "0m";
  if (mins < 60) return `${mins}m`;
  const h = Math.floor(mins / 60);
  const m = mins % 60;
  return m > 0 ? `${h}h ${m}m` : `${h}h`;
}

export default function DashboardOverview() {
  const [data, setData] = useState<Overview | null>(null);

  useEffect(() => {
    const favorites = readList(FAVORITES_KEY);
    const watchlist = readList(WATCHLIST_KEY);
    const recent = readRecentlySeen();

    // Combine every tracked title to derive the movie/TV split and top pick.
    const all = [...favorites, ...watchlist, ...recent];
    const movieCount = all.filter((i) => i.media_type === "movie").length;
    const tvCount = all.filter((i) => i.media_type === "tv").length;
    const estimatedMinutes = recent.reduce(
      (acc, i) => acc + (i.media_type === "movie" ? 90 : 45),
      0,
    );
    const top = all.reduce<Overview["topTitle"]>((best, i) => {
      if (!best || i.vote_average > best.vote) {
        return { title: i.title, vote: i.vote_average };
      }
      return best;
    }, null);

    setData({
      favorites: favorites.length,
      watchlist: watchlist.length,
      watched: recent.length,
      estimatedMinutes,
      movieCount,
      tvCount,
      topTitle: top,
    });
  }, []);

  if (!data) {
    return (
      <div className="grid gap-4 lg:grid-cols-[1fr_1fr]">
        <div className="h-40 animate-pulse rounded-none bg-card/60 ring-1 ring-foreground/10" />
        <div className="h-40 animate-pulse rounded-none bg-card/60 ring-1 ring-foreground/10" />
      </div>
    );
  }

  const stats = [
    { label: "Favorites", value: data.favorites, icon: Heart },
    { label: "Watchlist", value: data.watchlist, icon: Bookmark },
    { label: "Watched", value: data.watched, icon: Play },
    { label: "Watch Time", value: formatHours(data.estimatedMinutes), icon: Clock },
  ];

  // Library-composition graph: real counts from local lists, scaled to the max.
  const bars = [
    { label: "Favorites", value: data.favorites, color: "var(--chart-2)" },
    { label: "Watchlist", value: data.watchlist, color: "var(--chart-3)" },
    { label: "Watched", value: data.watched, color: "var(--chart-4)" },
  ];
  const maxBar = Math.max(1, ...bars.map((b) => b.value));

  const totalTitles = data.movieCount + data.tvCount;
  const moviePct = totalTitles ? Math.round((data.movieCount / totalTitles) * 100) : 0;

  return (
    <div className="space-y-6">
      {/* Overview stat cards */}
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
        {stats.map(({ label, value, icon: Icon }) => (
          <div
            key={label}
            className="flex items-center gap-3 rounded-none border border-border/60 bg-card px-4 py-3 ring-1 ring-foreground/5 transition-colors hover:border-border"
          >
            <div className="flex size-9 shrink-0 items-center justify-center rounded-none bg-primary/10 text-primary">
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

      <div className="grid gap-4 lg:grid-cols-[1.2fr_1fr]">
        {/* Activity graph — library composition */}
        <div className="rounded-none border border-border/60 bg-card p-5 ring-1 ring-foreground/5">
          <div className="mb-4 flex items-center gap-2">
            <Film className="size-4 text-primary" />
            <h3 className="text-sm font-medium">Your Library</h3>
          </div>

          {totalTitles === 0 ? (
            <p className="text-xs text-muted-foreground">
              Add favorites, build a watchlist, or watch something to see your
              activity here.
            </p>
          ) : (
            <>
              <div className="flex h-36 items-end gap-4">
                {bars.map((bar) => (
                  <div
                    key={bar.label}
                    className="flex flex-1 flex-col items-center gap-2"
                  >
                    <span className="text-xs font-semibold tabular-nums text-foreground">
                      {bar.value}
                    </span>
                    <div
                      className="w-full rounded-none transition-all"
                      style={{
                        height: `${(bar.value / maxBar) * 100}%`,
                        minHeight: bar.value > 0 ? "0.25rem" : "0",
                        backgroundColor: bar.color,
                      }}
                    />
                    <span className="text-[10px] uppercase tracking-[0.15em] text-muted-foreground">
                      {bar.label}
                    </span>
                  </div>
                ))}
              </div>

              {/* Movie vs TV split */}
              <div className="mt-5 space-y-2">
                <div className="flex items-center justify-between text-[11px] text-muted-foreground">
                  <span className="flex items-center gap-1">
                    <Film className="size-3" /> Movies {data.movieCount}
                  </span>
                  <span className="flex items-center gap-1">
                    {data.tvCount} TV <Tv className="size-3" />
                  </span>
                </div>
                <div className="flex h-2 w-full overflow-hidden rounded-none bg-muted">
                  <div
                    className="h-full"
                    style={{
                      width: `${moviePct}%`,
                      backgroundColor: "var(--chart-2)",
                    }}
                  />
                  <div
                    className="h-full flex-1"
                    style={{ backgroundColor: "var(--chart-4)" }}
                  />
                </div>
              </div>
            </>
          )}
        </div>

        {/* Insights panel */}
        <div className="rounded-none border border-border/60 bg-card p-5 ring-1 ring-foreground/5">
          <div className="mb-4 flex items-center gap-2">
            <Sparkles className="size-4 text-primary" />
            <h3 className="text-sm font-medium">Insights</h3>
          </div>
          <dl className="space-y-3 text-sm">
            <Insight
              label="Titles tracked"
              value={totalTitles.toLocaleString()}
            />
            <Insight
              label="You mostly watch"
              value={
                totalTitles === 0
                  ? "—"
                  : data.movieCount >= data.tvCount
                    ? "Movies"
                    : "TV Shows"
              }
            />
            <Insight
              label="Est. watch time"
              value={formatHours(data.estimatedMinutes)}
            />
            <Insight
              label="Top rated pick"
              value={
                data.topTitle
                  ? `${data.topTitle.title} · ${data.topTitle.vote.toFixed(1)}★`
                  : "—"
              }
            />
          </dl>
        </div>
      </div>
    </div>
  );
}

function Insight({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-center justify-between gap-3 border-b border-border/40 pb-2 last:border-0 last:pb-0">
      <dt className="text-muted-foreground">{label}</dt>
      <dd className="truncate text-right font-medium text-foreground">{value}</dd>
    </div>
  );
}
