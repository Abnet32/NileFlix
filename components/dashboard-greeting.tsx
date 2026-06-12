"use client";

import { useEffect, useState } from "react";
import { Coffee, Moon, Sun, Sunset, type LucideIcon } from "lucide-react";

type Period = { label: string; icon: LucideIcon };

function periodFor(hour: number): Period {
  if (hour >= 5 && hour < 12) return { label: "Good morning", icon: Coffee };
  if (hour >= 12 && hour < 17) return { label: "Good afternoon", icon: Sun };
  if (hour >= 17 && hour < 22) return { label: "Good evening", icon: Sunset };
  return { label: "Good night", icon: Moon };
}

export default function DashboardGreeting({ name }: { name: string }) {
  // Null on the server and first client render to avoid hydration mismatch;
  // filled in (and ticked every second) after mount.
  const [now, setNow] = useState<Date | null>(null);

  useEffect(() => {
    const tick = () => setNow(new Date());
    tick();
    const id = window.setInterval(tick, 1000);
    return () => window.clearInterval(id);
  }, []);

  const { label, icon: Icon } = now ? periodFor(now.getHours()) : periodFor(8);
  const clock = now
    ? now.toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
        second: "2-digit",
      })
    : "--:--:--";

  return (
    <header className="flex items-center gap-3">
      <span className="flex size-11 lg:size-18 shrink-0 items-center justify-center text-primary">
        <Icon className="size-12" />
      </span>
      <div className="min-w-0">
        <h1 className="truncate text-xl font-heading font-bold tracking-tight sm:text-2xl">
          {label}, {name}
        </h1>
        <p
          className="text-sm text-muted-foreground tabular-nums"
          suppressHydrationWarning
        >
          {clock}
        </p>
      </div>
    </header>
  );
}
