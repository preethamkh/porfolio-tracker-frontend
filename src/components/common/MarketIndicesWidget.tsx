/**
 * Market Indices Widget
 *
 * Displays major market indices performance
 * Static data for now - can be connected to real API later
 */

import { TrendingUp, TrendingDown } from "lucide-react";

interface MarketIndex {
  name: string;
  symbol: string;
  value: number;
  change: number;
  changePercent: number;
}

export function MarketIndicesWidget() {
  // TODO: Replace with real API data later
  const indices: MarketIndex[] = [
    {
      name: "S&P 500",
      symbol: "^GSPC",
      value: 5234.18,
      change: 26.42,
      changePercent: 0.51,
    },
    {
      name: "Dow Jones",
      symbol: "^DJI",
      value: 38467.31,
      change: 115.33,
      changePercent: 0.3,
    },
    {
      name: "NASDAQ",
      symbol: "^IXIC",
      value: 16341.13,
      change: -32.52,
      changePercent: -0.2,
    },
    {
      name: "Russell 2000",
      symbol: "^RUT",
      value: 2043.67,
      change: 8.91,
      changePercent: 0.44,
    },
  ];

  return (
    <div className="bg-gradient-to-r from-blue-50 to-indigo-50 border-y border-blue-200 overflow-hidden">
      <div className="container mx-auto px-4 py-3">
        <div className="flex items-center justify-between gap-4">
          <div className="flex items-center gap-3 flex-shrink-0">
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></div>
              <span className="text-xs md:text-sm font-semibold text-gray-700">
                Markets Open
              </span>
            </div>
            <span className="text-xs px-2 py-0.5 bg-blue-100 text-blue-700 rounded-full font-medium border border-blue-200">
              Preview Data
            </span>
          </div>

          <div
            className="flex items-center gap-4 md:gap-6 overflow-x-auto flex-1 -mr-4 pr-4"
            style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
          >
            {indices.map((index) => (
              <div
                key={index.symbol}
                className="flex items-center gap-3 min-w-fit"
              >
                <div>
                  <p className="text-xs font-medium text-gray-600">
                    {index.name}
                  </p>
                  <p className="text-sm font-bold text-gray-900">
                    {index.value.toLocaleString("en-US", {
                      minimumFractionDigits: 2,
                    })}
                  </p>
                </div>
                <div
                  className={`flex items-center gap-1 ${index.change >= 0 ? "text-green-600" : "text-red-600"}`}
                >
                  {index.change >= 0 ? (
                    <TrendingUp className="h-3 w-3" />
                  ) : (
                    <TrendingDown className="h-3 w-3" />
                  )}
                  <span className="text-xs font-semibold">
                    {index.change >= 0 ? "+" : ""}
                    {index.changePercent.toFixed(2)}%
                  </span>
                </div>
              </div>
            ))}
          </div>

          <span className="text-xs text-gray-500 hidden lg:block">
            Last sync: 2 mins ago
          </span>
        </div>
      </div>
    </div>
  );
}
