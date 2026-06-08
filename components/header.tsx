"use client";

import { ModeToggle } from "@/components/theme-toggle";
import Link from "next/link";
import { Film, Menu, TvMinimalPlay, Star, UserRound } from "lucide-react";

import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";

const navItems = [
  {
    label: "Movie",
    href: "#movies",
    icon: Film,
  },
  {
    label: "Anime",
    href: "#anime",
    icon: Star,
  },
  {
    label: "TV Show",
    href: "#tv-shows",
    icon: TvMinimalPlay,
  },
] as const;

export default function Header() {
  return (
    <header className="w-full">
      <div className="mx-auto flex items-center gap-3 px-4 py-4  sm:px-6 lg:px-8">
        <Link href="/" className="group flex items-center gap-3 shrink-0">
          <span className="leading-none text-white">
            <span className="block text-[0.98rem] uppercase tracking-[0.45em] text-white/55">
              NileFlix
            </span>
          </span>
        </Link>

        <nav className="hidden flex-1 items-center justify-center gap-2 md:flex">
          {navItems.map(({ label, href, icon: Icon }) => (
            <Link
              key={label}
              href={href}
              className={cn(
                buttonVariants({ variant: "ghost", size: "sm" }),
                "border border-white/10 bg-white/5 px-4 text-white/80 shadow-sm shadow-black/10 backdrop-blur-sm transition-all duration-300 hover:border-white/20 hover:bg-white/10 hover:text-white",
              )}
            >
              <Icon className="size-4" aria-hidden="true" />
              {label}
            </Link>
          ))}
        </nav>

        <div className="ml-auto hidden items-center gap-2 md:flex">
          <ModeToggle />
          <Link
            href="/sign-in"
            className={cn(
              buttonVariants({ variant: "default", size: "sm" }),
              "bg-primary px-6 py-4 text-primary-foreground shadow-lg shadow-black/15 transition-transform duration-300 hover:-translate-y-0.5 hover:bg-white/90",
            )}
          >
            <UserRound className="size-4" aria-hidden="true" />
            Sign in
          </Link>
        </div>

        <div className="ml-auto flex items-center gap-2 md:hidden">
          <ModeToggle />

          <details className="relative">
            <summary
              className={cn(
                buttonVariants({ variant: "ghost", size: "sm" }),
                "list-none border border-white/10 bg-white/5 px-3 text-white/80 shadow-sm shadow-black/10 backdrop-blur-sm hover:border-white/20 hover:bg-white/10 hover:text-white [&::-webkit-details-marker]:hidden",
              )}
            >
              <Menu className="size-4" aria-hidden="true" />
              Menu
            </summary>

            <div className="absolute right-0 top-full z-50 mt-3 w-38 overflow-hidden border border-white/10 bg-black/95 p-2 shadow-2xl shadow-black/30 backdrop-blur-xl">
              {navItems.map(({ label, href, icon: Icon }) => (
                <Link
                  key={label}
                  href={href}
                  className={cn(
                    buttonVariants({ variant: "ghost", size: "sm" }),
                    "w-full justify-start gap-2 px-3 text-white/85 hover:bg-white/10 hover:text-white",
                  )}
                >
                  <Icon className="size-4" aria-hidden="true" />
                  {label}
                </Link>
              ))}

              <Link
                href="/sign-in"
                className={cn(
                  buttonVariants({ variant: "default", size: "sm" }),
                  "mt-2 w-full justify-start gap-2 px-3",
                )}
              >
                <UserRound className="size-4" aria-hidden="true" />
                Sign in
              </Link>
            </div>
          </details>
        </div>
      </div>
    </header>
  );
}
