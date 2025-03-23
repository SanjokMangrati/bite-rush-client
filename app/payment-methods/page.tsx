"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { PermissionEnum } from "@/lib/types/user.types";
import type { PaymentMethod } from "@/lib/types/payment.types";
import PaymentMethodCard from "@/components/payment/PaymentMethodCard";
import LoadingSpinner from "@/components/ui/loading-spinner";
import { Plus } from "lucide-react";
import { useAuth } from "@/lib/context/auth.context";
import { usePayment } from "@/lib/context/payment.context";
import { usePermission } from "@/lib/hooks/usePermission.hook";
import { useRouter } from "next/navigation";
import Container from "@/components/layout/Container";
import { toast } from "sonner";

export default function PaymentMethodsPage() {
  const { isAuthenticated, isLoading: isAuthenticating } = useAuth();
  const {
    paymentMethods,
    isLoading,
    fetchPaymentMethods,
    updatePaymentMethod,
    error: paymentError,
  } = usePayment();
  const { hasPermission } = usePermission();
  const router = useRouter();
  const [isUpdating, setIsUpdating] = useState(false);

  const canUpdatePayment = hasPermission(PermissionEnum.UPDATE_PAYMENT);

  useEffect(() => {
    if (!isAuthenticated && !isAuthenticating) {
      router.push("/login");
    }
  }, [isAuthenticated, router]);

  useEffect(() => {
    if (isAuthenticated) {
      fetchPaymentMethods();
    }
  }, [isAuthenticated]);

  const handleEdit = (id: string) => {
    router.push(`/payment-methods/${id}/edit`);
  };

  const handleSetDefault = async (id: string) => {
    try {
      setIsUpdating(true);
      await updatePaymentMethod(id, { is_default: true });
      toast.success("Payment method set as default");
    } catch (error) {
      toast.error(paymentError || "Failed to set as default");
    } finally {
      setIsUpdating(false);
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
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold">Payment Methods</h1>
          <Link href="/payment-methods/new">
            <Button>
              <Plus className="mr-2 h-4 w-4" />
              Add Payment Method
            </Button>
          </Link>
        </div>

        {isUpdating && (
          <div className="mb-4 flex justify-center">
            <LoadingSpinner />
          </div>
        )}

        {paymentMethods.length === 0 ? (
          <div className="text-center py-8">
            <p className="text-muted-foreground mb-4">
              You don't have any payment methods yet.
            </p>
            <Link href="/payment-methods/new">
              <Button>Add Your First Payment Method</Button>
            </Link>
          </div>
        ) : (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {paymentMethods.map((method: PaymentMethod) => (
              <PaymentMethodCard
                key={method.id}
                paymentMethod={method}
                onEdit={handleEdit}
                onSetDefault={handleSetDefault}
                canEdit={canUpdatePayment}
              />
            ))}
          </div>
        )}
      </div>
    </Container>
  );
}
