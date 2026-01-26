/**
 * Domain Entity Types
 * These match the backend DTOs I've created in .NET 8
 *
 * Similar to C# DTOs, but in TypeScript we use interfaces instead of classes
 *
 * C#: public class UserDto { public Guid Id { get; set; } }
 * TS:  export interface UserDto { id: string; }
 *
 * Note: Guid in C# is represented as string in TypeScript/JavaScript
 */

// ============================================================================
// USER
// ============================================================================

export interface User {
  id: string;
  email: string;
  fullName?: string | null;
  createdAt: string; // ISO 8601 date string
  lastLogin?: string | null;
}

export interface CreateUserDto {
  email: string;
  password: string;
  fullName?: string | null;
}

export interface UpdateUserDto {
  email?: string;
  fullName?: string | null;
}

// ============================================================================
// PORTFOLIO
// ============================================================================

export interface Portfolio {
  id: string;
  userId: string;
  name: string;
  description?: string | null;
  currency: string; // e.g., "AUD", "USD"
  isDefault: boolean;
  createdAt: string;
  updatedAt: string;
  // Relationships (populated by backend)
  holdings?: Holding[];
  totalValue?: number; // Calculated on frontend
  totalCost?: number; // Calculated on frontend
  totalGainLoss?: number; // Calculated on frontend
}

export interface CreatePortfolioDto {
  name: string;
  description?: string;
  currency: string;
  isDefault?: boolean;
}

export interface UpdatePortfolioDto {
  name?: string;
  description?: string;
  currency?: string;
  isDefault?: boolean;
}

// ============================================================================
// SECURITY
// ============================================================================

export interface Security {
  id: string;
  symbol: string; // e.g., "VGS.AX"
  name: string; // e.g., "Vanguard MSCI Index ETF"
  exchange?: string | null; // e.g., "ASX"
  securityType: string; // e.g., "ETF", "Stock"
  currency: string; // e.g., "AUD"
  sector?: string | null;
  industry?: string | null;
  createdAt: string;
  updatedAt: string;
  // Current price (fetched separately)
  currentPrice?: number;
  priceChange?: number;
  priceChangePercent?: number;
}

export interface CreateSecurityDto {
  symbol: string;
  name: string;
  exchange?: string;
  securityType: string;
  currency: string;
  sector?: string;
  industry?: string;
}

export interface UpdateSecurityDto {
  symbol?: string;
  name?: string;
  exchange?: string;
  securityType?: string;
  currency?: string;
  sector?: string;
  industry?: string;
}

// For search results (search local db)
export interface SecuritySearchResult {
  id: string;
  symbol: string;
  name: string;
  exchange?: string;
  securityType?: string;
}

// Exernal security search result (from 3rd party API)
export interface ExternalSecuritySearchDto {
  symbol: string;
  name: string;
  type?: string | null;
  region?: string | null;
  exchange?: string | null;
  currency: string;
}

// ============================================================================
// HOLDING
// ============================================================================

export interface Holding {
  id: string;
  holdingId?: string; // API response uses this name
  portfolioId: string;
  securityId: string;
  totalShares: number;
  averageCost?: number | null;
  createdAt: string;
  updatedAt: string;
  // Relationships
  security: Security;
  transactions?: Transaction[];
  // Calculated fields (computed on frontend)
  currentValue?: number;
  totalCost?: number;
  gainLoss?: number;
  gainLossPercent?: number;
  dayGain?: number;
  dayGainPercent?: number;
}

export interface CreateHoldingDto {
  securityId: string;
  totalShares: number;
  averageCost?: number;
}

export interface UpdateHoldingDto {
  totalShares?: number;
  averageCost?: number;
}

// ============================================================================
// TRANSACTION
// ============================================================================

export type TransactionType = "Buy" | "Sell";

export interface Transaction {
  id: string;
  holdingId: string;
  transactionType: TransactionType;
  shares: number;
  pricePerShare: number;
  totalAmount: number;
  fees: number;
  transactionDate: string; // ISO date string
  notes?: string | null;
  createdAt: string;
}

export interface CreateTransactionDto {
  holdingId: string;
  transactionType: TransactionType;
  shares: number;
  pricePerShare: number;
  //totalAmount: number; // this will be calculated
  fees?: number;
  transactionDate: string; // ISO format: "2024-01-15T00:00:00Z"
  notes?: string;
}

export interface UpdateTransactionDto {
  transactionType?: TransactionType;
  shares?: number;
  pricePerShare?: number;
  totalAmount?: number;
  fees?: number;
  transactionDate?: string;
  notes?: string;
}

// ============================================================================
// PRICE HISTORY ENTITY (for charts - FUTURE use)
// ============================================================================

export interface PriceHistory {
  id: string;
  securityId: string;
  price: number;
  openPrice?: number | null;
  highPrice?: number | null;
  lowPrice?: number | null;
  closePrice?: number | null;
  volume?: number | null;
  priceDate: string;
  createdAt: string;
}

// ============================================================================
// EXTERNAL PRICE DATA DTO (from 3rd party API)
// ============================================================================

export interface StockQuote {
  symbol: string;
  price: number;
  change: number;
  changePercent: number;
  volume?: number;
  lastUpdated: string;
}

export interface CompanyInfo {
  symbol: string;
  name: string;
  description?: string;
  exchange?: string;
  sector?: string;
  industry?: string;
  marketCap?: number;
}

// ============================================================================
// UI-SPECIFIC TYPES (Not from backend)
// Used for frontend state management and calculations
// For the Yahoo Finance-style table
// ============================================================================

export interface HoldingTableRow extends Holding {
  // All Holding fields plus:
  currentPrice: number;
  marketValue: number;
  bookValue: number;
  unrealizedGain: number;
  unrealizedGainPercent: number;
  dayChange: number;
  dayChangePercent: number;
}

// For expandable transaction rows
export interface TransactionTableRow extends Transaction {
  securitySymbol?: string;
  securityName?: string;
}
