/**
 * AXIOS HTTP Client Configuration
 *
 * This is the SINGLE place where all API calls go through.
 * Similar to the .NET HttpClient setup in the backend, but with interceptors for request/response handling.
 *
 * Features:
 * - Automatic inclusion of auth tokens in headers (JWT token injection)
 * - Centralized error handling
 * - Request/Response logging for debugging (development mode)
 * - Timeout configuration
 */

import { ApiError } from "@/types";
import axios, {
  AxiosError,
  AxiosInstance,
  InternalAxiosRequestConfig,
} from "axios";
import { ENV, STORAGE_KEYS } from "@/utils/constants";

// ============================================================================
// CREATE AXIOS INSTANCE
// ============================================================================

const apiClient: AxiosInstance = axios.create({
  baseURL: ENV.API_BASE_URL,
  timeout: 30000, // 30 seconds timeout
  headers: {
    "Content-Type": "application/json",
  },
});

// ============================================================================
// REQUEST INTERCEPTOR (Outgoing requests)
// ============================================================================

/**
 * Intercepts every request BEFORE it's sent to add JWT token
 *
 * C# equivalent:
 * httpClient.DefaultRequestHeaders.Authorization =
 *   new AuthenticationHeaderValue("Bearer", token);
 */
//todo: later if time permits (use HTTP only cookies for token storage)

apiClient.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    // Retrieve token from localStorage (or any secure storage)
    const token = localStorage.getItem(STORAGE_KEYS.AUTH_TOKEN);

    // If token exists, add it to Authorization header (req. header)
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    // Log the request in development mode
    if (import.meta.env.DEV) {
      console.log("API Request:", {
        method: config.method?.toUpperCase() ?? "UNKNOWN",
        url: config.url,
        data: config.data,
      });
    }

    return config;
  },
  (error) => {
    // Handle request error here
    return Promise.reject(error);
  }
);

// ============================================================================
// RESPONSE INTERCEPTOR (Incoming responses)
// ============================================================================

/**
 * Intercepts every response to handle errors consistently
 * This is where we:
 * - Log responses in dev mode
 * - Transform error responses into consistent ApiError format
 * - Handle 401 Unauthorized (logout user)
 * - Handle network errors
 */

apiClient.interceptors.response.use(
  // Success handler - just return the response
  (response) => {
    if (import.meta.env.DEV) {
      console.log("API Response:", {
        url: response.config.url,
        status: response.status,
        data: response.data,
      });
    }
    return response;
  },
  (error: AxiosError<ApiError>) => {
    if (import.meta.env.DEV) {
      console.error("API Error:", {
        url: error.config?.url,
        message: error.response?.data?.message || error.message,
        status: error.response?.status,
        data: error.response?.data,
      });
    }

    // Network error (no response from server)
    if (!error.response) {
      return Promise.reject({
        message: "Network error - please check your internet connection.",
        statusCode: 0,
      } as ApiError);
    }

    // 401 Unauthorized - clear auth and redirect to login
    if (error.response.status === 401) {
      localStorage.removeItem(STORAGE_KEYS.AUTH_TOKEN);
      localStorage.removeItem(STORAGE_KEYS.USER);

      // Only redirect if not already on login page
      if (!window.location.pathname.includes("/login")) {
        window.location.href = "/login";
      }

      return Promise.reject({
        message: "Your session has expired. Please log in again.",
        statusCode: 401,
      } as ApiError);
    }

    // 403 Forbidden
    if (error.response.status === 403) {
      return Promise.reject({
        message: "You do not have permission to perform this action.",
        statusCode: 403,
      } as ApiError);
    }

    // 404 Not Found
    if (error.response.status === 404) {
      return Promise.reject({
        message: error.response.data?.message || "Resource not found.",
        statusCode: 404,
      } as ApiError);
    }

    // 400 Bad Request (validation errors)
    if (error.response.status === 400) {
      return Promise.reject({
        message: error.response.data?.message || "Invalid request.",
        errors: error.response.data?.errors,
        statusCode: 400,
      } as ApiError);
    }

    // 500 Server Error
    if (error.response.status >= 500) {
      return Promise.reject({
        message: "Server error. Please try again later.",
        statusCode: error.response.status,
      } as ApiError);
    }

    return Promise.reject({
      message:
        error.response.data?.message || error.message || "An error occurred.",
      statusCode: error.response?.status,
      data: error.response?.data,
    } as ApiError);
  }
);

// ============================================================================
// HELPER FUNCTIONS
// ============================================================================

/**
 * Set auth token (called after login/register)
 */
export function setAuthToken(token: string) {
  localStorage.setItem(STORAGE_KEYS.AUTH_TOKEN, token);
}

/**
 * Clear auth token (called on logout)
 */
export function clearAuthToken() {
  localStorage.removeItem(STORAGE_KEYS.AUTH_TOKEN);
  localStorage.removeItem(STORAGE_KEYS.USER);
}

/**
 * Get current auth token
 * @return JWT token or null
 */
export function getAuthToken(): string | null {
  return localStorage.getItem(STORAGE_KEYS.AUTH_TOKEN);
}

/**
 * Check if user is authenticated
 * @return boolean
 */
export function isAuthenticated(): boolean {
  return !getAuthToken() ? false : true;
}

export default apiClient;
