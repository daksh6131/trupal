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
    return <div className="min-h-screen flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
          <p className="text-gray-600">Verifying authentication...</p>
        </div>
      </div>;
  }
  if (!authState.isAuthenticated) {
    return null;
  }
  return <>{children}</>;
}