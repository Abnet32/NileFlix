import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import ActionButtons from "@/components/action-buttons";
import { getMovie, getMovieVideos, getTrailerVideo } from "@/lib/tmdb";
import Image from "next/image";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { formatRuntime } from "@/lib/utils";

type MoviePageProps = {
  params: Promise<{ id: string }>;
};

export default async function MoviePage({ params }: MoviePageProps) {
  const { id } = await params;
  const [movie, videos] = await Promise.all([getMovie(id), getMovieVideos(id)]);
  const trailer = getTrailerVideo(videos.results);

  return (
    <main className="container mx-auto px-4 py-10">
      <div className="flex justify-end mb-4">
        <Button variant="ghost" size="sm">
          <Link href="/" className="flex items-center gap-2">
            <ArrowLeft className="size-4" />
            Back
          </Link>
        </Button>
      </div>
      <section className="grid gap-8 lg:grid-cols-[minmax(0,0.9fr)_minmax(0,1.1fr)] lg:items-center">
        <div className="overflow-hidden border border-foreground/10 bg-card shadow-2xl shadow-black/10">
          <div className="relative aspect-2/3 sm:aspect-4/5 lg:aspect-5/6">
            {movie.poster_path ? (
              <Image
                src={`https://image.tmdb.org/t/p/w780${movie.poster_path}`}
                alt={movie.title}
                fill
                className="object-cover"
                priority
              />
            ) : (
              <div className="flex h-full w-full items-center justify-center bg-linear-to-br from-muted via-background to-muted text-xs uppercase tracking-[0.35em] text-muted-foreground">
                No poster
              </div>
            )}
          </div>
        </div>

        <div className="flex flex-col gap-6">
          <div className="space-y-3">
            <Badge variant="secondary">
              {movie.vote_average.toFixed(1)} ⭐
            </Badge>
            <h1 className="font-heading text-3xl font-medium text-balance sm:text-5xl">
              {movie.title}
            </h1>
            <p className="text-sm text-muted-foreground sm:text-base">
              {movie.release_date || "Release date unavailable"}
              {movie.runtime ? ` • ${formatRuntime(movie.runtime)}` : ""}
            </p>
            <div className="flex flex-wrap gap-2">
              {movie.genres.map((genre) => (
                <Badge key={genre.id} variant="outline">
                  {genre.name}
                </Badge>
              ))}
            </div>
          </div>

          <p className="max-w-2xl text-sm leading-6 text-muted-foreground sm:text-base">
            {movie.overview}
          </p>

          <ActionButtons movieId={movie.id} trailerKey={trailer?.key ?? null} />
        </div>
      </section>
    </main>
  );
}
