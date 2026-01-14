/**
 * Authentication Context
 *
 * Think of this as a C# service that manages user authentication state
 * It provies auth state and methods to the entire app via React Context API
 *
 * C# equivalent
 * public class AuthService
 * {
 *    public User CurrentUser { get; private set; }
 *    public bool IsAuthenticated => CurrentUser != null;
 *    public async Task<User> Login(string email, string password) { ... }
 * }
 *
 * But in React, we use Context and Hooks to achieve similar functionality across components
 * Instead of dependency injection, we use Context Providers
 *  */

import React, { createContext, useContext, useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  login as apiLogin,
  register as apiRegister,
  logout as apiLogout,
} from "@/api/endpoints/auth";
import { setAuthToken, clearAuthToken, getAuthToken } from "@/api/client";
import { AuthUser, LoginRequest, RegisterRequest, AuthResponse } from "@/types";
import { STORAGE_KEYS, ROUTES } from "@/utils/constants";
import { useToast } from "@/hooks/use-toast";

// ============================================================================
// CONTEXT TYPE DEFINITION
// ============================================================================

interface AuthContextType {
  //State
  user: AuthUser | null;
  isAuthenticated: boolean;
  isLoading: boolean;

  //Methods/Actions
  login: (data: LoginRequest) => Promise<void>;
  register: (data: RegisterRequest) => Promise<void>;
  logout: () => void;
}

// ============================================================================
// CREATE CONTEXT
// ============================================================================

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// ============================================================================
// PROVIDER COMPONENT
// ============================================================================

interface AuthProviderProps {
  children: React.ReactNode;
}

export function AuthProvider({ children }: AuthProviderProps) {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const navigate = useNavigate();
  const { toast } = useToast();

  // ============================================================================
  // INITIALIZE AUTH STATE ON MOUNT
  // ============================================================================

  /**
   * When the app loads, check if there's a saved token and user info in localStorage
   * If so, set the auth state accordingly
   * This is like checking if the user has a valid session.
   *
   * TODO: Refactor this into separate functions later if time permits (clean code)
   */
  useEffect(() => {
    /**
     * Initializes the authentication state by attempting to restore the user session
     * from local storage and the authentication token.
     *
     * - Retrieves the authentication token using `getAuthToken()`.
     * - Retrieves the saved user data from local storage using `STORAGE_KEYS.USER`.
     * - If both the token and user data are present, parses the user data and sets the user state.
     * - If an error occurs (e.g., invalid token or corrupted user data), clears the authentication token
     *   and user data from local storage, and logs the error.
     * - Regardless of outcome, sets the loading state to false.
     *
     * @remarks
     * This function is typically called when the authentication context provider component mounts,
     * such as within a `useEffect` hook in the `AuthContext` provider. Its purpose is to restore
     * the user's authentication state when the application is initialized or refreshed.
     */
    const initializeAuth = () => {
      try {
        const token = getAuthToken();
        const savedUser = localStorage.getItem(STORAGE_KEYS.USER);

        if (token && savedUser) {
          // We have a token and user - restore auth state
          const parsedUser: AuthUser = JSON.parse(savedUser);
          setUser(parsedUser);
        }
      } catch (error) {
        // Invalid token or user data - clear everything
        console.error("Failed to initialize auth state:", error);
        clearAuthToken();
        localStorage.removeItem(STORAGE_KEYS.USER);
        //setUser(null);
      } finally {
        setIsLoading(false);
      }
    };
    initializeAuth();
  }, []);

  // ============================================================================
  // LOGIN
  // ============================================================================

  /**
   * Handles user login by authenticating with the backend API.
   *
   * - Sets loading state while the request is in progress.
   * - On success:
   *   - Stores the authentication token.
   *   - Saves user information to local storage.
   *   - Updates the user state.
   *   - Displays a success toast notification.
   *   - Redirects the user to the dashboard.
   * - On failure:
   *   - Displays an error toast notification.
   *   - Throws the error for further handling.
   * - Always resets the loading state after the operation.
   *
   * @param credentials - The user's login credentials.
   * @returns A promise that resolves when the login process is complete.
   * @throws Will throw an error if authentication fails.
   */
  const login = async (credentials: LoginRequest): Promise<void> => {
    try {
      setIsLoading(true);

      // Call backend API
      const response: AuthResponse = await apiLogin(credentials);

      // Save token and user info
      setAuthToken(response.token);
      localStorage.setItem(STORAGE_KEYS.USER, JSON.stringify(response.user));
      setUser(response.user);

      // Show success message
      toast({
        title: "Welcome back!",
        description: `Logged in as , ${response.user.email}!`,
      });

      //Redirect to dashboard
      navigate(ROUTES.DASHBOARD);
    } catch (error: any) {
      // Show error message
      toast({
        variant: "destructive",
        title: "Login Failed",
        description: error?.message || "Invalid email or password",
      });
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  // ============================================================================
  // REGISTER
  // ============================================================================

  const register = async (data: RegisterRequest): Promise<void> => {
    try {
      setIsLoading(true);

      // Call backend API
      const response: AuthResponse = await apiRegister(data);

      // Save token and user info
      setAuthToken(response.token);
      localStorage.setItem(STORAGE_KEYS.USER, JSON.stringify(response.user));
      setUser(response.user);

      // Show success message
      toast({
        title: "Account Created!",
        description: `Welcome to the Portfolio tracker , ${response.user.email}!`,
      });

      //Redirect to dashboard
      navigate(ROUTES.DASHBOARD);
    } catch (error: any) {
      // Show error message
      toast({
        variant: "destructive",
        title: "Registration Failed",
        description: error?.message || "Failed to create account",
      });
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  // ============================================================================
  // LOGOUT
  // ============================================================================
  const logout = (): void => {
    // Clear token and user info
    apiLogout(); // Optionally notify backend
    clearAuthToken();
    localStorage.removeItem(STORAGE_KEYS.USER);
    setUser(null);

    // Show message
    toast({
      title: "Logged Out",
      description: "You have been logged out successfully.",
    });

    // Redirect to login page
    navigate(ROUTES.LOGIN);
  };

  // ============================================================================
  // CONTEXT VALUE
  // ============================================================================

  /**
   * The context value for authentication, providing user information and authentication state.
   *
   * @property {User | null} user - The currently authenticated user, or null if not authenticated.
   * @property {boolean} isAuthenticated - Indicates whether a user is currently authenticated.
   * @property {boolean} isLoading - Indicates whether authentication-related operations are in progress.
   * @property {(credentials: LoginCredentials) => Promise<void>} login - Function to log in a user with provided credentials.
   * @property {(details: RegisterDetails) => Promise<void>} register - Function to register a new user with provided details.
   * @property {() => void} logout - Function to log out the current user.
   */
  const value: AuthContextType = {
    user,
    isAuthenticated: !!user,
    isLoading,
    login,
    register,
    logout,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

// ============================================================================
// CUSTOM HOOK TO USE AUTH CONTEXT
// ============================================================================

/**
 * Hook to access auth context in any component
 *
 * Usage:
 * const { user, isAuthenticated, login, logout } = useAuth();
 */
export function useAuth(): AuthContextType {
  const context = useContext(AuthContext);

  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }

  return context;
}
