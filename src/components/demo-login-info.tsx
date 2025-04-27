"use client";

import { Info } from "lucide-react";
interface DemoLoginInfoProps {
  type?: "agent" | "admin";
}
export default function DemoLoginInfo({
  type = "agent"
}: DemoLoginInfoProps) {
  const isAgent = type === "agent";
  return <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6" data-unique-id="e43155ee-3936-4d29-83d6-31fe9ac9e0f4" data-loc="11:9-11:80" data-file-name="components/demo-login-info.tsx">
      <div className="flex items-start" data-unique-id="42f9951e-eb9a-42e4-a8cf-2c4881fe5560" data-loc="12:6-12:40" data-file-name="components/demo-login-info.tsx">
        <Info className="h-5 w-5 text-blue-500 mt-0.5 mr-2 flex-shrink-0" />
        <div data-unique-id="7ac2dc58-3292-4f78-88ca-9ac8c29ef839" data-loc="14:8-14:13" data-file-name="components/demo-login-info.tsx">
          <h3 className="font-medium text-blue-800 mb-1" data-unique-id="f97eb1c3-8549-4403-a058-b52541c249a9" data-loc="15:10-15:57" data-file-name="components/demo-login-info.tsx">Demo {isAgent ? "Agent" : "Admin"} Login</h3>
          <p className="text-sm text-blue-700 mb-2" data-unique-id="37aace5a-f50f-42b1-ac5e-9ee58f712458" data-loc="16:10-16:52" data-file-name="components/demo-login-info.tsx">Use these credentials to test the application:</p>
          <ul className="text-sm text-blue-700 space-y-1" data-unique-id="488030ef-7b3d-4ad1-8a7c-ecbf57a5524d" data-loc="17:10-17:58" data-file-name="components/demo-login-info.tsx">
            <li data-unique-id="18a37de6-3641-49ab-b14a-41e50bd8b6f1" data-loc="18:12-18:16" data-file-name="components/demo-login-info.tsx"><span className="font-medium" data-unique-id="ebad55c6-f255-485f-b54f-1fb050b2b8c5" data-loc="18:16-18:46" data-file-name="components/demo-login-info.tsx">Phone:</span> {isAgent ? "9876543210" : "8076492495"}</li>
            <li data-unique-id="e5d490da-9ab3-4636-9b35-3c24eba21ec0" data-loc="19:12-19:16" data-file-name="components/demo-login-info.tsx"><span className="font-medium" data-unique-id="073a718a-7403-449d-97c0-582ea4ef6ac8" data-loc="19:16-19:46" data-file-name="components/demo-login-info.tsx">OTP:</span> 123456 (will be displayed after sending)</li>
            <li data-unique-id="7817b22a-9dde-4b39-990d-c9569cfe564d" data-loc="20:12-20:16" data-file-name="components/demo-login-info.tsx"><span className="font-medium" data-unique-id="ded4d140-979f-4a34-9758-371aae2c5f2e" data-loc="20:16-20:46" data-file-name="components/demo-login-info.tsx">Role:</span> {isAgent ? "Sales Agent" : "Admin"}</li>
          </ul>
        </div>
      </div>
    </div>;
}