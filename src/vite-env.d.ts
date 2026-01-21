// typescrit directive to include Vite's client types
/// <reference types="vite/client" />

/**
 * Defines the shape of environment variables available in the Vite project.
 *
 * This interface extends the default `ImportMetaEnv` and provides type safety
 * for custom environment variables prefixed with `VITE_`.
 *
 * @property {string} VITE_API_BASE_URL - The base URL for API requests.
 * @property {string} VITE_APP_NAME - The name of the application.
 * @property {string} VITE_APP_VERSION - The current version of the application.
 */

// Global build-time constants injected by Vite
declare const __APP_VERSION__: string;

// Access the environment variables via import.meta.env
interface ImportMetaEnv {
  readonly VITE_API_BASE_URL: string;
  readonly VITE_APP_NAME: string;
  readonly VITE_APP_VERSION: string;
}

// declaration merging from the global `ImportMeta` interface
interface ImportMeta {
  // extends the existing `ImportMeta` interface to include `env` property
  readonly env: ImportMetaEnv;
}
