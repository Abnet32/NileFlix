"use client";

import { useRouter, usePathname } from "next/navigation";
import { ChevronDown } from "lucide-react";

const SORT_OPTIONS = [
  { label: "Popularity", value: "popularity.desc" },
  { label: "Top Rated", value: "vote_average.desc" },
  { label: "Release Date", value: "release_date.desc" },
  { label: "Box Office", value: "revenue.desc" },
];

export default function GenreSort({ currentSort }: { currentSort: string }) {
  const router = useRouter();
  const pathname = usePathname();

  const handleSort = (value: string) => {
    router.push(`${pathname}?sort=${value}`);
  };

  return (
    <div className="fixed bottom-6 right-6 z-30">
      <div className="relative">
        <select
          value={currentSort}
          onChange={(e) => handleSort(e.target.value)}
          className="h-10 appearance-none rounded-lg border border-border bg-card/90 pl-3 pr-9 text-sm shadow-lg backdrop-blur outline-none transition-colors focus:border-primary focus:ring-1 focus:ring-primary/30"
          aria-label="Sort order"
        >
          {SORT_OPTIONS.map((opt) => (
            <option key={opt.value} value={opt.value}>
              {opt.label}
            </option>
          ))}
        </select>
        <ChevronDown className="pointer-events-none absolute right-2.5 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
      </div>
    </div>
  );
}
