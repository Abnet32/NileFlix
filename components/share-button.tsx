"use client";

import { useState } from "react";
import { Share2, Check } from "lucide-react";
import { cn } from "@/lib/utils";

type ShareButtonProps = {
  title: string;
  url?: string;
  className?: string;
};

export default function ShareButton({ title, url, className }: ShareButtonProps) {
  const [copied, setCopied] = useState(false);

  const handleShare = async () => {
    const shareUrl = url ?? (typeof window !== "undefined" ? window.location.href : "");
    const shareData = { title, url: shareUrl };

    try {
      if (navigator.share) {
        await navigator.share(shareData);
      } else {
        await navigator.clipboard.writeText(shareUrl);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
      }
    } catch {
      // Fallback: copy to clipboard
      try {
        await navigator.clipboard.writeText(shareUrl);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
      } catch {
        // Ignore if clipboard also fails
      }
    }
  };

  return (
    <button
      type="button"
      onClick={handleShare}
      className={cn(
        "inline-flex items-center gap-2 rounded-lg border border-border bg-background px-4 py-2 text-sm font-medium transition-all duration-200 hover:bg-muted active:scale-95",
        className,
      )}
      aria-label="Share"
    >
      {copied ? (
        <>
          <Check className="size-4 text-green-500" />
          Copied!
        </>
      ) : (
        <>
          <Share2 className="size-4" />
          Share
        </>
      )}
    </button>
  );
}
