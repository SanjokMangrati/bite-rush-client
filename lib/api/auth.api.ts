import { RefreshTokenPayload } from "../types/user.types";
import { RefreshTokenResponse } from "../types/user.types";
import { LoginResponse } from "../types/user.types";
import { LoginPayload } from "../types/user.types";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

export async function login(payload: LoginPayload): Promise<LoginResponse> {
	console.log(API_BASE_URL);
	const response = await fetch(`${API_BASE_URL}/auth/login`, {
		method: "POST",
		headers: { "Content-Type": "application/json" },
		body: JSON.stringify(payload),
	});

	if (!response.ok) {
		const errorData = await response.json().catch(() => ({}));
		throw new Error(errorData.message || "Login failed");
	}

	return response.json();
}

export async function refreshToken(
	payload: RefreshTokenPayload
): Promise<RefreshTokenResponse> {
	const response = await fetch(`${API_BASE_URL}/auth/refresh`, {
		method: "POST",
		headers: { "Content-Type": "application/json" },
		body: JSON.stringify(payload),
	});

	if (!response.ok) {
		const errorData = await response.json().catch(() => ({}));
		throw new Error(errorData.message || "Token refresh failed");
	}

	return response.json();
}

export async function logout(): Promise<void> {
	const response = await fetch(`${API_BASE_URL}/auth/logout`, {
		method: "POST",
		headers: { "Content-Type": "application/json" },
	});

	if (!response.ok) {
		const errorData = await response.json().catch(() => ({}));
		throw new Error(errorData.message || "Logout failed");
	}
}
