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
    return <div className="min-h-screen flex items-center justify-center" data-unique-id="ae022ca5-8366-4497-8e56-6dd23d5ae37c" data-loc="22:11-22:74" data-file-name="components/protected-route.tsx">
        <div className="flex flex-col items-center gap-4" data-unique-id="c836cc15-95de-4bd8-8416-a75594f26286" data-loc="23:8-23:58" data-file-name="components/protected-route.tsx">
          <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
          <p className="text-gray-600" data-unique-id="5ab4dab4-76eb-4be8-af62-2043da868cdd" data-loc="25:10-25:39" data-file-name="components/protected-route.tsx">Verifying authentication...</p>
        </div>
      </div>;
  }
  if (!authState.isAuthenticated) {
    return null;
  }
  return <>{children}</>;
}