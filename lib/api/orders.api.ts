import { Order } from "../types/order.types";
import { AddItemToCartPayload } from "../types/order.types";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

export async function addItemToCart(
	payload: AddItemToCartPayload,
	token: string
): Promise<Order> {
	const response = await fetch(`${API_BASE_URL}/orders/items`, {
		method: "POST",
		headers: {
			Authorization: `Bearer ${token}`,
			"Content-Type": "application/json",
		},
		body: JSON.stringify(payload),
	});

	if (!response.ok) {
		const errorData = await response.json().catch(() => ({}));
		throw new Error(errorData.message || "Failed to add item to cart");
	}

	return response.json();
}

export async function getOrder(orderId: string, token: string): Promise<Order> {
	const response = await fetch(`${API_BASE_URL}/orders/${orderId}`, {
		headers: {
			Authorization: `Bearer ${token}`,
			"Content-Type": "application/json",
		},
	});

	if (!response.ok) {
		const errorData = await response.json().catch(() => ({}));
		throw new Error(errorData.message || "Failed to fetch order");
	}

	return response.json();
}

export async function checkoutOrder(
	orderId: string,
	token: string
): Promise<Order> {
	const response = await fetch(`${API_BASE_URL}/orders/${orderId}/checkout`, {
		method: "POST",
		headers: {
			Authorization: `Bearer ${token}`,
			"Content-Type": "application/json",
		},
	});

	if (!response.ok) {
		const errorData = await response.json().catch(() => ({}));
		throw new Error(errorData.message || "Failed to checkout order");
	}

	return response.json();
}

export async function cancelOrder(
	orderId: string,
	token: string
): Promise<Order> {
	const response = await fetch(`${API_BASE_URL}/orders/${orderId}/cancel`, {
		method: "PATCH",
		headers: {
			Authorization: `Bearer ${token}`,
			"Content-Type": "application/json",
		},
	});

	if (!response.ok) {
		const errorData = await response.json().catch(() => ({}));
		throw new Error(errorData.message || "Failed to cancel order");
	}

	return response.json();
}

export async function decreaseOrderItem(
	orderId: string,
	menuItemId: string,
	decreaseBy: number,
	token: string
): Promise<Order | null> {
	const response = await fetch(
		`${API_BASE_URL}/orders/${orderId}/items/${menuItemId}/decrease`,
		{
			method: "PATCH",
			headers: {
				Authorization: `Bearer ${token}`,
				"Content-Type": "application/json",
			},
			body: JSON.stringify({ decreaseBy }),
		}
	);

	if (!response.ok) {
		const errorData = await response.json().catch(() => ({}));
		throw new Error(errorData.message || "Failed to decrease item quantity");
	}

	const text = await response.text();
	if (!text) return null;

	return JSON.parse(text);
}

export async function deleteOrderItem(
	orderId: string,
	menuItemId: string,
	token: string
): Promise<Order | null> {
	const response = await fetch(
		`${API_BASE_URL}/orders/${orderId}/items/${menuItemId}`,
		{
			method: "DELETE",
			headers: {
				Authorization: `Bearer ${token}`,
				"Content-Type": "application/json",
			},
		}
	);

	if (!response.ok) {
		const errorData = await response.json().catch(() => ({}));
		throw new Error(errorData.message || "Failed to remove item");
	}

	const text = await response.text();
	return text ? JSON.parse(text) : null;
}
