/**
 * AXIS HTTP Client Configuration
 *
 * This is the SINGLE place where all API calls go through.
 * Similar to the .NET HttpClient setup in the backend, but with interceptors for request/response handling.
 *
 * Features:
 * - Automatic inclusion of auth tokens in headers (JWT token injection)
 * - Centralized error handling
 * - Request/Response logging for debugging (development mode)
 * - Timeout configuration
 */

import axios, {
  AxiosError,
  AxiosInstance,
  InternalAxiosRequestConfig,
} from "axios";
