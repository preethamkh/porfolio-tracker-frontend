/**
 * Portfolio TanStack Query Hooks
 *
 * These are custom React hooks that wrap API calls.
 * TanStack Query is used for data fetching and caching, loading states and refetching automatically.
 *
 * Think of it like:
 * C#: var users = await _userService.GetUsersAsync();
 * or
 * C#: var users = await _context.Users.ToListAsync();
 *
 * React: const {data: users} = useGetUsers();
 *
 * But with automatic:
 * - Loading state
 * - Error handling
 * - Caching
 * - Background refetching
 *
 * Each hook corresponds to a specific API endpoint in src/api/portfolio.ts
 */

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  getUserPortfolios,
  getPortfolioById,
  createPortfolio,
  deletePortfolio,
  setDefaultPortfolio,
  updatePortfolio,
} from "@/api/endpoints/portfolio";
import { PortfolioDto, CreatePortfolioDto, UpdatePortfolioDto } from "@/types";
import { useToast } from "@/hooks/use-toast";

// ============================================================================
// QUERY KEYS
// ============================================================================

/**
 * Query keys are used by TanStack Query to identify and cache queries.
 * They should be unique per resource type and parameters.
 */

export const portfolioKeys = {
  all: ["portfolios"] as const,
  lists: () => [...portfolioKeys.all, "list"] as const,
  list: (userId: string) => [...portfolioKeys.lists(), userId] as const,
  details: () => [...portfolioKeys.all, "detail"] as const,
  detail: (userId: string, portfolioId: string) =>
    [...portfolioKeys.details(), userId, portfolioId] as const,
  default: (userId: string) =>
    [...portfolioKeys.all, "default", userId] as const,
};

// ============================================================================
// QUERIES (Read Operations)
// ============================================================================

/**
 * Get all portfolios for a user
 *
 * Usage:
 * const {data: portfolios, isLoading, error} = useGetUserPortfolios(userId);
 */

export function useGetUserPortfolios(userId: string) {
  return useQuery({
    queryKey: portfolioKeys.list(userId),
    queryFn: () => getUserPortfolios(userId),
    enabled: !!userId, // Only run if userId is provided / exists
    staleTime: 5 * 60 * 1000, // 5 minutes // todo: increase this
  });
}

/**
 * Get specific portfolio by ID
 */
export function useGetDefaultPortfolio(userId: string) {
  return useQuery({
    queryKey: portfolioKeys.default(userId),
    queryFn: async () => {
      const portfolios = await getUserPortfolios(userId);
      return portfolios.find((p) => p.isDefault) || portfolios[0] || null;
    },
    enabled: !!userId,
    select: (data) => data, // Return the default portfolio
  });
}
