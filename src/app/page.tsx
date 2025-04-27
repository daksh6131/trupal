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
  return <div className="flex flex-col items-center justify-center min-h-screen p-6 bg-gradient-to-b from-blue-50 to-white" data-unique-id="f03d0aaa-d8b1-47e6-9899-91f4d9f2d1b5" data-loc="89:9-89:124" data-file-name="app/page.tsx">
      <div className="w-full max-w-md" data-unique-id="e6f5cfd5-3c12-42ad-89e1-2c5702681ab9" data-loc="90:6-90:39" data-file-name="app/page.tsx">
        <div className="text-center mb-10" data-unique-id="3afe4caf-ddba-419f-82c6-8ee30a625053" data-loc="91:8-91:43" data-file-name="app/page.tsx">
          <h1 className="text-3xl font-bold text-blue-800 mb-2" data-unique-id="0890c01b-16d5-4289-a31b-27b77e0ea815" data-loc="92:10-92:64" data-file-name="app/page.tsx">CardSales Pro</h1>
          <p className="text-gray-600" data-unique-id="36eb719c-ab0a-4bd0-ab7b-54ba56c39604" data-loc="93:10-93:39" data-file-name="app/page.tsx">Internal sales tool for credit card recommendations</p>
        </div>

        <DemoLoginInfo type="agent" />

        <div className="bg-white rounded-lg shadow-lg p-8" data-unique-id="c6b92a5a-40c4-4b36-a045-562d45bba040" data-loc="98:8-98:59" data-file-name="app/page.tsx">
          <h2 className="text-2xl font-semibold mb-6 text-center text-gray-800" data-unique-id="1c1f1242-01d5-4260-93c5-d991889343a0" data-loc="99:10-99:80" data-file-name="app/page.tsx">
            {isOtpSent ? "Verify OTP" : "Sales Agent Login"}
          </h2>

          {error && <div className="bg-red-50 text-red-700 p-3 rounded-md mb-4 text-sm" data-unique-id="f88e7f6f-96b4-4e4f-8c5b-feeec835a462" data-loc="103:20-103:88" data-file-name="app/page.tsx">
              {error}
            </div>}

          {!isOtpSent ? <div className="space-y-4" data-unique-id="e332f48f-ef51-4e22-b7f4-4878b2f595e7" data-loc="107:24-107:51" data-file-name="app/page.tsx">
              <div className="relative" data-unique-id="afeb3b82-6453-4311-88ef-fc40fc87763d" data-loc="108:14-108:40" data-file-name="app/page.tsx">
                <label htmlFor="phone" className="text-sm font-medium text-gray-700 block mb-1" data-unique-id="5fe6bd03-e3a4-48c5-a2ec-8b90926965d9" data-loc="109:16-109:96" data-file-name="app/page.tsx">
                  Mobile Number
                </label>
                <div className="relative" data-unique-id="cd29ceb6-31ae-4fe8-9976-471e8f21d441" data-loc="112:16-112:42" data-file-name="app/page.tsx">
                  <span className="absolute left-3 top-3.5 text-gray-500" data-unique-id="5138484e-21d7-4f4d-bf86-5f6849b1ba6e" data-loc="113:18-113:74" data-file-name="app/page.tsx">+91</span>
                  <input id="phone" type="tel" className="pl-10 w-full border border-gray-300 rounded-md py-3 px-4 focus:outline-none focus:ring-2 focus:ring-blue-500" placeholder="Enter 10 digit number" value={phone} onChange={e => setPhone(e.target.value)} maxLength={10} data-unique-id="cf2a18d1-a91a-442a-9d3b-fcabae784907" data-loc="114:18-114:276" data-file-name="app/page.tsx" />
                  <Phone className="absolute right-3 top-3.5 h-5 w-5 text-gray-400" />
                </div>
                <p className="text-xs text-gray-500 mt-1" data-unique-id="4f2d5af5-c4d2-4d0c-92fb-cd95ad3e6186" data-loc="117:16-117:58" data-file-name="app/page.tsx">
                  For demo, use: 9876543210
                </p>
              </div>

              <button onClick={handleSendOtp} disabled={isLoading} className={cn("w-full py-3 bg-blue-600 text-white rounded-md font-medium flex items-center justify-center", isLoading && "opacity-70 cursor-not-allowed")} data-unique-id="749c894f-32e6-4a72-ad89-4e985fd314ff" data-loc="122:14-122:222" data-file-name="app/page.tsx">
                {isLoading ? <span className="flex items-center" data-unique-id="4ea04b24-8f15-4e8e-b8ba-7d14fc997d44" data-loc="123:29-123:65" data-file-name="app/page.tsx">
                    <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" data-unique-id="f198cd95-40a1-45ce-a8b6-f858867fda4a" data-loc="124:20-124:147" data-file-name="app/page.tsx">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Sending OTP...
                  </span> : <span className="flex items-center" data-unique-id="649fdf5e-bafd-4164-8bb8-e06d54b4581b" data-loc="129:28-129:64" data-file-name="app/page.tsx">
                    Send OTP
                    <ArrowRight className="ml-2 h-5 w-5" />
                  </span>}
              </button>
            </div> : <div className="space-y-4" data-unique-id="4f72c265-7e59-436c-8eda-8d8ef090b273" data-loc="134:21-134:48" data-file-name="app/page.tsx">
              <div data-unique-id="7bb189e1-2caa-4ee5-ba76-8c9e2e54fa11" data-loc="135:14-135:19" data-file-name="app/page.tsx">
                <label htmlFor="otp" className="text-sm font-medium text-gray-700 block mb-1" data-unique-id="86bee76d-ee84-4a56-b46b-3802a081dc27" data-loc="136:16-136:94" data-file-name="app/page.tsx">
                  One-Time Password
                </label>
                <div className="relative" data-unique-id="a5151a88-9e41-41b3-b1da-ae2c2b7c2d0b" data-loc="139:16-139:42" data-file-name="app/page.tsx">
                  <input id="otp" type="text" className="w-full border border-gray-300 rounded-md py-3 px-4 focus:outline-none focus:ring-2 focus:ring-blue-500" placeholder="Enter 6 digit OTP" value={otp} onChange={e => setOtp(e.target.value)} maxLength={6} data-unique-id="9d7c38c4-5f21-4bdf-bf65-468072321d4e" data-loc="140:18-140:260" data-file-name="app/page.tsx" />
                  <Lock className="absolute right-3 top-3.5 h-5 w-5 text-gray-400" />
                </div>
                {generatedOtp && <div className="mt-2 bg-green-50 border border-green-200 rounded p-2" data-unique-id="cfde37da-bbbd-4d8a-80f9-0f0b99250399" data-loc="143:33-143:103" data-file-name="app/page.tsx">
                    <p className="text-sm font-medium text-green-800" data-unique-id="2bf9d1b9-2d08-4f7f-a358-427979b8bf91" data-loc="144:20-144:70" data-file-name="app/page.tsx">Demo OTP: <span className="font-bold" data-unique-id="33fdea67-84dc-429f-b433-130eaead2606" data-loc="144:80-144:108" data-file-name="app/page.tsx">{generatedOtp}</span></p>
                    <p className="text-xs text-green-700 mt-1" data-unique-id="fca9e4f7-9f82-43e2-9d86-58c19466ee1f" data-loc="145:20-145:63" data-file-name="app/page.tsx">Use this code to log in</p>
                  </div>}
                <div className="flex justify-between mt-2 text-sm" data-unique-id="b5c17d32-675b-42a9-abab-429398292d29" data-loc="147:16-147:67" data-file-name="app/page.tsx">
                  <span className="text-gray-500" data-unique-id="44ce5183-41db-4463-8259-da06fce18ca8" data-loc="148:18-148:50" data-file-name="app/page.tsx">
                    OTP sent to: +91 {phone}
                  </span>
                  {countdown > 0 ? <span className="text-gray-500" data-unique-id="6b11808f-e85d-4ace-bc1d-0f85269f11a9" data-loc="151:35-151:67" data-file-name="app/page.tsx">Resend in {countdown}s</span> : <button className="text-blue-600 hover:text-blue-800" onClick={handleSendOtp} disabled={isLoading} data-unique-id="6bfeb879-6249-4be8-8e28-9309916b2972" data-loc="151:99-151:198" data-file-name="app/page.tsx">
                      Resend OTP
                    </button>}
                </div>
              </div>

              <button onClick={handleVerifyOtp} disabled={isLoading} className={cn("w-full py-3 bg-blue-600 text-white rounded-md font-medium flex items-center justify-center", isLoading && "opacity-70 cursor-not-allowed")} data-unique-id="af0d287c-f3e4-4531-82c2-6669f885d95f" data-loc="157:14-157:224" data-file-name="app/page.tsx">
                {isLoading ? <span className="flex items-center" data-unique-id="2430f5b2-c1eb-4850-a653-fbfeb88d53ed" data-loc="158:29-158:65" data-file-name="app/page.tsx">
                    <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" data-unique-id="b8f61157-9eb9-400f-84e9-48c35585ae68" data-loc="159:20-159:147" data-file-name="app/page.tsx">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Verifying...
                  </span> : <span className="flex items-center" data-unique-id="fad4c310-53fa-44d2-ae66-f5ba8af26965" data-loc="164:28-164:64" data-file-name="app/page.tsx">
                    Verify & Login
                    <ArrowRight className="ml-2 h-5 w-5" />
                  </span>}
              </button>

              <button onClick={() => setIsOtpSent(false)} className="w-full py-2 text-gray-600 font-medium" data-unique-id="fbc902ab-379c-45b4-8734-7aa437ae10c7" data-loc="170:14-170:108" data-file-name="app/page.tsx">
                Change Phone Number
              </button>
            </div>}
        </div>

        <div className="text-center mt-8 text-sm text-gray-500" data-unique-id="f292ee80-37b2-41b3-903f-43738d148eca" data-loc="176:8-176:64" data-file-name="app/page.tsx">
          <p data-unique-id="e9e8f4ea-c7df-4a8c-972d-570ad042ae76" data-loc="177:10-177:13" data-file-name="app/page.tsx">Admin login? <a href="/admin" className="text-blue-600 hover:text-blue-800" data-unique-id="8ea62425-509b-4e40-98c9-b29a70c73154" data-loc="177:26-177:89" data-file-name="app/page.tsx">Click here</a></p>
        </div>
      </div>
    </div>;
}