import { useMutation, useQueryClient } from "@tanstack/react-query";
import {
  createTransaction,
  updateTransaction,
  deleteTransaction,
} from "../endpoints/transactions";
import type { CreateTransactionDto, UpdateTransactionDto } from "@/types";
import { useToast } from "@/hooks/use-toast";
import { holdingKeys } from "./useHoldings";
import { portfolioKeys } from "./usePortfolios";

/**
 * Hook: Create transaction
 * Automatically invalidates holdings and portfolio queries after creation
 */
export function useCreateTransaction() {
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
      data: CreateTransactionDto;
    }) => createTransaction(userId, portfolioId, data),
    onSuccess: () => {
      // Invalidate all holdings and portfolios to show updated data
      queryClient.invalidateQueries({ queryKey: holdingKeys.all });
      queryClient.invalidateQueries({ queryKey: portfolioKeys.all });

      toast({
        title: "Transaction added",
        description: "Your transaction has been recorded successfully.",
      });
    },
    onError: (error: any) => {
      toast({
        title: "Failed to add transaction",
        description: error.response?.data?.message || "Something went wrong",
        variant: "destructive",
      });
    },
  });
}

/**
 * Hook: Update an existing transaction
 * Automatically invalidates holdings and portfolio queries after update
 */
export function useUpdateTransaction() {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: ({
      userId,
      transactionId,
      data,
    }: {
      userId: string;
      transactionId: string;
      data: UpdateTransactionDto;
    }) => updateTransaction(userId, transactionId, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: holdingKeys.all });
      queryClient.invalidateQueries({ queryKey: portfolioKeys.all });

      toast({
        title: "Transaction updated",
        description: "Changes saved successfully.",
      });
    },
    onError: (error: any) => {
      toast({
        title: "Failed to update transaction",
        description: error.response?.data?.message || "Something went wrong",
        variant: "destructive",
      });
    },
  });
}

/**
 * Hook: Delete a transaction
 * Automatically invalidates holdings and portfolio queries after deletion
 */
export function useDeleteTransaction() {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: ({
      userId,
      transactionId,
    }: {
      userId: string;
      transactionId: string;
    }) => deleteTransaction(userId, transactionId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: holdingKeys.all });
      queryClient.invalidateQueries({ queryKey: portfolioKeys.all });
      toast({
        title: "Transaction deleted",
        description: "The transaction has been removed successfully.",
      });
    },
    onError: (error: any) => {
      toast({
        title: "Failed to delete transaction",
        description: error.response?.data?.message || "Something went wrong",
        variant: "destructive",
      });
    },
  });
}
