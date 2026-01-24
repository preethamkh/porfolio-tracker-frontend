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
import { Portfolio, CreatePortfolioDto, UpdatePortfolioDto } from "@/types";
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

export function useGetPortfolios(userId: string) {
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
export function useGetPortfolio(userId: string, portfolioId: string) {
  return useQuery({
    queryKey: portfolioKeys.detail(userId, portfolioId),
    queryFn: () => getPortfolioById(userId, portfolioId),
    enabled: !!userId && !!portfolioId,
  });
}

// Get default portfolio for user (derived from  list of portfolios where isDefault=true)
export function useGetDefaultPortfolio(userId: string) {
  return useQuery({
    queryKey: portfolioKeys.default(userId),
    queryFn: async () => {
      const portfolios = await getUserPortfolios(userId);
      return portfolios.find((p) => p.isDefault) || portfolios[0] || null;
    },
    enabled: !!userId,
    select: (data) => data, // Return the default portfolio object
  });
}

// Create a new portfolio
export function useCreatePortfolio() {
  const queryClient = useQueryClient();
  const { toast } = useToast();
  return useMutation({
    mutationFn: ({
      userId,
      data,
    }: {
      userId: string;
      data: CreatePortfolioDto;
    }) => createPortfolio(userId, data),
    onSuccess: (_, { userId }) => {
      // Invalidate list (new portfolio added) and default (might have become default)
      queryClient.invalidateQueries({
        queryKey: portfolioKeys.list(userId),
      });
      queryClient.invalidateQueries({
        queryKey: portfolioKeys.default(userId),
      });
      toast({
        title: "Portfolio Created",
        description: "The new portfolio has been created successfully.",
      });
    },
  });
}

// Update a portfolio
export function useUpdatePortfolio() {
  const queryClient = useQueryClient();
  const { toast } = useToast();
  return useMutation({
    mutationFn: ({
      userId,
      portfolioId,
      data,
    }: {
      userId: string;
      portfolioId: string;
      data: UpdatePortfolioDto;
    }) => updatePortfolio(userId, portfolioId, data),
    onSuccess: (_, { userId, portfolioId }) => {
      // Invalidate list (name/currency changed), detail (specific portfolio changed), and default (isDefault flag might have changed)
      queryClient.invalidateQueries({
        queryKey: portfolioKeys.list(userId),
      });
      queryClient.invalidateQueries({
        queryKey: portfolioKeys.detail(userId, portfolioId),
      });
      queryClient.invalidateQueries({
        queryKey: portfolioKeys.default(userId),
      });
      toast({
        title: "Portfolio Updated",
        description: "The portfolio has been updated successfully.",
      });
    },
  });
}

// Delete a portfolio
export function useDeletePortfolio() {
  const queryClient = useQueryClient();
  const { toast } = useToast();
  return useMutation({
    mutationFn: ({
      userId,
      portfolioId,
    }: {
      userId: string;
      portfolioId: string;
    }) => deletePortfolio(userId, portfolioId),
    onSuccess: (_, { userId }) => {
      // Invalidate list (portfolio removed) and default (if deleted the default, another becomes default)
      queryClient.invalidateQueries({
        queryKey: portfolioKeys.list(userId),
      });
      queryClient.invalidateQueries({
        queryKey: portfolioKeys.default(userId),
      });
      toast({
        title: "Portfolio Deleted",
        description: "The portfolio has been deleted successfully.",
      });
    },
  });
}

// Set a portfolio as default
export function useSetDefaultPortfolio() {
  const queryClient = useQueryClient();
  const { toast } = useToast();
  return useMutation({
    mutationFn: ({
      userId,
      portfolioId,
    }: {
      userId: string;
      portfolioId: string;
    }) => setDefaultPortfolio(userId, portfolioId),
    onSuccess: (_, { userId }) => {
      // Invalidate list (all isDefault flags changed) and default (the default portfolio changed)
      queryClient.invalidateQueries({
        queryKey: portfolioKeys.list(userId),
      });
      queryClient.invalidateQueries({
        queryKey: portfolioKeys.default(userId),
      });
      toast({
        title: "Default Portfolio Set",
        description: "The portfolio has been set as your default.",
      });
    },
  });
}
