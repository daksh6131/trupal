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
  return <ErrorBoundary fallback={<div className="min-h-screen flex flex-col items-center justify-center p-6 bg-purple-50" data-unique-id="9f5d1d75-6ebd-4009-9272-b9adf57a1144" data-loc="13:34-13:123" data-file-name="app/admin/layout.tsx">
          <div className="max-w-md w-full bg-white rounded-lg shadow-lg p-8 text-center" data-unique-id="244c95b5-896c-4439-a96d-c78b23216d1d" data-loc="14:10-14:89" data-file-name="app/admin/layout.tsx">
            <div className="flex items-center justify-center w-16 h-16 mx-auto rounded-full bg-purple-100 mb-4" data-unique-id="a1467095-19ef-4d46-9d92-800d72b14126" data-loc="15:12-15:112" data-file-name="app/admin/layout.tsx">
              <ShieldAlert className="h-8 w-8 text-purple-600" />
            </div>
            <h2 className="text-2xl font-bold text-gray-900 mb-2" data-unique-id="bc548026-77dd-4719-9532-aa037c96b17f" data-loc="18:12-18:66" data-file-name="app/admin/layout.tsx">Admin Panel Error</h2>
            <p className="text-gray-600 mb-6" data-unique-id="970bbc2c-0fcf-44c9-a821-466bd69734f1" data-loc="19:12-19:46" data-file-name="app/admin/layout.tsx">
              We encountered an issue in the admin panel. Our technical team has been notified.
            </p>
            <div className="flex flex-col space-y-3" data-unique-id="e14b2f0c-5131-4151-8261-3e8d8cb6b6c7" data-loc="22:12-22:53" data-file-name="app/admin/layout.tsx">
              <button onClick={() => window.location.reload()} className="w-full py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-purple-600 hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500" data-unique-id="62a84dbb-76ac-44d8-8d36-3af3ce10ea5c" data-loc="23:14-23:278" data-file-name="app/admin/layout.tsx">
                Refresh Page
              </button>
              <a href="/admin" className="w-full py-2 px-4 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500" data-unique-id="1b48a905-372c-42f1-9d92-d32c040a0ea7" data-loc="26:14-26:238" data-file-name="app/admin/layout.tsx">
                Return to Admin Login
              </a>
            </div>
          </div>
        </div>}>
      <div className="fixed top-0 right-0 z-50 m-4 flex flex-col gap-2" data-unique-id="3e6db870-a4d9-41f8-a623-8b86b5856fdf" data-loc="32:6-32:72" data-file-name="app/admin/layout.tsx">
        <ConnectionStatus />
        <SyncStatus />
      </div>
      {children}
    </ErrorBoundary>;
}