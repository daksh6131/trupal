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
  return <ErrorBoundary fallback={<div className="min-h-screen flex flex-col items-center justify-center p-6 bg-purple-50" data-unique-id="d2044e2a-1572-4aca-b05a-042739916c25" data-loc="13:34-13:123" data-file-name="app/admin/layout.tsx">
          <div className="max-w-md w-full bg-white rounded-lg shadow-lg p-8 text-center" data-unique-id="cbe20d9c-d19a-4eb2-872d-31e785b28f15" data-loc="14:10-14:89" data-file-name="app/admin/layout.tsx">
            <div className="flex items-center justify-center w-16 h-16 mx-auto rounded-full bg-purple-100 mb-4" data-unique-id="7f99ae52-e006-405c-923e-0fce7e30251b" data-loc="15:12-15:112" data-file-name="app/admin/layout.tsx">
              <ShieldAlert className="h-8 w-8 text-purple-600" />
            </div>
            <h2 className="text-2xl font-bold text-gray-900 mb-2" data-unique-id="2a361d96-04d3-4e33-a8e1-df737cff13c1" data-loc="18:12-18:66" data-file-name="app/admin/layout.tsx">Admin Panel Error</h2>
            <p className="text-gray-600 mb-6" data-unique-id="79928cdd-c498-4f73-9442-f0cde79d7a30" data-loc="19:12-19:46" data-file-name="app/admin/layout.tsx">
              We encountered an issue in the admin panel. Our technical team has been notified.
            </p>
            <div className="flex flex-col space-y-3" data-unique-id="86696be7-68f2-4b2e-8461-81fc9e08e977" data-loc="22:12-22:53" data-file-name="app/admin/layout.tsx">
              <button onClick={() => window.location.reload()} className="w-full py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-purple-600 hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500" data-unique-id="09cc288e-2826-4c63-aa5d-078947646fc5" data-loc="23:14-23:278" data-file-name="app/admin/layout.tsx">
                Refresh Page
              </button>
              <a href="/admin" className="w-full py-2 px-4 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500" data-unique-id="cb811190-fc2b-4724-8b8b-dccf7c7a45b9" data-loc="26:14-26:238" data-file-name="app/admin/layout.tsx">
                Return to Admin Login
              </a>
            </div>
          </div>
        </div>}>
      <div className="fixed top-0 right-0 z-50 m-4 flex flex-col gap-2" data-unique-id="69183ef6-63b0-4909-a640-711fd43bd581" data-loc="32:6-32:72" data-file-name="app/admin/layout.tsx">
        <ConnectionStatus />
        <SyncStatus />
      </div>
      {children}
    </ErrorBoundary>;
}