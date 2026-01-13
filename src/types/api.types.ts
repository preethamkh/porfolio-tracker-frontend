/**
 * API Request/Response Types
 * These types define the structure of data sent to and received from the API endpoints.(backend)
 * They often mirror the domain entity types but can include additional metadata or omit certain fields.
 */

// ============================================================================
// AUTHENTICATION
// ============================================================================

export interface LoginRequest {
  email: string;
  password: string;
}

export interface RegisterRequest {
  email: string;
  password: string;
  fullName?: string | null;
}

export interface AuthResponse {
  token: string; // JWT
  expiresAt?: string; // ISO 8601 date string
  user: {
    id: string;
    email: string;
    fullName?: string | null;
  };
}

// For storing in localStorage/state
export interface AuthUser {
  id: string;
  email: string;
  fullName?: string | null;
}

// ============================================================================
// API RESPONSE WRAPPERS
// ============================================================================

// Generic API response wrapper
export interface ApiResponse<T> {
  data: T;
  message?: string;
  success: boolean;
}

// Error response from backend
export interface ApiError {
  errors?: Record<string, string[]>; // Validaton errors
  message: string;
  statusCode: number;
}

// ============================================================================
// SEARCH/FILTER PARAMETERS
// ============================================================================

export interface SecuritySearchParams {
  query: string;
  limit?: number;
}

export interface TransactionFilterParams {
  startDate?: string;
  endDate?: string;
  transactionType?: "BUY" | "SELL";
}

// ============================================================================
// BATCH OPERATIONS (Future use)
// ============================================================================

export interface BulkCreateTransactionsDto {
  transactions: Array<{
    securitySymbol: string;
    transactionType: "BUY" | "SELL";
    shares: number;
    pricePerShare: number;
    transactionDate: string;
    fees?: number;
  }>;
}

// ============================================================================
// STOCK QUOTE REQUEST
// ============================================================================

export interface GetOrCreateSecurityRequest {
  symbol: string;
}
