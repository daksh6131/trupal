"use client";

import { Info } from "lucide-react";
interface DemoLoginInfoProps {
  type?: "agent" | "admin";
}
export default function DemoLoginInfo({
  type = "agent"
}: DemoLoginInfoProps) {
  const isAgent = type === "agent";
  return <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6" data-unique-id="4801d024-8e49-4773-aeb7-74b60a19e0cf" data-loc="11:9-11:80" data-file-name="components/demo-login-info.tsx">
      <div className="flex items-start" data-unique-id="afa8307c-4b38-427f-8205-9e9adf2fbf02" data-loc="12:6-12:40" data-file-name="components/demo-login-info.tsx">
        <Info className="h-5 w-5 text-blue-500 mt-0.5 mr-2 flex-shrink-0" />
        <div data-unique-id="02caca51-d13d-4f7b-8e4f-101e616f7440" data-loc="14:8-14:13" data-file-name="components/demo-login-info.tsx">
          <h3 className="font-medium text-blue-800 mb-1" data-unique-id="0aa62aed-6d9d-4b91-bf6c-19c17415bb15" data-loc="15:10-15:57" data-file-name="components/demo-login-info.tsx">Demo {isAgent ? "Agent" : "Admin"} Login</h3>
          <p className="text-sm text-blue-700 mb-2" data-unique-id="1e0be591-fa03-44c9-881f-84a726422d19" data-loc="16:10-16:52" data-file-name="components/demo-login-info.tsx">Use these credentials to test the application:</p>
          <ul className="text-sm text-blue-700 space-y-1" data-unique-id="be905477-6ae6-4547-a6b5-7ec29e1d41c3" data-loc="17:10-17:58" data-file-name="components/demo-login-info.tsx">
            <li data-unique-id="e4032b47-58ee-4d2d-8c49-d7aacbda951a" data-loc="18:12-18:16" data-file-name="components/demo-login-info.tsx"><span className="font-medium" data-unique-id="35600d98-bf88-4f8d-8af7-a0f4ce623d31" data-loc="18:16-18:46" data-file-name="components/demo-login-info.tsx">Phone:</span> {isAgent ? "9876543210" : "8076492495"}</li>
            <li data-unique-id="0a71d89b-d88b-41bc-8fd0-72e707747fc1" data-loc="19:12-19:16" data-file-name="components/demo-login-info.tsx"><span className="font-medium" data-unique-id="4b8f4039-1f38-4cc6-9d47-1386aa174438" data-loc="19:16-19:46" data-file-name="components/demo-login-info.tsx">OTP:</span> 123456 (will be displayed after sending)</li>
            <li data-unique-id="6aa2894b-a32a-4338-b60c-80d166aa62d1" data-loc="20:12-20:16" data-file-name="components/demo-login-info.tsx"><span className="font-medium" data-unique-id="0e87f9eb-13d7-4169-9b24-6acebfb0f306" data-loc="20:16-20:46" data-file-name="components/demo-login-info.tsx">Role:</span> {isAgent ? "Sales Agent" : "Admin"}</li>
          </ul>
        </div>
      </div>
    </div>;
}