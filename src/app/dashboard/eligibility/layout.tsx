"use client";

import React from "react";
import { ErrorBoundary } from "@/components/error-boundary";
import { CreditCard, RefreshCw } from "lucide-react";
import { useRouter } from "next/navigation";
export default function EligibilityLayout({
  children
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  return <ErrorBoundary fallback={<div className="min-h-screen flex flex-col items-center justify-center p-6 bg-green-50" data-unique-id="6114cfa3-7d8a-4c9b-9dd2-e5849e1a0d96" data-loc="13:34-13:122" data-file-name="app/dashboard/eligibility/layout.tsx">
          <div className="max-w-md w-full bg-white rounded-lg shadow-lg p-8 text-center" data-unique-id="186ff0b0-04dd-4031-9ffd-099bc9cf0c1b" data-loc="14:10-14:89" data-file-name="app/dashboard/eligibility/layout.tsx">
            <div className="flex items-center justify-center w-16 h-16 mx-auto rounded-full bg-green-100 mb-4" data-unique-id="3a86d634-e1fb-49d4-88b9-2d5e7397ede7" data-loc="15:12-15:111" data-file-name="app/dashboard/eligibility/layout.tsx">
              <CreditCard className="h-8 w-8 text-green-600" />
            </div>
            <h2 className="text-2xl font-bold text-gray-900 mb-2" data-unique-id="d45d1fe0-e343-4158-bb4c-343833a54a60" data-loc="18:12-18:66" data-file-name="app/dashboard/eligibility/layout.tsx">Eligibility Check Error</h2>
            <p className="text-gray-600 mb-6" data-unique-id="c8105fe5-cb90-499f-8068-bf66fcf37ae6" data-loc="19:12-19:46" data-file-name="app/dashboard/eligibility/layout.tsx">
              We encountered an issue while checking credit card eligibility. Please try again or return to the dashboard.
            </p>
            <div className="flex flex-col space-y-3" data-unique-id="64f4839f-00bf-4000-90aa-54c84132b9af" data-loc="22:12-22:53" data-file-name="app/dashboard/eligibility/layout.tsx">
              <button onClick={() => window.location.reload()} className="w-full py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500" data-unique-id="c39832a5-290e-4deb-b5c0-f9b1fd74eaee" data-loc="23:14-23:275" data-file-name="app/dashboard/eligibility/layout.tsx">
                Try Again
              </button>
              <button onClick={() => router.push("/dashboard")} className="w-full py-2 px-4 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500" data-unique-id="326ae92d-f00a-430b-8973-a259d5f90eac" data-loc="26:14-26:270" data-file-name="app/dashboard/eligibility/layout.tsx">
                Return to Dashboard
              </button>
            </div>
          </div>
        </div>}>
      {children}
    </ErrorBoundary>;
}