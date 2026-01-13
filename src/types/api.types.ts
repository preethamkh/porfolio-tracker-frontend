/**
 * API Request/Response Types
 * These types define the structure of data sent to and received from the API endpoints.(backend)
 * They often mirror the domain entity types but can include additional metadata or omit certain fields.
 */

import {
  UserDto,
  PortfolioDto,
  Holding,
  Security,
  Transaction,
} from "./entities.types";

// AUTHENTICATION

export interface LoginRequest {
  email: string;
  password: string;
}

export interface RegisterRequest {
  email: string;
  password: string;
  fullName?: string | null;
}

export interface AuthResponse {
  token: string; // JWT
  //user: UserDto;
  user: {
    id: string;
    email: string;
    fullName?: string | null;
  };
}

// export interface BulkCreateTransactionsDto {
//   transactions: Array<Transaction>;
// }
