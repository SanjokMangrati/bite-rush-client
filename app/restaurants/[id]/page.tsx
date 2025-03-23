"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import type { Restaurant } from "@/lib/types/restaurant.types";
import MenuItem from "@/components/restaurant/MenuItem";
import LoadingSpinner from "@/components/ui/loading-spinner";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { PermissionEnum } from "@/lib/types/user.types";
import { useAuth } from "@/lib/context/auth.context";
import { usePermission } from "@/lib/hooks/usePermission.hook";
import { getRestaurant } from "@/lib/api/restaurant.api";
import Container from "@/components/layout/Container";

export default function RestaurantDetailPage() {
  const params = useParams();
  const restaurantId = params.id as string;
  const {
    accessToken,
    refreshAccessToken: refreshAuthToken,
    isAuthenticated,
    isLoading: isAuthenticating,
  } = useAuth();
  const { hasPermission } = usePermission();
  const [restaurant, setRestaurant] = useState<Restaurant | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const router = useRouter();

  useEffect(() => {
    if (!isAuthenticated && !isAuthenticating) {
      router.push("/login");
    }
  }, [isAuthenticated, router]);

  useEffect(() => {
    const fetchRestaurant = async () => {
      if (!accessToken) return;

      try {
        setIsLoading(true);
        const data = await getRestaurant(restaurantId, accessToken);
        setRestaurant(data);
      } catch (err) {
        console.error("Failed to fetch restaurant:", err);

        if (err instanceof Error && err.message.includes("401")) {
          try {
            const newToken = await refreshAuthToken();
            if (newToken) {
              const data = await getRestaurant(restaurantId, newToken);
              setRestaurant(data);
              return;
            }
          } catch (refreshErr) {
            console.error("Failed to refresh token:", refreshErr);
          }
        }

        setError("Failed to load restaurant details. Please try again later.");
      } finally {
        setIsLoading(false);
      }
    };

    fetchRestaurant();
  }, [restaurantId, accessToken, refreshAuthToken]);

  if (!hasPermission(PermissionEnum.VIEW_RESTAURANTS)) {
    return (
      <Container>
        <div className="container py-8 text-center">
          <h1 className="text-2xl font-bold mb-4">Access Denied</h1>
          <p>You don't have permission to view restaurant details.</p>
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

  if (!restaurant) {
    return (
      <Container>
        <div className="container py-8 text-center">
          <h1 className="text-2xl font-bold mb-4">Restaurant Not Found</h1>
          <p>
            The restaurant you're looking for doesn't exist or has been removed.
          </p>
        </div>
      </Container>
    );
  }

  return (
    <Container>
      <div className="container py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold">{restaurant.name}</h1>
          <p className="text-muted-foreground mt-2">{restaurant.description}</p>
          <div className="flex flex-col sm:flex-row gap-4 mt-4">
            <div>
              <span className="font-medium">Address:</span> {restaurant.address}
            </div>
            <div>
              <span className="font-medium">Country:</span>{" "}
              {restaurant.country.name}
            </div>
          </div>
        </div>

        {restaurant.menuCategories && restaurant.menuCategories.length > 0 ? (
          <Tabs defaultValue={restaurant.menuCategories[0].id}>
            <TabsList className="mb-6">
              {restaurant.menuCategories.map((category) => (
                <TabsTrigger key={category.id} value={category.id}>
                  {category.name}
                </TabsTrigger>
              ))}
            </TabsList>

            {restaurant.menuCategories.map((category) => (
              <TabsContent key={category.id} value={category.id}>
                {category.description && (
                  <p className="text-muted-foreground mb-6">
                    {category.description}
                  </p>
                )}

                {category.menuItems && category.menuItems.length > 0 ? (
                  <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                    {category.menuItems.map((menuItem) => (
                      <MenuItem
                        key={menuItem.id}
                        menuItem={menuItem}
                        restaurantId={restaurant.id}
                      />
                    ))}
                  </div>
                ) : (
                  <p className="text-center text-muted-foreground">
                    No items in this category.
                  </p>
                )}
              </TabsContent>
            ))}
          </Tabs>
        ) : (
          <p className="text-center text-muted-foreground">
            No menu categories available.
          </p>
        )}
      </div>
    </Container>
  );
}
