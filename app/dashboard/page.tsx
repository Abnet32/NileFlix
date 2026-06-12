import Link from "next/link";
import { headers } from "next/headers";
import {
  Bookmark,
  Compass,
  Drama,
  Flame,
  Heart,
  Star,
  Tv,
} from "lucide-react";
import DashboardOverview from "@/components/dashboard-overview";
import DashboardGreeting from "@/components/dashboard-greeting";
import ContinueWatchingRow from "@/components/continue-watching-row";
import { auth } from "@/lib/auth";

const quickLinks = [
  { label: "Trending", href: "/dashboard/discover/trending", icon: Flame },
  { label: "Popular", href: "/dashboard/discover/popular", icon: Compass },
  { label: "Top Rated", href: "/dashboard/discover/top-rated", icon: Star },
  { label: "TV Shows", href: "/dashboard/tv-shows/popular", icon: Tv },
  { label: "Anime", href: "/dashboard/animes/popular", icon: Drama },
  { label: "Favorites", href: "/dashboard/favorites", icon: Heart },
  { label: "Watchlist", href: "/dashboard/watchlist", icon: Bookmark },
];

export default async function DashboardPage() {
  const session = await auth.api.getSession({ headers: await headers() });
  const name = session?.user?.name?.trim() || "there";

  return (
    <main className="flex-1 space-y-6 px-3 py-4 sm:px-5">
      {/* Greeting */}
      <DashboardGreeting name={name} />

      {/* Overview stats */}
      <DashboardOverview />

      {/* Quick browse */}
      <section className="space-y-3">
        <h2 className="px-2 text-xs uppercase tracking-[0.3em] text-muted-foreground">
          Browse
        </h2>
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-7">
          {quickLinks.map(({ label, href, icon: Icon }) => (
            <Link
              key={href}
              href={href}
              className="flex items-center gap-2 rounded-sm  bg-card px-4 py-3 text-sm font-medium ring-1 ring-foreground/5 transition-colors hover:border-border hover:bg-muted"
            >
              <Icon className="size-4 text-primary" />
              {label}
            </Link>
          ))}
        </div>
      </section>

      {/* Continue watching (hides itself when empty) */}
      <ContinueWatchingRow />
    </main>
  );
}
