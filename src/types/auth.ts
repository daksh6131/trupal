export interface PhoneAuthResponse {
  success: boolean;
  error?: string;
  session?: {
    user: {
      id: string;
      phone: string;
      role?: string;
    };
    access_token: string;
  };
}

export interface AuthState {
  isLoading: boolean;
  isAuthenticated: boolean;
  user: {
    id: string;
    phone: string;
    role?: string;
  } | null;
  error: string | null;
}

export interface PhoneVerificationState {
  phone: string;
  isVerifying: boolean;
  verificationId: string | null;
  error: string | null;
}
