"use client";

import React from "react";
import { ErrorBoundary } from "@/components/error-boundary";
import { RefreshCw, ShieldAlert } from "lucide-react";
import ConnectionStatus from "@/components/connection-status";
import SyncStatus from "@/components/sync-status";
export default function AdminLayout({
  children
}: {
  children: React.ReactNode;
}) {
  return <ErrorBoundary fallback={<div className="min-h-screen flex flex-col items-center justify-center p-6 bg-purple-50">
          <div className="max-w-md w-full bg-white rounded-lg shadow-lg p-8 text-center">
            <div className="flex items-center justify-center w-16 h-16 mx-auto rounded-full bg-purple-100 mb-4">
              <ShieldAlert className="h-8 w-8 text-purple-600" />
            </div>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Admin Panel Error</h2>
            <p className="text-gray-600 mb-6">
              We encountered an issue in the admin panel. Our technical team has been notified.
            </p>
            <div className="flex flex-col space-y-3">
              <button onClick={() => window.location.reload()} className="w-full py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-purple-600 hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500">
                Refresh Page
              </button>
              <a href="/admin" className="w-full py-2 px-4 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500">
                Return to Admin Login
              </a>
            </div>
          </div>
        </div>}>
      <div className="fixed top-0 right-0 z-50 m-4 flex flex-col gap-2">
        <ConnectionStatus />
        <SyncStatus />
      </div>
      {children}
    </ErrorBoundary>;
}