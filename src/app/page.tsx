"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Phone, Lock, ArrowRight } from "lucide-react";
import { cn } from "@/lib/utils";
import { useAuth } from "@/contexts/auth-context";
import DemoLoginInfo from "@/components/demo-login-info";
export default function HomePage() {
  const router = useRouter();
  const [phone, setPhone] = useState("9876543210"); // Pre-filled with demo number
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

  // Auto-fill demo credentials
  useEffect(() => {
    // Pre-filled with demo phone number already in state initialization
  }, []);
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
      // For demo purposes, directly call the API to get the OTP
      const response = await fetch('/api/auth/otp/generate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          phone
        })
      });
      const data = await response.json();
      if (data.success) {
        setGeneratedOtp(data.otp);
        console.log("Demo OTP:", data.otp);
      }
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
  return <div className="flex flex-col items-center justify-center min-h-screen p-6 bg-gradient-to-b from-blue-50 to-white" data-unique-id="8d24c807-fa8a-4e63-b7ae-cce6cbf1e645" data-loc="90:9-90:124" data-file-name="app/page.tsx">
      <div className="w-full max-w-md" data-unique-id="ab8079b5-ed29-4626-8a26-619aeba287e4" data-loc="91:6-91:39" data-file-name="app/page.tsx">
        <div className="text-center mb-10" data-unique-id="14a91abd-75af-4c10-8383-1dbce3a59553" data-loc="92:8-92:43" data-file-name="app/page.tsx">
          <h1 className="text-3xl font-bold text-blue-800 mb-2" data-unique-id="68fee573-faca-4cf7-b029-792226505a4c" data-loc="93:10-93:64" data-file-name="app/page.tsx">CardSales Pro</h1>
          <p className="text-gray-600" data-unique-id="daa66bc4-81f1-4c31-8d6d-af83e1d19167" data-loc="94:10-94:39" data-file-name="app/page.tsx">Internal sales tool for credit card recommendations</p>
        </div>

        <DemoLoginInfo type="agent" />

        <div className="bg-white rounded-lg shadow-lg p-8" data-unique-id="466aa9d3-1f60-4490-9dcc-efc8a38f03fc" data-loc="99:8-99:59" data-file-name="app/page.tsx">
          <h2 className="text-2xl font-semibold mb-6 text-center text-gray-800" data-unique-id="25de7a98-dc72-4cfb-8858-5516d7e32945" data-loc="100:10-100:80" data-file-name="app/page.tsx">
            {isOtpSent ? "Verify OTP" : "Sales Agent Login"}
          </h2>

          {error && <div className="bg-red-50 text-red-700 p-3 rounded-md mb-4 text-sm" data-unique-id="4bc2bf6f-998b-4342-bc52-72fda5e1a84c" data-loc="104:20-104:88" data-file-name="app/page.tsx">
              {error}
            </div>}

          {!isOtpSent ? <div className="space-y-4" data-unique-id="88096e49-b487-4555-a306-8526678fc2aa" data-loc="108:24-108:51" data-file-name="app/page.tsx">
              <div className="relative" data-unique-id="bbc99d71-6e76-418c-9bb3-e9d43c5279dc" data-loc="109:14-109:40" data-file-name="app/page.tsx">
                <label htmlFor="phone" className="text-sm font-medium text-gray-700 block mb-1" data-unique-id="2255a4cf-7e4d-4a12-acda-6f50b404c790" data-loc="110:16-110:96" data-file-name="app/page.tsx">
                  Mobile Number
                </label>
                <div className="relative" data-unique-id="1f8440d4-b681-4d3d-adc8-fd0e68467f40" data-loc="113:16-113:42" data-file-name="app/page.tsx">
                  <span className="absolute left-3 top-3.5 text-gray-500" data-unique-id="2e3f78c2-e6ee-4d7f-bfbc-251e763158f4" data-loc="114:18-114:74" data-file-name="app/page.tsx">+91</span>
                  <input id="phone" type="tel" className="pl-10 w-full border border-gray-300 rounded-md py-3 px-4 focus:outline-none focus:ring-2 focus:ring-blue-500" placeholder="Enter 10 digit number" value={phone} onChange={e => setPhone(e.target.value)} maxLength={10} data-unique-id="49d96a99-77d4-426b-8e0c-f43d45b64e53" data-loc="115:18-115:276" data-file-name="app/page.tsx" />
                  <Phone className="absolute right-3 top-3.5 h-5 w-5 text-gray-400" />
                </div>
                <p className="text-xs text-gray-500 mt-1" data-unique-id="cd3245d1-d02d-4229-bdd9-931f1acf68be" data-loc="118:16-118:58" data-file-name="app/page.tsx">
                  For demo, use: 9876543210
                </p>
              </div>

              <button onClick={handleSendOtp} disabled={isLoading} className={cn("w-full py-3 bg-blue-600 text-white rounded-md font-medium flex items-center justify-center", isLoading && "opacity-70 cursor-not-allowed")} data-unique-id="8bc47d84-0ac1-463d-9fad-d4f95eaabe58" data-loc="123:14-123:222" data-file-name="app/page.tsx">
                {isLoading ? <span className="flex items-center" data-unique-id="76fcb8e3-9378-4872-aea8-73df65e8ef07" data-loc="124:29-124:65" data-file-name="app/page.tsx">
                    <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" data-unique-id="8a844421-dd60-4cca-a93b-23290fe1a88f" data-loc="125:20-125:147" data-file-name="app/page.tsx">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Sending OTP...
                  </span> : <span className="flex items-center" data-unique-id="89476dcd-e7ae-4f8f-bf3a-eb9542264fd6" data-loc="130:28-130:64" data-file-name="app/page.tsx">
                    Send OTP
                    <ArrowRight className="ml-2 h-5 w-5" />
                  </span>}
              </button>
            </div> : <div className="space-y-4" data-unique-id="2db2873c-4645-4207-982a-7e50f23de421" data-loc="135:21-135:48" data-file-name="app/page.tsx">
              <div data-unique-id="25d2fd63-422d-4cef-a6ef-2375ef410c24" data-loc="136:14-136:19" data-file-name="app/page.tsx">
                <label htmlFor="otp" className="text-sm font-medium text-gray-700 block mb-1" data-unique-id="288d2447-4900-4157-ac7c-8fe47032e1f0" data-loc="137:16-137:94" data-file-name="app/page.tsx">
                  One-Time Password
                </label>
                <div className="relative" data-unique-id="b912ec22-9f9a-48df-9d34-ac27dd6f6e70" data-loc="140:16-140:42" data-file-name="app/page.tsx">
                  <input id="otp" type="text" className="w-full border border-gray-300 rounded-md py-3 px-4 focus:outline-none focus:ring-2 focus:ring-blue-500" placeholder="Enter 6 digit OTP" value={otp} onChange={e => setOtp(e.target.value)} maxLength={6} data-unique-id="78bf6e27-9828-49ff-bde9-afb480634ee2" data-loc="141:18-141:260" data-file-name="app/page.tsx" />
                  <Lock className="absolute right-3 top-3.5 h-5 w-5 text-gray-400" />
                </div>
                {generatedOtp && <div className="mt-2 bg-green-50 border border-green-200 rounded p-2" data-unique-id="ae99960c-34aa-4273-a578-e708f62a1bc3" data-loc="144:33-144:103" data-file-name="app/page.tsx">
                    <p className="text-sm font-medium text-green-800" data-unique-id="951e36da-11fe-423e-8403-a13d862b42ee" data-loc="145:20-145:70" data-file-name="app/page.tsx">Demo OTP: <span className="font-bold" data-unique-id="9ea785b6-0977-48c5-96c6-4c49afb5ea58" data-loc="145:80-145:108" data-file-name="app/page.tsx">{generatedOtp}</span></p>
                    <p className="text-xs text-green-700 mt-1" data-unique-id="b64f8750-b3cd-4b5f-a8de-d65bcac9dde0" data-loc="146:20-146:63" data-file-name="app/page.tsx">Use this code to log in</p>
                  </div>}
                <div className="flex justify-between mt-2 text-sm" data-unique-id="b50fc477-54f7-4968-bf84-be71db0f84c0" data-loc="148:16-148:67" data-file-name="app/page.tsx">
                  <span className="text-gray-500" data-unique-id="91798ce7-a175-4206-b17a-ca3d995a6844" data-loc="149:18-149:50" data-file-name="app/page.tsx">
                    OTP sent to: +91 {phone}
                  </span>
                  {countdown > 0 ? <span className="text-gray-500" data-unique-id="3f35d769-fac7-41ad-ad3e-c547f3042301" data-loc="152:35-152:67" data-file-name="app/page.tsx">Resend in {countdown}s</span> : <button className="text-blue-600 hover:text-blue-800" onClick={handleSendOtp} disabled={isLoading} data-unique-id="8de1cada-bddf-40dc-852a-80fce3619575" data-loc="152:99-152:198" data-file-name="app/page.tsx">
                      Resend OTP
                    </button>}
                </div>
              </div>

              <button onClick={handleVerifyOtp} disabled={isLoading} className={cn("w-full py-3 bg-blue-600 text-white rounded-md font-medium flex items-center justify-center", isLoading && "opacity-70 cursor-not-allowed")} data-unique-id="2ed9cb9a-65dc-4b5e-941f-77d6bb952abd" data-loc="158:14-158:224" data-file-name="app/page.tsx">
                {isLoading ? <span className="flex items-center" data-unique-id="7358e637-eab7-411f-84d0-fd2af9c8b3e6" data-loc="159:29-159:65" data-file-name="app/page.tsx">
                    <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" data-unique-id="df6dfbbd-fe24-410d-921c-462c71062612" data-loc="160:20-160:147" data-file-name="app/page.tsx">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Verifying...
                  </span> : <span className="flex items-center" data-unique-id="9bf45340-1c1e-4980-8e85-f30fa227af66" data-loc="165:28-165:64" data-file-name="app/page.tsx">
                    Verify & Login
                    <ArrowRight className="ml-2 h-5 w-5" />
                  </span>}
              </button>

              <button onClick={() => setIsOtpSent(false)} className="w-full py-2 text-gray-600 font-medium" data-unique-id="088f67ff-8b36-4e0a-8025-5bc8f858e164" data-loc="171:14-171:108" data-file-name="app/page.tsx">
                Change Phone Number
              </button>
            </div>}
        </div>

        <div className="text-center mt-8 text-sm text-gray-500" data-unique-id="27d792ab-3172-4929-8517-f975d5e6402b" data-loc="177:8-177:64" data-file-name="app/page.tsx">
          <p data-unique-id="b7a4a839-f4ef-475e-8765-30249a60ba37" data-loc="178:10-178:13" data-file-name="app/page.tsx">Admin login? <a href="/admin" className="text-blue-600 hover:text-blue-800" data-unique-id="e5d0912a-a254-42d8-80ae-76f2d91fc203" data-loc="178:26-178:89" data-file-name="app/page.tsx">Click here</a></p>
        </div>
      </div>
    </div>;
}