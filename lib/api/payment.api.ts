import { UpdatePaymentMethodPayload } from "../types/payment.types";
import { CreatePaymentMethodPayload } from "../types/payment.types";
import { PaymentMethod } from "../types/payment.types";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

export async function getPaymentMethods(
	token: string
): Promise<PaymentMethod[]> {
	const response = await fetch(`${API_BASE_URL}/payment-methods`, {
		headers: {
			Authorization: `Bearer ${token}`,
			"Content-Type": "application/json",
		},
	});

	if (!response.ok) {
		const errorData = await response.json().catch(() => ({}));
		throw new Error(errorData.message || "Failed to fetch payment methods");
	}
	return response.json();
}

export async function createPaymentMethod(
	payload: CreatePaymentMethodPayload,
	token: string
): Promise<PaymentMethod> {
	const response = await fetch(`${API_BASE_URL}/payment-methods`, {
		method: "POST",
		headers: {
			Authorization: `Bearer ${token}`,
			"Content-Type": "application/json",
		},
		body: JSON.stringify(payload),
	});

	if (!response.ok) {
		const errorData = await response.json().catch(() => ({}));
		throw new Error(errorData.message || "Failed to add payment method");
	}

	return response.json();
}

export async function updatePaymentMethod(
	id: string,
	payload: UpdatePaymentMethodPayload,
	token: string
): Promise<PaymentMethod> {
	const response = await fetch(`${API_BASE_URL}/payment-methods/${id}`, {
		method: "PATCH",
		headers: {
			Authorization: `Bearer ${token}`,
			"Content-Type": "application/json",
		},
		body: JSON.stringify(payload),
	});

	if (!response.ok) {
		const errorData = await response.json().catch(() => ({}));
		throw new Error(errorData.message || "Failed to update payment method");
	}

	return response.json();
}
