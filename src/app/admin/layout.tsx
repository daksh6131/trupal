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
  return <ErrorBoundary fallback={<div className="min-h-screen flex flex-col items-center justify-center p-6 bg-purple-50" data-unique-id="82e7dc02-2d9b-46d3-a7ab-80bc65f60ad5" data-loc="13:34-13:123" data-file-name="app/admin/layout.tsx">
          <div className="max-w-md w-full bg-white rounded-lg shadow-lg p-8 text-center" data-unique-id="3a45f836-e55b-4798-acfc-5659250f796f" data-loc="14:10-14:89" data-file-name="app/admin/layout.tsx">
            <div className="flex items-center justify-center w-16 h-16 mx-auto rounded-full bg-purple-100 mb-4" data-unique-id="1a517444-44b4-41d5-aa80-cfe18939458c" data-loc="15:12-15:112" data-file-name="app/admin/layout.tsx">
              <ShieldAlert className="h-8 w-8 text-purple-600" />
            </div>
            <h2 className="text-2xl font-bold text-gray-900 mb-2" data-unique-id="508ac049-be48-431c-9d3e-c9775befc06d" data-loc="18:12-18:66" data-file-name="app/admin/layout.tsx">Admin Panel Error</h2>
            <p className="text-gray-600 mb-6" data-unique-id="61095ce6-7a98-4fa8-9bfe-b009a2a684b6" data-loc="19:12-19:46" data-file-name="app/admin/layout.tsx">
              We encountered an issue in the admin panel. Our technical team has been notified.
            </p>
            <div className="flex flex-col space-y-3" data-unique-id="4fe6ea34-d0ea-4f8d-b60d-ac99485a1bef" data-loc="22:12-22:53" data-file-name="app/admin/layout.tsx">
              <button onClick={() => window.location.reload()} className="w-full py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-purple-600 hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500" data-unique-id="3d53cbaa-3959-4711-9d60-4d19308a95af" data-loc="23:14-23:278" data-file-name="app/admin/layout.tsx">
                Refresh Page
              </button>
              <a href="/admin" className="w-full py-2 px-4 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500" data-unique-id="ab3c9124-193b-46b9-b4fe-532f945101fb" data-loc="26:14-26:238" data-file-name="app/admin/layout.tsx">
                Return to Admin Login
              </a>
            </div>
          </div>
        </div>}>
      <div className="fixed top-0 right-0 z-50 m-4 flex flex-col gap-2" data-unique-id="6f414288-5b17-43be-970e-5d30621fdb0f" data-loc="32:6-32:72" data-file-name="app/admin/layout.tsx">
        <ConnectionStatus />
        <SyncStatus />
      </div>
      {children}
    </ErrorBoundary>;
}