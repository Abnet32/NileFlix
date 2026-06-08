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
  BarChart3,
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
  ratingBuckets: number[];
};

const RATING_LABELS = ["0–2", "2–4", "4–6", "6–8", "8–10"];

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

    // Distribution of all tracked titles across rating bands [0-2,2-4,...,8-10].
    const ratingBuckets = [0, 0, 0, 0, 0];
    for (const i of all) {
      const idx = Math.min(4, Math.max(0, Math.floor(i.vote_average / 2)));
      ratingBuckets[idx] += 1;
    }

    setData({
      favorites: favorites.length,
      watchlist: watchlist.length,
      watched: recent.length,
      estimatedMinutes,
      movieCount,
      tvCount,
      topTitle: top,
      ratingBuckets,
    });
  }, []);

  if (!data) {
    return (
      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <div
            key={i}
            className="h-24 animate-pulse rounded-xl bg-card/60 ring-1 ring-foreground/10"
          />
        ))}
      </div>
    );
  }

  const stats = [
    { label: "Favorites", value: data.favorites, icon: Heart, color: "var(--chart-5)" },
    { label: "Watchlist", value: data.watchlist, icon: Bookmark, color: "var(--chart-3)" },
    { label: "Watched", value: data.watched, icon: Play, color: "var(--chart-2)" },
    {
      label: "Watch Time",
      value: formatHours(data.estimatedMinutes),
      icon: Clock,
      color: "var(--chart-4)",
    },
  ];

  const segments = [
    { label: "Favorites", value: data.favorites, color: "var(--chart-5)" },
    { label: "Watchlist", value: data.watchlist, color: "var(--chart-3)" },
    { label: "Watched", value: data.watched, color: "var(--chart-2)" },
  ];
  const segTotal = segments.reduce((a, s) => a + s.value, 0);

  const totalTitles = data.movieCount + data.tvCount;
  const moviePct = totalTitles
    ? Math.round((data.movieCount / totalTitles) * 100)
    : 0;
  const hasRatings = data.ratingBuckets.some((v) => v > 0);

  return (
    <div className="space-y-4">
      {/* Colorful stat cards */}
      <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
        {stats.map(({ label, value, icon: Icon, color }) => (
          <div
            key={label}
            className="relative overflow-hidden rounded-xl border border-border/60 bg-card p-4 ring-1 ring-foreground/5"
          >
            <div
              className="absolute -right-6 -top-6 size-20 rounded-full opacity-15 blur-xl"
              style={{ backgroundColor: color }}
            />
            <div
              className="flex size-9 items-center justify-center rounded-lg"
              style={{
                backgroundColor: `color-mix(in oklab, ${color} 15%, transparent)`,
                color,
              }}
            >
              <Icon className="size-4" />
            </div>
            <p className="mt-3 text-2xl font-semibold tabular-nums leading-none">
              {typeof value === "number" ? value.toLocaleString() : value}
            </p>
            <p className="mt-1 text-[11px] uppercase tracking-[0.18em] text-muted-foreground">
              {label}
            </p>
          </div>
        ))}
      </div>

      {/* Actual graph: rating distribution area chart */}
      <div className="rounded-xl border border-border/60 bg-card p-4 ring-1 ring-foreground/5">
        <div className="mb-1 flex items-center gap-2">
          <BarChart3 className="size-4 text-primary" />
          <h3 className="text-sm font-medium">Ratings of Your Titles</h3>
        </div>
        <p className="mb-3 text-xs text-muted-foreground">
          How the {totalTitles} titles you track are distributed across rating
          bands.
        </p>
        {hasRatings ? (
          <AreaChart values={data.ratingBuckets} labels={RATING_LABELS} />
        ) : (
          <EmptyHint />
        )}
      </div>

      <div className="grid gap-3 lg:grid-cols-2">
        {/* Donut: library composition */}
        <div className="rounded-xl border border-border/60 bg-card p-4 ring-1 ring-foreground/5">
          <div className="mb-3 flex items-center gap-2">
            <Sparkles className="size-4 text-primary" />
            <h3 className="text-sm font-medium">Library Composition</h3>
          </div>
          {segTotal === 0 ? (
            <EmptyHint />
          ) : (
            <div className="flex items-center gap-4">
              <Donut segments={segments} total={segTotal} />
              <ul className="flex-1 space-y-2">
                {segments.map((s) => (
                  <li
                    key={s.label}
                    className="flex items-center justify-between text-xs"
                  >
                    <span className="flex items-center gap-2 text-muted-foreground">
                      <span
                        className="size-2.5 rounded-full"
                        style={{ backgroundColor: s.color }}
                      />
                      {s.label}
                    </span>
                    <span className="font-semibold tabular-nums">{s.value}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>

        {/* Insights + movies vs tv */}
        <div className="rounded-xl border border-border/60 bg-card p-4 ring-1 ring-foreground/5">
          <div className="mb-3 flex items-center gap-2">
            <Film className="size-4 text-primary" />
            <h3 className="text-sm font-medium">Insights</h3>
          </div>

          <div className="mb-3 space-y-2">
            <div className="flex items-center justify-between text-[11px] text-muted-foreground">
              <span className="flex items-center gap-1">
                <Film className="size-3" /> Movies {data.movieCount}
              </span>
              <span className="flex items-center gap-1">
                {data.tvCount} TV <Tv className="size-3" />
              </span>
            </div>
            <div className="flex h-2 w-full overflow-hidden rounded-full bg-muted">
              <div
                className="h-full rounded-full transition-all"
                style={{ width: `${moviePct}%`, backgroundColor: "var(--chart-1)" }}
              />
              <div
                className="h-full flex-1"
                style={{ backgroundColor: "var(--chart-4)" }}
              />
            </div>
          </div>

          <dl className="space-y-2 text-sm">
            <Insight label="Titles tracked" value={totalTitles.toLocaleString()} />
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

function AreaChart({
  values,
  labels,
}: {
  values: number[];
  labels: string[];
}) {
  const max = Math.max(1, ...values);
  const n = values.length;
  const padY = 8;
  const points = values.map((v, i) => {
    const x = n > 1 ? (i / (n - 1)) * 100 : 50;
    const y = 100 - padY - (v / max) * (100 - padY * 2);
    return { x, y, v };
  });

  const linePath = points
    .map((p, i) => `${i === 0 ? "M" : "L"} ${p.x} ${p.y}`)
    .join(" ");
  const areaPath = `M ${points[0].x} 100 ${points
    .map((p) => `L ${p.x} ${p.y}`)
    .join(" ")} L ${points[n - 1].x} 100 Z`;

  return (
    <div>
      <div className="relative h-36 w-full">
        <svg
          viewBox="0 0 100 100"
          preserveAspectRatio="none"
          className="h-full w-full"
        >
          <defs>
            <linearGradient id="areaFill" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="var(--chart-1)" stopOpacity="0.45" />
              <stop offset="100%" stopColor="var(--chart-1)" stopOpacity="0" />
            </linearGradient>
          </defs>

          {/* horizontal gridlines */}
          {[25, 50, 75].map((y) => (
            <line
              key={y}
              x1="0"
              y1={y}
              x2="100"
              y2={y}
              stroke="var(--border)"
              strokeWidth="0.5"
              vectorEffect="non-scaling-stroke"
            />
          ))}

          <path d={areaPath} fill="url(#areaFill)" />
          <path
            d={linePath}
            fill="none"
            stroke="var(--chart-1)"
            strokeWidth="2"
            strokeLinejoin="round"
            strokeLinecap="round"
            vectorEffect="non-scaling-stroke"
          />
          {points.map((p) => (
            <circle
              key={p.x}
              cx={p.x}
              cy={p.y}
              r="2.5"
              fill="var(--card)"
              stroke="var(--chart-1)"
              strokeWidth="2"
              vectorEffect="non-scaling-stroke"
            />
          ))}
        </svg>
      </div>
      <div className="mt-1.5 flex justify-between px-1 text-[10px] text-muted-foreground">
        {labels.map((l) => (
          <span key={l}>{l}</span>
        ))}
      </div>
    </div>
  );
}

function Donut({
  segments,
  total,
}: {
  segments: { label: string; value: number; color: string }[];
  total: number;
}) {
  const r = 38;
  const c = 2 * Math.PI * r;
  let offset = 0;

  return (
    <div className="relative size-28 shrink-0">
      <svg viewBox="0 0 100 100" className="size-full -rotate-90">
        <circle cx="50" cy="50" r={r} fill="none" stroke="var(--muted)" strokeWidth="12" />
        {segments.map((s) => {
          const len = total ? (s.value / total) * c : 0;
          const seg = (
            <circle
              key={s.label}
              cx="50"
              cy="50"
              r={r}
              fill="none"
              stroke={s.color}
              strokeWidth="12"
              strokeDasharray={`${len} ${c - len}`}
              strokeDashoffset={-offset}
            />
          );
          offset += len;
          return seg;
        })}
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <span className="text-xl font-semibold tabular-nums leading-none">
          {total}
        </span>
        <span className="text-[10px] uppercase tracking-[0.15em] text-muted-foreground">
          Titles
        </span>
      </div>
    </div>
  );
}

function EmptyHint() {
  return (
    <p className="py-6 text-xs text-muted-foreground">
      Add favorites, build a watchlist, or watch something to see your stats
      here.
    </p>
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
