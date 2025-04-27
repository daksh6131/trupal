"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Phone, Lock, ArrowRight } from "lucide-react";
import { cn } from "@/lib/utils";
import { useAuth } from "@/contexts/auth-context";
export default function HomePage() {
  const router = useRouter();
  const [phone, setPhone] = useState("");
  const [otp, setOtp] = useState("");
  const [isOtpSent, setIsOtpSent] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [countdown, setCountdown] = useState(0);
  const [generatedOtp, setGeneratedOtp] = useState<string | null>(null);
  const {
    authState,
    signInWithPhone,
    verifyOTP
  } = useAuth();
  useEffect(() => {
    if (authState.isAuthenticated) {
      router.push("/dashboard");
    }
  }, [authState.isAuthenticated, router]);
  useEffect(() => {
    if (countdown > 0) {
      const timer = setTimeout(() => setCountdown(countdown - 1), 1000);
      return () => clearTimeout(timer);
    }
  }, [countdown]);
  const handleSendOtp = async () => {
    setIsLoading(true);
    setError("");

    // Validate phone number
    if (!phone || phone.length !== 10 || !/^\d+$/.test(phone)) {
      setError("Please enter a valid 10-digit phone number");
      setIsLoading(false);
      return;
    }
    try {
      await signInWithPhone(`+91${phone}`);
      setIsOtpSent(true);
      setCountdown(30);
    } catch (error) {
      setError(error instanceof Error ? error.message : "Failed to send OTP");
    } finally {
      setIsLoading(false);
    }
  };
  const handleVerifyOtp = async () => {
    setIsLoading(true);
    setError("");
    if (!otp || otp.length !== 6) {
      setError("Please enter a valid 6-digit OTP");
      setIsLoading(false);
      return;
    }
    try {
      await verifyOTP(`+91${phone}`, otp);
    } catch (error) {
      setError(error instanceof Error ? error.message : "Invalid OTP. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };
  return <div className="flex flex-col items-center justify-center min-h-screen p-6 bg-gradient-to-b from-blue-50 to-white">
      <div className="w-full max-w-md">
        <div className="text-center mb-10">
          <h1 className="text-3xl font-bold text-blue-800 mb-2">CardSales Pro</h1>
          <p className="text-gray-600">Internal sales tool for credit card recommendations</p>
        </div>

        <div className="bg-white rounded-lg shadow-lg p-8">
          <h2 className="text-2xl font-semibold mb-6 text-center text-gray-800">
            {isOtpSent ? "Verify OTP" : "Sales Agent Login"}
          </h2>

          {error && <div className="bg-red-50 text-red-700 p-3 rounded-md mb-4 text-sm">
              {error}
            </div>}

          {!isOtpSent ? <div className="space-y-4">
              <div className="relative">
                <label htmlFor="phone" className="text-sm font-medium text-gray-700 block mb-1">
                  Mobile Number
                </label>
                <div className="relative">
                  <span className="absolute left-3 top-3.5 text-gray-500">+91</span>
                  <input id="phone" type="tel" className="pl-10 w-full border border-gray-300 rounded-md py-3 px-4 focus:outline-none focus:ring-2 focus:ring-blue-500" placeholder="Enter 10 digit number" value={phone} onChange={e => setPhone(e.target.value)} maxLength={10} />
                  <Phone className="absolute right-3 top-3.5 h-5 w-5 text-gray-400" />
                </div>
                <p className="text-xs text-gray-500 mt-1">
                  For demo, use: 9876543210
                </p>
              </div>

              <button onClick={handleSendOtp} disabled={isLoading} className={cn("w-full py-3 bg-blue-600 text-white rounded-md font-medium flex items-center justify-center", isLoading && "opacity-70 cursor-not-allowed")}>
                {isLoading ? <span className="flex items-center">
                    <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Sending OTP...
                  </span> : <span className="flex items-center">
                    Send OTP
                    <ArrowRight className="ml-2 h-5 w-5" />
                  </span>}
              </button>
            </div> : <div className="space-y-4">
              <div>
                <label htmlFor="otp" className="text-sm font-medium text-gray-700 block mb-1">
                  One-Time Password
                </label>
                <div className="relative">
                  <input id="otp" type="text" className="w-full border border-gray-300 rounded-md py-3 px-4 focus:outline-none focus:ring-2 focus:ring-blue-500" placeholder="Enter 6 digit OTP" value={otp} onChange={e => setOtp(e.target.value)} maxLength={6} />
                  <Lock className="absolute right-3 top-3.5 h-5 w-5 text-gray-400" />
                </div>
                {generatedOtp && <p className="text-xs text-gray-500 mt-1">
                    Development OTP: {generatedOtp}
                  </p>}
                <div className="flex justify-between mt-2 text-sm">
                  <span className="text-gray-500">
                    OTP sent to: +91 {phone}
                  </span>
                  {countdown > 0 ? <span className="text-gray-500">Resend in {countdown}s</span> : <button className="text-blue-600 hover:text-blue-800" onClick={handleSendOtp} disabled={isLoading}>
                      Resend OTP
                    </button>}
                </div>
              </div>

              <button onClick={handleVerifyOtp} disabled={isLoading} className={cn("w-full py-3 bg-blue-600 text-white rounded-md font-medium flex items-center justify-center", isLoading && "opacity-70 cursor-not-allowed")}>
                {isLoading ? <span className="flex items-center">
                    <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Verifying...
                  </span> : <span className="flex items-center">
                    Verify & Login
                    <ArrowRight className="ml-2 h-5 w-5" />
                  </span>}
              </button>

              <button onClick={() => setIsOtpSent(false)} className="w-full py-2 text-gray-600 font-medium">
                Change Phone Number
              </button>
            </div>}
        </div>

        <div className="text-center mt-8 text-sm text-gray-500">
          <p>Admin login? <a href="/admin" className="text-blue-600 hover:text-blue-800">Click here</a></p>
        </div>
      </div>
    </div>;
}