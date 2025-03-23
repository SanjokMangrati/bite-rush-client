"use client";

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import type { PaymentMethod } from "@/lib/types/payment.types";
import { CreditCard, Check } from "lucide-react";
import { formatCardNumber } from "@/lib/utils";

interface PaymentMethodCardProps {
  paymentMethod: PaymentMethod;
  onEdit: (id: string) => void;
  onSetDefault: (id: string) => void;
  canEdit: boolean;
}

export default function PaymentMethodCard({
  paymentMethod,
  onEdit,
  onSetDefault,
  canEdit,
}: PaymentMethodCardProps) {
  const { id, type, card_number, cardholder_name, expiry_date, is_default } =
    paymentMethod;

  return (
    <Card className={is_default ? "border-primary" : ""}>
      <CardHeader>
        <CardTitle className="flex items-center justify-between w-full">
          <div className="flex items-center gap-2">
            <CreditCard className="h-5 w-5" />
            {type === "CREDIT_CARD" ? "Credit Card" : "Debit Card"}
          </div>
          {is_default && (
            <span className="flex items-center rounded-full bg-primary/10 px-2 py-1 text-xs font-medium text-primary">
              <Check className="mr-1 h-3 w-3" />
              Default
            </span>
          )}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid gap-1">
          <div className="text-sm">
            <span className="font-medium text-muted-foreground">
              Card Number:
            </span>
            <span className="ml-1">{formatCardNumber(card_number)}</span>
          </div>
          <div className="text-sm">
            <span className="font-medium text-muted-foreground">
              Cardholder:
            </span>
            <span className="ml-1">{cardholder_name}</span>
          </div>
          <div className="text-sm">
            <span className="font-medium text-muted-foreground">Expires:</span>
            <span className="ml-1">{expiry_date}</span>
          </div>
        </div>
      </CardContent>
      <CardFooter className="flex justify-between">
        {canEdit && (
          <Button variant="outline" size="sm" onClick={() => onEdit(id)}>
            Edit
          </Button>
        )}
        {!is_default && (
          <Button
            variant="secondary"
            size="sm"
            onClick={() => onSetDefault(id)}
          >
            Set as Default
          </Button>
        )}
      </CardFooter>
    </Card>
  );
}
