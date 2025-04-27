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
      <ErrorBoundary fallback={<div className="min-h-screen flex flex-col items-center justify-center p-6 bg-blue-50" data-unique-id="eb7a858c-5abd-43c1-a9c5-54de3054a201" data-loc="15:31-15:118" data-file-name="app/dashboard/layout.tsx">
            <div className="max-w-md w-full bg-white rounded-lg shadow-lg p-8 text-center" data-unique-id="39518247-80e5-474d-bab3-4292b03b55ca" data-loc="16:12-16:91" data-file-name="app/dashboard/layout.tsx">
              <div className="flex items-center justify-center w-16 h-16 mx-auto rounded-full bg-blue-100 mb-4" data-unique-id="f51c4925-2382-49ee-a60a-21248fa82f03" data-loc="17:14-17:112" data-file-name="app/dashboard/layout.tsx">
                <RefreshCw className="h-8 w-8 text-blue-600" />
              </div>
              <h2 className="text-2xl font-bold text-gray-900 mb-2" data-unique-id="4817d7b2-e34e-4390-854d-7f4071a03e53" data-loc="20:14-20:68" data-file-name="app/dashboard/layout.tsx">Dashboard Error</h2>
              <p className="text-gray-600 mb-6" data-unique-id="70c1286b-8979-4c8c-a194-7a887bfd421b" data-loc="21:14-21:48" data-file-name="app/dashboard/layout.tsx">
                We encountered an issue while loading the dashboard. This has been reported to our team.
              </p>
              <div className="flex flex-col space-y-3" data-unique-id="b21da079-7253-4db3-af51-08e76a0581ca" data-loc="24:14-24:55" data-file-name="app/dashboard/layout.tsx">
                <button onClick={() => window.location.reload()} className="w-full py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500" data-unique-id="ce0e0554-07e4-4edb-a681-c15502a0a061" data-loc="25:16-25:274" data-file-name="app/dashboard/layout.tsx">
                  Refresh Page
                </button>
                <a href="/" className="w-full py-2 px-4 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500" data-unique-id="cbadd774-3ddf-43cc-999e-63d94e0e0047" data-loc="28:16-28:233" data-file-name="app/dashboard/layout.tsx">
                  Return to Login
                </a>
              </div>
            </div>
          </div>}>
        <div className="fixed top-0 right-0 z-50 m-4 flex flex-col gap-2" data-unique-id="31fbd4b8-346b-4734-81ac-fc9e7003f476" data-loc="34:8-34:74" data-file-name="app/dashboard/layout.tsx">
          <SyncStatus />
          {/* Add RLS Status component */}
          <RlsStatus />
        </div>
        {children}
      </ErrorBoundary>
    </ProtectedRoute>;
}