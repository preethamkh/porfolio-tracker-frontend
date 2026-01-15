/**
 * Dashboard Page
 *
 * Main page after login - will show holdings table.
 * For now, it's a placeholder that confirms auth is working.
 */

import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";

export function DashboardPage() {
  const { user, logout } = useAuth();

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-slate-100 to-indigo-100 font-sans">
      {/* Header */}
      <header className="border-b border-slate-200 bg-white/80 backdrop-blur-md shadow-sm">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-extrabold bg-gradient-to-r from-indigo-500 to-blue-500 bg-clip-text text-transparent tracking-tight drop-shadow-md">
              Portfolio Tracker
            </h1>
            <p className="text-sm text-slate-500 font-medium">
              Welcome back, {user?.fullName || user?.email}
            </p>
          </div>
          <Button
            variant="outline"
            onClick={logout}
            className="border-indigo-200 text-indigo-700 hover:bg-indigo-50 font-semibold transition-colors"
          >
            Logout
          </Button>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-12">
        <div className="bg-white border border-slate-200 rounded-2xl p-10 shadow-xl max-w-2xl mx-auto text-center">
          <h2 className="text-3xl font-extrabold text-indigo-700 mb-4">
            Authentication Working!
          </h2>
          <p className="text-slate-500 mb-8">
            You successfully logged in. (TBD) - Holdings table will go here.
          </p>

          <div className="bg-indigo-50 rounded-xl p-8 max-w-md mx-auto text-left shadow-sm">
            <h3 className="font-semibold text-indigo-700 mb-4 text-lg">
              Your Details
            </h3>
            <dl className="space-y-4 text-base">
              <div className="flex justify-between items-center">
                <dt className="text-slate-500 font-medium">Email:</dt>
                <dd className="font-semibold text-slate-800">{user?.email}</dd>
              </div>
              <div className="flex justify-between items-center">
                <dt className="text-slate-500 font-medium">Full Name:</dt>
                <dd className="font-semibold text-slate-800">
                  {user?.fullName || "Not set"}
                </dd>
              </div>
              <div className="flex justify-between items-center">
                <dt className="text-slate-500 font-medium">User ID:</dt>
                <dd className="font-mono text-xs text-indigo-700">
                  {user?.id}
                </dd>
              </div>
            </dl>
          </div>
        </div>
      </main>
      {/* Footer */}
      <footer className="mt-12 text-center text-xs text-slate-400">
        &copy; {new Date().getFullYear()} Portfolio Tracker. All rights
        reserved.
      </footer>
    </div>
  );
}
