import Link from "next/link";
import {
  ArrowRight,
  Calendar,
  Check,
  Film,
  Play,
  Search,
  Shield,
  Sparkles,
  Star,
  TvMinimalPlay,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { buttonVariants } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { cn } from "@/lib/utils";

const perks = [
  {
    title: "4K + HDR Exclusives",
    description:
      "Original productions and restored classics with premium cinema color grades.",
    icon: Film,
  },
  {
    title: "Adaptive Recommendations",
    description:
      "Smart rails learn your mood in real-time and update your queue instantly.",
    icon: Sparkles,
  },
  {
    title: "Watch Everywhere",
    description:
      "Sync progress across phone, tablet, and TV with seamless account sessions.",
    icon: TvMinimalPlay,
  },
];

const movieRail = [
  { title: "Night Horizon", genre: "Action", year: "2026", rating: "9.1" },
  { title: "Eden Protocol", genre: "Sci-Fi", year: "2025", rating: "8.7" },
  {
    title: "The Last Broadcast",
    genre: "Thriller",
    year: "2026",
    rating: "8.9",
  },
  { title: "Coral City", genre: "Drama", year: "2024", rating: "8.5" },
];

const continueWatching = [
  { title: "Black Comet", season: "S2:E4", progress: "68%" },
  { title: "Hidden Empire", season: "S1:E8", progress: "42%" },
  { title: "Etherline", season: "S3:E1", progress: "12%" },
];

const topTen = [
  "Neon Vortex",
  "Crown Of Dust",
  "Warden 12",
  "Afterlight",
  "Silent Delta",
  "Iron Harbor",
  "Rogue Sonata",
  "Mercury Vale",
  "Signal Blue",
  "Skyline Echo",
];

const plans = [
  { name: "Basic", price: "$6.99", detail: "1 screen • HD" },
  { name: "Standard", price: "$12.99", detail: "2 screens • Full HD" },
  { name: "Premium", price: "$17.99", detail: "4 screens • 4K + Dolby" },
];

export default function HomePage() {
  return (
    <main className="cinema-grid min-h-dvh px-4 pb-12 pt-6 md:px-8 md:pt-8">
      <section className="ott-shell grid gap-6">
        <header className="ott-glass stagger-in flex flex-wrap items-center justify-between gap-4 rounded-2xl border border-border/70 px-4 py-3 md:px-6">
          <div className="flex items-center gap-3">
            <div className="flex size-10 items-center justify-center rounded-full bg-primary/20 text-primary">
              <Film className="size-5" />
            </div>
            <div>
              <p className="text-lg font-bold tracking-wide">NileFlix</p>
              <p className="text-xs text-muted-foreground">
                Stream beyond ordinary
              </p>
            </div>
          </div>

          <nav className="hidden items-center gap-5 text-sm text-muted-foreground md:flex">
            <span className="text-foreground">Home</span>
            <span>Movies</span>
            <span>Series</span>
            <span>My List</span>
            <span>Pricing</span>
          </nav>

          <div className="flex items-center gap-2">
            <button
              type="button"
              className="inline-flex size-8 items-center justify-center rounded-lg border border-border/70 bg-secondary text-muted-foreground"
              aria-label="Search"
            >
              <Search className="size-4" />
            </button>
            <Link
              href="/sign-in"
              className={buttonVariants({ variant: "outline" })}
            >
              Sign in
            </Link>
            <Link href="/sign-up" className={buttonVariants()}>
              Start free
            </Link>
          </div>
        </header>

        <div className="hero-glow stagger-in delay-1 overflow-hidden rounded-3xl border border-border/80 bg-(--hero) p-5 md:p-8">
          <header className="mb-10 flex items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="flex size-10 items-center justify-center rounded-full bg-primary/20 text-primary">
                <Film className="size-5" />
              </div>
              <div>
                <p className="text-lg font-bold tracking-wide">NileFlix</p>
                <p className="text-xs text-muted-foreground">
                  Premium streaming
                </p>
              </div>
            </div>

            <Badge
              variant="secondary"
              className="bg-secondary text-secondary-foreground"
            >
              Premieres every Friday
            </Badge>
          </header>

          <div className="grid gap-6 md:grid-cols-[1.2fr_1fr]">
            <div className="space-y-5">
              <Badge
                variant="secondary"
                className="bg-accent text-accent-foreground"
              >
                #1 in Sci-Fi this week
              </Badge>
              <h1 className="max-w-xl text-4xl font-semibold leading-tight md:text-6xl md:leading-[1.02]">
                Watch movies, shows and originals in one dark cinema hub.
              </h1>
              <p className="max-w-xl text-base text-muted-foreground md:text-lg">
                Curated rails, exclusive releases, and binge-worthy series built
                to feel like your personal OTT command center.
              </p>

              <div className="flex flex-wrap gap-3 pt-2">
                <Link
                  href="/sign-up"
                  className={cn(buttonVariants({ size: "lg" }), "gap-2")}
                >
                  Create account
                  <ArrowRight className="size-4" />
                </Link>
                <Link
                  href="/sign-in"
                  className={buttonVariants({
                    variant: "secondary",
                    size: "lg",
                  })}
                >
                  Browse catalog
                </Link>
              </div>
            </div>

            <Card className="ott-poster stagger-in delay-2 border-border/70 bg-card/85">
              <CardHeader>
                <CardTitle className="flex items-center justify-between text-lg">
                  Orbit Legacy
                  <Badge variant="outline" className="bg-background/30">
                    Featured
                  </Badge>
                </CardTitle>
              </CardHeader>
              <CardContent className="flex flex-1 flex-col justify-end gap-3">
                <p className="max-w-xs text-sm text-muted-foreground">
                  A renegade pilot uncovers a buried network beyond Jupiter
                  while factions race to control interstellar memory.
                </p>
                <div className="flex items-center gap-2 text-sm">
                  <Badge className="gap-1">
                    <Star className="size-3.5" />
                    9.2
                  </Badge>
                  <Badge variant="outline">Sci-Fi</Badge>
                  <Badge variant="outline">2h 06m</Badge>
                </div>
                <Link
                  href="/sign-in"
                  className={cn(buttonVariants({ size: "lg" }), "w-fit gap-2")}
                >
                  <Play className="size-4" />
                  Watch trailer
                </Link>
              </CardContent>
            </Card>
          </div>
        </div>

        <section className="grid gap-4 md:grid-cols-3">
          {perks.map((perk, index) => (
            <Card
              key={perk.title}
              className="ott-glass stagger-in border-border/80 bg-card/80 fill-mode-[both]"
              style={{ animationDelay: `${index * 90 + 160}ms` }}
            >
              <CardHeader className="gap-3">
                <div className="flex size-10 items-center justify-center rounded-full bg-secondary text-accent">
                  <perk.icon className="size-4" />
                </div>
                <CardTitle>{perk.title}</CardTitle>
              </CardHeader>
              <CardContent className="text-sm leading-relaxed text-muted-foreground">
                {perk.description}
              </CardContent>
            </Card>
          ))}
        </section>

        <section className="stagger-in delay-3 grid gap-4">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-semibold">Trending this week</h2>
            <Link
              href="/sign-in"
              className={buttonVariants({ variant: "link" })}
            >
              View all
            </Link>
          </div>
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
            {movieRail.map((item) => (
              <article
                key={item.title}
                className="ott-strip rounded-2xl border border-border/70 p-4 transition-transform duration-200 hover:-translate-y-1"
              >
                <div className="mb-12 inline-flex rounded-md bg-background/55 px-2 py-1 text-xs text-muted-foreground">
                  {item.genre}
                </div>
                <p className="text-lg font-semibold">{item.title}</p>
                <p className="mt-1 text-sm text-muted-foreground">
                  {item.year}
                </p>
                <p className="mt-3 inline-flex items-center gap-1 text-sm text-accent">
                  <Star className="size-4 fill-current" />
                  {item.rating}
                </p>
              </article>
            ))}
          </div>
        </section>

        <section className="stagger-in grid gap-4 [animation-delay:360ms]">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-semibold">Continue watching</h2>
            <Link
              href="/sign-in"
              className={buttonVariants({ variant: "link" })}
            >
              Open watchlist
            </Link>
          </div>

          <div className="grid gap-3 md:grid-cols-3">
            {continueWatching.map((item, idx) => (
              <Card
                key={item.title}
                className="ott-glass border-border/80 bg-card/70"
              >
                <CardContent className="space-y-3 pt-4">
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <p className="font-semibold">{item.title}</p>
                      <p className="text-sm text-muted-foreground">
                        {item.season}
                      </p>
                    </div>
                    <Badge variant="outline">#{idx + 1}</Badge>
                  </div>
                  <div>
                    <div className="mb-1 flex justify-between text-xs text-muted-foreground">
                      <span>Progress</span>
                      <span>{item.progress}</span>
                    </div>
                    <div className="h-2 rounded-full bg-secondary">
                      <div
                        className="h-2 rounded-full bg-primary"
                        style={{ width: item.progress }}
                      />
                    </div>
                  </div>
                  <Link
                    href="/sign-in"
                    className={cn(
                      buttonVariants({ size: "sm" }),
                      "w-fit gap-2",
                    )}
                  >
                    <Play className="size-3.5" />
                    Resume
                  </Link>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>

        <section className="stagger-in grid gap-4 [animation-delay:420ms]">
          <h2 className="text-xl font-semibold">Top 10 on NileFlix today</h2>
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-5">
            {topTen.map((title, idx) => (
              <article
                key={title}
                className="ott-strip rounded-2xl border border-border/70 p-4 transition-all duration-200 hover:-translate-y-1 hover:border-accent/70"
              >
                <p className="text-3xl font-bold leading-none text-accent/80">
                  {idx + 1}
                </p>
                <p className="mt-6 text-sm font-medium">{title}</p>
                <p className="mt-1 text-xs text-muted-foreground">
                  New episode weekly
                </p>
              </article>
            ))}
          </div>
        </section>

        <section className="stagger-in grid gap-4 md:grid-cols-[1.1fr_1fr] [animation-delay:480ms]">
          <Card className="ott-glass border-border/80 bg-card/75">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-lg">
                <Calendar className="size-4 text-accent" />
                Upcoming Premieres
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="rounded-xl border border-border/70 bg-background/35 p-3">
                <p className="font-medium">Ghostline: Season 3</p>
                <p className="text-sm text-muted-foreground">
                  Apr 21 • 8 Episodes
                </p>
              </div>
              <div className="rounded-xl border border-border/70 bg-background/35 p-3">
                <p className="font-medium">The Atlas Room</p>
                <p className="text-sm text-muted-foreground">
                  May 03 • Feature Film
                </p>
              </div>
              <div className="rounded-xl border border-border/70 bg-background/35 p-3">
                <p className="font-medium">Shadow Runner</p>
                <p className="text-sm text-muted-foreground">
                  May 10 • Weekly Release
                </p>
              </div>
            </CardContent>
          </Card>

          <Card className="ott-glass border-border/80 bg-card/75">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-lg">
                <Shield className="size-4 text-accent" />
                Why viewers choose us
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-2 text-sm text-muted-foreground">
              <p className="inline-flex items-center gap-2">
                <Check className="size-4 text-accent" />
                Ad-free premium plans with 4K playback.
              </p>
              <p className="inline-flex items-center gap-2">
                <Check className="size-4 text-accent" />
                Personalized profiles and parental controls.
              </p>
              <p className="inline-flex items-center gap-2">
                <Check className="size-4 text-accent" />
                Downloads, cross-device sync, and watch parties.
              </p>
            </CardContent>
          </Card>
        </section>

        <section className="stagger-in grid gap-4 [animation-delay:540ms]">
          <h2 className="text-xl font-semibold">Choose your plan</h2>
          <div className="grid gap-4 md:grid-cols-3">
            {plans.map((plan, idx) => (
              <Card
                key={plan.name}
                className={cn(
                  "border-border/80 bg-card/85",
                  idx === 1 && "hero-glow border-accent/60",
                )}
              >
                <CardHeader>
                  <CardTitle className="flex items-center justify-between text-lg">
                    {plan.name}
                    {idx === 1 ? <Badge>Popular</Badge> : null}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-2xl font-semibold">{plan.price}</p>
                  <p className="mt-1 text-sm text-muted-foreground">
                    {plan.detail}
                  </p>
                  <Link
                    href="/sign-up"
                    className={cn(
                      buttonVariants({
                        variant: idx === 1 ? "default" : "outline",
                      }),
                      "mt-4 w-full",
                    )}
                  >
                    Get started
                  </Link>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>

        <section className="glass-panel stagger-in rounded-2xl border border-border/70 px-5 py-4 text-center [animation-delay:340ms]">
          <p className="text-sm text-muted-foreground">
            Ready to start your watchlist?
          </p>
          <div className="mt-3 flex justify-center gap-3">
            <Link href="/sign-up" className={buttonVariants()}>
              Join NileFlix
            </Link>
            <Link
              href="/sign-in"
              className={buttonVariants({ variant: "outline" })}
            >
              Sign in
            </Link>
          </div>
        </section>
      </section>
    </main>
  );
}
