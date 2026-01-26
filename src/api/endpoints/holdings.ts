/**
 * Holdings API Endpoints
 * Maps to: .NET Controller: HoldingsController
 */

import apiClient from "../client";
import { Holding, CreateHoldingDto, UpdateHoldingDto } from "@/types";

/**
 * Get all holdings for a specific portfolio and user.
 *
 * GET /api/users/{userID}/portfolios/{portfolioID}/holdings
 */
export async function getPortfolioHoldings(
  portfolioId: string,
  userId: string,
): Promise<Holding[]> {
  const response = await apiClient.get<Holding[]>(
    `/users/${userId}/portfolios/${portfolioId}/holdings`,
  );
  return response.data;
}

/**
 * Get a specific holding by ID.
 *
 * GET /api/users/{userID}/portfolios/{portfolioID}/holdings/{holdingID}
 */
export async function getHoldingById(
  holdingId: string,
  userId: string,
  portfolioId: string,
): Promise<Holding> {
  const response = await apiClient.get<Holding>(
    `/users/${userId}/portfolios/${portfolioId}/holdings/${holdingId}`,
  );
  return response.data;
}

/**
 * Find holding by security ID
 * Returns null if not found
 */
export async function findHoldingBySecurityId(
  userId: string,
  portfolioId: string,
  securityId: string,
): Promise<Holding | null> {
  try {
    // Get all holdings for the portfolio
    const holdings = await getPortfolioHoldings(portfolioId, userId);

    // Find the one matching this security
    const holding = holdings.find((h) => h.securityId === securityId);

    return holding || null;
  } catch (error) {
    console.error("Error finding holding:", error);
    return null;
  }
}

/**
 * Create a new holding
 * POST /api/users/{userId}/portfolios/{portfolioId}/holdings
 */
export async function createHolding(
  portfolioId: string,
  userId: string,
  data: CreateHoldingDto,
): Promise<Holding> {
  const response = await apiClient.post<Holding>(
    `/users/${userId}/portfolios/${portfolioId}/holdings`,
    data,
  );
  return response.data;
}

/**
 * Update a holding
 * PUT /api/users/{userId}/portfolios/{portfolioId}/holdings/{holdingId}
 */
export async function updateHolding(
  userId: string,
  portfolioId: string,
  holdingId: string,
  data: UpdateHoldingDto,
): Promise<Holding> {
  const response = await apiClient.put<Holding>(
    `/users/${userId}/portfolios/${portfolioId}/holdings/${holdingId}`,
    data,
  );
  return response.data;
}

/**
 * Delete a holding
 * DELETE /api/users/{userId}/portfolios/{portfolioId}/holdings/{holdingId}
 */
export async function deleteHolding(
  holdingId: string,
  portfolioId: string,
  userId: string,
): Promise<void> {
  await apiClient.delete(
    `/users/${userId}/portfolios/${portfolioId}/holdings/${holdingId}`,
  );
}
