import { MenuItem } from "./restaurant.types";

export type OrderStatus = "CART" | "PLACED" | "CANCELLED";

export interface OrderItem {
  id: string;
  menuItem: MenuItem;
  quantity: number;
  price_at_order: number;
}

export interface Order {
  id: string;
  status: OrderStatus;
  total_amount: number;
  restaurant: {
    id: string;
    name: string;
  };
  orderItems?: OrderItem[];
}

export interface AddItemToCartPayload {
  restaurantId: string;
  menuItemId: string;
  quantity: number;
}
