"use client";

import React from "react";
import { ErrorBoundary } from "@/components/error-boundary";
import { RefreshCw } from "lucide-react";
import SyncStatus from "@/components/sync-status";
import ProtectedRoute from "@/components/protected-route";
import RlsStatus from "@/components/rls-status";
export default function DashboardLayout({
  children
}: {
  children: React.ReactNode;
}) {
  return <ProtectedRoute>
      <ErrorBoundary fallback={<div className="min-h-screen flex flex-col items-center justify-center p-6 bg-blue-50">
            <div className="max-w-md w-full bg-white rounded-lg shadow-lg p-8 text-center">
              <div className="flex items-center justify-center w-16 h-16 mx-auto rounded-full bg-blue-100 mb-4">
                <RefreshCw className="h-8 w-8 text-blue-600" />
              </div>
              <h2 className="text-2xl font-bold text-gray-900 mb-2">Dashboard Error</h2>
              <p className="text-gray-600 mb-6">
                We encountered an issue while loading the dashboard. This has been reported to our team.
              </p>
              <div className="flex flex-col space-y-3">
                <button onClick={() => window.location.reload()} className="w-full py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500">
                  Refresh Page
                </button>
                <a href="/" className="w-full py-2 px-4 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500">
                  Return to Login
                </a>
              </div>
            </div>
          </div>}>
        <div className="fixed top-0 right-0 z-50 m-4 flex flex-col gap-2">
          <SyncStatus />
          {/* Add RLS Status component */}
          <RlsStatus />
        </div>
        {children}
      </ErrorBoundary>
    </ProtectedRoute>;
}