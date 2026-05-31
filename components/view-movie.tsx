"use client";

import { useEffect } from "react";

type VideoPlayerProps = {
  id: string;
  title: string;
  contentType?: "movie" | "tv";
  seasonNumber?: string;
  episodeNumber?: string;
  primaryColor?: string;
  secondaryColor?: string;
  iconColor?: string;
  autoplay?: boolean;
  poster?: boolean;
  showTitle?: boolean;
  nextButton?: boolean;
  player?: "default" | "jw";
  className?: string;
};

function buildVidlinkSrc({
  id,
  seasonNumber,
  episodeNumber,
  primaryColor,
  secondaryColor,
  iconColor,
  autoplay = false,
  poster = true,
  showTitle = false,
  nextButton = false,
  player = "default",
  contentType = "movie",
}: VideoPlayerProps) {
  const params = new URLSearchParams();

  params.set("primaryColor", primaryColor ?? "63b8bc");
  params.set("secondaryColor", secondaryColor ?? "a2a2a2");
  params.set("iconColor", iconColor ?? "eefdec");
  params.set("icons", "default");
  params.set("player", player);
  params.set("title", String(showTitle));
  params.set("poster", String(poster));
  params.set("autoplay", String(autoplay));
  params.set("nextbutton", String(nextButton));

  const mediaPath =
    contentType === "tv"
      ? `tv/${id}/${seasonNumber ?? 1}/${episodeNumber ?? 1}`
      : `${contentType}/${id}`;

  return `https://vidlink.pro/${mediaPath}?${params.toString()}`;
}

export default function VideoPlayer({
  id,
  title,
  contentType,
  seasonNumber,
  episodeNumber,
}: VideoPlayerProps) {
  useEffect(() => {
    const handleMessage = (event: MessageEvent) => {
      if (event.origin !== "https://vidlink.pro") return;

      if (event.data?.type === "MEDIA_DATA") {
        localStorage.setItem(
          "vidLinkProgress",
          JSON.stringify(event.data.data),
        );
      }
    };

    window.addEventListener("message", handleMessage);

    return () => window.removeEventListener("message", handleMessage);
  }, []);

  return (
    <div className="mx-auto w-full max-w-6xl overflow-hidden border border-white/10 bg-zinc-950 shadow-2xl shadow-black/40">
      <div className="relative aspect-video w-full bg-black">
        <iframe
          title={`${title} player`}
          src={buildVidlinkSrc({
            id,
            title,
            contentType,
            seasonNumber,
            episodeNumber,
          })}
          className="absolute inset-0 h-full w-full border-0 transition-opacity duration-200 ease-out"
          allow="autoplay; fullscreen; picture-in-picture"
          loading="eager"
        />
      </div>
    </div>
  );
}
