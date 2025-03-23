import { z } from "zod";

export const loginSchema = z.object({
  email: z.string().email("Please enter a valid email address"),
  password: z.string(),
});

export const paymentMethodSchema = z.object({
  type: z.enum(["CREDIT_CARD", "DEBIT_CARD"], {
    required_error: "Please select a card type",
  }),
  card_number: z
    .string()
    .min(12, "Card number must be at least 12 digits")
    .max(19, "Card number must be at most 19 digits")
    .regex(/^\d+$/, "Card number must contain only digits"),
  cardholder_name: z.string().min(1, "Cardholder name is required"),
  expiry_date: z
    .string()
    .regex(
      /^(0[1-9]|1[0-2])\/?([0-9]{2})$/,
      "Expiry date must be in MM/YY format",
    ),
  cvv: z.string().regex(/^\d{3}$/, "CVV must be exactly 3 digits"),
  is_default: z.boolean().optional(),
});
