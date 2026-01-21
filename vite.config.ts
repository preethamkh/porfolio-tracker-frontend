import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import path from "path";
import { execSync } from "child_process";
import { readFileSync } from "fs";

// Generate version dynamically: package.json version + git commit count
function generateVersion() {
  try {
    const packageJson = JSON.parse(readFileSync("./package.json", "utf-8"));
    const baseVersion = packageJson.version;

    let buildNumber = "dev";
    try {
      // Get git commit count as build number
      buildNumber = execSync("git rev-list --count HEAD", {
        encoding: "utf-8",
        stdio: ["pipe", "pipe", "ignore"],
      }).trim();
    } catch {
      // Not a git repo or git not available, use timestamp
      buildNumber = Date.now().toString();
    }

    return `${baseVersion}+build.${buildNumber}`;
  } catch (error) {
    return "1.0.0+build.unknown";
  }
}

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

  // Inject environment variables at build time
  define: {
    __APP_VERSION__: JSON.stringify(generateVersion()),
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
