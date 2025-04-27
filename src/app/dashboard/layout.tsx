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
      <ErrorBoundary fallback={<div className="min-h-screen flex flex-col items-center justify-center p-6 bg-blue-50" data-unique-id="0da96830-a3a9-4c1e-b565-4ebaa4368130" data-loc="15:31-15:118" data-file-name="app/dashboard/layout.tsx">
            <div className="max-w-md w-full bg-white rounded-lg shadow-lg p-8 text-center" data-unique-id="44596eee-c5fd-4315-93fc-37637576d621" data-loc="16:12-16:91" data-file-name="app/dashboard/layout.tsx">
              <div className="flex items-center justify-center w-16 h-16 mx-auto rounded-full bg-blue-100 mb-4" data-unique-id="ed97121b-f843-40d0-b146-bf3cd9daf37d" data-loc="17:14-17:112" data-file-name="app/dashboard/layout.tsx">
                <RefreshCw className="h-8 w-8 text-blue-600" />
              </div>
              <h2 className="text-2xl font-bold text-gray-900 mb-2" data-unique-id="27fdf90f-f7f9-4255-b99f-ccbff3f5b7f6" data-loc="20:14-20:68" data-file-name="app/dashboard/layout.tsx">Dashboard Error</h2>
              <p className="text-gray-600 mb-6" data-unique-id="69b15d0d-1a63-45a0-8ec6-370f3c0bf63f" data-loc="21:14-21:48" data-file-name="app/dashboard/layout.tsx">
                We encountered an issue while loading the dashboard. This has been reported to our team.
              </p>
              <div className="flex flex-col space-y-3" data-unique-id="692e834e-a196-441b-a6ac-e2204e2820ef" data-loc="24:14-24:55" data-file-name="app/dashboard/layout.tsx">
                <button onClick={() => window.location.reload()} className="w-full py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500" data-unique-id="3695ae3e-3b68-4717-a8f0-37d179c751e2" data-loc="25:16-25:274" data-file-name="app/dashboard/layout.tsx">
                  Refresh Page
                </button>
                <a href="/" className="w-full py-2 px-4 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500" data-unique-id="b2ef101b-9d2e-4b26-a64c-b25b161e0d39" data-loc="28:16-28:233" data-file-name="app/dashboard/layout.tsx">
                  Return to Login
                </a>
              </div>
            </div>
          </div>}>
        <div className="fixed top-0 right-0 z-50 m-4 flex flex-col gap-2" data-unique-id="ad8b4594-1652-44c1-921b-bef925360ff1" data-loc="34:8-34:74" data-file-name="app/dashboard/layout.tsx">
          <SyncStatus />
          {/* Add RLS Status component */}
          <RlsStatus />
        </div>
        {children}
      </ErrorBoundary>
    </ProtectedRoute>;
}