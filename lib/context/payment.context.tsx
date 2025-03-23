"use client";

import { createContext, useContext, useState, type ReactNode } from "react";
import type {
  PaymentMethod,
  CreatePaymentMethodPayload,
  UpdatePaymentMethodPayload,
} from "../types/payment.types";
import {
  getPaymentMethods,
  createPaymentMethod,
  updatePaymentMethod,
} from "../api/payment.api";
import { useAuth } from "./auth.context";
import { toast } from "sonner";

interface PaymentContextType {
  paymentMethods: PaymentMethod[];
  isLoading: boolean;
  error: string | null;
  fetchPaymentMethods: () => Promise<void>;
  createPaymentMethod: (payload: CreatePaymentMethodPayload) => Promise<void>;
  updatePaymentMethod: (
    id: string,
    payload: UpdatePaymentMethodPayload,
  ) => Promise<void>;
}

const PaymentContext = createContext<PaymentContextType | undefined>(undefined);

export function PaymentProvider({ children }: { children: ReactNode }) {
  const { accessToken, refreshAccessToken: refreshAuthToken } = useAuth();
  const [paymentMethods, setPaymentMethods] = useState<PaymentMethod[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

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

  const handleFetchPaymentMethods = async () => {
    setIsLoading(true);
    setError(null);

    try {
      const methods = await handleApiCall((token) => getPaymentMethods(token));

      if (methods) {
        setPaymentMethods(methods);
      }
    } catch (error) {
      console.error("Failed to fetch payment methods:", error);
      const errorData =
        error instanceof Error
          ? error.message
          : "Failed to fetch payment methods";
      toast.error(errorData);
      setError(errorData);
    } finally {
      setIsLoading(false);
    }
  };

  const handleCreatePaymentMethod = async (
    payload: CreatePaymentMethodPayload,
  ) => {
    setIsLoading(true);
    setError(null);

    try {
      const newMethod = await handleApiCall((token) =>
        createPaymentMethod(payload, token),
      );

      if (newMethod) {
        setPaymentMethods((prev) => [...prev, newMethod]);
      }
    } catch (error) {
      console.error("Failed to create payment method:", error);
      const errorData =
        error instanceof Error
          ? error.message
          : "Failed to create payment method";
      setError(errorData);
      toast.error(errorData);
    } finally {
      setIsLoading(false);
    }
  };

  const handleUpdatePaymentMethod = async (
    id: string,
    payload: UpdatePaymentMethodPayload,
  ) => {
    setIsLoading(true);
    setError(null);

    try {
      const updatedMethod = await handleApiCall((token) =>
        updatePaymentMethod(id, payload, token),
      );

      if (updatedMethod) {
        setPaymentMethods((prev) =>
          prev.map((method) => (method.id === id ? updatedMethod : method)),
        );
      }
    } catch (error) {
      console.error("Failed to update payment method:", error);
      const errorData =
        error instanceof Error
          ? error.message
          : "Failed to update payment method";
      setError(errorData);
      toast.error(errorData);
    } finally {
      setIsLoading(false);
    }
  };

  const contextValue: PaymentContextType = {
    paymentMethods,
    isLoading,
    error,
    fetchPaymentMethods: handleFetchPaymentMethods,
    createPaymentMethod: handleCreatePaymentMethod,
    updatePaymentMethod: handleUpdatePaymentMethod,
  };

  return (
    <PaymentContext.Provider value={contextValue}>
      {children}
    </PaymentContext.Provider>
  );
}

export function usePayment() {
  const context = useContext(PaymentContext);
  if (context === undefined) {
    throw new Error("usePayment must be used within a PaymentProvider");
  }
  return context;
}
