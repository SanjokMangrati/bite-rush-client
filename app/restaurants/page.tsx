"use client";

import { useEffect, useState } from "react";
import type { Restaurant } from "@/lib/types/restaurant.types";
import RestaurantCard from "@/components/restaurant/RestaurantCard";
import LoadingSpinner from "@/components/ui/loading-spinner";
import { PermissionEnum } from "@/lib/types/user.types";
import { useAuth } from "@/lib/context/auth.context";
import { usePermission } from "@/lib/hooks/usePermission.hook";
import { getRestaurants } from "@/lib/api/restaurant.api";
import Container from "@/components/layout/Container";
import { useRouter } from "next/navigation";

export default function RestaurantsPage() {
  const {
    accessToken,
    refreshAccessToken: refreshAuthToken,
    isAuthenticated,
    isLoading: isAuthenticating,
  } = useAuth();
  const { hasPermission } = usePermission();
  const [restaurants, setRestaurants] = useState<Restaurant[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  useEffect(() => {
    if (!isAuthenticated && !isAuthenticating) {
      router.push("/login");
    }
  }, [isAuthenticated, router]);

  useEffect(() => {
    const fetchRestaurants = async () => {
      if (!accessToken) return;

      try {
        setIsLoading(true);
        const data = await getRestaurants(accessToken);
        setRestaurants(data);
      } catch (err) {
        console.error("Failed to fetch restaurants:", err);

        if (err instanceof Error && err.message.includes("401")) {
          try {
            const newToken = await refreshAuthToken();
            if (newToken) {
              const data = await getRestaurants(newToken);
              setRestaurants(data);
              return;
            }
          } catch (refreshErr) {
            console.error("Failed to refresh token:", refreshErr);
          }
        }

        setError("Failed to load restaurants. Please try again later.");
      } finally {
        setIsLoading(false);
      }
    };

    fetchRestaurants();
  }, [accessToken, refreshAuthToken]);

  if (!isAuthenticated && !isAuthenticating) {
    return null;
  }

  if (!hasPermission(PermissionEnum.VIEW_RESTAURANTS) && !isLoading) {
    return (
      <Container>
        <div className="container py-8 text-center">
          <h1 className="text-2xl font-bold mb-4">Access Denied</h1>
          <p>You don't have permission to view restaurants.</p>
        </div>
      </Container>
    );
  }

  if (isLoading || isAuthenticating) {
    return (
      <Container>
        <div className="container py-8 flex justify-center items-center h-screen">
          <LoadingSpinner size="medium" />
        </div>
      </Container>
    );
  }

  if (error) {
    return (
      <Container>
        <div className="container py-8">
          <div className="p-4 bg-destructive/10 text-destructive rounded-md">
            {error}
          </div>
        </div>
      </Container>
    );
  }

  return (
    <Container>
      <div className="container py-8">
        <h1 className="text-3xl font-bold mb-6">Restaurants</h1>

        {restaurants.length === 0 ? (
          <p className="text-center text-muted-foreground">
            No restaurants found.
          </p>
        ) : (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {restaurants.map((restaurant) => (
              <RestaurantCard key={restaurant.id} restaurant={restaurant} />
            ))}
          </div>
        )}
      </div>
    </Container>
  );
}
