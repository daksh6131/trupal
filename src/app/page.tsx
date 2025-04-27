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
  return <div className="flex flex-col items-center justify-center min-h-screen p-6 bg-gradient-to-b from-blue-50 to-white" data-unique-id="c1ba5985-ea0f-4c49-bde7-8417d24406e9" data-loc="90:9-90:124" data-file-name="app/page.tsx">
      <div className="w-full max-w-md" data-unique-id="c6e9409b-9cbf-4422-af23-5622edd7ad4d" data-loc="91:6-91:39" data-file-name="app/page.tsx">
        <div className="text-center mb-10" data-unique-id="d53581b3-f1cd-4c59-bf0a-4737a04d654e" data-loc="92:8-92:43" data-file-name="app/page.tsx">
          <h1 className="text-3xl font-bold text-blue-800 mb-2" data-unique-id="525a6f83-3495-4c49-927b-08eb11eb92a5" data-loc="93:10-93:64" data-file-name="app/page.tsx">CardSales Pro</h1>
          <p className="text-gray-600" data-unique-id="dcf962ad-1847-427c-9a8e-3523dd363f98" data-loc="94:10-94:39" data-file-name="app/page.tsx">Internal sales tool for credit card recommendations</p>
        </div>

        <DemoLoginInfo type="agent" />

        <div className="bg-white rounded-lg shadow-lg p-8" data-unique-id="b0caf969-8f54-4189-bd0b-aa7c2b41adc7" data-loc="99:8-99:59" data-file-name="app/page.tsx">
          <h2 className="text-2xl font-semibold mb-6 text-center text-gray-800" data-unique-id="fc2a7619-4582-4566-87ad-8e40772fa7ff" data-loc="100:10-100:80" data-file-name="app/page.tsx">
            {isOtpSent ? "Verify OTP" : "Sales Agent Login"}
          </h2>

          {error && <div className="bg-red-50 text-red-700 p-3 rounded-md mb-4 text-sm" data-unique-id="3892610c-001a-4585-bdaa-9437523a24d7" data-loc="104:20-104:88" data-file-name="app/page.tsx">
              {error}
            </div>}

          {!isOtpSent ? <div className="space-y-4" data-unique-id="c1099302-d856-4908-9d6c-e3d273f643f8" data-loc="108:24-108:51" data-file-name="app/page.tsx">
              <div className="relative" data-unique-id="29192a6d-e673-4997-84b0-09b0175a531e" data-loc="109:14-109:40" data-file-name="app/page.tsx">
                <label htmlFor="phone" className="text-sm font-medium text-gray-700 block mb-1" data-unique-id="93e7fc8e-fae0-48ad-9553-321f6b5cb17d" data-loc="110:16-110:96" data-file-name="app/page.tsx">
                  Mobile Number
                </label>
                <div className="relative" data-unique-id="84e2aa5a-0ad7-49fe-a201-627235a3fd08" data-loc="113:16-113:42" data-file-name="app/page.tsx">
                  <span className="absolute left-3 top-3.5 text-gray-500" data-unique-id="7c64fdb1-0c07-4309-8a62-df8f54e66a83" data-loc="114:18-114:74" data-file-name="app/page.tsx">+91</span>
                  <input id="phone" type="tel" className="pl-10 w-full border border-gray-300 rounded-md py-3 px-4 focus:outline-none focus:ring-2 focus:ring-blue-500" placeholder="Enter 10 digit number" value={phone} onChange={e => setPhone(e.target.value)} maxLength={10} data-unique-id="b8764f97-caf7-46da-ab47-4ac5c53fe747" data-loc="115:18-115:276" data-file-name="app/page.tsx" />
                  <Phone className="absolute right-3 top-3.5 h-5 w-5 text-gray-400" />
                </div>
                <p className="text-xs text-gray-500 mt-1" data-unique-id="05551926-c89b-4e59-ad86-88577aa381c5" data-loc="118:16-118:58" data-file-name="app/page.tsx">
                  For demo, use: 9876543210
                </p>
              </div>

              <button onClick={handleSendOtp} disabled={isLoading} className={cn("w-full py-3 bg-blue-600 text-white rounded-md font-medium flex items-center justify-center", isLoading && "opacity-70 cursor-not-allowed")} data-unique-id="5232fbff-e635-44e4-8fdc-1735c22c2432" data-loc="123:14-123:222" data-file-name="app/page.tsx">
                {isLoading ? <span className="flex items-center" data-unique-id="1ea7473d-a64d-4a56-a1a5-4db47cf303e9" data-loc="124:29-124:65" data-file-name="app/page.tsx">
                    <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" data-unique-id="2cced019-3e3d-4521-a988-677517753846" data-loc="125:20-125:147" data-file-name="app/page.tsx">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Sending OTP...
                  </span> : <span className="flex items-center" data-unique-id="2229d38f-aa3c-4427-9acc-460fd0ec5994" data-loc="130:28-130:64" data-file-name="app/page.tsx">
                    Send OTP
                    <ArrowRight className="ml-2 h-5 w-5" />
                  </span>}
              </button>
            </div> : <div className="space-y-4" data-unique-id="2cee6de1-bebd-4775-a4bd-59c303ff6bca" data-loc="135:21-135:48" data-file-name="app/page.tsx">
              <div data-unique-id="ec0495ec-f10a-401f-b713-cb52cea59c42" data-loc="136:14-136:19" data-file-name="app/page.tsx">
                <label htmlFor="otp" className="text-sm font-medium text-gray-700 block mb-1" data-unique-id="afeaf1d0-5d12-4c1c-a6c8-8fc0f8ea86c0" data-loc="137:16-137:94" data-file-name="app/page.tsx">
                  One-Time Password
                </label>
                <div className="relative" data-unique-id="0451c192-ec20-4a17-abf6-6194342c5773" data-loc="140:16-140:42" data-file-name="app/page.tsx">
                  <input id="otp" type="text" className="w-full border border-gray-300 rounded-md py-3 px-4 focus:outline-none focus:ring-2 focus:ring-blue-500" placeholder="Enter 6 digit OTP" value={otp} onChange={e => setOtp(e.target.value)} maxLength={6} data-unique-id="d79801f3-2ca9-420c-ba36-34f7f4d78e6a" data-loc="141:18-141:260" data-file-name="app/page.tsx" />
                  <Lock className="absolute right-3 top-3.5 h-5 w-5 text-gray-400" />
                </div>
                {generatedOtp && <div className="mt-2 bg-green-50 border border-green-200 rounded p-2" data-unique-id="4b503e59-6b4c-4c3e-921a-afc5cb1a50ca" data-loc="144:33-144:103" data-file-name="app/page.tsx">
                    <p className="text-sm font-medium text-green-800" data-unique-id="c954449e-1b6b-4130-a59f-43175ce534ed" data-loc="145:20-145:70" data-file-name="app/page.tsx">Demo OTP: <span className="font-bold" data-unique-id="cbc99efa-e7e7-4f1d-8a75-a35e769238f0" data-loc="145:80-145:108" data-file-name="app/page.tsx">{generatedOtp}</span></p>
                    <p className="text-xs text-green-700 mt-1" data-unique-id="550c5d1a-82c0-4e79-a97a-1da84cec0818" data-loc="146:20-146:63" data-file-name="app/page.tsx">Use this code to log in</p>
                  </div>}
                <div className="flex justify-between mt-2 text-sm" data-unique-id="3ae4df97-b776-481d-8efa-39bec832fa04" data-loc="148:16-148:67" data-file-name="app/page.tsx">
                  <span className="text-gray-500" data-unique-id="9d93236e-5e79-45ec-a665-154b02da4055" data-loc="149:18-149:50" data-file-name="app/page.tsx">
                    OTP sent to: +91 {phone}
                  </span>
                  {countdown > 0 ? <span className="text-gray-500" data-unique-id="1f31c194-d440-4fa5-ba1c-e71b810933c2" data-loc="152:35-152:67" data-file-name="app/page.tsx">Resend in {countdown}s</span> : <button className="text-blue-600 hover:text-blue-800" onClick={handleSendOtp} disabled={isLoading} data-unique-id="3b3f0407-9b35-46c2-90ab-3bd3b4692ae2" data-loc="152:99-152:198" data-file-name="app/page.tsx">
                      Resend OTP
                    </button>}
                </div>
              </div>

              <button onClick={handleVerifyOtp} disabled={isLoading} className={cn("w-full py-3 bg-blue-600 text-white rounded-md font-medium flex items-center justify-center", isLoading && "opacity-70 cursor-not-allowed")} data-unique-id="8847971d-fa11-499f-b0cb-c6e12e36c7df" data-loc="158:14-158:224" data-file-name="app/page.tsx">
                {isLoading ? <span className="flex items-center" data-unique-id="5350371d-418a-4180-8c4e-54880eb3006e" data-loc="159:29-159:65" data-file-name="app/page.tsx">
                    <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" data-unique-id="6e7ffe2d-3e13-49ba-b67c-e98c5baf02c0" data-loc="160:20-160:147" data-file-name="app/page.tsx">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Verifying...
                  </span> : <span className="flex items-center" data-unique-id="76500ca8-3222-4b0e-9c28-a89d8ee8d213" data-loc="165:28-165:64" data-file-name="app/page.tsx">
                    Verify & Login
                    <ArrowRight className="ml-2 h-5 w-5" />
                  </span>}
              </button>

              <button onClick={() => setIsOtpSent(false)} className="w-full py-2 text-gray-600 font-medium" data-unique-id="8140887f-d7c2-496b-ade4-c6e76e0e9569" data-loc="171:14-171:108" data-file-name="app/page.tsx">
                Change Phone Number
              </button>
            </div>}
        </div>

        <div className="text-center mt-8 text-sm text-gray-500" data-unique-id="bca73865-c696-45eb-a1c5-472d568cd40e" data-loc="177:8-177:64" data-file-name="app/page.tsx">
          <p data-unique-id="6b24b062-ceed-424c-925a-e5f0b28573f8" data-loc="178:10-178:13" data-file-name="app/page.tsx">Admin login? <a href="/admin" className="text-blue-600 hover:text-blue-800" data-unique-id="d5e85d33-a14e-40a4-966a-e361e3023fec" data-loc="178:26-178:89" data-file-name="app/page.tsx">Click here</a></p>
        </div>
      </div>
    </div>;
}