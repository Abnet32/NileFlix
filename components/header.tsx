"use client";

import { ModeToggle } from "@/components/theme-toggle";

export default function Header() {
  return (
    <header className={["w-full"].filter(Boolean).join(" ")}>
      <div className="container mx-auto flex items-center justify-between gap-4 px-4 py-4 sm:py-5">
        <div className="space-y-1">
          <p className="text-[0.7rem] uppercase tracking-[0.45em] text-white/55">
            NileFlix
          </p>
        </div>

        <div className="shrink-0">
          <ModeToggle />
        </div>
      </div>
    </header>
  );
}
