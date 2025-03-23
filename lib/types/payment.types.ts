export type PaymentMethodType = "CREDIT_CARD" | "DEBIT_CARD";

export interface PaymentMethod {
  id: string;
  type: PaymentMethodType;
  card_number: string;
  cardholder_name: string;
  expiry_date: string;
  cvv: string;
  is_default: boolean;
}

export interface CreatePaymentMethodPayload {
  type: PaymentMethodType;
  card_number: string;
  cardholder_name: string;
  expiry_date: string;
  cvv: string;
  is_default?: boolean;
}

export interface UpdatePaymentMethodPayload {
  type?: PaymentMethodType;
  card_number?: string;
  cardholder_name?: string;
  expiry_date?: string;
  cvv?: string;
  is_default?: boolean;
}
