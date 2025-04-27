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
      <ErrorBoundary fallback={<div className="min-h-screen flex flex-col items-center justify-center p-6 bg-blue-50" data-unique-id="c4b5b923-a189-4d7f-aaad-e973d31fa19a" data-loc="15:31-15:118" data-file-name="app/dashboard/layout.tsx">
            <div className="max-w-md w-full bg-white rounded-lg shadow-lg p-8 text-center" data-unique-id="c65cb1bb-d960-4f22-87b4-bcc05b5373ad" data-loc="16:12-16:91" data-file-name="app/dashboard/layout.tsx">
              <div className="flex items-center justify-center w-16 h-16 mx-auto rounded-full bg-blue-100 mb-4" data-unique-id="f0b058a6-ab8a-4015-923c-e53727b13f1d" data-loc="17:14-17:112" data-file-name="app/dashboard/layout.tsx">
                <RefreshCw className="h-8 w-8 text-blue-600" />
              </div>
              <h2 className="text-2xl font-bold text-gray-900 mb-2" data-unique-id="44b06bfe-bb58-443a-831d-b55f288a2081" data-loc="20:14-20:68" data-file-name="app/dashboard/layout.tsx">Dashboard Error</h2>
              <p className="text-gray-600 mb-6" data-unique-id="74f927bb-1251-47c1-a93a-d349b9e698e8" data-loc="21:14-21:48" data-file-name="app/dashboard/layout.tsx">
                We encountered an issue while loading the dashboard. This has been reported to our team.
              </p>
              <div className="flex flex-col space-y-3" data-unique-id="cdaa7c78-a3f8-4252-885f-622d64e772b8" data-loc="24:14-24:55" data-file-name="app/dashboard/layout.tsx">
                <button onClick={() => window.location.reload()} className="w-full py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500" data-unique-id="49e613e8-e92f-4d4e-8da5-d694410f3ab2" data-loc="25:16-25:274" data-file-name="app/dashboard/layout.tsx">
                  Refresh Page
                </button>
                <a href="/" className="w-full py-2 px-4 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500" data-unique-id="c1957fb0-54d2-4b56-b469-b18eb370291c" data-loc="28:16-28:233" data-file-name="app/dashboard/layout.tsx">
                  Return to Login
                </a>
              </div>
            </div>
          </div>}>
        <div className="fixed top-0 right-0 z-50 m-4 flex flex-col gap-2" data-unique-id="d10d7558-10b4-49d4-80c3-4a3c1be4461f" data-loc="34:8-34:74" data-file-name="app/dashboard/layout.tsx">
          <SyncStatus />
          {/* Add RLS Status component */}
          <RlsStatus />
        </div>
        {children}
      </ErrorBoundary>
    </ProtectedRoute>;
}