"use client";

import {
  createContext,
  useContext,
  useState,
  type ReactNode,
  useEffect,
  useCallback,
} from "react";
import type { AddItemToCartPayload, Order } from "../types/order.types";
import {
  addItemToCart,
  getOrder,
  checkoutOrder,
  cancelOrder,
  decreaseOrderItem,
  deleteOrderItem,
} from "../api/orders.api";
import { useAuth } from "./auth.context";
import { toast } from "sonner";

interface OrderContextType {
  currentOrder: Order | null;
  isLoading: boolean;
  itemBeingAdded: string;
  isOrderBeingCancelled: boolean;
  loggingOut: boolean;
  error: string | null;
  addItem: (payload: AddItemToCartPayload) => Promise<void>;
  fetchOrder: (orderId: string) => Promise<void>;
  checkout: (orderId: string) => Promise<void>;
  cancel: (orderId: string) => Promise<void>;
  decreaseItem: (
    orderId: string,
    menuItemId: string,
    decreaseBy: number,
  ) => Promise<void>;
  removeOrderItem: (orderId: string, menuItemId: string) => Promise<void>;
  clearOrder: () => void;
}

const OrderContext = createContext<OrderContextType | undefined>(undefined);

export function OrderProvider({ children }: { children: ReactNode }) {
  const { accessToken, refreshAccessToken: refreshAuthToken } = useAuth();
  const [currentOrder, setCurrentOrder] = useState<Order | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [itemBeingAdded, setItemBeingAdded] = useState<string>("");
  const [isOrderBeingCancelled, setIsOrderBeingCancelled] = useState<boolean>(false);
  const [loggingOut, setLoggingOut] = useState<boolean>(false);

  useEffect(() => {
    const storedOrder = localStorage.getItem("currentOrder");
    if (storedOrder) {
      try {
        setCurrentOrder(JSON.parse(storedOrder));
      } catch (error) {
        console.error("Failed to parse stored order:", error);
        localStorage.removeItem("currentOrder");
      }
    }
  }, []);

  useEffect(() => {
    if (currentOrder) {
      localStorage.setItem("currentOrder", JSON.stringify(currentOrder));
    } else {
      localStorage.removeItem("currentOrder");
    }
  }, [currentOrder]);

  const handleApiCall = async <T,>(
    apiCall: (token: string) => Promise<T>,
  ): Promise<T | null> => {
    if (!accessToken) {
      const errorData = "Authentication required";
      setError(errorData);
      toast.error(errorData);
      return null;
    }
    try {
      return await apiCall(accessToken);
    } catch (error) {
      if (error instanceof Error && error.message.includes("401")) {
        const newToken = await refreshAuthToken();
        if (newToken) {
          return await apiCall(newToken);
        }
      }
      throw error;
    }
  };

  const handleAddItem = useCallback(
    async (payload: AddItemToCartPayload) => {
      setItemBeingAdded(payload.menuItemId);
      setError(null);
      try {
        const updatedOrder = await handleApiCall((token) =>
          addItemToCart(payload, token),
        );
        if (updatedOrder) {
          setCurrentOrder(updatedOrder);
          localStorage.setItem("currentOrder", JSON.stringify(updatedOrder));
        }
      } catch (error) {
        console.error("Failed to add item to cart:", error);
        const errorData =
          error instanceof Error ? error.message : "Failed to add item to cart";
        setError(errorData);
        toast.error(errorData);
      } finally {
        setItemBeingAdded("");
      }
    },
    [accessToken, refreshAuthToken],
  );

  const handleFetchOrder = useCallback(
    async (orderId: string) => {
      setIsLoading(true);
      setError(null);
      try {
        const order = await handleApiCall((token) => getOrder(orderId, token));
        if (order) {
          setCurrentOrder(order);
        }
      } catch (error) {
        console.error("Failed to fetch order:", error);
        const errorData =
          error instanceof Error ? error.message : "Failed to fetch order";
        setError(errorData);
        toast.error(errorData);
      } finally {
        setIsLoading(false);
      }
    },
    [accessToken, refreshAuthToken],
  );

  const handleCheckout = useCallback(
    async (orderId: string) => {
      setIsLoading(true);
      setError(null);
      try {
        const updatedOrder = await handleApiCall((token) =>
          checkoutOrder(orderId, token),
        );
        if (updatedOrder) {
          setCurrentOrder(updatedOrder);
        }
      } catch (error) {
        console.error("Failed to checkout order:", error);
        const errorData =
          error instanceof Error ? error.message : "Failed to checkout order";
        setError(errorData);
        toast.error(errorData);
      } finally {
        setIsLoading(false);
      }
    },
    [accessToken, refreshAuthToken],
  );

  const handleCancel = useCallback(
    async (orderId: string) => {
      setIsOrderBeingCancelled(true);
      setError(null);
      try {
        const updatedOrder = await handleApiCall((token) =>
          cancelOrder(orderId, token),
        );
        if (updatedOrder) {
          setCurrentOrder(updatedOrder);
        }
      } catch (error) {
        console.error("Failed to cancel order:", error);
        const errorData =
          error instanceof Error ? error.message : "Failed to cancel order";
        setError(errorData);
        toast.error(errorData);
      } finally {
        setIsOrderBeingCancelled(false);
      }
    },
    [accessToken, refreshAuthToken],
  );

  const handleDecreaseItem = useCallback(
    async (orderId: string, menuItemId: string, decreaseBy: number) => {
      setError(null);
      try {
        const updatedOrder = await handleApiCall((token) =>
          decreaseOrderItem(orderId, menuItemId, decreaseBy, token),
        );
        if (updatedOrder) {
          setCurrentOrder(updatedOrder);
          localStorage.setItem("currentOrder", JSON.stringify(updatedOrder));
        } else {
          setCurrentOrder(null);
          localStorage.removeItem("currentOrder");
        }
      } catch (error) {
        console.error("Failed to decrease order item quantity:", error);
        const errorData =
          error instanceof Error
            ? error.message
            : "Failed to decrease order item quantity";
        setError(errorData);
        toast.error(errorData);
      }
    },
    [accessToken, refreshAuthToken],
  );

  const handleDeleteOrderItem = useCallback(
    async (orderId: string, menuItemId: string) => {
      setIsLoading(true);
      setError(null);
      try {
        const updatedOrder = await handleApiCall((token) =>
          deleteOrderItem(orderId, menuItemId, token),
        );
        if (updatedOrder) {
          setCurrentOrder(updatedOrder);
          localStorage.setItem("currentOrder", JSON.stringify(updatedOrder));
        } else {
          setCurrentOrder(null);
          localStorage.removeItem("currentOrder");
        }
      } catch (error) {
        console.error("Failed to delete order item:", error);
        const errorData =
          error instanceof Error
            ? error.message
            : "Failed to delete order item";
        setError(errorData);
        toast.error(errorData);
      } finally {
        setIsLoading(false);
      }
    },
    [accessToken, refreshAuthToken],
  );

  const clearOrder = useCallback(() => {
    setLoggingOut(true);
    setCurrentOrder(null);
    localStorage.removeItem("currentOrder");
  }, []);

  const contextValue: OrderContextType = {
    currentOrder,
    isLoading,
    itemBeingAdded,
    isOrderBeingCancelled,
    loggingOut,
    error,
    addItem: handleAddItem,
    fetchOrder: handleFetchOrder,
    checkout: handleCheckout,
    cancel: handleCancel,
    decreaseItem: handleDecreaseItem,
    removeOrderItem: handleDeleteOrderItem,
    clearOrder,
  };

  return (
    <OrderContext.Provider value={contextValue}>
      {children}
    </OrderContext.Provider>
  );
}

export function useOrder() {
  const context = useContext(OrderContext);
  if (context === undefined) {
    throw new Error("useOrder must be used within an OrderProvider");
  }
  return context;
}
