/**
 * Register Form Component
 *
 * Handles new user registration with validation.
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
import { ROUTES, VALIDATION } from "@/utils/constants";

// ============================================================================
// VALIDATION SCHEMA
// ============================================================================

/**
 * Defines a Zod schema for user registration form validation.
 *
 * The schema validates the following fields:
 * - `email`: Required string, must be a valid email address.
 * - `password`: Required string, must meet minimum and maximum length constraints as defined in `VALIDATION`.
 * - `confirmPassword`: Required string, must match the `password` field.
 * - `fullName`: Optional string, must not exceed the maximum length defined in `VALIDATION`.
 *
 * The `.refine()` method is used to add a custom validation rule that ensures the `password` and `confirmPassword` fields match.
 *
 * @example
 * ```typescript
 * registerSchema.parse({
 *   email: "user@example.com",
 *   password: "securePassword123",
 *   confirmPassword: "securePassword123",
 *   fullName: "John Doe"
 * });
 * ```
 *
 * @remarks
 * - The `path` option in `.refine()` specifies which field the custom error message should be attached to if the validation fails.
 * - This is standard Zod syntax for custom validation logic.
 * - The `message` property provides a user-friendly error message when the refinement fails.
 */
const registerSchema = z
  .object({
    email: z
      .string()
      .min(1, "Email is required")
      .email("Invalid email address"),
    password: z
      .string()
      .min(
        VALIDATION.PASSWORD_MIN_LENGTH,
        `Password must be at least ${VALIDATION.PASSWORD_MIN_LENGTH} characters`
      )
      .max(
        VALIDATION.PASSWORD_MAX_LENGTH,
        `Password must be less than ${VALIDATION.PASSWORD_MAX_LENGTH} characters`
      ),
    confirmPassword: z.string().min(1, "Please confirm your password"),
    fullName: z
      .string()
      .max(
        VALIDATION.NAME_MAX_LENGTH,
        `Name must be less than ${VALIDATION.NAME_MAX_LENGTH} characters`
      )
      .optional(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords don't match",
    path: ["confirmPassword"],
  });

/**
 * Represents the shape of the registration form data as defined by the `registerSchema` Zod schema.
 *
 * This type is automatically inferred from the `registerSchema` using Zod's `infer` utility,
 * ensuring that the TypeScript type always matches the schema's structure and validation rules.
 *
 * @see registerSchema
 */
type RegisterFormData = z.infer<typeof registerSchema>;

// ============================================================================
// COMPONENT
// ============================================================================

export function RegisterForm() {
  const { register: registerUser } = useAuth();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<RegisterFormData>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      email: "",
      password: "",
      confirmPassword: "",
      fullName: "",
    },
  });

  // ============================================================================
  // SUBMIT HANDLER
  // ============================================================================

  const onSubmit = async (data: RegisterFormData) => {
    try {
      setIsSubmitting(true);

      // Remove confirmPassword before sending to API
      const { confirmPassword, ...registrationData } = data;

      await registerUser(registrationData);
      // Navigation happens in AuthContext after successful registration
    } catch (error) {
      // Error toast is shown in AuthContext
      console.error("Registration error:", error);
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
        <h2 className="text-3xl font-extrabold tracking-tight text-indigo-700">
          Create an account
        </h2>
        <p className="mt-2 text-slate-500 text-base">
          Start tracking your investment portfolio
        </p>
      </div>

      {/* Divider */}
      <div className="flex items-center my-2">
        <div className="flex-grow border-t border-slate-200" />
        <span className="mx-4 text-xs text-slate-400">Register</span>
        <div className="flex-grow border-t border-slate-200" />
      </div>

      {/* Form */}
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        {/* Full Name Field (Optional) */}
        <div className="space-y-2">
          <Label htmlFor="fullName" className="text-slate-700 font-semibold">
            Full Name <span className="text-slate-400 text-xs">(optional)</span>
          </Label>
          <Input
            id="fullName"
            type="text"
            placeholder="John Doe"
            autoComplete="name"
            {...register("fullName")}
            className={
              errors.fullName
                ? "border-destructive focus:ring-destructive"
                : "focus:ring-indigo-500"
            }
          />
          {errors.fullName && (
            <p className="text-sm text-destructive mt-1">
              {errors.fullName.message}
            </p>
          )}
        </div>

        {/* Email Field */}
        <div className="space-y-2">
          <Label htmlFor="email" className="text-slate-700 font-semibold">
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
                : "focus:ring-indigo-500"
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
          <Label htmlFor="password" className="text-slate-700 font-semibold">
            Password
          </Label>
          <Input
            id="password"
            type="password"
            placeholder="••••••••"
            autoComplete="new-password"
            {...register("password")}
            className={
              errors.password
                ? "border-destructive focus:ring-destructive"
                : "focus:ring-indigo-500"
            }
          />
          {errors.password && (
            <p className="text-sm text-destructive mt-1">
              {errors.password.message}
            </p>
          )}
        </div>

        {/* Confirm Password Field */}
        <div className="space-y-2">
          <Label
            htmlFor="confirmPassword"
            className="text-slate-700 font-semibold"
          >
            Confirm Password
          </Label>
          <Input
            id="confirmPassword"
            type="password"
            placeholder="••••••••"
            autoComplete="new-password"
            {...register("confirmPassword")}
            className={
              errors.confirmPassword
                ? "border-destructive focus:ring-destructive"
                : "focus:ring-indigo-500"
            }
          />
          {errors.confirmPassword && (
            <p className="text-sm text-destructive mt-1">
              {errors.confirmPassword.message}
            </p>
          )}
        </div>

        {/* Submit Button */}
        <Button
          type="submit"
          className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-2 px-4 rounded-lg transition-colors duration-150"
          disabled={isSubmitting}
        >
          {isSubmitting ? (
            <>
              <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
              Creating account...
            </>
          ) : (
            "Create account"
          )}
        </Button>
      </form>

      {/* Login Link */}
      <div className="text-center text-sm mt-6">
        <span className="text-slate-500">Already have an account? </span>
        <Link
          to={ROUTES.LOGIN}
          className="text-indigo-600 hover:underline font-semibold transition-colors"
        >
          Sign in
        </Link>
      </div>
    </div>
  );
}
