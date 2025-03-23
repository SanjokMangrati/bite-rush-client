import Link from "next/link";
import { Button } from "@/components/ui/button";
import Container from "@/components/layout/Container";

export default function Home() {
  return (
    <Container>
      <div className="flex flex-col items-center justify-center min-h-[calc(100vh-4rem)] p-4 text-center">
        <h1 className="text-4xl font-bold tracking-tight sm:text-5xl md:text-6xl">
          <span className="text-primary">Bite</span>Rush
        </h1>
        <p className="mt-4 text-xl text-muted-foreground max-w-md">
          Order delicious food from your favorite restaurants with just a few
          clicks.
        </p>
        <div className="mt-8 flex flex-col sm:flex-row gap-4">
          <Link href="/login">
            <Button size="lg">Get Started</Button>
          </Link>
          <Link href="/restaurants">
            <Button variant="outline" size="lg">
              Browse Restaurants
            </Button>
          </Link>
        </div>
      </div>
    </Container>
  );
}
