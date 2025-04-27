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
  return <div className="flex flex-col items-center justify-center min-h-screen p-6 bg-gradient-to-b from-blue-50 to-white" data-unique-id="e3492687-df2e-4e6a-8daf-609c46a7d83f" data-loc="90:9-90:124" data-file-name="app/page.tsx">
      <div className="w-full max-w-md" data-unique-id="d3ac7361-16f5-4519-8cf7-1e8b8a93e06b" data-loc="91:6-91:39" data-file-name="app/page.tsx">
        <div className="text-center mb-10" data-unique-id="e7ab2d05-f26d-4acf-8c50-492b96cc7f22" data-loc="92:8-92:43" data-file-name="app/page.tsx">
          <h1 className="text-3xl font-bold text-blue-800 mb-2" data-unique-id="68a0dfab-82ff-40d2-883d-d9de1a30df05" data-loc="93:10-93:64" data-file-name="app/page.tsx">CardSales Pro</h1>
          <p className="text-gray-600" data-unique-id="4b19b4fc-347d-4924-8e69-3b96f9984475" data-loc="94:10-94:39" data-file-name="app/page.tsx">Internal sales tool for credit card recommendations</p>
        </div>

        <DemoLoginInfo type="agent" />

        <div className="bg-white rounded-lg shadow-lg p-8" data-unique-id="80baf581-68ae-42fe-82da-c1d6f357d19b" data-loc="99:8-99:59" data-file-name="app/page.tsx">
          <h2 className="text-2xl font-semibold mb-6 text-center text-gray-800" data-unique-id="bae62d8b-48b1-466d-b7ad-9ac14b156748" data-loc="100:10-100:80" data-file-name="app/page.tsx">
            {isOtpSent ? "Verify OTP" : "Sales Agent Login"}
          </h2>

          {error && <div className="bg-red-50 text-red-700 p-3 rounded-md mb-4 text-sm" data-unique-id="ff5806a1-c19e-408f-babb-96165316d9e7" data-loc="104:20-104:88" data-file-name="app/page.tsx">
              {error}
            </div>}

          {!isOtpSent ? <div className="space-y-4" data-unique-id="9199c52c-1d41-4045-9283-fc6a764d01d3" data-loc="108:24-108:51" data-file-name="app/page.tsx">
              <div className="relative" data-unique-id="5985ac95-76f7-47b5-8f4a-2c099d475627" data-loc="109:14-109:40" data-file-name="app/page.tsx">
                <label htmlFor="phone" className="text-sm font-medium text-gray-700 block mb-1" data-unique-id="b6213d4d-5fa4-4ea1-8dc0-1661205315af" data-loc="110:16-110:96" data-file-name="app/page.tsx">
                  Mobile Number
                </label>
                <div className="relative" data-unique-id="9bd766a5-92b7-4248-992a-411648a11d71" data-loc="113:16-113:42" data-file-name="app/page.tsx">
                  <span className="absolute left-3 top-3.5 text-gray-500" data-unique-id="40bdaf2f-b50d-43ce-848f-62cdb1a34ae4" data-loc="114:18-114:74" data-file-name="app/page.tsx">+91</span>
                  <input id="phone" type="tel" className="pl-10 w-full border border-gray-300 rounded-md py-3 px-4 focus:outline-none focus:ring-2 focus:ring-blue-500" placeholder="Enter 10 digit number" value={phone} onChange={e => setPhone(e.target.value)} maxLength={10} data-unique-id="51d34cd3-7540-4a71-a74b-c8231d38c236" data-loc="115:18-115:276" data-file-name="app/page.tsx" />
                  <Phone className="absolute right-3 top-3.5 h-5 w-5 text-gray-400" />
                </div>
                <p className="text-xs text-gray-500 mt-1" data-unique-id="5961c342-f707-4fe1-bb2f-3708affa09f9" data-loc="118:16-118:58" data-file-name="app/page.tsx">
                  For demo, use: 9876543210
                </p>
              </div>

              <button onClick={handleSendOtp} disabled={isLoading} className={cn("w-full py-3 bg-blue-600 text-white rounded-md font-medium flex items-center justify-center", isLoading && "opacity-70 cursor-not-allowed")} data-unique-id="ba6174fa-9b73-40da-8125-8d5211636d6e" data-loc="123:14-123:222" data-file-name="app/page.tsx">
                {isLoading ? <span className="flex items-center" data-unique-id="11f757d3-e312-4e40-b348-3a890162c42e" data-loc="124:29-124:65" data-file-name="app/page.tsx">
                    <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" data-unique-id="c01194f8-b67b-4203-ac2f-f16414d388a3" data-loc="125:20-125:147" data-file-name="app/page.tsx">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Sending OTP...
                  </span> : <span className="flex items-center" data-unique-id="1c480478-4e99-499b-adec-31a57c9c245d" data-loc="130:28-130:64" data-file-name="app/page.tsx">
                    Send OTP
                    <ArrowRight className="ml-2 h-5 w-5" />
                  </span>}
              </button>
            </div> : <div className="space-y-4" data-unique-id="a755ece1-f0bb-4cb5-a46c-814d8e53927d" data-loc="135:21-135:48" data-file-name="app/page.tsx">
              <div data-unique-id="ebbb492b-a9cf-400e-8a9a-8453ab855d7b" data-loc="136:14-136:19" data-file-name="app/page.tsx">
                <label htmlFor="otp" className="text-sm font-medium text-gray-700 block mb-1" data-unique-id="ccc29197-1800-4eff-b0a7-6c315d523e78" data-loc="137:16-137:94" data-file-name="app/page.tsx">
                  One-Time Password
                </label>
                <div className="relative" data-unique-id="b4e8cec1-0413-4922-95b0-085923a52918" data-loc="140:16-140:42" data-file-name="app/page.tsx">
                  <input id="otp" type="text" className="w-full border border-gray-300 rounded-md py-3 px-4 focus:outline-none focus:ring-2 focus:ring-blue-500" placeholder="Enter 6 digit OTP" value={otp} onChange={e => setOtp(e.target.value)} maxLength={6} data-unique-id="d6da8798-11b8-4064-9e79-21974e1b1fff" data-loc="141:18-141:260" data-file-name="app/page.tsx" />
                  <Lock className="absolute right-3 top-3.5 h-5 w-5 text-gray-400" />
                </div>
                {generatedOtp && <div className="mt-2 bg-green-50 border border-green-200 rounded p-2" data-unique-id="b50d03d4-7565-463e-a8c5-fb91f3e91f84" data-loc="144:33-144:103" data-file-name="app/page.tsx">
                    <p className="text-sm font-medium text-green-800" data-unique-id="de7f4f4a-13fb-4128-843e-c275be070806" data-loc="145:20-145:70" data-file-name="app/page.tsx">Demo OTP: <span className="font-bold" data-unique-id="925fb584-9724-4408-b465-3a4cf130ce9f" data-loc="145:80-145:108" data-file-name="app/page.tsx">{generatedOtp}</span></p>
                    <p className="text-xs text-green-700 mt-1" data-unique-id="c02e0a83-db30-4b94-8122-dd0cf614e1d7" data-loc="146:20-146:63" data-file-name="app/page.tsx">Use this code to log in</p>
                  </div>}
                <div className="flex justify-between mt-2 text-sm" data-unique-id="3f9161b8-ce96-46dd-9d94-ab6994969cfa" data-loc="148:16-148:67" data-file-name="app/page.tsx">
                  <span className="text-gray-500" data-unique-id="cbddc46b-636a-4597-aa8d-99179729eba3" data-loc="149:18-149:50" data-file-name="app/page.tsx">
                    OTP sent to: +91 {phone}
                  </span>
                  {countdown > 0 ? <span className="text-gray-500" data-unique-id="40e6550a-713e-432d-bae8-ae102ea5778d" data-loc="152:35-152:67" data-file-name="app/page.tsx">Resend in {countdown}s</span> : <button className="text-blue-600 hover:text-blue-800" onClick={handleSendOtp} disabled={isLoading} data-unique-id="42fc2f85-cca2-45a6-a6fb-dbf33811013b" data-loc="152:99-152:198" data-file-name="app/page.tsx">
                      Resend OTP
                    </button>}
                </div>
              </div>

              <button onClick={handleVerifyOtp} disabled={isLoading} className={cn("w-full py-3 bg-blue-600 text-white rounded-md font-medium flex items-center justify-center", isLoading && "opacity-70 cursor-not-allowed")} data-unique-id="09c5f178-d580-413d-ba5c-6d5fba1e74cf" data-loc="158:14-158:224" data-file-name="app/page.tsx">
                {isLoading ? <span className="flex items-center" data-unique-id="0bc0ca85-7b02-4fb5-835a-c3101bd53401" data-loc="159:29-159:65" data-file-name="app/page.tsx">
                    <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" data-unique-id="ec68e0af-8462-4e3c-b354-cfe877f416db" data-loc="160:20-160:147" data-file-name="app/page.tsx">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Verifying...
                  </span> : <span className="flex items-center" data-unique-id="b01d8f70-cde7-4793-8591-68331ad39688" data-loc="165:28-165:64" data-file-name="app/page.tsx">
                    Verify & Login
                    <ArrowRight className="ml-2 h-5 w-5" />
                  </span>}
              </button>

              <button onClick={() => setIsOtpSent(false)} className="w-full py-2 text-gray-600 font-medium" data-unique-id="77afe922-ad97-458c-a3a0-5c826013c54a" data-loc="171:14-171:108" data-file-name="app/page.tsx">
                Change Phone Number
              </button>
            </div>}
        </div>

        <div className="text-center mt-8 text-sm text-gray-500" data-unique-id="87cf154b-5a08-4bab-8e95-356c7d4610f5" data-loc="177:8-177:64" data-file-name="app/page.tsx">
          <p data-unique-id="775224cd-8e90-4e61-a0ff-36558b44f63d" data-loc="178:10-178:13" data-file-name="app/page.tsx">Admin login? <a href="/admin" className="text-blue-600 hover:text-blue-800" data-unique-id="c877272b-fdd8-4e58-9f57-240721888aac" data-loc="178:26-178:89" data-file-name="app/page.tsx">Click here</a></p>
        </div>
      </div>
    </div>;
}