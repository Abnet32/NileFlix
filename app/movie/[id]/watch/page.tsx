import { buttonVariants } from "@/components/ui/button";
import VideoPlayer from "@/components/view-movie";
import { getMovie } from "@/lib/tmdb";
import Link from "next/link";

type WatchPageProps = {
  params: Promise<{ id: string }>;
};

export default async function WatchPage({ params }: WatchPageProps) {
  const { id } = await params;
  const movie = await getMovie(id);

  return (
    <main className="h-dvh overflow-hidden bg-black text-white">
      <div className="mx-auto flex h-full w-full max-w-5xl flex-col gap-4 p-4 sm:p-6">
        <div className="flex items-start justify-between gap-4">
          <div className="min-w-0">
            <p className="text-[10px] uppercase tracking-[0.35em] text-white/50">
              Now playing
            </p>
            <h1 className="mt-1 truncate font-heading text-xl font-medium sm:text-3xl">
              {movie.title}
            </h1>
          </div>

          <Link
            href={`/movie/${movie.id}`}
            className={buttonVariants({  size: "sm" })}
          >
            Back
          </Link>
        </div>

        <div className="min-h-0 flex-1">
          <VideoPlayer id={movie.id.toString()} title={movie.title} />
        </div>
      </div>
    </main>
  );
}
