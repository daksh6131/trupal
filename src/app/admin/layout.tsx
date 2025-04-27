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
  return <ErrorBoundary fallback={<div className="min-h-screen flex flex-col items-center justify-center p-6 bg-purple-50" data-unique-id="fc113a8e-2357-4a62-b5c8-2046367a7a99" data-loc="13:34-13:123" data-file-name="app/admin/layout.tsx">
          <div className="max-w-md w-full bg-white rounded-lg shadow-lg p-8 text-center" data-unique-id="559ce329-f062-4e63-889c-c0840f8e8172" data-loc="14:10-14:89" data-file-name="app/admin/layout.tsx">
            <div className="flex items-center justify-center w-16 h-16 mx-auto rounded-full bg-purple-100 mb-4" data-unique-id="35e23343-d4b9-47cb-9b24-2663c4f3f1ae" data-loc="15:12-15:112" data-file-name="app/admin/layout.tsx">
              <ShieldAlert className="h-8 w-8 text-purple-600" />
            </div>
            <h2 className="text-2xl font-bold text-gray-900 mb-2" data-unique-id="486687ed-0886-44ab-b06c-84d3f3699373" data-loc="18:12-18:66" data-file-name="app/admin/layout.tsx">Admin Panel Error</h2>
            <p className="text-gray-600 mb-6" data-unique-id="5266560b-80f4-4636-8037-b561089c3925" data-loc="19:12-19:46" data-file-name="app/admin/layout.tsx">
              We encountered an issue in the admin panel. Our technical team has been notified.
            </p>
            <div className="flex flex-col space-y-3" data-unique-id="25aaad71-983c-4525-804e-ea01c8f49bd3" data-loc="22:12-22:53" data-file-name="app/admin/layout.tsx">
              <button onClick={() => window.location.reload()} className="w-full py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-purple-600 hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500" data-unique-id="0f2ef083-f8b0-40df-8671-f0be7e8632b5" data-loc="23:14-23:278" data-file-name="app/admin/layout.tsx">
                Refresh Page
              </button>
              <a href="/admin" className="w-full py-2 px-4 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500" data-unique-id="dd6814af-40ea-4f78-969c-7e879e747c6d" data-loc="26:14-26:238" data-file-name="app/admin/layout.tsx">
                Return to Admin Login
              </a>
            </div>
          </div>
        </div>}>
      <div className="fixed top-0 right-0 z-50 m-4 flex flex-col gap-2" data-unique-id="cfc98f55-8c0e-452c-9b6a-b985c609a635" data-loc="32:6-32:72" data-file-name="app/admin/layout.tsx">
        <ConnectionStatus />
        <SyncStatus />
      </div>
      {children}
    </ErrorBoundary>;
}