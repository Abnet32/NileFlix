"use client";

import { useEffect, useState } from "react";
import { ShieldCheck, X } from "lucide-react";
import { Button } from "@/components/ui/button";

/**
 * Popup on the watch page recommending an ad blocker. The embedded player is
 * ad-supported, so this nudges users toward a cleaner experience.
 *
 * It first checks whether the visitor already runs an ad blocker. Playback is
 * never blocked either way — we only skip the nudge for users who already have
 * one, so the recommendation is shown solely to those who could benefit from it.
 */

/**
 * Best-effort ad-blocker detection. Returns true only when we have a positive
 * signal that a blocker is active; anything uncertain resolves to false so the
 * recommendation still reaches users who almost certainly aren't blocking ads.
 */
async function detectAdBlocker(): Promise<boolean> {
  // Method 1 — bait element. Filter lists hide elements with these class names
  // via cosmetic rules (`display:none !important`), which collapses the box.
  const bait = document.createElement("div");
  bait.className = "ad ads adsbox ad-banner ad-placement pub_300x250";
  bait.style.cssText =
    "position:absolute;left:-9999px;top:-9999px;width:1px;height:1px;";
  document.body.appendChild(bait);

  // Give the extension a tick to apply its cosmetic filtering.
  await new Promise((resolve) => setTimeout(resolve, 120));

  const baitBlocked =
    bait.offsetParent === null ||
    bait.offsetHeight === 0 ||
    window.getComputedStyle(bait).display === "none";

  bait.remove();

  if (baitBlocked) return true;

  // Method 2 — request a script URL that blockers drop via network filters.
  // A successful (opaque) response means no blocker; a thrown error means the
  // request was intercepted.
  try {
    await fetch(
      "https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js",
      { method: "HEAD", mode: "no-cors", cache: "no-store" },
    );
    return false;
  } catch {
    return true;
  }
}

export default function AdblockNotice() {
  // Start hidden: we only reveal the popup once detection confirms the user
  // does NOT have an ad blocker.
  const [open, setOpen] = useState(false);

  useEffect(() => {
    let cancelled = false;

    detectAdBlocker().then((hasBlocker) => {
      if (!cancelled && !hasBlocker) setOpen(true);
    });

    return () => {
      cancelled = true;
    };
  }, []);

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
          This player is ad-supported and may show pop-ups or redirects. You can
          keep watching as-is, but an ad blocker like{" "}
          <a
            href="https://adblockplus.org/"
            target="_blank"
            rel="noopener noreferrer"
            className="font-medium text-primary underline-offset-2 hover:underline"
          >
            Adblock Plus
          </a>{" "}
          gives a cleaner, safer experience.
        </p>

        <Button onClick={dismiss} className="mt-5 w-full">
          Got it
        </Button>
      </div>
    </div>
  );
}
