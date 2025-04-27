"use client";

import { Info } from "lucide-react";
interface DemoLoginInfoProps {
  type?: "agent" | "admin";
}
export default function DemoLoginInfo({
  type = "agent"
}: DemoLoginInfoProps) {
  const isAgent = type === "agent";
  return <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6" data-unique-id="38ea47a1-2dc7-4519-9602-2d1d218d2b56" data-loc="11:9-11:80" data-file-name="components/demo-login-info.tsx">
      <div className="flex items-start" data-unique-id="305f05f8-056d-467b-b47c-3d2706811d6e" data-loc="12:6-12:40" data-file-name="components/demo-login-info.tsx">
        <Info className="h-5 w-5 text-blue-500 mt-0.5 mr-2 flex-shrink-0" />
        <div data-unique-id="6dbb48c7-866c-417d-9d27-4add5468055c" data-loc="14:8-14:13" data-file-name="components/demo-login-info.tsx">
          <h3 className="font-medium text-blue-800 mb-1" data-unique-id="5d126e05-850c-489a-b993-767445253e88" data-loc="15:10-15:57" data-file-name="components/demo-login-info.tsx">Demo {isAgent ? "Agent" : "Admin"} Login</h3>
          <p className="text-sm text-blue-700 mb-2" data-unique-id="251f7f56-5a89-4afa-af41-60d8082a4320" data-loc="16:10-16:52" data-file-name="components/demo-login-info.tsx">Use these credentials to test the application:</p>
          <ul className="text-sm text-blue-700 space-y-1" data-unique-id="ae16ac74-d123-4e13-a127-fe5bd557d903" data-loc="17:10-17:58" data-file-name="components/demo-login-info.tsx">
            <li data-unique-id="06b1ae94-7cf1-40e9-8ca3-3e826aca8008" data-loc="18:12-18:16" data-file-name="components/demo-login-info.tsx"><span className="font-medium" data-unique-id="07314723-7069-454e-a633-948ab99d279f" data-loc="18:16-18:46" data-file-name="components/demo-login-info.tsx">Phone:</span> {isAgent ? "9876543210" : "8076492495"}</li>
            <li data-unique-id="ec3f6c77-0eee-4f3d-aa20-fe05752d8e4a" data-loc="19:12-19:16" data-file-name="components/demo-login-info.tsx"><span className="font-medium" data-unique-id="b6c90602-9669-40ff-8071-25ee5264ca8a" data-loc="19:16-19:46" data-file-name="components/demo-login-info.tsx">OTP:</span> 123456 (will be displayed after sending)</li>
            <li data-unique-id="e8743fc3-89b5-48ad-9660-033573594416" data-loc="20:12-20:16" data-file-name="components/demo-login-info.tsx"><span className="font-medium" data-unique-id="edf63684-660d-4f3e-89a1-b0f7298aa763" data-loc="20:16-20:46" data-file-name="components/demo-login-info.tsx">Role:</span> {isAgent ? "Sales Agent" : "Admin"}</li>
          </ul>
        </div>
      </div>
    </div>;
}