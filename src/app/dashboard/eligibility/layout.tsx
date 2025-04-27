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
  return <ErrorBoundary fallback={<div className="min-h-screen flex flex-col items-center justify-center p-6 bg-green-50" data-unique-id="442fb406-07f1-4747-9a69-f9e33667a998" data-loc="13:34-13:122" data-file-name="app/dashboard/eligibility/layout.tsx">
          <div className="max-w-md w-full bg-white rounded-lg shadow-lg p-8 text-center" data-unique-id="25b97435-8adc-4b77-a9e0-f679f66bcc1e" data-loc="14:10-14:89" data-file-name="app/dashboard/eligibility/layout.tsx">
            <div className="flex items-center justify-center w-16 h-16 mx-auto rounded-full bg-green-100 mb-4" data-unique-id="193a2204-c555-4e07-b9d3-47599b40e25f" data-loc="15:12-15:111" data-file-name="app/dashboard/eligibility/layout.tsx">
              <CreditCard className="h-8 w-8 text-green-600" />
            </div>
            <h2 className="text-2xl font-bold text-gray-900 mb-2" data-unique-id="28b61665-0a88-4694-bba6-fb679d2017b1" data-loc="18:12-18:66" data-file-name="app/dashboard/eligibility/layout.tsx">Eligibility Check Error</h2>
            <p className="text-gray-600 mb-6" data-unique-id="b2991b8a-d5a0-4d49-a80f-c13bff68b1ba" data-loc="19:12-19:46" data-file-name="app/dashboard/eligibility/layout.tsx">
              We encountered an issue while checking credit card eligibility. Please try again or return to the dashboard.
            </p>
            <div className="flex flex-col space-y-3" data-unique-id="1fc19dea-c77b-4ce2-9290-b1cf984db512" data-loc="22:12-22:53" data-file-name="app/dashboard/eligibility/layout.tsx">
              <button onClick={() => window.location.reload()} className="w-full py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500" data-unique-id="a0dd7c35-28e8-488f-a7a5-3d804c8bb658" data-loc="23:14-23:275" data-file-name="app/dashboard/eligibility/layout.tsx">
                Try Again
              </button>
              <button onClick={() => router.push("/dashboard")} className="w-full py-2 px-4 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500" data-unique-id="726e46ea-2472-4286-ade1-78123ff37db6" data-loc="26:14-26:270" data-file-name="app/dashboard/eligibility/layout.tsx">
                Return to Dashboard
              </button>
            </div>
          </div>
        </div>}>
      {children}
    </ErrorBoundary>;
}