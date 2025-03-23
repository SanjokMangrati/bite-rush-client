"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { PermissionEnum } from "@/lib/types/user.types";
import type { AddItemToCartPayload, OrderItem } from "@/lib/types/order.types";
import CartItem from "@/components/cart/CartItem";
import LoadingSpinner from "@/components/ui/loading-spinner";
import { ShoppingBag } from "lucide-react";
import { useAuth } from "@/lib/context/auth.context";
import { useOrder } from "@/lib/context/order.context";
import { usePermission } from "@/lib/hooks/usePermission.hook";
import Container from "@/components/layout/Container";
import { toast } from "sonner";

export default function CartPage() {
  const {
    currentOrder,
    isLoading,
    checkout,
    decreaseItem,
    removeOrderItem,
    addItem,
  } = useOrder();
  const { isAuthenticated, isLoading: isAuthenticating } = useAuth();
  const { hasPermission } = usePermission();
  const router = useRouter();
  const [isCheckingOut, setIsCheckingOut] = useState(false);

  const canPlaceOrder = hasPermission(PermissionEnum.PLACE_ORDER);

  useEffect(() => {
    if (!isAuthenticated && !isAuthenticating) {
      router.push("/login");
    }
  }, [isAuthenticated, router]);

  const handleUpdateQuantity = async (itemId: string, newQuantity: number) => {
    if (!currentOrder?.orderItems) return;
    const orderItem = currentOrder.orderItems.find(
      (item) => item.id === itemId,
    );
    if (!orderItem) return;

    const diff = newQuantity - orderItem.quantity;

    if (diff < 0) {
      await decreaseItem(
        currentOrder.id,
        orderItem.menuItem?.id,
        Math.abs(diff),
      );
    } else if (diff > 0) {
      const payload: AddItemToCartPayload = {
        restaurantId: currentOrder?.restaurant?.id,
        menuItemId: orderItem.menuItem?.id,
        quantity: diff,
      };
      await addItem(payload);
    }
  };

  const handleRemoveItem = async (itemId: string) => {
    if (!currentOrder?.orderItems) return;
    const orderItem = currentOrder.orderItems.find(
      (item) => item.id === itemId,
    );
    if (!orderItem) return;
    await removeOrderItem(currentOrder.id, orderItem.menuItem.id);
  };

  const handleCheckout = async () => {
    if (!currentOrder || !currentOrder.id) {
      return;
    }
    try {
      setIsCheckingOut(true);
      await checkout(currentOrder.id);
      toast.success("Successfully placed order");
      router.push("/dashboard");
    } catch (error: any) {
      toast.error(error.message || "Failed to checkout order");
    } finally {
      setIsCheckingOut(false);
    }
  };

  if (!isAuthenticated && !isAuthenticating) {
    return null;
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

  if (
    !currentOrder ||
    !currentOrder?.orderItems ||
    currentOrder?.orderItems.length === 0
  ) {
    return (
      <Container>
        <div className="container py-8 text-center">
          <div className="flex flex-col items-center justify-center gap-4">
            <ShoppingBag className="h-16 w-16 text-muted-foreground" />
            <h1 className="text-2xl font-bold">Your Cart is Empty</h1>
            <p className="text-muted-foreground mb-4">
              Add some delicious items to your cart!
            </p>
            <Link href="/restaurants">
              <Button>Browse Restaurants</Button>
            </Link>
          </div>
        </div>
      </Container>
    );
  }

  return (
    <Container>
      <div className="container py-8">
        <h1 className="text-3xl font-bold mb-6">Your Cart</h1>

        <div className="grid gap-6 md:grid-cols-3">
          <div className="md:col-span-2">
            <Card>
              <CardHeader>
                <CardTitle>
                  Items from {currentOrder?.restaurant?.name}
                </CardTitle>
              </CardHeader>
              <CardContent>
                {currentOrder.orderItems.map((item: OrderItem) => (
                  <CartItem
                    key={item.id}
                    item={item}
                    onUpdateQuantity={handleUpdateQuantity}
                    onRemoveItem={handleRemoveItem}
                  />
                ))}
              </CardContent>
            </Card>
          </div>

          <div>
            <Card>
              <CardHeader>
                <CardTitle>Order Summary</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  {currentOrder.orderItems.map((item: OrderItem) => (
                    <div key={item.id} className="flex justify-between">
                      <span>
                        {item.quantity} x {item.menuItem.name}
                      </span>
                      <span>
                        $
                        {(Number(item.price_at_order) * item.quantity).toFixed(
                          2,
                        )}
                      </span>
                    </div>
                  ))}
                  <div className="border-t pt-2 mt-4">
                    <div className="flex justify-between font-bold">
                      <span>Total</span>
                      <span>
                        ${Number(currentOrder.total_amount).toFixed(2)}
                      </span>
                    </div>
                  </div>
                </div>
              </CardContent>
              <CardFooter>
                <Button
                  className="w-full"
                  onClick={handleCheckout}
                  disabled={
                    isCheckingOut ||
                    !canPlaceOrder ||
                    currentOrder.status !== "CART"
                  }
                >
                  {isCheckingOut ? <LoadingSpinner size="small" /> : "Checkout"}
                </Button>
              </CardFooter>
            </Card>
          </div>
        </div>
      </div>
    </Container>
  );
}
