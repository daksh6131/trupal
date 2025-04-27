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
  return <ErrorBoundary fallback={<div className="min-h-screen flex flex-col items-center justify-center p-6 bg-purple-50" data-unique-id="3a52ad3e-f430-401f-bca1-64baf484aa4c" data-loc="13:34-13:123" data-file-name="app/admin/layout.tsx">
          <div className="max-w-md w-full bg-white rounded-lg shadow-lg p-8 text-center" data-unique-id="06e09492-5a4d-41a2-9567-96016dcdb14b" data-loc="14:10-14:89" data-file-name="app/admin/layout.tsx">
            <div className="flex items-center justify-center w-16 h-16 mx-auto rounded-full bg-purple-100 mb-4" data-unique-id="446c255c-08af-4ebb-8ea8-aae0ed33f1fc" data-loc="15:12-15:112" data-file-name="app/admin/layout.tsx">
              <ShieldAlert className="h-8 w-8 text-purple-600" />
            </div>
            <h2 className="text-2xl font-bold text-gray-900 mb-2" data-unique-id="22ac3eb0-052e-44bb-988b-79740b45e84b" data-loc="18:12-18:66" data-file-name="app/admin/layout.tsx">Admin Panel Error</h2>
            <p className="text-gray-600 mb-6" data-unique-id="7469de1b-c4c0-4506-b2f2-48bf570eebfc" data-loc="19:12-19:46" data-file-name="app/admin/layout.tsx">
              We encountered an issue in the admin panel. Our technical team has been notified.
            </p>
            <div className="flex flex-col space-y-3" data-unique-id="241ea9ec-0b3d-4282-b54d-b0a78e153561" data-loc="22:12-22:53" data-file-name="app/admin/layout.tsx">
              <button onClick={() => window.location.reload()} className="w-full py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-purple-600 hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500" data-unique-id="00e2fa66-eeb6-4531-b849-9eb417a0f5a8" data-loc="23:14-23:278" data-file-name="app/admin/layout.tsx">
                Refresh Page
              </button>
              <a href="/admin" className="w-full py-2 px-4 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500" data-unique-id="39ed8590-4b4c-49db-88eb-d5ed873e47c6" data-loc="26:14-26:238" data-file-name="app/admin/layout.tsx">
                Return to Admin Login
              </a>
            </div>
          </div>
        </div>}>
      <div className="fixed top-0 right-0 z-50 m-4 flex flex-col gap-2" data-unique-id="5d515aea-fa03-4739-9adc-c5a48ab3efec" data-loc="32:6-32:72" data-file-name="app/admin/layout.tsx">
        <ConnectionStatus />
        <SyncStatus />
      </div>
      {children}
    </ErrorBoundary>;
}