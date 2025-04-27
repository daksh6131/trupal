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
    return <div className="min-h-screen flex items-center justify-center" data-unique-id="245aa0f8-7a40-4333-8c31-e105030c6bac" data-loc="22:11-22:74" data-file-name="components/protected-route.tsx">
        <div className="flex flex-col items-center gap-4" data-unique-id="bf215275-1e07-412c-9846-21dd27d08111" data-loc="23:8-23:58" data-file-name="components/protected-route.tsx">
          <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
          <p className="text-gray-600" data-unique-id="04db0c42-f6a8-4410-b869-1dfe07b1c26b" data-loc="25:10-25:39" data-file-name="components/protected-route.tsx">Verifying authentication...</p>
        </div>
      </div>;
  }
  if (!authState.isAuthenticated) {
    return null;
  }
  return <>{children}</>;
}