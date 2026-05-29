import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import Image from "next/image";
import Link from "next/link";
import { TMDBMovie } from "@/lib/tmdb";

type MovieCardProps = {
  movie: TMDBMovie;
};

export default function MovieCard({ movie }: MovieCardProps) {
  const imagePath = movie.poster_path ?? movie.backdrop_path;
  const releaseYear = movie.release_date
    ? new Date(movie.release_date).getFullYear()
    : null;

  return (
    <Link href={`/movie/${movie.id}`} className="block group">
      <Card className="mx-auto h-full w-full overflow-hidden shadow-lg transition-transform duration-200 hover:-translate-y-1 hover:shadow-2xl">
        <div className="relative aspect-2/3 w-full overflow-hidden">
          {imagePath ? (
            <Image
              src={`https://image.tmdb.org/t/p/w342${imagePath}`}
              alt={movie.title}
              fill
              className="object-cover"
              sizes="(max-width: 640px) 40vw, (max-width: 1024px) 22vw, 16vw"
            />
          ) : (
            <div className="flex h-full w-full items-center justify-center bg-linear-to-br from-muted via-background to-muted px-3 text-center text-[10px] uppercase tracking-[0.3em] text-muted-foreground sm:text-xs">
              No artwork
            </div>
          )}

          <div className="absolute inset-0 bg-linear-to-t from-black/90 via-black/30 to-transparent opacity-100 transition-opacity duration-200 sm:opacity-0 sm:group-hover:opacity-100" />
          <div className="absolute left-2 top-2 sm:left-3 sm:top-3">
            <Badge
              variant="secondary"
              className="px-2 py-1 text-[10px] sm:text-xs"
            >
              {movie.vote_average.toFixed(1)} ⭐
            </Badge>
          </div>
          <div className="absolute inset-x-0 bottom-0 p-2 sm:p-3">
            <div className="space-y-1 text-white">
              <h3 className="line-clamp-2 text-sm font-semibold leading-tight sm:text-base sm:font-bold lg:text-lg">
                {movie.title}
              </h3>
              {releaseYear ? (
                <p className="text-[11px] font-medium text-white/85 sm:text-sm">
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
