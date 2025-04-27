"use client";

import { Info } from "lucide-react";
interface DemoLoginInfoProps {
  type?: "agent" | "admin";
}
export default function DemoLoginInfo({
  type = "agent"
}: DemoLoginInfoProps) {
  const isAgent = type === "agent";
  return <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6" data-unique-id="06503f9e-1caa-4c5d-9fd0-6fc48d455d3e" data-loc="11:9-11:80" data-file-name="components/demo-login-info.tsx">
      <div className="flex items-start" data-unique-id="a2eb2014-e52f-4bf4-981f-debb3350851a" data-loc="12:6-12:40" data-file-name="components/demo-login-info.tsx">
        <Info className="h-5 w-5 text-blue-500 mt-0.5 mr-2 flex-shrink-0" />
        <div data-unique-id="00f92b00-0926-4e5e-8ca8-7a7b37af009c" data-loc="14:8-14:13" data-file-name="components/demo-login-info.tsx">
          <h3 className="font-medium text-blue-800 mb-1" data-unique-id="0b174d79-6900-4285-80c1-f75d2aabf9b7" data-loc="15:10-15:57" data-file-name="components/demo-login-info.tsx">Demo {isAgent ? "Agent" : "Admin"} Login</h3>
          <p className="text-sm text-blue-700 mb-2" data-unique-id="6b7b0262-20c1-4e01-a591-903ea6fe419b" data-loc="16:10-16:52" data-file-name="components/demo-login-info.tsx">Use these credentials to test the application:</p>
          <ul className="text-sm text-blue-700 space-y-1" data-unique-id="82a7330c-6794-4a31-9d34-8370283bc1c3" data-loc="17:10-17:58" data-file-name="components/demo-login-info.tsx">
            <li data-unique-id="57cf46be-2348-404a-a5e6-b4dcb341d286" data-loc="18:12-18:16" data-file-name="components/demo-login-info.tsx"><span className="font-medium" data-unique-id="e63ece6a-02ad-4dd7-a7ec-efcce68b6194" data-loc="18:16-18:46" data-file-name="components/demo-login-info.tsx">Phone:</span> {isAgent ? "9876543210" : "8076492495"}</li>
            <li data-unique-id="7da1199b-dc5b-4412-bfbb-66aa2291654d" data-loc="19:12-19:16" data-file-name="components/demo-login-info.tsx"><span className="font-medium" data-unique-id="3499fcf0-96fb-4e28-8571-dd9942a61847" data-loc="19:16-19:46" data-file-name="components/demo-login-info.tsx">OTP:</span> 123456 (will be displayed after sending)</li>
            <li data-unique-id="9e60e126-0d79-4557-9115-519081d9e352" data-loc="20:12-20:16" data-file-name="components/demo-login-info.tsx"><span className="font-medium" data-unique-id="ad0ef5c8-d368-471e-946c-40c2dca81b3d" data-loc="20:16-20:46" data-file-name="components/demo-login-info.tsx">Role:</span> {isAgent ? "Sales Agent" : "Admin"}</li>
          </ul>
        </div>
      </div>
    </div>;
}