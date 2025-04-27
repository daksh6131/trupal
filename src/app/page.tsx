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
  return <div className="flex flex-col items-center justify-center min-h-screen p-6 bg-gradient-to-b from-blue-50 to-white" data-unique-id="35dbcc6e-8008-4160-92cf-effb4ff61985" data-loc="90:9-90:124" data-file-name="app/page.tsx">
      <div className="w-full max-w-md" data-unique-id="2aa73767-ed69-4795-9e0f-377b06c1cb08" data-loc="91:6-91:39" data-file-name="app/page.tsx">
        <div className="text-center mb-10" data-unique-id="5b69bd05-0db9-49e0-a0af-7bb5bacc4f1d" data-loc="92:8-92:43" data-file-name="app/page.tsx">
          <h1 className="text-3xl font-bold text-blue-800 mb-2" data-unique-id="b8cd2eee-b860-4240-b39d-ff753141fdea" data-loc="93:10-93:64" data-file-name="app/page.tsx">CardSales Pro</h1>
          <p className="text-gray-600" data-unique-id="96a15fa9-848b-459d-babe-db51102a226a" data-loc="94:10-94:39" data-file-name="app/page.tsx">Internal sales tool for credit card recommendations</p>
        </div>

        <DemoLoginInfo type="agent" />

        <div className="bg-white rounded-lg shadow-lg p-8" data-unique-id="62419a66-2556-49e2-a9bc-5b38512cc32b" data-loc="99:8-99:59" data-file-name="app/page.tsx">
          <h2 className="text-2xl font-semibold mb-6 text-center text-gray-800" data-unique-id="f495b399-aec5-4089-9599-986f67f4bb57" data-loc="100:10-100:80" data-file-name="app/page.tsx">
            {isOtpSent ? "Verify OTP" : "Sales Agent Login"}
          </h2>

          {error && <div className="bg-red-50 text-red-700 p-3 rounded-md mb-4 text-sm" data-unique-id="2ae4f321-8d14-4b89-a6b1-3ce0ca440306" data-loc="104:20-104:88" data-file-name="app/page.tsx">
              {error}
            </div>}

          {!isOtpSent ? <div className="space-y-4" data-unique-id="1ae61543-a2a1-4a57-a873-6cdcbbfb69d2" data-loc="108:24-108:51" data-file-name="app/page.tsx">
              <div className="relative" data-unique-id="f8ef53c5-5fc5-4204-ae74-30d0964bf050" data-loc="109:14-109:40" data-file-name="app/page.tsx">
                <label htmlFor="phone" className="text-sm font-medium text-gray-700 block mb-1" data-unique-id="5cbbf0b8-6560-4426-9b25-ad7d27326128" data-loc="110:16-110:96" data-file-name="app/page.tsx">
                  Mobile Number
                </label>
                <div className="relative" data-unique-id="42341682-7c8d-4f08-b929-e407a3a6a945" data-loc="113:16-113:42" data-file-name="app/page.tsx">
                  <span className="absolute left-3 top-3.5 text-gray-500" data-unique-id="a221f705-5fd7-41fb-ad1b-a7aed58f91dc" data-loc="114:18-114:74" data-file-name="app/page.tsx">+91</span>
                  <input id="phone" type="tel" className="pl-10 w-full border border-gray-300 rounded-md py-3 px-4 focus:outline-none focus:ring-2 focus:ring-blue-500" placeholder="Enter 10 digit number" value={phone} onChange={e => setPhone(e.target.value)} maxLength={10} data-unique-id="ba434ac1-c9d1-41af-b794-255731dd7019" data-loc="115:18-115:276" data-file-name="app/page.tsx" />
                  <Phone className="absolute right-3 top-3.5 h-5 w-5 text-gray-400" />
                </div>
                <p className="text-xs text-gray-500 mt-1" data-unique-id="48a266e1-f334-4e82-b6c7-f1f695d01b5f" data-loc="118:16-118:58" data-file-name="app/page.tsx">
                  For demo, use: 9876543210
                </p>
              </div>

              <button onClick={handleSendOtp} disabled={isLoading} className={cn("w-full py-3 bg-blue-600 text-white rounded-md font-medium flex items-center justify-center", isLoading && "opacity-70 cursor-not-allowed")} data-unique-id="2f625cc8-09d0-42ec-b5c9-35f7c0257ca4" data-loc="123:14-123:222" data-file-name="app/page.tsx">
                {isLoading ? <span className="flex items-center" data-unique-id="003abf43-0397-4178-9639-452eafc144c0" data-loc="124:29-124:65" data-file-name="app/page.tsx">
                    <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" data-unique-id="40b7c8a8-10b2-4b5e-b7c8-1d6eeb063e9f" data-loc="125:20-125:147" data-file-name="app/page.tsx">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Sending OTP...
                  </span> : <span className="flex items-center" data-unique-id="c7078d87-efaa-4fa7-a7ee-2ade0447b398" data-loc="130:28-130:64" data-file-name="app/page.tsx">
                    Send OTP
                    <ArrowRight className="ml-2 h-5 w-5" />
                  </span>}
              </button>
            </div> : <div className="space-y-4" data-unique-id="09fcba1f-de08-4f38-a45f-861288ae28e1" data-loc="135:21-135:48" data-file-name="app/page.tsx">
              <div data-unique-id="0acfb427-33c9-4db4-89c5-9b621296d62b" data-loc="136:14-136:19" data-file-name="app/page.tsx">
                <label htmlFor="otp" className="text-sm font-medium text-gray-700 block mb-1" data-unique-id="807ed4a8-218e-44d1-96ee-f2f290626c04" data-loc="137:16-137:94" data-file-name="app/page.tsx">
                  One-Time Password
                </label>
                <div className="relative" data-unique-id="4c709538-6df8-4ca3-9d74-e0453385f854" data-loc="140:16-140:42" data-file-name="app/page.tsx">
                  <input id="otp" type="text" className="w-full border border-gray-300 rounded-md py-3 px-4 focus:outline-none focus:ring-2 focus:ring-blue-500" placeholder="Enter 6 digit OTP" value={otp} onChange={e => setOtp(e.target.value)} maxLength={6} data-unique-id="5ef7384b-1ddd-46ff-8c86-340fbbb4270d" data-loc="141:18-141:260" data-file-name="app/page.tsx" />
                  <Lock className="absolute right-3 top-3.5 h-5 w-5 text-gray-400" />
                </div>
                {generatedOtp && <div className="mt-2 bg-green-50 border border-green-200 rounded p-2" data-unique-id="a7e6320c-6845-499b-8532-d1f285ded136" data-loc="144:33-144:103" data-file-name="app/page.tsx">
                    <p className="text-sm font-medium text-green-800" data-unique-id="30a98afa-8489-4d39-8d83-c6eedbd736e6" data-loc="145:20-145:70" data-file-name="app/page.tsx">Demo OTP: <span className="font-bold" data-unique-id="33c743f7-95f9-4777-abd2-bb97614c1a4c" data-loc="145:80-145:108" data-file-name="app/page.tsx">{generatedOtp}</span></p>
                    <p className="text-xs text-green-700 mt-1" data-unique-id="fa5f25e0-1715-41c2-80d0-d8b782e1fe78" data-loc="146:20-146:63" data-file-name="app/page.tsx">Use this code to log in</p>
                  </div>}
                <div className="flex justify-between mt-2 text-sm" data-unique-id="491eb618-6544-4bbd-b64b-053d054733de" data-loc="148:16-148:67" data-file-name="app/page.tsx">
                  <span className="text-gray-500" data-unique-id="45b4b20e-9297-45e9-ab0f-1aaa6edf5b4f" data-loc="149:18-149:50" data-file-name="app/page.tsx">
                    OTP sent to: +91 {phone}
                  </span>
                  {countdown > 0 ? <span className="text-gray-500" data-unique-id="70f8a217-4c7c-402b-9a22-fde51408bbde" data-loc="152:35-152:67" data-file-name="app/page.tsx">Resend in {countdown}s</span> : <button className="text-blue-600 hover:text-blue-800" onClick={handleSendOtp} disabled={isLoading} data-unique-id="9a7e84cf-d6d4-4b5c-9d2c-41eda6e553c6" data-loc="152:99-152:198" data-file-name="app/page.tsx">
                      Resend OTP
                    </button>}
                </div>
              </div>

              <button onClick={handleVerifyOtp} disabled={isLoading} className={cn("w-full py-3 bg-blue-600 text-white rounded-md font-medium flex items-center justify-center", isLoading && "opacity-70 cursor-not-allowed")} data-unique-id="3ee952a5-0b8b-4e9d-ad54-9b0f4c7d692c" data-loc="158:14-158:224" data-file-name="app/page.tsx">
                {isLoading ? <span className="flex items-center" data-unique-id="6f0d058e-cc05-493c-ac24-53dfe7388d3b" data-loc="159:29-159:65" data-file-name="app/page.tsx">
                    <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" data-unique-id="3fbde6c3-1c8d-4fcd-811c-f5e1220f4cf8" data-loc="160:20-160:147" data-file-name="app/page.tsx">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Verifying...
                  </span> : <span className="flex items-center" data-unique-id="dd93a136-f81d-421d-aa36-e8cf906be13d" data-loc="165:28-165:64" data-file-name="app/page.tsx">
                    Verify & Login
                    <ArrowRight className="ml-2 h-5 w-5" />
                  </span>}
              </button>

              <button onClick={() => setIsOtpSent(false)} className="w-full py-2 text-gray-600 font-medium" data-unique-id="913498d1-6ec2-4a5d-9bcb-5965caba4996" data-loc="171:14-171:108" data-file-name="app/page.tsx">
                Change Phone Number
              </button>
            </div>}
        </div>

        <div className="text-center mt-8 text-sm text-gray-500" data-unique-id="51720e45-c4f5-4e84-a25e-4a77e0a9503e" data-loc="177:8-177:64" data-file-name="app/page.tsx">
          <p data-unique-id="3b73dfd1-1db4-4e8e-9c02-cf9d3a7771a2" data-loc="178:10-178:13" data-file-name="app/page.tsx">Admin login? <a href="/admin" className="text-blue-600 hover:text-blue-800" data-unique-id="e63e7041-2b26-445e-bc36-c2d14d4ba8f9" data-loc="178:26-178:89" data-file-name="app/page.tsx">Click here</a></p>
        </div>
      </div>
    </div>;
}