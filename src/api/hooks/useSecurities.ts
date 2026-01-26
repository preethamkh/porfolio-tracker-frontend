import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  searchSecurities,
  getSecurity,
  getSecurityBySymbol,
  getOrCreateSecurity,
} from "../endpoints/securities";
import type { GetOrCreateSecurityRequest } from "@/types";
import { useToast } from "@/hooks/use-toast";
import { AxiosError } from "axios";

// ============================================================================
// QUERY KEYS
// ============================================================================

export const securitiesKeys = {
  all: ["securities"] as const,
  search: (query: string, limit: number) =>
    ["securities", "search", query, limit] as const,
  detail: (id: string) => ["securities", "detail", id] as const,
  bySymbol: (symbol: string) => ["securities", "symbol", symbol] as const,
};

/**
 * Hook: Search securities
 * Automatically caches results for 5 minutes
 */

export function useSecuritySearch(
  query: string,
  limit: number = 10,
  enabled = true,
) {
  return useQuery({
    queryKey: securitiesKeys.search(query, limit),
    queryFn: () => searchSecurities(query, limit),
    enabled: enabled && query.length >= 2,
    staleTime: 12 * 60 * 60 * 1000, // 12 hours
    // Don't refetch on window focus (search results don't change that fast)
    refetchOnWindowFocus: false,
  });
}

/**
 * Hook: Get single security by ID
 */
/**
 * Custom React Query hook for fetching a single security by ID.
 *
 * The query is only enabled when a valid (non-empty) ID is provided.
 *
 * @param id - The unique identifier of the security to fetch
 * @returns A React Query result object containing the security data, loading state, and error state
 *
 * @example
 * ```tsx
 * const { data: security, isLoading, error } = useSecurity('ABC123');
 * ```
 */
export function useSecurity(id: string, enabled = true) {
  return useQuery({
    queryKey: securitiesKeys.detail(id),
    queryFn: () => getSecurity(id),
    enabled: enabled && !!id,
    staleTime: 10 * 60 * 1000, // 10 minutes
  });
}

/**
 * Hook: Get security by symbol
 */
export function useSecurityBySymbol(symbol: string, enabled = true) {
  return useQuery({
    queryKey: securitiesKeys.bySymbol(symbol),
    queryFn: () => getSecurityBySymbol(symbol),
    enabled: enabled && !!symbol,
    staleTime: 10 * 60 * 1000, // 10 minutes
  });
}

/**
 * Hook: Get or create security by symbol
 * Useful when adding transactions - ensures security exists
 */
export function useGetOrCreateSecurity() {
  const queryClient = useQueryClient();
  const { toast } = useToast();
  return useMutation({
    mutationFn: (data: GetOrCreateSecurityRequest) => getOrCreateSecurity(data),
    onSuccess: () => {
      // Invalidate search queries to include the new/fetched security
      queryClient.invalidateQueries({ queryKey: securitiesKeys.all });
      // Optionally show success toast (commented out to avoid spam)
      // toast({
      //   title: 'Security loaded',
      //   description: `${security.symbol} - ${security.name}`,
      // });
    },
    onError: (error: AxiosError<{ message?: string }>) => {
      toast({
        title: "Error fetching security",
        description: error.response?.data?.message || "Something went wrong",
        variant: "destructive",
      });
    },
  });
}
