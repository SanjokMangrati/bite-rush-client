"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { PermissionEnum } from "@/lib/types/user.types";
import type { PaymentMethod } from "@/lib/types/payment.types";
import PaymentMethodForm from "@/components/payment/PaymentMethodForm";
import type { z } from "zod";
import type { paymentMethodSchema } from "@/components/ui/form-schema";
import LoadingSpinner from "@/components/ui/loading-spinner";
import { useAuth } from "@/lib/context/auth.context";
import { usePayment } from "@/lib/context/payment.context";
import { usePermission } from "@/lib/hooks/usePermission.hook";
import Container from "@/components/layout/Container";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

type PaymentMethodFormValues = z.infer<typeof paymentMethodSchema>;

export default function EditPaymentMethodPage() {
  const params = useParams();
  const paymentMethodId = params.id as string;
  const router = useRouter();
  const { isAuthenticated, isLoading: isAuthenticating } = useAuth();
  const { hasPermission } = usePermission();
  const {
    paymentMethods,
    fetchPaymentMethods,
    updatePaymentMethod,
    isLoading,
  } = usePayment();
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod | null>(
    null,
  );
  const [isInitialLoading, setIsInitialLoading] = useState(true);

  const canUpdatePayment = hasPermission(PermissionEnum.UPDATE_PAYMENT);

  useEffect(() => {
    const loadPaymentMethod = async () => {
      if (!isAuthenticated && !isAuthenticating) {
        router.push("/login");
        return;
      }

      if (!canUpdatePayment) {
        toast.error("Access denied!");
        router.push("/payment-methods");
        return;
      }

      try {
        if (paymentMethods.length === 0) {
          await fetchPaymentMethods();
        }

        const method = paymentMethods.find((m) => m.id === paymentMethodId);

        if (method) {
          setPaymentMethod(method);
        } else {
          toast.error("Payment method not found");
          router.push("/payment-methods");
        }
      } catch (error) {
        toast.error("Failed to load payment method");
      } finally {
        setIsInitialLoading(false);
      }
    };

    loadPaymentMethod();
  }, [
    isAuthenticated,
    canUpdatePayment,
    paymentMethodId,
    paymentMethods,
    fetchPaymentMethods,
    router,
  ]);

  const handleSubmit = async (data: PaymentMethodFormValues) => {
    if (!paymentMethodId) return;

    try {
      await updatePaymentMethod(paymentMethodId, data);
      toast.success("Payment method updated successfully");
      router.push("/payment-methods");
    } catch (error) {
      toast.error("Failed to update payment method");
    }
  };

  if (!isAuthenticated && !isAuthenticating) {
    return null;
  }

  if (isInitialLoading || isAuthenticating) {
    return (
      <Container>
        <div className="container py-8 flex justify-center items-center h-screen">
          <LoadingSpinner size="medium" />
        </div>
      </Container>
    );
  }

  if (!paymentMethod) {
    return (
      <div className="text-center py-8">
        <p className="text-muted-foreground mb-4">
          You don't have any payment methods yet.
        </p>
        <Link href="/payment-methods/new">
          <Button>Add Your First Payment Method</Button>
        </Link>
      </div>
    );
  }

  return (
    <Container>
      <div className="container py-8">
        <div className="max-w-md mx-auto">
          <Card>
            <CardHeader>
              <CardTitle>Edit Payment Method</CardTitle>
              <CardDescription>
                Update your payment method details
              </CardDescription>
            </CardHeader>
            <CardContent>
              <PaymentMethodForm
                onSubmit={handleSubmit}
                initialData={paymentMethod}
                isLoading={isLoading}
              />
            </CardContent>
          </Card>
        </div>
      </div>
    </Container>
  );
}
