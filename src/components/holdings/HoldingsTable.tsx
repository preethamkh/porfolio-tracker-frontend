/**
 * Holdings Table Component
 *
 * Yahoo Finance-style table displaying portfolio holdings.
 * Shows: Symbol, Shares, Price, Cost, Value, Gain/Loss
 *
 * Features:
 * - Color-coded gains/losses (green/red)
 * - Sortable columns
 * - Responsive design
 * - Loading states
 */

import { useState, useMemo } from "react";
import { Holding } from "@/types";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { ArrowUpDown, RefreshCw, Inbox } from "lucide-react";
import {
  formatCurrency,
  formatPercent,
  formatShares,
} from "@/utils/formatters";
import { cn } from "@/lib/utils";

import { EmptyState } from "@/components/common/EmptyState";

// ============================================================================
// TYPES
// ============================================================================

type SortField =
  | "symbol"
  | "shares"
  | "price"
  | "cost"
  | "value"
  | "gain"
  | "gainPercent";
type SortDirection = "asc" | "desc";

interface HoldingsTableProps {
  holdings: Holding[];
  isLoading: boolean;
  onRefresh: () => void;
}

// ============================================================================
// COMPONENT
// ============================================================================

export function HoldingsTable({
  holdings,
  isLoading,
  onRefresh,
}: HoldingsTableProps) {
  const [sortField, setSortField] = useState<SortField>("symbol");
  const [sortDirection, setSortDirection] = useState<SortDirection>("asc");

  // ============================================================================
  // CALCULATE DERIVED VALUES
  // ============================================================================

  /**
   * Enhance Holdings with calculated fields
   * SAFETY: Backend may return flat structure or nested security object
   */
  const enrichedHoldings = useMemo(() => {
    return holdings.map((holding) => {
      // Handle both flat and nested security structures
      const security = holding.security || {
        id: holding.securityId || "",
        symbol: (holding as any).symbol || "N/A",
        name: (holding as any).securityName || "Unknown Security",
        currency: (holding as any).currency || "USD",
        securityType: (holding as any).securityType || "Unknown",
        currentPrice: (holding as any).currentPrice,
        createdAt: "",
        updatedAt: "",
      };

      // SAFETY: currentPrice may be in different locations
      const currentPrice =
        security.currentPrice ?? (holding as any).currentPrice ?? 0;

      // Market value = shares * current price
      const marketValue = (holding.totalShares ?? 0) * currentPrice;

      // Book value (cost basis) = shares * average cost
      const bookValue = (holding.totalShares ?? 0) * (holding.averageCost ?? 0);

      // Unrealized gain/loss
      const unrealizedGain = marketValue - bookValue;
      const unrealizedGainPercent =
        bookValue > 0 ? unrealizedGain / bookValue : 0;

      return {
        ...holding,
        security,
        currentPrice,
        marketValue,
        bookValue,
        unrealizedGain,
        unrealizedGainPercent,
      };
    });
  }, [holdings]);

  // ============================================================================
  // SORTING
  // ============================================================================

  const sortedHoldings = useMemo(() => {
    // 1. Create a copy of the array (to avoid mutating original)
    const sorted = [...enrichedHoldings].sort((a, b) => {
      // a = first holding being compared (e.g., Apple stock)
      // b = second holding being compared (e.g., Tesla stock)

      let aValue: any; // Will hold the value to compare from 'a'
      let bValue: any; // Will hold the value to compare from 'b'

      // 2. Extract the SAME FIELD from BOTH objects based on sortField
      // SAFETY: All fields use ?. and ?? to handle undefined/null values
      switch (sortField) {
        case "symbol":
          aValue = a.security?.symbol ?? ""; // Optional chaining + default to empty string
          bValue = b.security?.symbol ?? "";
          break;
        case "shares":
          aValue = a.totalShares ?? 0; // Nullish coalescing: default to 0
          bValue = b.totalShares ?? 0;
          break;
        case "price":
          aValue = a.currentPrice ?? 0; // currentPrice may not exist in SecurityDto
          bValue = b.currentPrice ?? 0;
          break;
        case "cost":
          aValue = a.averageCost ?? 0;
          bValue = b.averageCost ?? 0;
          break;
        case "value":
          aValue = a.marketValue ?? 0;
          bValue = b.marketValue ?? 0;
          break;
        case "gain":
          aValue = a.unrealizedGain ?? 0;
          bValue = b.unrealizedGain ?? 0;
          break;
        case "gainPercent":
          aValue = a.unrealizedGainPercent ?? 0;
          bValue = b.unrealizedGainPercent ?? 0;
          break;
        default:
          return 0;
      }

      // 3. Compare the values based on their type
      // String comparison using localeCompare
      if (typeof aValue === "string") {
        return sortDirection === "asc"
          ? aValue.localeCompare(bValue) // "AAPL" vs "TSLA"
          : bValue.localeCompare(aValue);
      }

      // 4. Number comparison using subtraction
      // Returns: negative (a before b), 0 (equal), positive (a after b)
      return sortDirection === "asc" ? aValue - bValue : bValue - aValue;
    });

    return sorted;
  }, [enrichedHoldings, sortField, sortDirection]);
  // ☝️ Dependency array: Only recalculate when these values change
  // - enrichedHoldings: When the data changes
  // - sortField: When user clicks a different column to sort by
  // - sortDirection: When user toggles between ascending/descending
  // This prevents unnecessary re-sorting on every render (performance optimization)

  // ============================================================================
  // HANDLERS
  // ============================================================================

  const handleSort = (field: SortField) => {
    if (sortField === field) {
      // Toggle sort direction
      setSortDirection(sortDirection === "asc" ? "desc" : "asc");
    } else {
      // Set new sort field and default to ascending
      setSortField(field);
      setSortDirection("asc");
    }
  };

  // ============================================================================
  // RENDER: LOADING STATE
  // ============================================================================

  if (isLoading) {
    return (
      <div className="space-y-4">
        {/* Skeleton loading table, arbitraty 5 placeholder rows */}
        {[...Array(5)].map((_, i) => (
          <div
            key={i}
            className="h-12 bg-gradient-to-r from-teal-50 to-blue-50 animate-pulse rounded-lg border border-teal-100"
          />
        ))}
      </div>
    );
  }

  // ============================================================================
  // RENDER: EMPTY STATE
  // ============================================================================

  if (sortedHoldings.length === 0) {
    return (
      <EmptyState
        icon={<Inbox className="w-12 h-12" />}
        title="No holdings in this portfolio yet"
        description="Start building your portfolio by adding your first holding"
        action={{
          label: "Add Your First Holding",
          onClick: () => console.log("Add holding clicked"), // TODO: Wire up to add transaction dialog
        }}
      />
    );
  }

  // ============================================================================
  // RENDER: TABLE
  // ============================================================================

  return (
    <div className="space-y-4">
      {/* Header with Refresh */}
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-gray-900">Holdings</h2>
        {onRefresh && (
          <Button
            variant="outline"
            size="sm"
            onClick={onRefresh}
            className="border-teal-300 text-teal-700 hover:bg-teal-50"
          >
            <RefreshCw className="w-4 h-4 mr-2" />
            Refresh
          </Button>
        )}
      </div>

      {/* Table */}
      <div className="border-2 border-teal-200 rounded-2xl overflow-hidden shadow-md bg-white">
        <Table>
          <TableHeader>
            <TableRow className="bg-gradient-to-r from-teal-50 to-blue-50 border-b-2 border-teal-200">
              {/* Symbol */}
              {/* Symbol */}
              <TableHead>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => handleSort("symbol")}
                  className="font-semibold"
                >
                  Symbol
                  <ArrowUpDown className="ml-2 h-4 w-4" />
                </Button>
              </TableHead>

              {/* Shares */}
              <TableHead className="text-right">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => handleSort("shares")}
                  className="font-semibold"
                >
                  Shares
                  <ArrowUpDown className="ml-2 h-4 w-4" />
                </Button>
              </TableHead>

              {/* Last Price */}
              <TableHead className="text-right">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => handleSort("price")}
                  className="font-semibold"
                >
                  Last Price
                  <ArrowUpDown className="ml-2 h-4 w-4" />
                </Button>
              </TableHead>

              {/* Avg Cost */}
              <TableHead className="text-right">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => handleSort("cost")}
                  className="font-semibold"
                >
                  Avg Cost
                  <ArrowUpDown className="ml-2 h-4 w-4" />
                </Button>
              </TableHead>

              {/* Market Value */}
              <TableHead className="text-right">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => handleSort("value")}
                  className="font-semibold"
                >
                  Market Value
                  <ArrowUpDown className="ml-2 h-4 w-4" />
                </Button>
              </TableHead>

              {/* Total Gain/Loss */}
              <TableHead className="text-right">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => handleSort("gain")}
                  className="font-semibold"
                >
                  Total Gain
                  <ArrowUpDown className="ml-2 h-4 w-4" />
                </Button>
              </TableHead>

              {/* Gain % */}
              <TableHead className="text-right">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => handleSort("gainPercent")}
                  className="font-semibold"
                >
                  Gain %
                  <ArrowUpDown className="ml-2 h-4 w-4" />
                </Button>
              </TableHead>
            </TableRow>
          </TableHeader>

          <TableBody>
            {sortedHoldings.map((holding) => (
              <TableRow
                key={holding.id}
                className="hover:bg-teal-50/50 transition-colors border-b border-teal-100"
              >
                {/* Symbol */}
                <TableCell className="font-medium">
                  <div>
                    <div className="font-bold text-teal-700">
                      {holding.security.symbol}
                    </div>
                    <div className="text-xs text-gray-500">
                      {holding.security.name}
                    </div>
                  </div>
                </TableCell>

                {/* Shares */}
                <TableCell className="text-right numeric">
                  {formatShares(holding.totalShares)}
                </TableCell>

                {/* Last Price */}
                {/* SAFETY: Show "N/A" instead of $0 when currentPrice is actually missing */}
                <TableCell className="text-right numeric">
                  {holding.security.currentPrice !== undefined &&
                  holding.security.currentPrice !== null ? (
                    formatCurrency(
                      holding.currentPrice,
                      holding.security.currency,
                    )
                  ) : (
                    <span className="text-gray-400 italic">N/A</span>
                  )}
                </TableCell>

                {/* Avg Cost */}
                <TableCell className="text-right numeric">
                  {formatCurrency(
                    holding.averageCost || 0,
                    holding.security.currency,
                  )}
                </TableCell>

                {/* Market Value */}
                <TableCell className="text-right numeric font-semibold">
                  {formatCurrency(
                    holding.marketValue,
                    holding.security.currency,
                  )}
                </TableCell>

                {/* Total Gain/Loss */}
                <TableCell
                  className={cn(
                    "text-right numeric font-semibold",
                    holding.unrealizedGain >= 0 ? "text-profit" : "text-loss",
                  )}
                >
                  {formatCurrency(
                    holding.unrealizedGain,
                    holding.security.currency,
                  )}
                </TableCell>

                {/* Gain % */}
                <TableCell
                  className={cn(
                    "text-right numeric font-semibold",
                    holding.unrealizedGainPercent >= 0
                      ? "text-profit"
                      : "text-loss",
                  )}
                >
                  {formatPercent(holding.unrealizedGainPercent)}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      {/* Summary Footer */}
      <div className="bg-gradient-to-r from-teal-50 to-blue-50 rounded-2xl p-4 border-2 border-teal-200 shadow-sm">
        <div className="flex justify-between items-center">
          <span className="text-gray-600 font-medium">Total Holdings:</span>
          <span className="font-bold text-teal-700">
            {sortedHoldings.length}
          </span>
        </div>
      </div>
    </div>
  );
}
