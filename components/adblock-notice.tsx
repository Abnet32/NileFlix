"use client";

import { useState } from "react";
import { ShieldCheck, X } from "lucide-react";
import { Button } from "@/components/ui/button";

/**
 * Popup on the watch page recommending an ad blocker. The embedded player is
 * ad-supported, so this nudges users toward a cleaner experience. Shows every
 * time the watch page opens (resets on each mount).
 */
export default function AdblockNotice() {
  const [open, setOpen] = useState(true);

  const dismiss = () => setOpen(false);

  if (!open) return null;

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="adblock-notice-title"
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
    >
      <button
        type="button"
        aria-label="Dismiss"
        onClick={dismiss}
        className="absolute inset-0 bg-black/60 backdrop-blur-sm"
      />

      <div className="relative w-full max-w-sm rounded-xl border border-border bg-card p-6 shadow-2xl">
        <button
          type="button"
          aria-label="Close"
          onClick={dismiss}
          className="absolute right-3 top-3 rounded-sm p-1 text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
        >
          <X className="size-4" />
        </button>

        <div className="flex size-11 items-center justify-center rounded-xl bg-primary/10 text-primary">
          <ShieldCheck className="size-6" />
        </div>

        <h2
          id="adblock-notice-title"
          className="mt-4 text-lg font-semibold tracking-tight"
        >
          For the best experience
        </h2>
        <p className="mt-1.5 text-sm text-muted-foreground">
          This player is ad-supported and may show pop-ups or redirects. Use an
          ad blocker like{" "}
          <a
            href="https://adblockplus.org/"
            target="_blank"
            rel="noopener noreferrer"
            className="font-medium text-primary underline-offset-2 hover:underline"
          >
            Adblock Plus
          </a>{" "}
          for a cleaner, safer experience.
        </p>

        <Button onClick={dismiss} className="mt-5 w-full">
          Got it
        </Button>
      </div>
    </div>
  );
}
