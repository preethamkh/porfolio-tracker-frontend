/**
 * Protected Route Component
 *
 * This component ensures that only authenticated users can access certain routes.
 * If a user is not authenticated, they are redirected to the login page.
 *
 * i.e., Wraps around routes/components that require authentication.
 *
 * Usage:
 * <Route path="/dashboard" element={
 *   <ProtectedRoute>
 *     <DashboardPage />
 *   </ProtectedRoute>
 * } />
 */

import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { ROUTES } from "@/utils/constants";
import { LoadingPage } from '@/components/common/LoadingSpinner';

interface ProtectedRouteProps {
  children: React.ReactNode;
}

export function ProtectedRoute({ children }: ProtectedRouteProps) {
  const { isAuthenticated, isLoading } = useAuth();
  const location = useLocation();

  // Show loading while checking auth state
  if (isLoading) {
    return <LoadingPage message="Checking authentication..." />;
  }

  // Not authenticated - redirect to login
  if (!isAuthenticated) {
    // Save the location they tried to visit
    // So we can redirect them back after login
    return <Navigate to={ROUTES.LOGIN} state={{ from: location }} replace />;
  }

  // Render the protected component if authenticated
  return <>{children}</>;
}
