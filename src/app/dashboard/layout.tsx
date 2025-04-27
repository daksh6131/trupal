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
      <ErrorBoundary fallback={<div className="min-h-screen flex flex-col items-center justify-center p-6 bg-blue-50" data-unique-id="751be530-63e4-4455-a6b3-d72eb416e2bb" data-loc="15:31-15:118" data-file-name="app/dashboard/layout.tsx">
            <div className="max-w-md w-full bg-white rounded-lg shadow-lg p-8 text-center" data-unique-id="c2e9125e-2fc7-4c0b-a5fa-7f624c44b762" data-loc="16:12-16:91" data-file-name="app/dashboard/layout.tsx">
              <div className="flex items-center justify-center w-16 h-16 mx-auto rounded-full bg-blue-100 mb-4" data-unique-id="c6742d61-7573-456b-9a61-6a5a299b25b4" data-loc="17:14-17:112" data-file-name="app/dashboard/layout.tsx">
                <RefreshCw className="h-8 w-8 text-blue-600" />
              </div>
              <h2 className="text-2xl font-bold text-gray-900 mb-2" data-unique-id="241c4256-2d41-4af8-bf9d-de273f80e544" data-loc="20:14-20:68" data-file-name="app/dashboard/layout.tsx">Dashboard Error</h2>
              <p className="text-gray-600 mb-6" data-unique-id="ef8018e6-d921-4ec1-a419-3a5d7892c1d9" data-loc="21:14-21:48" data-file-name="app/dashboard/layout.tsx">
                We encountered an issue while loading the dashboard. This has been reported to our team.
              </p>
              <div className="flex flex-col space-y-3" data-unique-id="c33e4d10-370f-4166-99c9-1844a4a82071" data-loc="24:14-24:55" data-file-name="app/dashboard/layout.tsx">
                <button onClick={() => window.location.reload()} className="w-full py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500" data-unique-id="e78622b6-58f0-4ee9-8be4-d718048537e2" data-loc="25:16-25:274" data-file-name="app/dashboard/layout.tsx">
                  Refresh Page
                </button>
                <a href="/" className="w-full py-2 px-4 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500" data-unique-id="649d022a-5c1a-482e-b3b7-facb59440468" data-loc="28:16-28:233" data-file-name="app/dashboard/layout.tsx">
                  Return to Login
                </a>
              </div>
            </div>
          </div>}>
        <div className="fixed top-0 right-0 z-50 m-4 flex flex-col gap-2" data-unique-id="1c868306-a5ff-4962-ad46-1100be8e1d52" data-loc="34:8-34:74" data-file-name="app/dashboard/layout.tsx">
          <SyncStatus />
          {/* Add RLS Status component */}
          <RlsStatus />
        </div>
        {children}
      </ErrorBoundary>
    </ProtectedRoute>;
}