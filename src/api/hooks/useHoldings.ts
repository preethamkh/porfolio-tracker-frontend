/**
 * Holdings TanStack Query Hooks
 * 
 * Manages fetching and caching of portfolio holdings data.
 * This is what powers the Yahoo Finance-style table.
 */

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
    getPortfolioHoldings,
    getHoldingById,
    createHolding,
    updateHolding,
    deleteHolding,
} from "@/api/endpoints/holdings";
import { CreateHoldingDto, UpdateHoldingDto } from "@/types";
import { useToast } from "@/hooks/use-toast";

// ============================================================================
// QUERY KEYS
// ============================================================================

export const holdingKeys = {
    all: ["holdings"] as const,
    lists: () => [...holdingKeys.all, "list"] as const,
    list: (portfolioId: string, userId: string) => [...holdingKeys.lists(), portfolioId, userId] as const,
    details: () => [...holdingKeys.all, 'detail'] as const,
    detail: (portfolioId: string, holdingId: string, userId: string) =>
        [...holdingKeys.details(), portfolioId, holdingId, userId] as const,
};

// ============================================================================
// QUERIES
// ============================================================================

/**
 * Get all holdings for a portfolio
 * 
 * This is the MAIN query for the holdings table
 * Usage:
 * const { data : holdings, isLoading, error, refetch } = useGetPortfolioHoldings(portfolioId, userId);
 */

export function useGetPortfolioHoldings(portfolioId: string, userId: string) {
    return useQuery({
        queryKey: holdingKeys.list(portfolioId, userId),
        queryFn: () => getPortfolioHoldings(portfolioId, userId),
        enabled: !!portfolioId && !!userId,
        staleTime: 24 * 60 * 60 * 1000 // 1 day // todo: check if we need to keep this as 1 day
    });
}

/**
 * Get a specific holding by Id that belongs to the user and portfolio
 */

export function useGetHoldingById(holdingId: string, userId: string, portfolioId: string) {
    return useQuery({
        queryKey: holdingKeys.detail(holdingId, userId, portfolioId),
        queryFn: () => getHoldingById(holdingId, userId, portfolioId),
        enabled: !!holdingId && !!userId && !!portfolioId
    });
}

// Crete a new holding
export function useCreateHolding() {
    const queryClient = useQueryClient();
    const { toast } = useToast();

    return useMutation({
        mutationFn: ({
            portfolioId,
            userId,
            data,
        }: {
            portfolioId: string,
            userId: string;
            data: CreateHoldingDto;
        }) => createHolding(portfolioId, userId, data),
        onSuccess: (_, { portfolioId, userId }) => {
            // Invalidate list (new holding added) and default (might have become default)
            queryClient.invalidateQueries({
                queryKey: holdingKeys.list(portfolioId, userId),
            });
            // queryClient.invalidateQueries({
            //     queryKey: holdingKeys.default(portfolioId, userId),
            // });
            toast({
                title: "Holding Created",
                description: "The new holding has been created successfully.",
            });
        },
    });
}

// Update a holding
export function useUpdateHolding() {
    const queryClient = useQueryClient();
    const { toast } = useToast();
    return useMutation({
        mutationFn: ({
            userId,
            portfolioId,
            holdingId,
            data,
        }: {
            userId: string;
            portfolioId: string;
            holdingId: string;
            data: UpdateHoldingDto;
        }) => updateHolding(userId, portfolioId, holdingId, data),
        onSuccess: (_, { portfolioId, userId, holdingId }) => {
            queryClient.invalidateQueries({
                queryKey: holdingKeys.detail(portfolioId, userId, holdingId),
            });
            toast({
                title: "Portfolio Updated",
                description: "The portfolio has been updated successfully.",
            });
        },
    });
}

// Delete a holding
export function useDeleteHolding() {
    const queryClient = useQueryClient();
    const { toast } = useToast();
    return useMutation({
        mutationFn: ({
            holdingId,
            portfolioId,
            userId
        }: {
            holdingId: string;
            portfolioId: string;
            userId: string;
        }) => deleteHolding(holdingId, portfolioId, userId),
        onSuccess: (_, { portfolioId, userId }) => {
            queryClient.invalidateQueries({
                queryKey: holdingKeys.list(portfolioId, userId),
            });
            toast({
                title: "Holding Deleted",
                description: "The holding has been deleted successfully.",
            });
        },
    });
}
