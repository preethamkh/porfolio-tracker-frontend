import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import path from "path";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],

  // Path aliases - so we can import like: import { Button } from '@/components/ui/button'
  // Instead of: import { Button } from '../../../components/ui/button'
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },

  // Dev server config
  server: {
    port: 3000,
    // Proxy API requests to our backend during development
    // When you call /api/auth/login, it proxies to http://localhost:5001/api/auth/login
    proxy: {
      "/api": {
        target: "http://localhost:5000", // Our backend port (currently configured to 5000)
        changeOrigin: true,
        secure: false,
      },
    },
  },

  // Build config for production
  build: {
    outDir: "dist",
    sourcemap: true, // Helps debug production issues
    // Chunk splitting for better caching
    rollupOptions: {
      output: {
        manualChunks: {
          "react-vendor": ["react", "react-dom", "react-router-dom"],
          "query-vendor": ["@tanstack/react-query"],
        },
      },
    },
  },

  // Environment variables prefix
  // Only variables starting with VITE_ are exposed to client
  envPrefix: "VITE_",
});
