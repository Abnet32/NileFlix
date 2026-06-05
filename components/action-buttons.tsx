"use client";

import Link from "next/link";
import { Play, Video } from "lucide-react";
import { buttonVariants } from "@/components/ui/button";

type Props = {
  movieId: number | string;
  trailerKey?: string | null;
  basePath?: string;
};

export default function ActionButtons({
  movieId,
  trailerKey,
  basePath = "/movie",
}: Props) {
  return (
    <div className="flex flex-wrap items-center gap-4 pt-1">
      <Link
        href={`${basePath}/${movieId}/watch`}
        className={
          buttonVariants({ variant: "default", size: "lg" }) +
          " min-w-48 text-center flex items-center justify-center gap-2"
        }
      >
        <Play />
        Play Movie
      </Link>

      {trailerKey ? (
        <a
          href={`https://www.youtube.com/watch?v=${trailerKey}`}
          target="_blank"
          rel="noreferrer"
          className={
            buttonVariants({ variant: "secondary", size: "lg" }) +
            " min-w-48 text-center flex items-center justify-center gap-2"
          }
        >
          <Video />
          Watch Trailer
        </a>
      ) : (
        <Link
          href={`${basePath}/${movieId}`}
          className={
            buttonVariants({ variant: "secondary", size: "lg" }) +
            " min-w-48 text-center flex items-center justify-center gap-2"
          }
        >
          <Video />
          Watch Trailer
        </Link>
      )}
    </div>
  );
}
