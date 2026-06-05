"use client";

import { useEffect, useState } from "react";
import MediaGrid from "@/components/media-grid";
import {
  itemToMovie,
  readList,
  type MediaListItem,
  type MediaListKey,
} from "@/lib/media-lists";

type SavedMediaGridProps = {
  listKey: MediaListKey;
  title: string;
  description?: string;
  emptyText: string;
};

/**
 * Client wrapper that reads a localStorage media list and renders it through
 * MediaGrid. Re-reads when the list changes (same-tab custom event + cross-tab
 * storage event).
 */
export default function SavedMediaGrid({
  listKey,
  title,
  description,
  emptyText,
}: SavedMediaGridProps) {
  const [items, setItems] = useState<MediaListItem[] | null>(null);

  useEffect(() => {
    const refresh = () => setItems(readList(listKey));
    refresh();

    const onCustom = (e: Event) => {
      if ((e as CustomEvent).detail === listKey) refresh();
    };
    const onStorage = (e: StorageEvent) => {
      if (e.key === listKey) refresh();
    };

    window.addEventListener("nileflix:lists", onCustom);
    window.addEventListener("storage", onStorage);
    return () => {
      window.removeEventListener("nileflix:lists", onCustom);
      window.removeEventListener("storage", onStorage);
    };
  }, [listKey]);

  // Avoid hydration mismatch: render nothing until mounted.
  if (items === null) {
    return (
      <main className="flex-1 px-4 py-6 sm:px-6">
        <h1 className="text-2xl font-semibold tracking-tight sm:text-3xl">
          {title}
        </h1>
      </main>
    );
  }

  if (items.length === 0) {
    return (
      <main className="flex-1 px-4 py-6 sm:px-6">
        <header className="mb-5 space-y-1">
          <h1 className="text-2xl font-semibold tracking-tight sm:text-3xl">
            {title}
          </h1>
          {description ? (
            <p className="text-sm text-muted-foreground">{description}</p>
          ) : null}
        </header>
        <p className="text-sm text-muted-foreground">{emptyText}</p>
      </main>
    );
  }

  return (
    <MediaGrid
      title={title}
      description={description}
      items={items.map(itemToMovie)}
      hrefPrefix="/dashboard"
    />
  );
}
