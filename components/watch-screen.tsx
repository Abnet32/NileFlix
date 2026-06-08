import { buttonVariants } from "@/components/ui/button";
import VideoPlayer from "@/components/view-movie";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";

type WatchScreenProps = {
  id: string;
  title: string;
  contentType?: "movie" | "tv";
  seasonNumber?: string;
  episodeNumber?: string;
  /** Where the "Back" button goes. */
  backHref: string;
};

export default function WatchScreen({
  id,
  title,
  contentType,
  seasonNumber,
  episodeNumber,
  backHref,
}: WatchScreenProps) {
  return (
    <main className="min-h-dvh bg-background text-foreground">
      <div className="mx-auto flex min-h-dvh w-full max-w-6xl flex-col gap-3 px-3 py-3 sm:gap-4 sm:px-6 sm:py-6 lg:px-8 lg:py-8">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between sm:gap-4">
          <div className="min-w-0 space-y-1">
            <p className="text-[10px] uppercase tracking-[0.35em] text-muted-foreground">
              Now playing
            </p>
            <h1 className="truncate font-heading text-xl font-medium sm:text-3xl lg:text-4xl">
              {title}
            </h1>
          </div>

          <Link
            href={backHref}
            className={
              buttonVariants({ size: "sm" }) +
              " w-full justify-center sm:w-auto"
            }
          >
            <ArrowLeft />
            Back
          </Link>
        </div>

        <div className="min-h-0 flex-1">
          <VideoPlayer
            id={id}
            title={title}
            contentType={contentType}
            seasonNumber={seasonNumber}
            episodeNumber={episodeNumber}
          />
        </div>
      </div>
    </main>
  );
}
