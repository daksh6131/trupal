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
  return <ErrorBoundary fallback={<div className="min-h-screen flex flex-col items-center justify-center p-6 bg-green-50" data-unique-id="2c6d2b33-1048-4b2b-86b1-9f4da35aa242" data-loc="13:34-13:122" data-file-name="app/dashboard/eligibility/layout.tsx">
          <div className="max-w-md w-full bg-white rounded-lg shadow-lg p-8 text-center" data-unique-id="93d3637a-6edd-44c4-bdee-ff1636b0f586" data-loc="14:10-14:89" data-file-name="app/dashboard/eligibility/layout.tsx">
            <div className="flex items-center justify-center w-16 h-16 mx-auto rounded-full bg-green-100 mb-4" data-unique-id="e0508e86-b60f-4110-a53b-14e2155ec2f4" data-loc="15:12-15:111" data-file-name="app/dashboard/eligibility/layout.tsx">
              <CreditCard className="h-8 w-8 text-green-600" />
            </div>
            <h2 className="text-2xl font-bold text-gray-900 mb-2" data-unique-id="29736e24-c676-42d0-98ac-eb4e3d6d1b9d" data-loc="18:12-18:66" data-file-name="app/dashboard/eligibility/layout.tsx">Eligibility Check Error</h2>
            <p className="text-gray-600 mb-6" data-unique-id="39c6672b-b344-47d6-b4a4-53fdb4c6f091" data-loc="19:12-19:46" data-file-name="app/dashboard/eligibility/layout.tsx">
              We encountered an issue while checking credit card eligibility. Please try again or return to the dashboard.
            </p>
            <div className="flex flex-col space-y-3" data-unique-id="5cbfac11-db02-45ca-bbe7-4b43abb0389d" data-loc="22:12-22:53" data-file-name="app/dashboard/eligibility/layout.tsx">
              <button onClick={() => window.location.reload()} className="w-full py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500" data-unique-id="2c575861-89c0-4486-ab91-c6f1c0b47e58" data-loc="23:14-23:275" data-file-name="app/dashboard/eligibility/layout.tsx">
                Try Again
              </button>
              <button onClick={() => router.push("/dashboard")} className="w-full py-2 px-4 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500" data-unique-id="1bb0448f-2924-4df6-b761-be60dcbb1f34" data-loc="26:14-26:270" data-file-name="app/dashboard/eligibility/layout.tsx">
                Return to Dashboard
              </button>
            </div>
          </div>
        </div>}>
      {children}
    </ErrorBoundary>;
}