"use client";

import { Info } from "lucide-react";
interface DemoLoginInfoProps {
  type?: "agent" | "admin";
}
export default function DemoLoginInfo({
  type = "agent"
}: DemoLoginInfoProps) {
  const isAgent = type === "agent";
  return <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6" data-unique-id="fc4012fb-6778-4046-8705-ce0dbc9df97b" data-loc="13:4-13:75" data-file-name="components/demo-login-info.tsx">
      <div className="flex items-start" data-unique-id="ba22b223-cb47-461c-9d1d-490746675f6c" data-loc="14:6-14:40" data-file-name="components/demo-login-info.tsx">
        <Info className="h-5 w-5 text-blue-500 mt-0.5 mr-2 flex-shrink-0" />
        <div data-unique-id="3cbbbb31-3bfb-476a-b8d2-b7cce8fbcb97" data-loc="16:8-16:13" data-file-name="components/demo-login-info.tsx">
          <h3 className="font-medium text-blue-800 mb-1" data-unique-id="8aeab4be-c44c-47c8-97e0-b961be72fd91" data-loc="17:10-17:57" data-file-name="components/demo-login-info.tsx">Demo {isAgent ? "Agent" : "Admin"} Login</h3>
          <p className="text-sm text-blue-700 mb-2" data-unique-id="eab0bcea-9e6c-4649-b166-eaadb1942e11" data-loc="18:10-18:52" data-file-name="components/demo-login-info.tsx">Use these credentials to test the application:</p>
          <ul className="text-sm text-blue-700 space-y-1" data-unique-id="cd47d8d4-00bf-40c3-a74c-d7198fade69c" data-loc="19:10-19:58" data-file-name="components/demo-login-info.tsx">
            <li data-unique-id="5c44c4a3-bd4b-45eb-a122-dd3f02edf3ad" data-loc="20:12-20:16" data-file-name="components/demo-login-info.tsx"><span className="font-medium" data-unique-id="ce8981c1-15ac-47c7-b8f8-07647cf0a4b9" data-loc="20:16-20:46" data-file-name="components/demo-login-info.tsx">Phone:</span> {isAgent ? "9876543210" : "8076492495"}</li>
            <li data-unique-id="60747629-865e-4ac0-aab1-03579c3b4e36" data-loc="21:12-21:16" data-file-name="components/demo-login-info.tsx"><span className="font-medium" data-unique-id="af6b65ff-00e8-4d3b-a353-7b6577815c8f" data-loc="21:16-21:46" data-file-name="components/demo-login-info.tsx">OTP:</span> 123456 (will be displayed after sending)</li>
            <li data-unique-id="10f61373-5bea-4d0b-94b3-206209a7ef2c" data-loc="22:12-22:16" data-file-name="components/demo-login-info.tsx"><span className="font-medium" data-unique-id="ff3b1dd0-77b7-4db8-9ab4-285d9b5237f6" data-loc="22:16-22:46" data-file-name="components/demo-login-info.tsx">Role:</span> {isAgent ? "Sales Agent" : "Admin"}</li>
          </ul>
        </div>
      </div>
    </div>;
}