"use client";

import React from "react";
import { ErrorBoundary } from "@/components/error-boundary";
import { CreditCard, RefreshCw } from "lucide-react";
import { useRouter } from "next/navigation";

export default function EligibilityLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();

  return (
    <ErrorBoundary
      fallback={
        <div className="min-h-screen flex flex-col items-center justify-center p-6 bg-green-50">
          <div className="max-w-md w-full bg-white rounded-lg shadow-lg p-8 text-center">
            <div className="flex items-center justify-center w-16 h-16 mx-auto rounded-full bg-green-100 mb-4">
              <CreditCard className="h-8 w-8 text-green-600" />
            </div>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Eligibility Check Error</h2>
            <p className="text-gray-600 mb-6">
              We encountered an issue while checking credit card eligibility. Please try again or return to the dashboard.
            </p>
            <div className="flex flex-col space-y-3">
              <button
                onClick={() => window.location.reload()}
                className="w-full py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
              >
                Try Again
              </button>
              <button
                onClick={() => router.push("/dashboard")}
                className="w-full py-2 px-4 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
              >
                Return to Dashboard
              </button>
            </div>
          </div>
        </div>
      }
    >
      {children}
    </ErrorBoundary>
  );
}
