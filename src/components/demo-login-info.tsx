"use client";

import { Info } from "lucide-react";
interface DemoLoginInfoProps {
  type?: "agent" | "admin";
}
export default function DemoLoginInfo({
  type = "agent"
}: DemoLoginInfoProps) {
  const isAgent = type === "agent";
  return <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6" data-unique-id="d2f87e73-ee5d-4da7-b72f-076d62eed1df" data-loc="11:9-11:80" data-file-name="components/demo-login-info.tsx">
      <div className="flex items-start" data-unique-id="099af523-cbd4-43ef-a81e-a7c014400d58" data-loc="12:6-12:40" data-file-name="components/demo-login-info.tsx">
        <Info className="h-5 w-5 text-blue-500 mt-0.5 mr-2 flex-shrink-0" />
        <div data-unique-id="f63f8252-1743-4122-bd69-5835a8320d1a" data-loc="14:8-14:13" data-file-name="components/demo-login-info.tsx">
          <h3 className="font-medium text-blue-800 mb-1" data-unique-id="ba68a0e3-9b50-4b77-8cd2-e44fa6a5b78a" data-loc="15:10-15:57" data-file-name="components/demo-login-info.tsx">Demo {isAgent ? "Agent" : "Admin"} Login</h3>
          <p className="text-sm text-blue-700 mb-2" data-unique-id="dcf96b15-5446-433b-986b-758144327ce5" data-loc="16:10-16:52" data-file-name="components/demo-login-info.tsx">Use these credentials to test the application:</p>
          <ul className="text-sm text-blue-700 space-y-1" data-unique-id="acd47613-7595-4a00-84bf-b368c7986248" data-loc="17:10-17:58" data-file-name="components/demo-login-info.tsx">
            <li data-unique-id="897a73fd-f1fa-48a0-ab7d-da80e83137ab" data-loc="18:12-18:16" data-file-name="components/demo-login-info.tsx"><span className="font-medium" data-unique-id="5d606963-0d23-4587-9d89-aa3e6d04fb52" data-loc="18:16-18:46" data-file-name="components/demo-login-info.tsx">Phone:</span> {isAgent ? "9876543210" : "8076492495"}</li>
            <li data-unique-id="99087b0c-c42e-4555-b0dc-3c3586ef27c3" data-loc="19:12-19:16" data-file-name="components/demo-login-info.tsx"><span className="font-medium" data-unique-id="2110662d-5b7a-4393-b3e3-ad9ea95a9cf2" data-loc="19:16-19:46" data-file-name="components/demo-login-info.tsx">OTP:</span> 123456 (will be displayed after sending)</li>
            <li data-unique-id="6c4bef80-b98f-4714-8170-c0e8849df6ce" data-loc="20:12-20:16" data-file-name="components/demo-login-info.tsx"><span className="font-medium" data-unique-id="d413757a-797f-4307-9418-210d4cb63b86" data-loc="20:16-20:46" data-file-name="components/demo-login-info.tsx">Role:</span> {isAgent ? "Sales Agent" : "Admin"}</li>
          </ul>
        </div>
      </div>
    </div>;
}