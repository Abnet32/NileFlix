import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardAction,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import Image from "next/image";
const MovieCard = async () => {
  // featch movie from tmdb api and display it in the card
  return (
    <Card className="relative mx-auto w-full max-w-sm pt-0">
      <div className="absolute inset-0 z-30 aspect-video bg-black/35" />
      <div className="relative aspect-video w-full overflow-hidden">
        <Image
          src="https://images.unsplash.com/photo-1485846234645-a62644f84728?q=80&w=859&auto=format&fit=crop"
          alt="Event cover"
          fill
          className="object-cover brightness-75 grayscale dark:brightness-50"
        />
      </div>
      <CardHeader>
        <CardAction>
          <Badge variant="secondary">Featured</Badge>
        </CardAction>
        <CardTitle>Design systems meetup</CardTitle>
        <CardDescription>
          A practical talk on component APIs, accessibility, and shipping
          faster.
        </CardDescription>
      </CardHeader>
      <CardFooter>
        <Button className="w-full">View Event</Button>
      </CardFooter>
    </Card>
  );
};

export default MovieCard;
