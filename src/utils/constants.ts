/**
 * Appilcation constants
 * Centralized place for all constant values used across the application.
 * i.e., magic strings, config values, default settings, etc.
 */

// ============================================================================
// LOCAL STORAGE KEYS
// ============================================================================

export const STORAGE_KEYS = {
  AUTH_TOKEN: "portfolio_tracker_token",
  USER: "portfolio_tracker_user",
  SELECTED_PORTFOLIO: "portfolio_tracker_selected_portfolio",
  THEME: "portfolio_tracker_theme",
} as const;

// ============================================================================
// API ENDPOINTS (BASE PATHS for backend routes)
// ============================================================================

export const API_ENDPOINTS = {
  AUTH: "/auth",
  USERS: "/users",
  PORTFOLIOS: "/portfolios",
  HOLDINGS: "/holdings",
  SECURITIES: "/securities",
  TRANSACTIONS: "/transactions",
} as const;

// ============================================================================
// TRANSACTION TYPES
// ============================================================================

export const TRANSACTION_TYPES = {
  BUY: "BUY",
  SELL: "SELL",
} as const;

export const TRANSACTION_TYPE_LABELS: Record<string, string> = {
  BUY: "Buy",
  SELL: "Sell",
};

// ============================================================================
// CURRENCY CODES
// ============================================================================

export const CURRENCIES = [
  { code: "AUD", symbol: "$", name: "Australian Dollar" },
  { code: "USD", symbol: "$", name: "US Dollar" },
  { code: "EUR", symbol: "€", name: "Euro" },
] as const;

// defaulting to USD as the 3rd party APIs in use primarily offer US securities data
export const DEFAULT_CURRENCY = "USD";

// ============================================================================
// TABLE SETTINGS
// ============================================================================

export const TABLE_SETTINGS = {
  DEFAULT_PAGE_SIZE: 25,
  PAGE_SIZE_OPTIONS: [10, 25, 50, 100],
  ROWS_PER_PAGE_MOBILE: 10,
} as const;

// ============================================================================
// REFRESH INTERVALS (milliseconds)
// ============================================================================

export const REFRESH_INTERVALS = {
  HOLDINGS: 60000, // 1 minute
  PRICES: 3600000, // 60 minutes
  PORTFOLIO_SUMMARY: 60000, // 1 minute
} as const;

// ============================================================================
// DATE FORMATS
// ============================================================================

export const DATE_FORMATS = {
  DISPLAY: "dd MMM yyyy", // 15 Jan 2024
  DISPLAY_WITH_TIME: "dd MMM yyyy, h:mm a", // 15 Jan 2024, 2:30 PM
  INPUT: "yyyy-MM-dd", // 2024-01-15 (HTML input format)
  ISO: "yyyy-MM-dd'T'HH:mm:ss'Z'", // ISO 8601
} as const;

// ============================================================================
// VALIDATION RULES
// ============================================================================

export const VALIDATION = {
  EMAIL_REGEX: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
  PASSWORD_MIN_LENGTH: 6,
  PASSWORD_MAX_LENGTH: 100,
  NAME_MAX_LENGTH: 100,
  SYMBOL_MAX_LENGTH: 10,
  NOTES_MAX_LENGTH: 500,
} as const;

// ============================================================================
// UI MESSAGES
// ============================================================================

export const MESSAGES = {
  // Success
  LOGIN_SUCCESS: "Welcome back!",
  REGISTER_SUCCESS: "Account created successfully!",
  TRANSACTION_ADDED: "Transaction added successfully",
  TRANSACTION_UPDATED: "Transaction updated successfully",
  TRANSACTION_DELETED: "Transaction deleted successfully",
  PORTFOLIO_CREATED: "Portfolio created successfully",
  PORTFOLIO_UPDATED: "Portfolio updated successfully",

  // Errors
  LOGIN_FAILED: "Invalid email or password",
  REGISTER_FAILED: "Failed to create account",
  NETWORK_ERROR: "Network error. Please check your connection.",
  UNAUTHORIZED: "Please log in to continue",
  FORBIDDEN: "You do not have permission to perform this action",
  NOT_FOUND: "Resource not found",
  VALIDATION_ERROR: "Please check your input and try again",

  // Loading
  LOADING: "Loading...",
  SAVING: "Saving...",
  DELETING: "Deleting...",
} as const;

// ============================================================================
// ROUTE PATHS (For navigating between pages in the app)
// ============================================================================

export const ROUTES = {
  HOME: "/",
  LOGIN: "/login",
  REGISTER: "/register",
  DASHBOARD: "/dashboard",
  PORTFOLIOS: "/portfolios",
  HOLDINGS: "/holdings",
  TRANSACTIONS: "/transactions",
  SETTINGS: "/settings",
} as const;

// ============================================================================
// ENVIRONMENT VARIABLES
// ============================================================================

export const ENV = {
  //API_BASE_URL: process.env.REACT_APP_API_BASE_URL || "http://localhost:5000/api",
  API_BASE_URL:
    import.meta.env.VITE_API_BASE_URL || "http://localhost:5001/api",
  APP_NAME: import.meta.env.VITE_APP_NAME || "Portfolio Tracker",
  // Auto-generated version: package.json version + git commit count (e.g., 1.0.0+build.123)
  APP_VERSION: typeof __APP_VERSION__ !== 'undefined' ? __APP_VERSION__ : "1.0.0+build.dev",
  // Build info from Vercel (automatically injected during build)
  GIT_COMMIT_SHA: import.meta.env.VITE_VERCEL_GIT_COMMIT_SHA || "dev",
  GIT_BRANCH: import.meta.env.VITE_VERCEL_GIT_COMMIT_REF || "local",
  VERCEL_ENV: import.meta.env.VITE_VERCEL_ENV || "development",
};
