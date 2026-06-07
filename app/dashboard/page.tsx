import Link from "next/link";
import {
  Bookmark,
  Compass,
  Flame,
  Heart,
  Star,
  Tv,
} from "lucide-react";
import DashboardOverview from "@/components/dashboard-overview";
import ContinueWatchingRow from "@/components/continue-watching-row";
import MovieRow from "@/components/movie-row";
import { getTrendingAll } from "@/lib/tmdb";

const quickLinks = [
  { label: "Trending", href: "/dashboard/discover/trending", icon: Flame },
  { label: "Popular", href: "/dashboard/discover/popular", icon: Compass },
  { label: "Top Rated", href: "/dashboard/discover/top-rated", icon: Star },
  { label: "TV Shows", href: "/dashboard/tv-shows/popular", icon: Tv },
  { label: "Favorites", href: "/dashboard/favorites", icon: Heart },
  { label: "Watchlist", href: "/dashboard/watchlist", icon: Bookmark },
];

export default async function DashboardPage() {
  const trendingAll = await getTrendingAll();
  const trending = trendingAll.results
    .filter((item) => item.media_type === "movie" || item.media_type === "tv")
    .slice(0, 12);

  return (
    <main className="flex-1 space-y-8 px-4 py-6 sm:px-6">
      {/* Greeting */}
      <header className="space-y-1">
        <h1 className="text-2xl font-heading font-bold tracking-tight">
          Welcome back
        </h1>
        <p className="text-sm text-muted-foreground">
          Here&apos;s an overview of your library and what&apos;s trending today.
        </p>
      </header>

      {/* Overview stats, activity graph, insights */}
      <DashboardOverview />

      {/* Continue watching (hides itself when empty) */}
      <ContinueWatchingRow />

      {/* Single compact trending strip */}
      <section className="space-y-1">
        <MovieRow
          title="Trending Now"
          movies={trending}
          hrefPrefix="/dashboard"
          viewAllHref="/dashboard/discover/trending"
        />
      </section>

      {/* Quick browse */}
      <section className="space-y-3">
        <h2 className="px-2 text-xs uppercase tracking-[0.3em] text-muted-foreground">
          Browse
        </h2>
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-6">
          {quickLinks.map(({ label, href, icon: Icon }) => (
            <Link
              key={href}
              href={href}
              className="flex items-center gap-2 rounded-none border border-border/60 bg-card px-4 py-3 text-sm font-medium ring-1 ring-foreground/5 transition-colors hover:border-border hover:bg-muted"
            >
              <Icon className="size-4 text-primary" />
              {label}
            </Link>
          ))}
        </div>
      </section>
    </main>
  );
}
