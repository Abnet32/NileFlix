import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { getContentTitle, getContentYear, type TMDBMovie } from "@/lib/tmdb";
import Image from "next/image";
import Link from "next/link";

type MovieCardProps = {
  movie: TMDBMovie;
  contentType?: "movie" | "tv" | "anime";
  hrefPrefix?: string;
};

export default function MovieCard({
  movie,
  contentType,
  hrefPrefix = "",
}: MovieCardProps) {
  const imagePath = movie.poster_path ?? movie.backdrop_path;
  const releaseYear = getContentYear(movie);
  const title = getContentTitle(movie);
  const resolvedType =
    contentType ?? (movie.media_type === "tv" ? "tv" : "movie");
  const path =
    resolvedType === "tv"
      ? `/tv/${movie.id}`
      : resolvedType === "anime"
        ? `/anime/${movie.id}`
        : `/movie/${movie.id}`;
  const href = `${hrefPrefix}${path}`;
  const typeLabel =
    resolvedType === "tv"
      ? "TV Show"
      : resolvedType === "anime"
        ? "Anime"
        : "Movie";

  return (
    <Link href={href} className="group block">
      <Card className="py-0 mx-auto h-full w-full overflow-hidden rounded-sm shadow-md ring-1 ring-white/10 transition-all duration-300 hover:-translate-y-0.5 hover:scale-[1.015] hover:shadow-xl">
        <div className="relative aspect-2/3 w-full overflow-hidden">
          {imagePath ? (
            <Image
              src={`https://image.tmdb.org/t/p/w342${imagePath}`}
              alt={title}
              fill
              className="object-cover"
              sizes="(max-width: 40px) 40vw, (max-width: 1024px) 22vw, 16vw"
            />
          ) : (
            <div className="flex h-full w-full items-center justify-center bg-linear-to-br from-muted via-background to-muted px-3 text-center text-[10px] uppercase tracking-[0.3em] text-muted-foreground sm:text-xs">
              No artwork
            </div>
          )}

          <div className="absolute inset-0 bg-linear-to-t from-black/95 via-black/40 to-transparent opacity-100 transition-all duration-300 sm:opacity-0 sm:group-hover:opacity-100 sm:group-hover:backdrop-blur-[2px]" />
          <div className="absolute left-1.5 top-1.5 sm:left-2 sm:top-2">
            <Badge
              variant="secondary"
              className="px-1.5 py-0.5 text-[10px] font-semibold"
            >
              {movie.vote_average.toFixed(1)} ⭐
            </Badge>
          </div>
          <div className="absolute right-1.5 top-1.5 sm:right-2 sm:top-2">
            <Badge
              variant="outline"
              className="border-white/20 bg-black/40 px-1.5 py-0.5 text-[10px] font-semibold text-white"
            >
              {typeLabel}
            </Badge>
          </div>
          <div className="absolute inset-x-0 bottom-0 p-2 sm:p-2.5">
            <div className="space-y-0.5 text-white">
              <h3 className="line-clamp-2 text-xs font-semibold leading-tight tracking-tight sm:text-sm">
                {title}
              </h3>
              {releaseYear ? (
                <p className="text-[10px] font-medium text-white/80 sm:text-[11px]">
                  {releaseYear}
                </p>
              ) : null}
            </div>
          </div>
        </div>
      </Card>
    </Link>
  );
}
