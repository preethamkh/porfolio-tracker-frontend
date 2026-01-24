/**
 * Login Form Component
 *
 * Handles user login with form validation.
 * Uses react-hook-form for form state management
 * and Zod for validation schema.
 */

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Link } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
// import { ROUTES, VALIDATION } from "@/utils/constants";
import { ROUTES } from "@/utils/constants";

// ============================================================================
// VALIDATION SCHEMA (using Zod)
// ============================================================================

/**
 * Zod is like FluentValidation in C#
 */

const loginSchema = z.object({
  email: z.string().min(1, "Email is required").email("Invalid email address"),
  password: z.string().min(8, "Password must be at least 8 characters long."),
});

/**
 * Type representing the shape of the login form data.
 *
 * This type is inferred from the Zod validation schema (`loginSchema`),
 * ensuring that the form data structure matches the validation rules.
 *
 * @typedef LoginFormData
 * @property {string} email - The user's email address.
 * @property {string} password - The user's password.
 */
type LoginFormData = z.infer<typeof loginSchema>;

// ============================================================================
// LOGIN FORM COMPONENT
// ============================================================================

/**
 * LoginForm component provides a user interface for signing in to the application.
 *
 * This form uses React Hook Form for form state management and validation, with Zod as the schema resolver.
 * It collects the user's email and password, validates them, and submits the credentials for authentication.
 *
 * ## How authentication works:
 * - When the user submits the form, the `onSubmit` handler is called.
 * - `onSubmit` calls the `login` function from the `useAuth()` hook, passing the form data.
 * - The `login` function is defined in the application's AuthContext (typically in `AuthProvider`).
 * - Inside `login`, the function makes an HTTP request to the backend login API endpoint (e.g., `/api/auth/login`).
 * - The backend validates the credentials and returns a response (e.g., JWT token, user info).
 * - On successful login, the AuthContext updates authentication state and may handle navigation.
 * - On error, the AuthContext may show an error toast or message.
 *
 * ### Call Path for `await login(data)`:
 * 1. `LoginForm` calls `useAuth()` to get the `login` function.
 * 2. `login(data)` is called in the `onSubmit` handler.
 * 3. `login` is implemented in the AuthContext (e.g., `AuthProvider`), where it:
 *    - Sends a POST request to the backend login API (e.g., using `fetch` or `axios`).
 *    - Handles the response, updates auth state, and manages side effects (like navigation or error handling).
 *
 * @component
 */
export function LoginForm() {
  const { login } = useAuth();
  const [isSubmitting, setIsSubmitting] = useState(false);

  // React Hook Form setup
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  // ============================================================================
  // SUBMIT HANDLER
  // ============================================================================

  const onSubmit = async (data: LoginFormData) => {
    try {
      setIsSubmitting(true);
      //todo: check where this is calling the backend api
      await login(data);

      // Navgation happens in AuthContext after successful login
    } catch (error) {
      //Error toast is shown in AuthContext
      console.error("Login error:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  // ============================================================================
  // RENDER
  // ============================================================================

  return (
    <div className="w-full max-w-md space-y-8">
      {/* Header */}
      <div className="text-center">
        <h2 className="text-3xl font-extrabold tracking-tight text-teal-700">
          Welcome back
        </h2>
        <p className="mt-2 text-gray-500 text-base">
          Sign in to your account to continue
        </p>
      </div>

      {/* Divider */}
      <div className="flex items-center my-2">
        <div className="flex-grow border-t border-teal-200" />
        <span className="mx-4 text-xs text-gray-400">Sign in</span>
        <div className="flex-grow border-t border-teal-200" />
      </div>

      {/* Form */}
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        {/* Email Field */}
        <div className="space-y-2">
          <Label htmlFor="email" className="text-gray-700 font-semibold">
            Email
          </Label>
          <Input
            id="email"
            type="email"
            placeholder="you@example.com"
            autoComplete="email"
            {...register("email")}
            className={
              errors.email
                ? "border-destructive focus:ring-destructive"
                : "focus:ring-teal-500"
            }
          />
          {errors.email && (
            <p className="text-sm text-destructive mt-1">
              {errors.email.message}
            </p>
          )}
        </div>

        {/* Password Field */}
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <Label htmlFor="password" className="text-gray-700 font-semibold">
              Password
            </Label>
            <Link
              to="#"
              className="text-sm text-teal-600 hover:underline font-medium transition-colors"
            >
              Forgot password?
            </Link>
          </div>
          <Input
            id="password"
            type="password"
            placeholder="••••••••"
            autoComplete="current-password"
            {...register("password")}
            className={
              errors.password
                ? "border-destructive focus:ring-destructive"
                : "focus:ring-teal-500"
            }
          />
          {errors.password && (
            <p className="text-sm text-destructive mt-1">
              {errors.password.message}
            </p>
          )}
        </div>

        {/* Submit Button */}
        <Button
          type="submit"
          className="w-full bg-teal-600 hover:bg-teal-700 text-white font-bold py-2 px-4 rounded-lg transition-colors duration-150"
          disabled={isSubmitting}
        >
          {isSubmitting ? (
            <>
              <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
              Signing in...
            </>
          ) : (
            "Sign in"
          )}
        </Button>
      </form>

      {/* Register Link */}
      <div className="text-center text-sm mt-6">
        <span className="text-gray-500">Don't have an account? </span>
        <Link
          to={ROUTES.REGISTER}
          className="text-teal-600 hover:underline font-semibold transition-colors"
        >
          Sign up
        </Link>
      </div>
    </div>
  );
}
