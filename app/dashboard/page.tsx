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

const quickLinks = [
  { label: "Trending", href: "/dashboard/discover/trending", icon: Flame },
  { label: "Popular", href: "/dashboard/discover/popular", icon: Compass },
  { label: "Top Rated", href: "/dashboard/discover/top-rated", icon: Star },
  { label: "TV Shows", href: "/dashboard/tv-shows/popular", icon: Tv },
  { label: "Favorites", href: "/dashboard/favorites", icon: Heart },
  { label: "Watchlist", href: "/dashboard/watchlist", icon: Bookmark },
];

export default async function DashboardPage() {
  return (
    <main className="flex-1 space-y-6 px-3 py-4 sm:px-5">
      {/* Greeting */}
      <header className="space-y-0.5">
        <h1 className="text-xl font-heading font-bold tracking-tight">
          Welcome back
        </h1>
        <p className="text-sm text-muted-foreground">
          Here&apos;s an overview of your library and viewing stats.
        </p>
      </header>

      {/* Overview stats, graphs, insights */}
      <DashboardOverview />

      {/* Continue watching (hides itself when empty) */}
      <ContinueWatchingRow />

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
