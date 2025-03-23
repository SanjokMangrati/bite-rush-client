"use client";

import { useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Plus, Minus } from "lucide-react";
import type { MenuItem as MenuItemType } from "@/lib/types/restaurant.types";
import { PermissionEnum } from "@/lib/types/user.types";
import { useOrder } from "@/lib/context/order.context";
import { usePermission } from "@/lib/hooks/usePermission.hook";
import { toast } from "sonner";

interface MenuItemProps {
  menuItem: MenuItemType;
  restaurantId: string;
}

export default function MenuItem({ menuItem, restaurantId }: MenuItemProps) {
  const [quantity, setQuantity] = useState(1);
  const { addItem, isLoading, itemBeingAdded } = useOrder();
  const { hasPermission } = usePermission();

  const canCreateOrder = hasPermission(PermissionEnum.CREATE_ORDER);

  const handleIncrement = () => {
    setQuantity((prev) => prev + 1);
  };

  const handleDecrement = () => {
    setQuantity((prev) => (prev > 1 ? prev - 1 : 1));
  };

  const handleAddToCart = async () => {
    try {
      await addItem({
        restaurantId,
        menuItemId: menuItem.id,
        quantity,
      });

      toast.success("Added to cart");

      setQuantity(1);
    } catch (error) {
      toast.error("Failed to add to cart");
    }
  };

  return (
    <Card className="h-full flex flex-col">
      <CardHeader>
        <CardTitle>{menuItem.name}</CardTitle>
        <CardDescription>${Number(menuItem.price).toFixed(2)}</CardDescription>
      </CardHeader>
      <CardContent className="flex-grow">
        {menuItem.description && (
          <p className="text-sm text-muted-foreground">
            {menuItem.description}
          </p>
        )}
        {menuItem.image_url && (
          <div className="mt-2 aspect-video w-full overflow-hidden rounded-md">
            <img
              src={menuItem.image_url || "/placeholder.svg"}
              alt={menuItem.name}
              className="h-full w-full object-cover"
            />
          </div>
        )}
      </CardContent>
      <CardFooter className="flex flex-col gap-2">
        {menuItem.is_available ? (
          <>
            <div className="flex items-center w-full">
              <Button
                variant="outline"
                size="icon"
                onClick={handleDecrement}
                disabled={quantity <= 1}
              >
                <Minus className="h-4 w-4" />
              </Button>
              <Input
                type="number"
                value={quantity}
                onChange={(e) =>
                  setQuantity(Number.parseInt(e.target.value) || 1)
                }
                min="1"
                className="h-9 w-16 mx-2 text-center"
              />
              <Button variant="outline" size="icon" onClick={handleIncrement}>
                <Plus className="h-4 w-4" />
              </Button>
            </div>
            <Button
              className="w-full"
              onClick={handleAddToCart}
              disabled={isLoading || !canCreateOrder}
            >
              {itemBeingAdded === menuItem.id ? "Adding..." : "Add to Cart"}
            </Button>
          </>
        ) : (
          <Button variant="outline" className="w-full" disabled>
            Currently Unavailable
          </Button>
        )}
      </CardFooter>
    </Card>
  );
}
