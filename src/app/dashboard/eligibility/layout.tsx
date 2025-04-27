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
  return <ErrorBoundary fallback={<div className="min-h-screen flex flex-col items-center justify-center p-6 bg-green-50" data-unique-id="6e1b0de8-6247-4c83-9519-025950aa897e" data-loc="13:34-13:122" data-file-name="app/dashboard/eligibility/layout.tsx">
          <div className="max-w-md w-full bg-white rounded-lg shadow-lg p-8 text-center" data-unique-id="f7365976-40bd-4ab2-a49b-a1f4c315adff" data-loc="14:10-14:89" data-file-name="app/dashboard/eligibility/layout.tsx">
            <div className="flex items-center justify-center w-16 h-16 mx-auto rounded-full bg-green-100 mb-4" data-unique-id="cd091ce6-ec0e-4323-9e24-7863c4c8a544" data-loc="15:12-15:111" data-file-name="app/dashboard/eligibility/layout.tsx">
              <CreditCard className="h-8 w-8 text-green-600" />
            </div>
            <h2 className="text-2xl font-bold text-gray-900 mb-2" data-unique-id="0d6f04bb-bb3a-4a24-97f1-643976cb497b" data-loc="18:12-18:66" data-file-name="app/dashboard/eligibility/layout.tsx">Eligibility Check Error</h2>
            <p className="text-gray-600 mb-6" data-unique-id="45d1a773-8da4-42d5-a83b-ee1667b9c482" data-loc="19:12-19:46" data-file-name="app/dashboard/eligibility/layout.tsx">
              We encountered an issue while checking credit card eligibility. Please try again or return to the dashboard.
            </p>
            <div className="flex flex-col space-y-3" data-unique-id="9700caff-f4f3-4bf9-9cdf-cf174c4a699f" data-loc="22:12-22:53" data-file-name="app/dashboard/eligibility/layout.tsx">
              <button onClick={() => window.location.reload()} className="w-full py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500" data-unique-id="6c337dc6-f232-4374-adc8-4bc61b25fa5d" data-loc="23:14-23:275" data-file-name="app/dashboard/eligibility/layout.tsx">
                Try Again
              </button>
              <button onClick={() => router.push("/dashboard")} className="w-full py-2 px-4 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500" data-unique-id="fdb52647-a1a6-4beb-afaf-70f20e33fdc2" data-loc="26:14-26:270" data-file-name="app/dashboard/eligibility/layout.tsx">
                Return to Dashboard
              </button>
            </div>
          </div>
        </div>}>
      {children}
    </ErrorBoundary>;
}