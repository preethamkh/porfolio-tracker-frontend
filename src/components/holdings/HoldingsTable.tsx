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
} from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { ArrowUpDown, RefreshCw } from 'lucide-react';
import { formatCurrency, formatNumber, formatPercent, formatShares } from '@/utils/formatters';
import { cn } from '@/lib/utils';

// ============================================================================
// TYPES
// ============================================================================

type SortField = 'symbol' | 'shares' | 'price' | 'cost' | 'value' | 'gain' | 'gainPercent';
type SortDirection = 'asc' | 'desc';

interface HoldingsTableProps {
    holdings: Holding[];
    isLoading: boolean;
    onRefresh: () => void;
}

// ============================================================================
// COMPONENT
// ============================================================================

export function HoldingsTable({ holdings, isLoading, onRefresh }: HoldingsTableProps) {
    const [sortField, setSortField] = useState<SortField>('symbol');
    const [sortDirection, setSortDirection] = useState<SortDirection>('asc');

    // ============================================================================
    // CALCULATE DERIVED VALUES
    // ============================================================================

    /**
     * Enhance Holdings with calculated fields
     */

    const enrichedHoldings = useMemo(() => {
        return holdings.map((holding) => {
            // Current price (from security.currentPrice if available, or use a default)
            const currentPrice = holding.security.currentPrice || 0;

            // Market value = shares * current price
            const marketValue = holding.totalShares * currentPrice;

            // Book value (cost basis) = shares * average cost
            const bookValue = holding.totalShares * (holding.averageCost || 0);

            // Unrealized gain/loss
            const unrealizedGain = marketValue - bookValue;
            const unrealizedGainPercent = bookValue > 0 ? (unrealizedGain / bookValue) : 0;

            return {
                ...holding,
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

            let aValue: any;  // Will hold the value to compare from 'a'
            let bValue: any;  // Will hold the value to compare from 'b'

            // 2. Extract the SAME FIELD from BOTH objects based on sortField
            switch (sortField) {
                case 'symbol':
                    aValue = a.security.symbol;  // e.g., "AAPL"
                    bValue = b.security.symbol;  // e.g., "TSLA"
                    break;
                case 'shares':
                    aValue = a.totalShares;      // e.g., 100
                    bValue = b.totalShares;      // e.g., 50
                    break;
                case 'price':
                    aValue = a.currentPrice;
                    bValue = b.currentPrice;
                    break;
                case 'cost':
                    aValue = a.averageCost || 0;
                    bValue = b.averageCost || 0;
                    break;
                case 'value':
                    aValue = a.marketValue;
                    bValue = b.marketValue;
                    break;
                case 'gain':
                    aValue = a.unrealizedGain;
                    bValue = b.unrealizedGain;
                    break;
                case 'gainPercent':
                    aValue = a.unrealizedGainPercent;
                    bValue = b.unrealizedGainPercent;
                    break;
                default:
                    return 0;
            }

            // 3. Compare the values based on their type
            // String comparison using localeCompare
            if (typeof aValue === 'string') {
                return sortDirection === 'asc'
                    ? aValue.localeCompare(bValue)  // "AAPL" vs "TSLA"
                    : bValue.localeCompare(aValue);
            }

            // 4. Number comparison using subtraction
            // Returns: negative (a before b), 0 (equal), positive (a after b)
            return sortDirection === 'asc' ? aValue - bValue : bValue - aValue;
        });

        return sorted;
    }, [enrichedHoldings, sortField, sortDirection]);
    // ☝️ Dependency array: Only recalculate when these values change
    // - enrichedHoldings: When the data changes
    // - sortField: When user clicks a different column to sort by
    // - sortDirection: When user toggles between ascending/descending
    // This prevents unnecessary re-sorting on every render (performance optimization)

}