/**
 * Dashboard Page
 *
 * Main page after login - will show holdings table.
 * For now, it's a placeholder that confirms auth is working.
 */

import { useAuth } from "@/contexts/AuthContext";

import { Button } from "@/components/ui/button";

import { useGetDefaultPortfolio } from "@/api/hooks/usePortfolios";
import { useGetPortfolioHoldings } from "@/api/hooks/useHoldings";
import { HoldingsTable } from "@/components/holdings/HoldingsTable";
import { formatCurrency, formatPercent } from "@/utils/formatters";
import { useMemo } from "react";

import { LoadingPage } from "@/components/common/LoadingSpinner";
import { ErrorDisplay } from "@/components/common/ErrorDisplay";

import AddTransactionDialog from "@/components/transactions/AddTransactionDialog";

export function DashboardPage() {
  const { user, logout } = useAuth();

  // Fetch user's default portfolio
  const {
    data: portfolio,
    isLoading: isLoadingPortfolio,
    error: portfolioError,
    refetch: refetchPortfolio,
  } = useGetDefaultPortfolio(user?.id || "");

  // Fetch holdings for the portfolio
  const {
    data: holdings = [],
    isLoading: isLoadingHoldings,
    error: holdingsError,
    refetch: refetchHoldings,
  } = useGetPortfolioHoldings(portfolio?.id || "", user?.id || ""); //todo: check if this is correct

  // Calculate portfolio summary
  const summary = useMemo(() => {
    if (!holdings.length) {
      return {
        totalValue: 0,
        totalCost: 0,
        totalGain: 0,
        totalGainPercent: 0,
        hasMissingPrices: false,
      };
    }

    // DEBUG: Log raw API response to inspect structure
    console.log("Holdings data:", holdings);

    let hasMissingPrices = false;

    // OPTIMIZATION: Backend HoldingDto already calculates per-holding values
    // (CurrentValue, TotalCost, UnrealizedGainLoss, etc.) in HoldingService.MapToHoldingDtoAsync
    // We just sum them instead of recalculating to ensure consistency with HoldingsTable

    // Sum up CurrentValue (shares * current price) from each holding
    const totalValue = holdings.reduce((sum, h) => {
      // SAFETY: Backend returns currentValue as flat property on HoldingDto
      // Use type assertion since our Holding interface doesn't include these calculated fields yet
      const currentValue = (h as any).currentValue ?? 0;

      // Track if price data is missing for warning banner
      if (
        (h as any).currentPrice === undefined ||
        (h as any).currentPrice === null
      ) {
        hasMissingPrices = true;
      }

      return sum + currentValue;
    }, 0);

    // Sum up TotalCost (shares * average cost) from each holding
    const totalCost = holdings.reduce((sum, h) => {
      const holdingCost = (h as any).totalCost ?? 0;
      return sum + holdingCost;
    }, 0);

    // Sum up UnrealizedGainLoss (current value - total cost) from each holding
    const totalGain = holdings.reduce((sum, h) => {
      const unrealizedGain = (h as any).unrealizedGainLoss ?? 0;
      return sum + unrealizedGain;
    }, 0);

    // Calculate portfolio-level gain percentage
    const totalGainPercent = totalCost > 0 ? totalGain / totalCost : 0;

    return {
      totalValue,
      totalCost,
      totalGain,
      totalGainPercent,
      hasMissingPrices,
    };
  }, [holdings]);

  // ============================================================================
  // RENDER: LOADING STATE
  // ============================================================================

  if (isLoadingPortfolio) {
    return <LoadingPage message="Loading your portfolio..." />;
  }

  // if (isLoadingHoldings) {
  //   return <LoadingPage message="Loading your holdings..." />;
  // }

  // ============================================================================
  // RENDER: ERROR STATE
  // ============================================================================

  if (portfolioError || holdingsError) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-gray-100 to-teal-50">
        <header className="border-b border-teal-200 bg-white shadow-sm">
          <div className="container mx-auto px-4 py-4 flex items-center justify-between">
            <h1 className="text-2xl font-bold text-gray-900">
              Portfolio Tracker
            </h1>
            <Button
              variant="outline"
              onClick={logout}
              className="border-teal-300 text-teal-700 hover:bg-teal-50"
            >
              Logout
            </Button>
          </div>
        </header>
        <main className="container mx-auto px-4 py-8">
          <ErrorDisplay
            title="Error Loading Portfolio"
            message={
              (portfolioError as any)?.message ||
              (holdingsError as any)?.message
            }
            onRetry={portfolioError ? refetchPortfolio : refetchHoldings} // todo: refetchPortfolio?
          />
        </main>
      </div>
    );
  }

  // ============================================================================
  // RENDER: MAIN DASHBOARD
  // ============================================================================

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-gray-100 to-teal-50 font-sans">
      {/* Header */}
      <header className="border-b border-teal-200 bg-white sticky top-0 z-10 shadow-sm">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">
                Portfolio Tracker
              </h1>
              <p className="text-sm text-gray-600">
                {portfolio?.name || "My Portfolio"}
              </p>
            </div>
            <div className="flex items-center gap-4">
              {/* User Info */}
              <div className="hidden md:block text-right">
                <p className="text-sm font-semibold text-gray-900">
                  {user?.fullName || user?.email}
                </p>
                <p className="text-xs text-gray-500">{user?.email}</p>
              </div>
              <Button
                variant="outline"
                onClick={logout}
                className="border-teal-300 text-teal-700 hover:bg-teal-50"
              >
                Logout
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Portfolio Summary */}
      <div className="bg-white border-b border-teal-200">
        <div className="container mx-auto px-4 py-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            {/* Total Value */}
            <div>
              <p className="text-sm text-gray-600 mb-1">Total Value</p>
              <p className="text-2xl font-bold text-gray-900">
                {formatCurrency(
                  summary.totalValue,
                  portfolio?.currency || "AUD",
                )}
              </p>
            </div>

            {/* Total Cost */}
            <div>
              <p className="text-sm text-gray-600 mb-1">Total Cost</p>
              <p className="text-2xl font-bold text-gray-900">
                {formatCurrency(
                  summary.totalCost,
                  portfolio?.currency || "AUD",
                )}
              </p>
            </div>

            {/* Total Gain/Loss */}
            <div>
              <p className="text-sm text-gray-600 mb-1">Total Gain/Loss</p>
              <p
                className={`text-2xl font-bold ${
                  summary.totalGain >= 0 ? "text-profit" : "text-loss"
                }`}
              >
                {formatCurrency(
                  summary.totalGain,
                  portfolio?.currency || "AUD",
                )}
              </p>
            </div>

            {/* Gain % */}
            <div>
              <p className="text-sm text-gray-600 mb-1">Return %</p>
              <p
                className={`text-2xl font-bold ${
                  summary.totalGainPercent >= 0 ? "text-profit" : "text-loss"
                }`}
              >
                {formatPercent(summary.totalGainPercent)}
              </p>
            </div>
          </div>

          {/* VISUAL FEEDBACK: Show warning when price data is missing */}
          {/* hasMissingPrices flag is set when security object or currentPrice is null/undefined */}
          {summary.hasMissingPrices && (
            <div className="mt-4 bg-yellow-50 border border-yellow-200 rounded-lg p-3 flex items-start gap-2">
              <svg
                className="w-5 h-5 text-yellow-600 mt-0.5 flex-shrink-0"
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <path
                  fillRule="evenodd"
                  d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z"
                  clipRule="evenodd"
                />
              </svg>
              <div className="flex-1">
                <p className="text-sm text-yellow-800 font-medium">
                  Price data unavailable for some holdings
                </p>
                <p className="text-xs text-yellow-700 mt-1">
                  Total value calculations may be incomplete. Market prices will
                  be fetched when available.
                </p>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Main Content - Holdings Table */}
      <main className="container mx-auto px-4 py-8">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-xl font-semibold text-gray-900">Holdings</h2>
            <p className="text-sm text-gray-500">
              Manage your portfolio positions
            </p>
          </div>
          <AddTransactionDialog portfolioId={portfolio?.id || ""} />
        </div>
        <HoldingsTable
          holdings={holdings}
          isLoading={isLoadingHoldings}
          onRefresh={refetchHoldings}
        />
      </main>

      {/* Footer */}
      <footer className="mt-12 text-center text-xs text-gray-400 pb-8">
        &copy; {new Date().getFullYear()} Portfolio Tracker. All rights
        reserved.
      </footer>
    </div>
  );
}

export default DashboardPage;
