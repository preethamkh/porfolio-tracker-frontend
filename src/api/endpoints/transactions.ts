/**
 * Transaction API Endpoints
 * Maps to: TransactionsController in the backend
 */

import apiClient from "../client";
import {
  Transaction,
  CreateTransactionDto,
  UpdateTransactionDto,
} from "@/types";

/**
 * Get all transactions for a given holding
 *GET /api/users/{userId}/holdings/{holdingId}/transactions
 */
export async function getHoldingTransactions(
  userId: string,
  holdingId: string,
): Promise<Transaction[]> {
  const response = await apiClient.get<Transaction[]>(
    `/users/${userId}/holdings/${holdingId}/transactions`,
  );
  return response.data;
}

/**
 * Get all transactions for a given portfolio
 * GET /api/users/{userId}/portfolios/{portfolioId}/transactions
 */
export async function getPortfolioTransactions(
  userId: string,
  portfolioId: string,
): Promise<Transaction[]> {
  const response = await apiClient.get<Transaction[]>(
    `/users/${userId}/portfolios/${portfolioId}/transactions`,
  );
  return response.data;
}

/**
 * Get a specific transaction by ID
 * GET /api/users/{userId}/transactions/{transactionId}
 */
export async function getTransaction(
  userId: string,
  transactionId: string,
): Promise<Transaction> {
  const response = await apiClient.get<Transaction>(
    `/users/${userId}/transactions/${transactionId}`,
  );
  return response.data;
}

/**
 * Create a new transaction
 * POST /api/users/{userId}/transactions
 */
export async function createTransaction(
  userId: string,
  portfolioId: string,
  data: CreateTransactionDto,
): Promise<Transaction> {
  const response = await apiClient.post<Transaction>(
    `/users/${userId}/portfolios/${portfolioId}/transactions`,
    data,
  );
  return response.data;
}

/**
 * Update an existing transaction
 * PUT /api/users/{userId}/transactions/{transactionId}
 */
export async function updateTransaction(
  userId: string,
  transactionId: string,
  data: UpdateTransactionDto,
): Promise<Transaction> {
  const response = await apiClient.put<Transaction>(
    `/users/${userId}/transactions/${transactionId}`,
    data,
  );
  return response.data;
}

/**
 * Delete a transaction
 * DELETE /api/users/{userId}/transactions/{transactionId}
 */
export async function deleteTransaction(
  userId: string,
  transactionId: string,
): Promise<void> {
  await apiClient.delete(`/users/${userId}/transactions/${transactionId}`);
}
