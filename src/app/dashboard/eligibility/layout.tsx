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
  return <ErrorBoundary fallback={<div className="min-h-screen flex flex-col items-center justify-center p-6 bg-green-50" data-unique-id="e898d552-f2ce-4f11-ae9f-30b7774eaf58" data-loc="13:34-13:122" data-file-name="app/dashboard/eligibility/layout.tsx">
          <div className="max-w-md w-full bg-white rounded-lg shadow-lg p-8 text-center" data-unique-id="9c10a3a5-238b-4c6b-904a-9b18edf83469" data-loc="14:10-14:89" data-file-name="app/dashboard/eligibility/layout.tsx">
            <div className="flex items-center justify-center w-16 h-16 mx-auto rounded-full bg-green-100 mb-4" data-unique-id="f3e489cc-7c95-47cc-8c42-75c6441ddd1b" data-loc="15:12-15:111" data-file-name="app/dashboard/eligibility/layout.tsx">
              <CreditCard className="h-8 w-8 text-green-600" />
            </div>
            <h2 className="text-2xl font-bold text-gray-900 mb-2" data-unique-id="2fef799b-7de2-4325-ad9e-4deb05576c5f" data-loc="18:12-18:66" data-file-name="app/dashboard/eligibility/layout.tsx">Eligibility Check Error</h2>
            <p className="text-gray-600 mb-6" data-unique-id="5722ee8b-d5d8-4906-b443-8e19a7dbaa19" data-loc="19:12-19:46" data-file-name="app/dashboard/eligibility/layout.tsx">
              We encountered an issue while checking credit card eligibility. Please try again or return to the dashboard.
            </p>
            <div className="flex flex-col space-y-3" data-unique-id="7712a3ae-1027-4f18-9590-787f3b602a08" data-loc="22:12-22:53" data-file-name="app/dashboard/eligibility/layout.tsx">
              <button onClick={() => window.location.reload()} className="w-full py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500" data-unique-id="f6fab4c3-683f-465e-ab69-0dfce86fa90a" data-loc="23:14-23:275" data-file-name="app/dashboard/eligibility/layout.tsx">
                Try Again
              </button>
              <button onClick={() => router.push("/dashboard")} className="w-full py-2 px-4 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500" data-unique-id="3dcdafba-f79b-4fd6-9abe-b05554d11983" data-loc="26:14-26:270" data-file-name="app/dashboard/eligibility/layout.tsx">
                Return to Dashboard
              </button>
            </div>
          </div>
        </div>}>
      {children}
    </ErrorBoundary>;
}