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
    return <div className="min-h-screen flex items-center justify-center" data-unique-id="a159d22c-a80a-4c8f-9dba-9aeade3c7cf6" data-loc="22:11-22:74" data-file-name="components/protected-route.tsx">
        <div className="flex flex-col items-center gap-4" data-unique-id="9c4f5a9a-0671-4124-8d97-10e3a5089e5a" data-loc="23:8-23:58" data-file-name="components/protected-route.tsx">
          <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
          <p className="text-gray-600" data-unique-id="f959b3c1-481a-4465-b08a-96bf593997c4" data-loc="25:10-25:39" data-file-name="components/protected-route.tsx">Verifying authentication...</p>
        </div>
      </div>;
  }
  if (!authState.isAuthenticated) {
    return null;
  }
  return <>{children}</>;
}