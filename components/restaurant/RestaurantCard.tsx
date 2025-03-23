import Link from "next/link";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import type { Restaurant } from "@/lib/types/restaurant.types";

interface RestaurantCardProps {
  restaurant: Restaurant;
}

export default function RestaurantCard({ restaurant }: RestaurantCardProps) {
  return (
    <Card className="h-full flex flex-col">
      <CardHeader>
        <CardTitle>{restaurant.name}</CardTitle>
        <CardDescription>{restaurant.country.name}</CardDescription>
      </CardHeader>
      <CardContent className="flex-grow">
        <img src={restaurant.image_url} alt={`${restaurant.name} image`} />
        <p className="text-sm text-muted-foreground">
          {restaurant.description}
        </p>
        <p className="text-sm mt-2">{restaurant.address}</p>
      </CardContent>
      <CardFooter>
        <Link href={`/restaurants/${restaurant.id}`} className="w-full">
          <Button className="w-full">View Menu</Button>
        </Link>
      </CardFooter>
    </Card>
  );
}
