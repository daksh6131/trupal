"use client";

import { createContext, useContext, useEffect, useState } from "react";
import { supabase } from "@/db";
import { AuthState } from "@/types/auth";
import { useRouter } from "next/navigation";

const initialState: AuthState = {
  isLoading: true,
  isAuthenticated: false,
  user: null,
  error: null,
};

const AuthContext = createContext<{
  authState: AuthState;
  signInWithPhone: (phone: string) => Promise<void>;
  verifyOTP: (phone: string, otp: string) => Promise<void>;
  signOut: () => Promise<void>;
}>({
  authState: initialState,
  signInWithPhone: async () => {},
  verifyOTP: async () => {},
  signOut: async () => {},
});

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [authState, setAuthState] = useState<AuthState>(initialState);
  const router = useRouter();

  useEffect(() => {
    // Check active session
    const checkSession = async () => {
      try {
        const { data: { session }, error } = await supabase.auth.getSession();
        
        if (error) throw error;

        if (session) {
          setAuthState({
            isLoading: false,
            isAuthenticated: true,
            user: {
              id: session.user.id,
              phone: session.user.phone || "",
              role: session.user.user_metadata?.role,
            },
            error: null,
          });
        } else {
          setAuthState({
            ...initialState,
            isLoading: false,
          });
        }
      } catch (error) {
        console.error("Session check error:", error);
        setAuthState({
          ...initialState,
          isLoading: false,
          error: "Failed to check authentication status",
        });
      }
    };

    checkSession();

    // Subscribe to auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        if (session) {
          setAuthState({
            isLoading: false,
            isAuthenticated: true,
            user: {
              id: session.user.id,
              phone: session.user.phone || "",
              role: session.user.user_metadata?.role,
            },
            error: null,
          });
        } else {
          setAuthState({
            ...initialState,
            isLoading: false,
          });
        }
      }
    );

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  const signInWithPhone = async (phone: string) => {
    try {
      setAuthState(prev => ({ ...prev, isLoading: true, error: null }));
      
      const { error } = await supabase.auth.signInWithOtp({
        phone,
        options: {
          channel: 'sms',
        },
      });

      if (error) throw error;

      setAuthState(prev => ({
        ...prev,
        isLoading: false,
        error: null,
      }));
    } catch (error) {
      console.error("Phone sign in error:", error);
      setAuthState(prev => ({
        ...prev,
        isLoading: false,
        error: error instanceof Error ? error.message : "Failed to send OTP",
      }));
    }
  };

  const verifyOTP = async (phone: string, otp: string) => {
    try {
      setAuthState(prev => ({ ...prev, isLoading: true, error: null }));

      const { data, error } = await supabase.auth.verifyOtp({
        phone,
        token: otp,
        type: 'sms',
      });

      if (error) throw error;

      if (data.session) {
        setAuthState({
          isLoading: false,
          isAuthenticated: true,
          user: {
            id: data.session.user.id,
            phone: data.session.user.phone || "",
            role: data.session.user.user_metadata?.role,
          },
          error: null,
        });

        router.push('/dashboard');
      }
    } catch (error) {
      console.error("OTP verification error:", error);
      setAuthState(prev => ({
        ...prev,
        isLoading: false,
        error: error instanceof Error ? error.message : "Failed to verify OTP",
      }));
    }
  };

  const signOut = async () => {
    try {
      setAuthState(prev => ({ ...prev, isLoading: true, error: null }));
      
      const { error } = await supabase.auth.signOut();
      if (error) throw error;

      setAuthState({
        ...initialState,
        isLoading: false,
      });

      router.push('/');
    } catch (error) {
      console.error("Sign out error:", error);
      setAuthState(prev => ({
        ...prev,
        isLoading: false,
        error: error instanceof Error ? error.message : "Failed to sign out",
      }));
    }
  };

  return (
    <AuthContext.Provider value={{ authState, signInWithPhone, verifyOTP, signOut }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
