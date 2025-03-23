"use client";

import { useRouter } from "next/navigation";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import PaymentMethodForm from "@/components/payment/PaymentMethodForm";
import type { z } from "zod";
import type { paymentMethodSchema } from "@/components/ui/form-schema";
import { useAuth } from "@/lib/context/auth.context";
import { usePayment } from "@/lib/context/payment.context";
import Container from "@/components/layout/Container";
import { useEffect } from "react";
import LoadingSpinner from "@/components/ui/loading-spinner";
import { toast } from "sonner";

type PaymentMethodFormValues = z.infer<typeof paymentMethodSchema>;

export default function NewPaymentMethodPage() {
  const router = useRouter();
  const { isAuthenticated, isLoading: isAuthenticating } = useAuth();
  const { createPaymentMethod, isLoading } = usePayment();

  useEffect(() => {
    if (!isAuthenticated && !isAuthenticating) {
      router.push("/login");
    }
  }, [isAuthenticated, router]);

  const handleSubmit = async (data: PaymentMethodFormValues) => {
    try {
      await createPaymentMethod(data);
      toast.success("Payment method added");
      router.push("/payment-methods");
    } catch (error) {
      toast.error("Failed to add payment method");
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

  return (
    <Container>
      <div className="container py-8">
        <div className="max-w-md mx-auto">
          <Card>
            <CardHeader>
              <CardTitle>Add Payment Method</CardTitle>
              <CardDescription>
                Add a new payment method to your account
              </CardDescription>
            </CardHeader>
            <CardContent>
              <PaymentMethodForm
                onSubmit={handleSubmit}
                isLoading={isLoading}
              />
            </CardContent>
          </Card>
        </div>
      </div>
    </Container>
  );
}
