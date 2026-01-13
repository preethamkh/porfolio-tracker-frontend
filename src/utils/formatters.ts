/**
 * Formatting utilities for currency, numbers, dates, etc.
 * These make your data look professional in the UI
 */

import { format, parseISO } from "date-fns";

// ============================================================================
// CURRENCY FORMATTING
// ============================================================================

/**
 * Format a number as currency
 * Example: 15368.00 → "$15,368.00"
 *
 * @param amount - The number to format
 * @param currency - Currency code (default: "AUD")
 * @param showCents - Whether to show decimal places (default: true)
 */
export function formatCurrency(
  amount: number,
  currency: string = "AUD",
  showCents: boolean = true
): string {
  return new Intl.NumberFormat("en", {
    style: "currency",
    currency: currency,
    minimumFractionDigits: showCents ? 2 : 0,
    maximumFractionDigits: showCents ? 2 : 0,
  }).format(amount);
}

/**
 * Format currency for compact display
 * Example: 1543217 → "$1.54M"
 */
export function formatCurrencyCompact(
  amount: number,
  currency: string = "AUD"
): string {
  return new Intl.NumberFormat("en", {
    style: "currency",
    currency: currency,
    notation: "compact",
    maximumFractionDigits: 2,
  }).format(amount);
}

// ============================================================================
// NUMBER FORMATTING
// ============================================================================

/**
 * Format a number with commas
 * Example: 17823 → "17,823"
 */
export function formatNumber(value: number, decimals: number = 0): string {
  return new Intl.NumberFormat("en", {
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  }).format(value);
}

/**
 * Format shares count (no decimals unless fractional)
 * Example: 100.5 → "100.5"
 * Example: 100 → "100"
 */
export function formatShares(shares: number): string {
  // Check if it's a whole number
  if (Number.isInteger(shares)) {
    return formatNumber(shares, 0);
  }
  return formatNumber(shares, 4); // Show up to 4 decimal places for fractional shares
}

// ============================================================================
// PERCENTAGE FORMATTING
// ============================================================================

/**
 * Format a percentage with + or - sign
 * Example: 0.0402 → "+4.02%"
 * Example: -0.2183 → "-21.83%"
 *
 * @param value - The decimal value (0.0402 for 4.02%)
 * @param decimals - Number of decimal places (default: 2)
 */
export function formatPercent(value: number, decimals: number = 2): string {
  const formatted = (value * 100).toFixed(decimals);
  const sign = value >= 0 ? "+" : "";
  return `${sign}${formatted}%`;
}

/**
 * Format percentage without + sign
 * Example: 0.0402 → "4.02%"
 */
export function formatPercentSimple(
  value: number,
  decimals: number = 2
): string {
  return `${(value * 100).toFixed(decimals)}%`;
}

// ============================================================================
// DATE FORMATTING
// ============================================================================

/**
 * Format ISO date string to readable format
 * Example: "2024-01-15T00:00:00Z" → "15 Jan 2024"
 */
export function formatDate(dateString: string): string {
  try {
    const date = parseISO(dateString);
    return format(date, "dd MMM yyyy");
  } catch (error) {
    return dateString; // Return original if parsing fails
  }
}

/**
 * Format date with time
 * Example: "2024-01-15T14:30:00Z" → "15 Jan 2024, 2:30 PM"
 */
export function formatDateTime(dateString: string): string {
  try {
    const date = parseISO(dateString);
    return format(date, "dd MMM yyyy, h:mm a");
  } catch (error) {
    return dateString;
  }
}

/**
 * Format date for input fields
 * Example: "2024-01-15T00:00:00Z" → "2024-01-15"
 */
export function formatDateForInput(dateString: string): string {
  try {
    const date = parseISO(dateString);
    return format(date, "yyyy-MM-dd");
  } catch (error) {
    return "";
  }
}

/**
 * Get relative time (e.g., "2 hours ago")
 */
export function formatRelativeTime(dateString: string): string {
  try {
    const date = parseISO(dateString);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMins / 60);
    const diffDays = Math.floor(diffHours / 24);

    if (diffMins < 1) return "Just now";
    if (diffMins < 60)
      return `${diffMins} minute${diffMins > 1 ? "s" : ""} ago`;
    if (diffHours < 24)
      return `${diffHours} hour${diffHours > 1 ? "s" : ""} ago`;
    if (diffDays < 7) return `${diffDays} day${diffDays > 1 ? "s" : ""} ago`;
    return formatDate(dateString);
  } catch (error) {
    return dateString;
  }
}

// ============================================================================
// COLOR HELPERS (For gains/losses)
// ============================================================================

/**
 * Get Tailwind color class based on value (positive/negative)
 * Used for profit/loss coloring
 */
export function getValueColorClass(value: number): string {
  if (value > 0) return "text-profit";
  if (value < 0) return "text-loss";
  return "text-muted-foreground";
}

/**
 * Get background color class based on value
 */
export function getValueBgClass(value: number): string {
  if (value > 0) return "bg-profit-light";
  if (value < 0) return "bg-loss-light";
  return "bg-muted";
}

// ============================================================================
// SIGN FORMATTING
// ============================================================================

/**
 * Add + or - sign to number
 * Example: 593.92 → "+593.92"
 * Example: -32.00 → "-32.00"
 */
export function formatWithSign(value: number, decimals: number = 2): string {
  const formatted = value.toFixed(decimals);
  return value >= 0 ? `+${formatted}` : formatted;
}
