/**
 * Dashboard Page
 *
 * Main page after login - will show holdings table.
 * For now, it's a placeholder that confirms auth is working.
 */

import { useAuth } from "@/contexts/AuthContext";

import { Button } from "@/components/ui/button";
import { RoadmapTimeline } from "@/components/common/RoadmapTimeline";

function DashboardPage() {
  const { user, logout } = useAuth();

  // Calculate week dates (same as LoginPage)
  const today = new Date();
  const weekDates = Array.from({ length: 4 }, (_, i) => {
    const d = new Date(today.getTime() + (i + 1) * 7 * 24 * 60 * 60 * 1000);
    return d.toLocaleDateString(undefined, {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  });

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-gray-100 to-teal-50 font-sans">
      {/* Header */}
      <header className="border-b border-teal-200 bg-white/80 backdrop-blur-md shadow-sm">
        <div className="container mx-auto px-4 py-4 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div className="flex items-center gap-3">
            <span className="inline-block">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="w-7 h-7 text-teal-600"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M3 17v2a2 2 0 002 2h14a2 2 0 002-2v-2M16 11V7a4 4 0 10-8 0v4M12 17v.01"
                />
              </svg>
            </span>
            <h1 className="text-2xl font-extrabold bg-gradient-to-r from-gray-800 via-teal-500 to-gray-700 bg-clip-text text-transparent tracking-tight drop-shadow-md">
              Portfolio Tracker
            </h1>
          </div>
          <div className="flex items-center gap-3">
            <span className="inline-block px-3 py-1 rounded-full bg-teal-100 text-teal-800 text-sm font-semibold shadow-sm border border-teal-200">
              Welcome back, {user?.fullName || user?.email}
            </span>
            <Button
              variant="outline"
              onClick={logout}
              className="border-teal-200 text-teal-700 hover:bg-teal-50 font-semibold transition-colors"
            >
              Logout
            </Button>
          </div>
        </div>
      </header>

      {/* Roadmap Timeline (condensed) */}
      <section className="container mx-auto px-4 py-6 max-w-3xl">
        <div className="bg-gradient-to-br from-white via-teal-50 to-blue-50 border border-teal-300 rounded-2xl p-4 shadow-md">
          <RoadmapTimeline weekDates={weekDates} condensed />
        </div>
      </section>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8">
        <div className="bg-white border border-teal-300 rounded-2xl p-10 shadow-xl max-w-2xl mx-auto text-center">
          <h2 className="text-3xl font-extrabold text-teal-700 mb-4">
            Authentication Working!
          </h2>
          <p className="text-gray-500 mb-8">
            You successfully logged in. (TBD) - Holdings table will go here.
          </p>

          <div className="bg-teal-50 rounded-xl p-8 max-w-md mx-auto text-left shadow-sm">
            <h3 className="font-semibold text-teal-700 mb-4 text-lg">
              Your Details
            </h3>
            <dl className="space-y-4 text-base">
              <div className="flex justify-between items-center">
                <dt className="text-gray-500 font-medium">Email:</dt>
                <dd className="font-semibold text-gray-800">{user?.email}</dd>
              </div>
              <div className="flex justify-between items-center">
                <dt className="text-gray-500 font-medium">Full Name:</dt>
                <dd className="font-semibold text-gray-800">
                  {user?.fullName || "Not set"}
                </dd>
              </div>
              <div className="flex justify-between items-center">
                <dt className="text-gray-500 font-medium">User ID:</dt>
                <dd className="font-mono text-xs text-teal-700">{user?.id}</dd>
              </div>
            </dl>
          </div>
        </div>
      </main>
      {/* Footer */}
      <footer className="mt-12 text-center text-xs text-gray-400">
        &copy; {new Date().getFullYear()} Portfolio Tracker. All rights
        reserved.
      </footer>
    </div>
  );
}

export default DashboardPage;
