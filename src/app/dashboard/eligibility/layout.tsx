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
  return <ErrorBoundary fallback={<div className="min-h-screen flex flex-col items-center justify-center p-6 bg-green-50" data-unique-id="8f67c9d8-0e6f-4571-b34f-9b7b059b2ae9" data-loc="13:34-13:122" data-file-name="app/dashboard/eligibility/layout.tsx">
          <div className="max-w-md w-full bg-white rounded-lg shadow-lg p-8 text-center" data-unique-id="bda8c6f5-821a-4435-879d-e50d2a08a3f1" data-loc="14:10-14:89" data-file-name="app/dashboard/eligibility/layout.tsx">
            <div className="flex items-center justify-center w-16 h-16 mx-auto rounded-full bg-green-100 mb-4" data-unique-id="be4b1168-3930-4a1f-a2c4-f639914a8712" data-loc="15:12-15:111" data-file-name="app/dashboard/eligibility/layout.tsx">
              <CreditCard className="h-8 w-8 text-green-600" />
            </div>
            <h2 className="text-2xl font-bold text-gray-900 mb-2" data-unique-id="d8de3f88-1270-4d92-af0e-a4871a9776a0" data-loc="18:12-18:66" data-file-name="app/dashboard/eligibility/layout.tsx">Eligibility Check Error</h2>
            <p className="text-gray-600 mb-6" data-unique-id="fa87500a-a03e-4cb9-8941-fc0a3f0e203a" data-loc="19:12-19:46" data-file-name="app/dashboard/eligibility/layout.tsx">
              We encountered an issue while checking credit card eligibility. Please try again or return to the dashboard.
            </p>
            <div className="flex flex-col space-y-3" data-unique-id="46a8d1f3-46d3-47c9-aa3f-10b974616608" data-loc="22:12-22:53" data-file-name="a