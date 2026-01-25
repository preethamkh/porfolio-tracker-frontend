/**
 * Main Application Component
 *
 * Sets up routing and providers for the entire app.
 * Think of this as your C# Program.cs / Startup.cs
 */

import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { QueryClientProvider } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import { Toaster } from "@/components/ui/toaster";
import { AuthProvider } from "@/contexts/AuthContext";
import { ProtectedRoute } from "@/components/auth/ProtectedRoute";
import { LoginPage } from "@/pages/auth/LoginPage";
import { RegisterPage } from "@/pages/auth/RegisterPage";
import DashboardPage from "@/pages/dashboard/DashboardPage";
import { queryClient } from "@/lib/queryClient";
import { ROUTES } from "@/utils/constants";

import SearchTest from "./pages/test/SearchTest";

function App() {
  return (
    // TanStack Query Provider - manages all API data fetching/caching
    // gives all child components access to query caching, fetching, and mutation features
    <QueryClientProvider client={queryClient}>
      {/* Router Provider - manages navigation */}
      <BrowserRouter>
        {/* Auth Provider - manages authentication state */}
        {/* Must be inside BrowserRouter because it uses useNavigate */}
        <AuthProvider>
          {/* Routes Definition */}
          <Routes>
            {/* Public Routes */}
            <Route path={ROUTES.LOGIN} element={<LoginPage />} />
            <Route path={ROUTES.REGISTER} element={<RegisterPage />} />

            {/* Test Route - Public for easy testing */}
            <Route path="/test-search" element={<SearchTest />} />

            {/* Protected Routes - require authentication */}
            <Route
              path={ROUTES.DASHBOARD}
              element={
                <ProtectedRoute>
                  <DashboardPage />
                </ProtectedRoute>
              }
            />

            {/* Root redirect - send to dashboard if logged in, login if not */}
            <Route
              path={ROUTES.HOME}
              element={<Navigate to={ROUTES.DASHBOARD} replace />}
            />

            {/* 404 - Not Found */}
            <Route
              path="*"
              element={<Navigate to={ROUTES.DASHBOARD} replace />}
            />
          </Routes>

          {/* Toast Notifications Container */}
          <Toaster />
        </AuthProvider>
      </BrowserRouter>

      {/* React Query DevTools - only shows in development when the site is loaded
      i.,e localhost:3000 in our case shows an icon in the bottom right corner */}
      {import.meta.env.DEV && <ReactQueryDevtools initialIsOpen={false} />}
    </QueryClientProvider>
  );
}

export default App;
