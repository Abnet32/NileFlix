"use client";

import { useEffect, useState } from "react";
import {
  Bookmark,
  Clock,
  Heart,
  Play,
  Sparkles,
  TrendingUp,
} from "lucide-react";
import { FAVORITES_KEY, WATCHLIST_KEY, readList } from "@/lib/media-lists";
import { readRecentlySeen } from "@/lib/recently-seen";

type Overview = {
  favorites: number;
  watchlist: number;
  watched: number;
  watchTime: string;
  total: number;
  movieCount: number;
  tvCount: number;
  avgRating: number;
  ratingBuckets: number[];
};

const RATING_LABELS = ["0–2", "2–4", "4–6", "6–8", "8–10"];

// Theme-aligned palette (forest green / teal / sage / calm blue).
const GREEN = "var(--primary)";
const TEAL = "var(--chart-2)";
const SAGE = "var(--chart-1)";
const BLUE = "var(--chart-4)";

function formatWatchTime(seconds: number) {
  const mins = Math.round(seconds / 60);
  if (mins <= 0) return "0m";
  if (mins < 60) return `${mins}m`;
  const h = Math.floor(mins / 60);
  const m = mins % 60;
  return m > 0 ? `${h}h ${m}m` : `${h}h`;
}

export default function DashboardOverview() {
  const [data, setData] = useState<Overview | null>(null);

  useEffect(() => {
    const refresh = () => {
      const favorites = readList(FAVORITES_KEY);
      const watchlist = readList(WATCHLIST_KEY);
      const recent = readRecentlySeen();

      // Unique titles only: a title in both favorites and watched (or any
      // overlap) must be counted once, not once per list.
      const seen = new Set<string>();
      const all = [...favorites, ...watchlist, ...recent].filter((i) => {
        const key = `${i.media_type}-${i.id}`;
        if (seen.has(key)) return false;
        seen.add(key);
        return true;
      });

      const watchedSeconds = recent.reduce(
        (acc, i) => acc + (i.watchedSeconds ?? 0),
        0,
      );
      const ratingBuckets = [0, 0, 0, 0, 0];
      const rated = all.filter((i) => i.vote_average > 0);
      for (const i of all) {
        const idx = Math.min(4, Math.max(0, Math.floor(i.vote_average / 2)));
        ratingBuckets[idx] += 1;
      }
      const avgRating = rated.length
        ? rated.reduce((a, i) => a + i.vote_average, 0) / rated.length
        : 0;

      setData({
        favorites: favorites.length,
        watchlist: watchlist.length,
        watched: recent.length,
        watchTime: formatWatchTime(watchedSeconds),
        total: all.length,
        movieCount: all.filter((i) => i.media_type === "movie").length,
        tvCount: all.filter((i) => i.media_type === "tv").length,
        avgRating,
        ratingBuckets,
      });
    };

    refresh();
    window.addEventListener("nileflix:lists", refresh);
    return () => window.removeEventListener("nileflix:lists", refresh);
  }, []);

  const stats = [
    {
      label: "Favorites",
      value: data?.favorites ?? 0,
      icon: Heart,
      color: GREEN,
      stripe: [GREEN, TEAL] as const,
    },
    {
      label: "Watchlist",
      value: data?.watchlist ?? 0,
      icon: Bookmark,
      color: TEAL,
      stripe: [TEAL, BLUE] as const,
    },
    {
      label: "Watched",
      value: data?.watched ?? 0,
      icon: Play,
      color: SAGE,
      stripe: [SAGE, GREEN] as const,
    },
    {
      label: "Watch Time",
      value: data?.watchTime ?? "0m",
      icon: Clock,
      color: BLUE,
      stripe: [BLUE, "var(--chart-5)"] as const,
    },
  ];

  // Donut ring is split by activity (Favorites / Watchlist / Watched), while
  // its center shows the unique title count — a title saved in several lists is
  // counted once there, not per list.
  const composition = [
    { label: "Favorites", value: data?.favorites ?? 0, color: GREEN },
    { label: "Watchlist", value: data?.watchlist ?? 0, color: TEAL },
    { label: "Watched", value: data?.watched ?? 0, color: BLUE },
  ];
  const compTotal = composition.reduce((a, s) => a + s.value, 0);

  const totalTitles = (data?.movieCount ?? 0) + (data?.tvCount ?? 0);
  const moviePct = totalTitles
    ? Math.round(((data?.movieCount ?? 0) / totalTitles) * 100)
    : 0;
  const hasRatings = (data?.ratingBuckets ?? []).some((v) => v > 0);

  return (
    <div className="space-y-3">
      {/* Primary stats — full-width stretched row, soft theme tints */}
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
        {stats.map(({ label, value, icon: Icon, color, stripe }) => (
          <div
            key={label}
            className="relative flex min-h-20 flex-col justify-center gap-2 overflow-hidden rounded-lg p-3 pl-4 shadow-sm transition-transform duration-300 hover:-translate-y-0.5 sm:min-h-36 sm:gap-4 sm:rounded-xl sm:p-5 sm:pl-7"
          >
            {/* Two-color gradient accent strip on the left edge — unique per card */}
            <span
              className="absolute inset-y-0 left-0 w-1.5 sm:w-2"
              style={{
                backgroundImage: `linear-gradient(to bottom, ${stripe[0]}, ${stripe[1]})`,
              }}
            />
            <span
              className="flex size-8 shrink-0 items-center justify-center rounded-lg sm:size-12 sm:rounded-xl"
              style={{
                backgroundColor: `color-mix(in oklab, ${color} 0%, transparent)`,
                color,
              }}
            >
              <Icon className="size-4 sm:size-6" />
            </span>
            <div className="min-w-0">
              <p className="text-lg font-bold tabular-nums leading-none sm:text-2xl">
                {typeof value === "number" ? value.toLocaleString() : value}
              </p>
              <p className="mt-1 text-[10px] font-medium uppercase tracking-[0.16em] text-muted-foreground sm:mt-1.5 sm:text-xs">
                {label}
              </p>
            </div>
          </div>
        ))}
      </div>

      <div className="grid gap-3 lg:grid-cols-2">
        {/* Ratings area chart */}
        <div className="rounded-2xl bg-card/70 p-5 shadow-sm">
          <div className="mb-1 flex items-center gap-2">
            <TrendingUp className="size-4 text-primary" />
            <h3 className="text-sm font-semibold">Ratings of Your Titles</h3>
          </div>
          <p className="mb-3 text-xs text-muted-foreground">
            {totalTitles} titles across rating bands — updates live.
          </p>
          {hasRatings ? (
            <AreaChart
              values={data?.ratingBuckets ?? []}
              labels={RATING_LABELS}
            />
          ) : (
            <EmptyHint />
          )}
        </div>

        {/* Library composition */}
        <div className="rounded-2xl bg-card/70 p-5 shadow-sm">
          <div className="mb-3 flex items-center gap-2">
            <Sparkles className="size-4 text-primary" />
            <h3 className="text-sm font-semibold">Library Composition</h3>
          </div>

          {compTotal === 0 ? (
            <EmptyHint />
          ) : (
            <div className="flex items-center gap-5">
              <Donut
                segments={composition}
                total={compTotal}
                display={totalTitles}
              />
              <ul className="flex-1 space-y-2.5">
                {composition.map((s) => (
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
                    <span className="font-semibold tabular-nums">
                      {s.value}
                    </span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {totalTitles > 0 ? (
            <div className="mt-4 space-y-1.5">
              <div className="flex items-center justify-between text-[11px] text-muted-foreground">
                <span>Movies {moviePct}%</span>
                <span>TV / Anime {100 - moviePct}%</span>
              </div>
              <div className="flex h-2 w-full overflow-hidden rounded-full bg-muted">
                <div
                  className="h-full rounded-full transition-all"
                  style={{ width: `${moviePct}%`, backgroundColor: BLUE }}
                />
                <div
                  className="h-full flex-1"
                  style={{ backgroundColor: TEAL }}
                />
              </div>
            </div>
          ) : null}
        </div>
      </div>
    </div>
  );
}

function AreaChart({ values, labels }: { values: number[]; labels: string[] }) {
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
              <stop offset="0%" stopColor="var(--primary)" stopOpacity="0.45" />
              <stop offset="100%" stopColor="var(--primary)" stopOpacity="0" />
            </linearGradient>
            <linearGradient id="areaStroke" x1="0" y1="0" x2="1" y2="0">
              <stop offset="0%" stopColor="var(--primary)" />
              <stop offset="100%" stopColor="var(--chart-2)" />
            </linearGradient>
          </defs>

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
            stroke="url(#areaStroke)"
            strokeWidth="2.5"
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
              stroke="var(--primary)"
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
  display,
}: {
  segments: { label: string; value: number; color: string }[];
  /** Drives the ring geometry (sum of segment values). */
  total: number;
  /** Number shown in the center; defaults to `total`. */
  display?: number;
}) {
  const r = 38;
  const c = 2 * Math.PI * r;

  const arcs = segments.reduce(
    (acc, s) => {
      const len = total ? (s.value / total) * c : 0;
      acc.items.push({ label: s.label, color: s.color, len, offset: acc.acc });
      acc.acc += len;
      return acc;
    },
    {
      acc: 0,
      items: [] as {
        label: string;
        color: string;
        len: number;
        offset: number;
      }[],
    },
  ).items;

  return (
    <div className="relative size-28 shrink-0">
      <svg viewBox="0 0 100 100" className="size-full -rotate-90">
        <circle
          cx="50"
          cy="50"
          r={r}
          fill="none"
          stroke="var(--muted)"
          strokeWidth="12"
        />
        {arcs.map((s) => (
          <circle
            key={s.label}
            cx="50"
            cy="50"
            r={r}
            fill="none"
            stroke={s.color}
            strokeWidth="12"
            strokeLinecap="round"
            strokeDasharray={`${s.len} ${c - s.len}`}
            strokeDashoffset={-s.offset}
          />
        ))}
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <span className="text-xl font-bold tabular-nums leading-none">
          {display ?? total}
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
      light up here.
    </p>
  );
}
