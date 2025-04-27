"use client";

import { useAuth } from "@/contexts/auth-context";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { Loader2 } from "lucide-react";
export default function ProtectedRoute({
  children
}: {
  children: React.ReactNode;
}) {
  const {
    authState
  } = useAuth();
  const router = useRouter();
  useEffect(() => {
    if (!authState.isLoading && !authState.isAuthenticated) {
      router.push("/");
    }
  }, [authState.isLoading, authState.isAuthenticated, router]);
  if (authState.isLoading) {
    return <div className="min-h-screen flex items-center justify-center" data-unique-id="bffab36a-d58a-425e-8fc1-053da067b9c9" data-loc="22:11-22:74" data-file-name="components/protected-route.tsx">
        <div className="flex flex-col items-center gap-4" data-unique-id="03a9b168-07bf-4992-9177-f406bb5ac35d" data-loc="23:8-23:58" data-file-name="components/protected-route.tsx">
          <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
          <p className="text-gray-600" data-unique-id="02efae71-0398-4459-85d4-abdeb8b5892c" data-loc="25:10-25:39" data-file-name="components/protected-route.tsx">Verifying authentication...</p>
        </div>
      </div>;
  }
  if (!authState.isAuthenticated) {
    return null;
  }
  return <>{children}</>;
}