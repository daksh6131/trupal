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
      <ErrorBoundary fallback={<div className="min-h-screen flex flex-col items-center justify-center p-6 bg-blue-50" data-unique-id="8ffed453-f712-401f-b59b-90a318e4012c" data-loc="15:31-15:118" data-file-name="app/dashboard/layout.tsx">
            <div className="max-w-md w-full bg-white rounded-lg shadow-lg p-8 text-center" data-unique-id="07861d3a-9eea-4cc8-8263-0c64637d4972" data-loc="16:12-16:91" data-file-name="app/dashboard/layout.tsx">
              <div className="flex items-center justify-center w-16 h-16 mx-auto rounded-full bg-blue-100 mb-4" data-unique-id="71c1e727-00da-414f-a571-dc87fb2dc9ca" data-loc="17:14-17:112" data-file-name="app/dashboard/layout.tsx">
                <RefreshCw className="h-8 w-8 text-blue-600" />
              </div>
              <h2 className="text-2xl font-bold text-gray-900 mb-2" data-unique-id="ef6e633e-9329-4913-852b-2fad2bcd0f38" data-loc="20:14-20:68" data-file-name="app/dashboard/layout.tsx">Dashboard Error</h2>
              <p className="text-gray-600 mb-6" data-unique-id="e783b5ce-4d6c-406d-9698-6442fad9d7ee" data-loc="21:14-21:48" data-file-name="app/dashboard/layout.tsx">
                We encountered an issue while loading the dashboard. This has been reported to our team.
              </p>
              <div className="flex flex-col space-y-3" data-unique-id="f6982e76-86c5-42fa-9230-9f1cb8f0f8cd" data-loc="24:14-24:55" data-file-name="app/dashboard/layout.tsx">
                <button onClick={() => window.location.reload()} className="w-full py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500" data-unique-id="95f9d341-59ee-431c-bb27-aff1c62bd4c2" data-loc="25:16-25:274" data-file-name="app/dashboard/layout.tsx">
                  Refresh Page
                </button>
                <a href="/" className="w-full py-2 px-4 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500" data-unique-id="558a30ff-4b47-4572-ba80-1470b264b610" data-loc="28:16-28:233" data-file-name="app/dashboard/layout.tsx">
                  Return to Login
                </a>
              </div>
            </div>
          </div>}>
        <div className="fixed top-0 right-0 z-50 m-4 flex flex-col gap-2" data-unique-id="a906762c-653a-4d3c-b8c3-34f78c0bf959" data-loc="34:8-34:74" data-file-name="app/dashboard/layout.tsx">
          <SyncStatus />
          {/* Add RLS Status component */}
          <RlsStatus />
        </div>
        {children}
      </ErrorBoundary>
    </ProtectedRoute>;
}