import type { Restaurant } from "../types/restaurant.types";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL;

export async function getRestaurants(token: string): Promise<Restaurant[]> {
  const response = await fetch(`${API_BASE_URL}/restaurants`, {
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.message || "Failed to fetch restaurants");
  }

  return response.json();
}

export async function getRestaurant(
  id: string,
  token: string,
): Promise<Restaurant> {
  const response = await fetch(`${API_BASE_URL}/restaurants/${id}`, {
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.message || "Failed to fetch restaurant");
  }

  return response.json();
}
