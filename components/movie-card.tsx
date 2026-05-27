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
      <Card className="mx-auto h-full w-full overflow-hidden shadow-lg transition-all duration-200 transform hover:-translate-y-1 hover:shadow-2xl">
        <div className="relative aspect-2/3 w-full overflow-hidden">
          {imagePath ? (
            <Image
              src={`https://image.tmdb.org/t/p/w780${imagePath}`}
              alt={movie.title}
              fill
              className="object-cover"
            />
          ) : (
            <div className="flex h-full w-full items-center justify-center bg-linear-to-br from-muted via-background to-muted text-xs uppercase tracking-[0.35em] text-muted-foreground">
              No artwork
            </div>
          )}

          <div className="absolute inset-0 bg-linear-to-t from-black/80 via-transparent to-transparent opacity-0 transition-opacity duration-200 group-hover:opacity-100" />
          <div className="absolute left-3 top-3">
            <Badge variant="secondary">
              {movie.vote_average.toFixed(1)} ⭐
            </Badge>
          </div>
          <div className="absolute inset-x-0 bottom-0 p-3 opacity-0 transition-opacity duration-200 group-hover:opacity-100">
            <div className="space-y-1">
              <h3 className="text-lg font-bold leading-tight text-white line-clamp-2">
                {movie.title}
              </h3>
              {releaseYear ? (
                <p className="text-sm font-semibold text-white/90">
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
