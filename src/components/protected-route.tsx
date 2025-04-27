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
    return <div className="min-h-screen flex items-center justify-center" data-unique-id="029ebf56-36ec-4e71-a259-9c591a2920cd" data-loc="22:11-22:74" data-file-name="components/protected-route.tsx">
        <div className="flex flex-col items-center gap-4" data-unique-id="f1c64a62-aa2a-4859-9789-54eb9470be70" data-loc="23:8-23:58" data-file-name="components/protected-route.tsx">
          <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
          <p className="text-gray-600" data-unique-id="0d53fd37-5585-4cd0-93c7-3653995fd099" data-loc="25:10-25:39" data-file-name="components/protected-route.tsx">Verifying authentication...</p>
        </div>
      </div>;
  }
  if (!authState.isAuthenticated) {
    return null;
  }
  return <>{children}</>;
}