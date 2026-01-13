/**
 * Authentication API Endpoints
 *
 * These functions map to the .NET AuthController endpoints.
 * - POST /api/auth/login
 * - POST /api/auth/register
 * - GET /api/auth/me
 *
 * The /api comes from the baseURL set in api/client.ts
 */

import apiClient from "../client";
import { AuthResponse, LoginRequest, RegisterRequest } from "@/types";

/**
 * Register a new user.
 *
 * C# equivalent:
 * await _httpClient.PostAsJsonAsync("/api/auth/register", registerRequest);
 */

export async function register(data: RegisterRequest): Promise<AuthResponse> {
  const response = await apiClient.post<AuthResponse>("/auth/register", data);
  return response.data;
}

/**
 * Login user.
 *
 * C# equivalent:
 * await _httpClient.PostAsJsonAsync("/api/auth/login", loginRequest);
 */
export async function login(data: LoginRequest): Promise<AuthResponse> {
  const response = await apiClient.post<AuthResponse>("/auth/login", data);
  return response.data;
}

/**
 * Get current authenticated user info
 */
export async function getCurrentUser(): Promise<AuthResponse> {
  const response = await apiClient.get<AuthResponse>("/auth/me");
  return response.data;
}

/**
 * Logout user (client-side only - just clears the token)
 * The backend doesn't need a logout endpoint since we're using JWTs.
 */
export function logout(): Promise<void> {
  // Token is cleared in client.ts clearAuthToken function
  // This is just a placeholder to match the API structure
  return Promise.resolve();
}
