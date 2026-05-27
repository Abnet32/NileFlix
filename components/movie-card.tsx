import { Badge } from "@/components/ui/badge";
import { buttonVariants } from "@/components/ui/button";
import {
  Card,
  CardAction,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import Image from "next/image";
import Link from "next/link";
import { Play } from "lucide-react";
import { TMDBMovie } from "@/lib/tmdb";

type MovieCardProps = {
  movie: TMDBMovie;
};

export default function MovieCard({ movie }: MovieCardProps) {
  return (
    <Card className="mx-auto w-full max-w-sm pt-0">
      <div className="relative aspect-video w-full overflow-hidden">
        {movie.backdrop_path ? (
          <Image
            src={`https://image.tmdb.org/t/p/w780${movie.backdrop_path}`}
            alt={movie.title}
            fill
            className="object-cover"
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center bg-linear-to-br from-muted via-background to-muted text-xs uppercase tracking-[0.35em] text-muted-foreground">
            No artwork
          </div>
        )}
      </div>
      <CardHeader>
        <CardAction>
          <Badge variant="secondary">{movie.vote_average.toFixed(1)} ⭐</Badge>
        </CardAction>
        <CardTitle>{movie.title}</CardTitle>
        <CardDescription>
          {movie.overview.length > 140
            ? `${movie.overview.slice(0, 140)}...`
            : movie.overview}
        </CardDescription>
      </CardHeader>
      <CardFooter>
        <div className="grid w-full grid-cols-2 gap-2">
          <Link
            href={`/movie/${movie.id}`}
            className={buttonVariants({ variant: "outline" })}
          >
            Details
          </Link>
          <Link
            href={`/movie/${movie.id}/watch`}
            className={buttonVariants({ variant: "default" })}
          >
            <Play />
            Play
          </Link>
        </div>
      </CardFooter>
    </Card>
  );
}
