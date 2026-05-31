"use client";

import { ModeToggle } from "@/components/theme-toggle";
import Link from "next/link";
import { Film, TvMinimalPlay, UserRound } from "lucide-react";

import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";

const navItems = [
  {
    label: "Movie",
    href: "#movies",
    icon: Film,
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
      <div className="mx-auto flex  items-center gap-3 px-4 py-4 backdrop-blur-xl sm:px-6 lg:px-8">
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

        <div className="ml-auto flex items-center gap-2">
          <ModeToggle />
          <Link
            href="/sign-in"
            className={cn(
              buttonVariants({ variant: "default", size: "sm" }),
              "bg-primary px-4 text-primary-foreground shadow-lg shadow-black/15 transition-transform duration-300 hover:-translate-y-0.5 hover:bg-white/90",
            )}
          >
            <UserRound className="size-4" aria-hidden="true" />
            Sign in
          </Link>
        </div>
      </div>
    </header>
  );
}
