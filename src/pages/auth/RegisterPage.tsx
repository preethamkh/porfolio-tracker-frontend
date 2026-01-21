/**
 * Register Page
 *
 * Full page layout for registration form.
 */

import { RegisterForm } from "@/components/auth/RegisterForm";
//import { ENV } from "@/utils/constants";

import { ENV } from "@/utils/constants";
import { ChartBarIcon } from "@heroicons/react/24/solid";

export function RegisterPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 via-gray-100 to-teal-50 px-4 font-sans">
      <div className="w-full max-w-md">
        {/* Logo/Branding */}
        <div className="mb-8 flex flex-col items-center">
          <h1 className="flex items-center justify-center gap-3 text-4xl font-extrabold tracking-tight text-center text-gray-900 drop-shadow-lg relative">
            <ChartBarIcon
              className="w-8 h-8 text-teal-600"
              aria-hidden="true"
            />
            <span className="bg-gradient-to-r from-gray-800 via-teal-500 to-gray-700 bg-clip-text text-transparent">
              {ENV.APP_NAME || "Portfolio Tracker"}
            </span>
          </h1>
          <span className="block h-1 w-16 mx-auto mt-4 rounded-full bg-gradient-to-r from-teal-400 via-gray-300 to-teal-400 opacity-60"></span>
          <p className="mt-4 text-lg text-gray-700 font-medium text-center max-w-xs">
            Register to start tracking your investments with a modern,
            multi-stack architecture.
          </p>
        </div>

        {/* Register Form */}
        <div className="bg-white border border-teal-300 rounded-2xl p-8 shadow-xl">
          <RegisterForm />
        </div>
        <div className="mt-8 text-center text-xs text-gray-400 space-y-1">
          <div>
            &copy; {new Date().getFullYear()} Portfolio Tracker. All rights
            reserved.
          </div>
          <div className="text-teal-400">
            .NET 8 + React + PostgreSQL + Redis
          </div>
          <div className="text-gray-400 font-mono text-[10px]">
            v{ENV.APP_VERSION}
            {ENV.GIT_COMMIT_SHA !== "dev" && (
              <> • {ENV.GIT_COMMIT_SHA.substring(0, 7)}</>
            )}
            {ENV.VERCEL_ENV !== "development" && <> • {ENV.VERCEL_ENV}</>}
          </div>
        </div>
      </div>
    </div>
  );
}
