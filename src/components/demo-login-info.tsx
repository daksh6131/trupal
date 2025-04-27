"use client";

import { Info } from "lucide-react";
interface DemoLoginInfoProps {
  type?: "agent" | "admin";
}
export default function DemoLoginInfo({
  type = "agent"
}: DemoLoginInfoProps) {
  const isAgent = type === "agent";
  return <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
      <div className="flex items-start">
        <Info className="h-5 w-5 text-blue-500 mt-0.5 mr-2 flex-shrink-0" />
        <div>
          <h3 className="font-medium text-blue-800 mb-1">Demo {isAgent ? "Agent" : "Admin"} Login</h3>
          <p className="text-sm text-blue-700 mb-2">Use these credentials to test the application:</p>
          <ul className="text-sm text-blue-700 space-y-1">
            <li><span className="font-medium">Phone:</span> {isAgent ? "9876543210" : "8076492495"}</li>
            <li><span className="font-medium">OTP:</span> 123456 (will be displayed after sending)</li>
            <li><span className="font-medium">Role:</span> {isAgent ? "Sales Agent" : "Admin"}</li>
          </ul>
        </div>
      </div>
    </div>;
}