/**
 * Dashboard Page
 *
 * Main page after login - will show holdings table.
 * For now, it's a placeholder that confirms auth is working.
 */

import { useAuth } from "@/contexts/AuthContext";

import { Button } from "@/components/ui/button";
import { RoadmapTimeline } from "@/components/common/RoadmapTimeline";
import { ROADMAP } from "@/utils/roadmap";

import { useGetDefaultPortfolio } from "@/api/hooks/usePortfolios";
import { useGetPortfolioHoldings } from "@/api/hooks/useHoldings";
import { HoldingsTable } from "@/components/holdings/HoldingsTable";
import { formatCurrency, formatPercent } from '@/utils/formatters';
import { useMemo } from 'react';

import { LoadingPage } from '@/components/common/LoadingSpinner';
import { ErrorDisplay } from '@/components/common/ErrorDisplay';

export function DashboardPage() {
  const { user, logout } = useAuth();

  // Fetch user's default portfolio
  const {
    data: portfolio,
    isLoading: isLoadingPortfolio,
    error: portfolioError,
    refetch: refetchPortfolio,
  } = useGetDefaultPortfolio(user?.id || '');

  // Fetch holdings for the portfolio
  const {
    data: holdings = [],
    isLoading: isLoadingHoldings,
    error: holdingsError,
    refetch: refetchHoldings,
  } = useGetPortfolioHoldings(portfolio?.id || '', user?.id || ''); //todo: check if this is correct

  // Calculate portfolio summary
  const summary = useMemo(() => {
    if (!holdings.length) {
      return {
        totalValue: 0,
        totalCost: 0,
        totalGain: 0,
        totalGainPercent: 0,
        hasMissingPrices: false
      };
    }

    // DEBUG: Log raw API response to inspect structure
    console.log('Holdings data:', holdings);

    let hasMissingPrices = false;

    const totalValue = holdings.reduce((sum, h) => {
      // SAFETY: Backend may not populate security object (EF navigation property issue)
      // Skip this holding if security is undefined/null to prevent crash
      if (!h?.security) {
        console.warn('Holding missing security object:', h);
        hasMissingPrices = true;
        return sum;
      }

      // SAFETY: Use ?? (nullish coalescing) to default to 0 if currentPrice is null/undefined
      // This handles cases where backend SecurityDto doesn't include currentPrice
      const currentPrice = h.security.currentPrice ?? 0;

      // Track if price data is unavailable for warning banner
      if (h.security.currentPrice === undefined || h.security.currentPrice === null) {
        hasMissingPrices = true;
      }

      // SAFETY: Protect totalShares in case it's null/undefined
      return sum + (h.totalShares ?? 0) * currentPrice;
    }, 0);

    const totalCost = holdings.reduce((sum, h) => {
      // SAFETY: Use ?? for all numeric fields that might be null/undefined
      const avgCost = h.averageCost ?? 0;
      const shares = h.totalShares ?? 0;
      return sum + shares * avgCost;
    }, 0);

    const totalGain = totalValue - totalCost;
    const totalGainPercent = totalCost > 0 ? totalGain / totalCost : 0;

    return { totalValue, totalCost, totalGain, totalGainPercent, hasMissingPrices };
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
      <div className="min-h-screen bg-background">
        <header className="border-b border-border bg-card">
          <div className="container mx-auto px-4 py-4 flex items-center justify-between">
            <h1 className="text-2xl font-bold">Portfolio Tracker</h1>
            <Button variant="outline" onClick={logout}>
              Logout
            </Button>
          </div>
        </header>
        <main className="container mx-auto px-4 py-8">
          <ErrorDisplay
            title="Error Loading Portfolio"
            message={(portfolioError as any)?.message || (holdingsError as any)?.message}
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
      <header className="border-b border-border bg-card sticky top-0 z-10">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold">Portfolio Tracker</h1>
              <p className="text-sm text-muted-foreground">
                {portfolio?.name || 'My Portfolio'}
              </p>
            </div>
            <Button variant="outline" onClick={logout}>
              Logout
            </Button>
          </div>
        </div>
      </header>

      {/* Portfolio Summary */}
      <div className="bg-card border-b border-border">
        <div className="container mx-auto px-4 py-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            {/* Total Value */}
            <div>
              <p className="text-sm text-muted-foreground mb-1">Total Value</p>
              <p className="text-2xl font-bold">
                {formatCurrency(summary.totalValue, portfolio?.currency || 'AUD')}
              </p>
            </div>

            {/* Total Cost */}
            <div>
              <p className="text-sm text-muted-foreground mb-1">Total Cost</p>
              <p className="text-2xl font-bold">
                {formatCurrency(summary.totalCost, portfolio?.currency || 'AUD')}
              </p>
            </div>

            {/* Total Gain/Loss */}
            <div>
              <p className="text-sm text-muted-foreground mb-1">Total Gain/Loss</p>
              <p
                className={`text-2xl font-bold ${summary.totalGain >= 0 ? 'text-profit' : 'text-loss'
                  }`}
              >
                {formatCurrency(summary.totalGain, portfolio?.currency || 'AUD')}
              </p>
            </div>

            {/* Gain % */}
            <div>
              <p className="text-sm text-muted-foreground mb-1">Return %</p>
              <p
                className={`text-2xl font-bold ${summary.totalGainPercent >= 0 ? 'text-profit' : 'text-loss'
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
              <svg className="w-5 h-5 text-yellow-600 mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
              </svg>
              <div className="flex-1">
                <p className="text-sm text-yellow-800 font-medium">
                  Price data unavailable for some holdings
                </p>
                <p className="text-xs text-yellow-700 mt-1">
                  Total value calculations may be incomplete. Market prices will be fetched when available.
                </p>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Main Content - Holdings Table */}
      <main className="container mx-auto px-4 py-8">
        <HoldingsTable
          holdings={holdings}
          isLoading={isLoadingHoldings}
          onRefresh={refetchHoldings}
        />
      </main>

      {/* Roadmap Timeline (condensed) */}
      <section className="container mx-auto px-4 py-6 max-w-3xl">
        <div className="bg-gradient-to-br from-white via-teal-50 to-blue-50 border border-teal-300 rounded-2xl p-4 shadow-md">
          <RoadmapTimeline roadmap={ROADMAP} condensed />
        </div>
      </section>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8">
        <div className="bg-white border border-teal-300 rounded-2xl p-10 shadow-xl max-w-2xl mx-auto text-center">
          <h2 className="text-3xl font-extrabold text-teal-700 mb-4">
            Authentication Working!
          </h2>
          <p className="text-gray-500 mb-8">
            You successfully logged in. (TBD) - Holdings table will go here.
          </p>

          <div className="bg-teal-50 rounded-xl p-8 max-w-md mx-auto text-left shadow-sm">
            <h3 className="font-semibold text-teal-700 mb-4 text-lg">
              Your Details
            </h3>
            <dl className="space-y-4 text-base">
              <div className="flex justify-between items-center">
                <dt className="text-gray-500 font-medium">Email:</dt>
                <dd className="font-semibold text-gray-800">{user?.email}</dd>
              </div>
              <div className="flex justify-between items-center">
                <dt className="text-gray-500 font-medium">Full Name:</dt>
                <dd className="font-semibold text-gray-800">
                  {user?.fullName || "Not set"}
                </dd>
              </div>
              <div className="flex justify-between items-center">
                <dt className="text-gray-500 font-medium">User ID:</dt>
                <dd className="font-mono text-xs text-teal-700">{user?.id}</dd>
              </div>
            </dl>
          </div>
        </div>
      </main>
      {/* Footer */}
      <footer className="mt-12 text-center text-xs text-gray-400">
        &copy; {new Date().getFullYear()} Portfolio Tracker. All rights
        reserved.
      </footer>
    </div>
  );
}

export default DashboardPage;
