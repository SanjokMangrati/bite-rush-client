"use client";

import type React from "react";

import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import type { z } from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { paymentMethodSchema } from "@/components/ui/form-schema";
import type {
  PaymentMethod,
  PaymentMethodType,
} from "@/lib/types/payment.types";
import { RadioGroup, RadioGroupItem } from "../ui/radio-group";
import { Checkbox } from "../ui/checkbox";
import { formatCardNumber, formatExpiryDate } from "@/lib/utils";

type PaymentMethodFormValues = z.infer<typeof paymentMethodSchema>;

interface PaymentMethodFormProps {
  onSubmit: (data: PaymentMethodFormValues) => Promise<void>;
  initialData?: Partial<PaymentMethod>;
  isLoading: boolean;
}

export default function PaymentMethodForm({
  onSubmit,
  initialData,
  isLoading,
}: PaymentMethodFormProps) {
  const {
    register,
    handleSubmit,
    formState: { errors },
    watch,
    setValue,
    control
  } = useForm<PaymentMethodFormValues>({
    resolver: zodResolver(paymentMethodSchema),
    defaultValues: {
      type: (initialData?.type as PaymentMethodType) || "CREDIT_CARD",
      card_number: initialData?.card_number || "",
      cardholder_name: initialData?.cardholder_name || "",
      expiry_date: initialData?.expiry_date || "",
      cvv: initialData?.cvv || "",
      is_default: initialData?.is_default || false,
    },
  });

  const watchType = watch("type");

  const handleCardNumberChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const formatted = formatCardNumber(e.target.value);
    e.target.value = formatted;
  };

  const handleExpiryDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const formatted = formatExpiryDate(e.target.value);
    e.target.value = formatted;
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      <div className="space-y-4">
        <div>
          <Label>Card Type</Label>
          <RadioGroup
            defaultValue={watchType}
            className="grid grid-cols-2 gap-4 pt-2"
            onValueChange={(value) =>
              setValue("type", value as PaymentMethodType)
            }
          >
            <div>
              <RadioGroupItem
                value="CREDIT_CARD"
                id="credit_card"
                className="peer sr-only"
                {...register("type")}
              />
              <Label
                htmlFor="credit_card"
                className="flex flex-col items-center justify-between rounded-md border-2 border-muted bg-popover p-4 hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-primary [&:has([data-state=checked])]:border-primary"
              >
                Credit Card
              </Label>
            </div>
            <div>
              <RadioGroupItem
                value="DEBIT_CARD"
                id="debit_card"
                className="peer sr-only"
                {...register("type")}
              />
              <Label
                htmlFor="debit_card"
                className="flex flex-col items-center justify-between rounded-md border-2 border-muted bg-popover p-4 hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-primary [&:has([data-state=checked])]:border-primary"
              >
                Debit Card
              </Label>
            </div>
          </RadioGroup>
          {errors.type && (
            <p className="text-sm text-destructive mt-1">
              {errors.type.message}
            </p>
          )}
        </div>

        <div className="space-y-2">
          <Label htmlFor="card_number">Card Number</Label>
          <Input
            id="card_number"
            placeholder="1234 5678 9012 3456"
            {...register("card_number")}
            onChange={handleCardNumberChange}
          />
          {errors.card_number && (
            <p className="text-sm text-destructive">
              {errors.card_number.message}
            </p>
          )}
        </div>

        <div className="space-y-2">
          <Label htmlFor="cardholder_name">Cardholder Name</Label>
          <Input
            id="cardholder_name"
            placeholder="John Doe"
            {...register("cardholder_name")}
          />
          {errors.cardholder_name && (
            <p className="text-sm text-destructive">
              {errors.cardholder_name.message}
            </p>
          )}
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="expiry_date">Expiry Date</Label>
            <Input
              id="expiry_date"
              placeholder="MM/YY"
              {...register("expiry_date")}
              onChange={handleExpiryDateChange}
            />
            {errors.expiry_date && (
              <p className="text-sm text-destructive">
                {errors.expiry_date.message}
              </p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="cvv">CVV</Label>
            <Input
              id="cvv"
              placeholder="123"
              type="password"
              maxLength={3}
              {...register("cvv")}
            />
            {errors.cvv && (
              <p className="text-sm text-destructive">{errors.cvv.message}</p>
            )}
          </div>
        </div>

        <div className="flex items-center space-x-2">
          <Controller
            control={control}
            name="is_default"
            render={({ field: { onChange, onBlur, value, ref } }) => (
              <>
                <Checkbox
                  id="is_default"
                  onCheckedChange={(checked: boolean) => {
                    onChange(checked);
                  }}
                  checked={value}
                  ref={ref}
                />
                <Label htmlFor="is_default">Set as default payment method</Label>
              </>
            )}
          />
        </div>
      </div>

      <Button type="submit" className="w-full" disabled={isLoading}>
        {isLoading
          ? "Saving..."
          : initialData
            ? "Update Payment Method"
            : "Add Payment Method"}
      </Button>
    </form>
  );
}
