/**
 * Login Page
 *
 * Full page layout for login form.
 * Centers the form and adds branding.
 */

import { LoginForm } from "@/components/auth/LoginForm";

import { ENV } from "@/utils/constants";
import { RoadmapTimeline } from "@/components/common/RoadmapTimeline";
import { ROADMAP } from "@/utils/roadmap";
import { ChartBarIcon } from "@heroicons/react/24/solid";

export function LoginPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 via-gray-100 to-teal-50 px-4 font-sans">
      <div className="w-full max-w-5xl grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
        {/* Left: Roadmap & Features */}
        <div className="space-y-8">
          {/* Logo/Branding */}
          <div className="mb-8 flex flex-col items-center">
            <h1 className="flex items-center justify-center gap-3 text-4xl md:text-5xl font-extrabold tracking-tight text-center text-gray-900 drop-shadow-lg relative">
              <ChartBarIcon
                className="w-10 h-10 text-teal-600"
                aria-hidden="true"
              />
              <span className="bg-gradient-to-r from-gray-800 via-teal-500 to-gray-700 bg-clip-text text-transparent">
                {ENV.APP_NAME || "Portfolio Tracker"}
              </span>
            </h1>
            <span className="block h-1 w-20 mx-auto mt-4 rounded-full bg-gradient-to-r from-teal-400 via-gray-300 to-teal-400 opacity-60"></span>
            <p className="mt-6 text-lg md:text-xl text-gray-700 font-medium text-center max-w-xl">
              A modern, multi-stack architecture to track your investment
              portfolio
            </p>
          </div>

          {/* Roadmap Timeline */}
          <div className="bg-gradient-to-br from-white via-teal-50 to-blue-50 border border-teal-300 rounded-2xl p-6 shadow-xl">
            <RoadmapTimeline roadmap={ROADMAP} />
          </div>

          {/* Current Capabilities */}
          <div className="bg-white border border-teal-300 rounded-2xl p-6 shadow-lg">
            <h3 className="text-xl font-semibold text-teal-700 mb-4 flex items-center gap-2">
              <span className="inline-block w-6 h-6 bg-gradient-to-r from-teal-400 to-blue-400 rounded-full mr-2"></span>
              What's Ready to Use
            </h3>
            <ul className="space-y-5 text-left text-gray-700">
              <li>
                <div className="flex items-center gap-2 mb-1">
                  <span className="font-bold text-teal-700">
                    User Registration & Login:
                  </span>
                  <span className="bg-teal-100 text-teal-700 px-2 py-0.5 rounded text-xs font-semibold">
                    Secure
                  </span>
                  <span className="bg-blue-100 text-blue-700 px-2 py-0.5 rounded text-xs font-semibold">
                    JWT
                  </span>
                </div>
                <div className="text-sm text-gray-600 ml-1">
                  Create an account, login securely, and access a protected
                  dashboard with JWT authentication.
                </div>
              </li>
              <li>
                <div className="flex items-center gap-2 mb-1">
                  <span className="font-bold text-teal-700">
                    Portfolio Dashboard:
                  </span>
                  <span className="bg-teal-100 text-teal-700 px-2 py-0.5 rounded text-xs font-semibold">
                    Real-time
                  </span>
                  <span className="bg-blue-100 text-blue-700 px-2 py-0.5 rounded text-xs font-semibold">
                    Responsive
                  </span>
                </div>
                <div className="text-sm text-gray-600 ml-1">
                  View your holdings, sortable by column, with color-coded
                  gains/losses and a mobile-friendly layout.
                </div>
              </li>
              <li>
                <div className="flex items-center gap-2 mb-1">
                  <span className="font-bold text-teal-700">
                    Backend Architecture:
                  </span>
                  <span className="bg-teal-100 text-teal-700 px-2 py-0.5 rounded text-xs font-semibold">
                    Clean
                  </span>
                  <span className="bg-blue-100 text-blue-700 px-2 py-0.5 rounded text-xs font-semibold">
                    144+ Tests
                  </span>
                </div>
                <div className="text-sm text-gray-600 ml-1">
                  Built with clean architecture, repository/service patterns,
                  external API integration, Redis caching, and a comprehensive
                  test suite.
                </div>
              </li>
            </ul>
          </div>
        </div>

        {/* Right: Login Form */}
        <div className="flex flex-col justify-center items-center h-full">
          <div className="w-full max-w-md">
            <div className="bg-white border border-teal-300 rounded-2xl p-8 shadow-xl">
              <LoginForm />
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
      </div>
    </div>
  );
}
