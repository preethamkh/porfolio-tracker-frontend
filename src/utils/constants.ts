/**
 * Appilcation constants
 * Centralized place for all constant values used across the application.
 * i.e., magic strings, config values, default settings, etc.
 */

// ENVIRONMENT VARIABLES

export const ENV = {
  //API_BASE_URL: process.env.REACT_APP_API_BASE_URL || "http://localhost:5000/api",
  API_BASE_URL:
    import.meta.env.VITE_API_BASE_URL || "http://localhost:5001/api",
  APP_NAME: import.meta.env.VITE_APP_NAME || "Portfolio Tracker",
  APP_VERSION: import.meta.env.VITE_APP_VERSION || "1.0.0",
};
