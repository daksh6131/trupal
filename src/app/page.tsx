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
  return <div className="flex flex-col items-center justify-center min-h-screen p-6 bg-gradient-to-b from-blue-50 to-white" data-unique-id="a680d5c6-9a9d-4d40-bc5b-158857bf1bca" data-loc="90:9-90:124" data-file-name="app/page.tsx">
      <div className="w-full max-w-md" data-unique-id="9296f086-53f4-4bb6-9353-7203ae738fb2" data-loc="91:6-91:39" data-file-name="app/page.tsx">
        <div className="text-center mb-10" data-unique-id="8d3fd8bb-dc56-4345-9560-46cc6df0f9dd" data-loc="92:8-92:43" data-file-name="app/page.tsx">
          <h1 className="text-3xl font-bold text-blue-800 mb-2" data-unique-id="fee86515-72b8-4dca-9aa5-7aa30c43d98b" data-loc="93:10-93:64" data-file-name="app/page.tsx">CardSales Pro</h1>
          <p className="text-gray-600" data-unique-id="41c33aae-0a01-4557-944e-1424e599d2fd" data-loc="94:10-94:39" data-file-name="app/page.tsx">Internal sales tool for credit card recommendations</p>
        </div>

        <DemoLoginInfo type="agent" />

        <div className="bg-white rounded-lg shadow-lg p-8" data-unique-id="efcd5b59-0323-4b4a-ac4e-c41f9020e8be" data-loc="99:8-99:59" data-file-name="app/page.tsx">
          <h2 className="text-2xl font-semibold mb-6 text-center text-gray-800" data-unique-id="0f5794cd-374d-45b4-bc1a-2ccfb97374fb" data-loc="100:10-100:80" data-file-name="app/page.tsx">
            {isOtpSent ? "Verify OTP" : "Sales Agent Login"}
          </h2>

          {error && <div className="bg-red-50 text-red-700 p-3 rounded-md mb-4 text-sm" data-unique-id="306713ff-7e32-4192-a6d9-bcc5423f2529" data-loc="104:20-104:88" data-file-name="app/page.tsx">
              {error}
            </div>}

          {!isOtpSent ? <div className="space-y-4" data-unique-id="1fac2ade-a7eb-48e9-b225-587317517cf7" data-loc="108:24-108:51" data-file-name="app/page.tsx">
              <div className="relative" data-unique-id="e6a4bad0-902c-4cff-a803-d22dc273710b" data-loc="109:14-109:40" data-file-name="app/page.tsx">
                <label htmlFor="phone" className="text-sm font-medium text-gray-700 block mb-1" data-unique-id="1856bf7c-acb3-4865-909f-a7484c58699a" data-loc="110:16-110:96" data-file-name="app/page.tsx">
                  Mobile Number
                </label>
                <div className="relative" data-unique-id="dc458d2d-e2a4-43a8-868c-2118ff4299c6" data-loc="113:16-113:42" data-file-name="app/page.tsx">
                  <span className="absolute left-3 top-3.5 text-gray-500" data-unique-id="780bc799-68ce-43c9-9098-8dd1c55a87f8" data-loc="114:18-114:74" data-file-name="app/page.tsx">+91</span>
                  <input id="phone" type="tel" className="pl-10 w-full border border-gray-300 rounded-md py-3 px-4 focus:outline-none focus:ring-2 focus:ring-blue-500" placeholder="Enter 10 digit number" value={phone} onChange={e => setPhone(e.target.value)} maxLength={10} data-unique-id="1f33f3c2-7d93-4c5e-b1f1-b20da1aefbcc" data-loc="115:18-115:276" data-file-name="app/page.tsx" />
                  <Phone className="absolute right-3 top-3.5 h-5 w-5 text-gray-400" />
                </div>
                <p className="text-xs text-gray-500 mt-1" data-unique-id="44919472-fdff-48ee-b133-a6997af6394e" data-loc="118:16-118:58" data-file-name="app/page.tsx">
                  For demo, use: 9876543210
                </p>
              </div>

              <button onClick={handleSendOtp} disabled={isLoading} className={cn("w-full py-3 bg-blue-600 text-white rounded-md font-medium flex items-center justify-center", isLoading && "opacity-70 cursor-not-allowed")} data-unique-id="58c6f096-323f-4b45-91e6-0de95ed1bcfd" data-loc="123:14-123:222" data-file-name="app/page.tsx">
                {isLoading ? <span className="flex items-center" data-unique-id="c3f7a3df-c5f3-41e6-8394-c2b6562ba892" data-loc="124:29-124:65" data-file-name="app/page.tsx">
                    <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" data-unique-id="7d7768b7-0148-4047-8454-a98535fcd163" data-loc="125:20-125:147" data-file-name="app/page.tsx">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Sending OTP...
                  </span> : <span className="flex items-center" data-unique-id="f5ac9ed8-bb25-4840-965f-b8757995dbf7" data-loc="130:28-130:64" data-file-name="app/page.tsx">
                    Send OTP
                    <ArrowRight className="ml-2 h-5 w-5" />
                  </span>}
              </button>
            </div> : <div className="space-y-4" data-unique-id="5549a522-ddd4-4a99-9663-9bb1e2ee723f" data-loc="135:21-135:48" data-file-name="app/page.tsx">
              <div data-unique-id="28e04a36-e1d9-438a-b33e-f66999c946a2" data-loc="136:14-136:19" data-file-name="app/page.tsx">
                <label htmlFor="otp" className="text-sm font-medium text-gray-700 block mb-1" data-unique-id="a9903a5d-a222-42b5-ac57-579566c34cea" data-loc="137:16-137:94" data-file-name="app/page.tsx">
                  One-Time Password
                </label>
                <div className="relative" data-unique-id="ced7802c-1515-47b5-b93d-6b8fb84fb2f3" data-loc="140:16-140:42" data-file-name="app/page.tsx">
                  <input id="otp" type="text" className="w-full border border-gray-300 rounded-md py-3 px-4 focus:outline-none focus:ring-2 focus:ring-blue-500" placeholder="Enter 6 digit OTP" value={otp} onChange={e => setOtp(e.target.value)} maxLength={6} data-unique-id="1aa6d0f8-0c21-40c0-882f-4080baa448ea" data-loc="141:18-141:260" data-file-name="app/page.tsx" />
                  <Lock className="absolute right-3 top-3.5 h-5 w-5 text-gray-400" />
                </div>
                {generatedOtp && <div className="mt-2 bg-green-50 border border-green-200 rounded p-2" data-unique-id="8902dad2-3229-46da-a31d-83dc4abb5848" data-loc="144:33-144:103" data-file-name="app/page.tsx">
                    <p className="text-sm font-medium text-green-800" data-unique-id="ed0829da-b805-4d16-a4bc-d25b63a970d3" data-loc="145:20-145:70" data-file-name="app/page.tsx">Demo OTP: <span className="font-bold" data-unique-id="3df221fd-854b-4d22-a963-5ba545da5beb" data-loc="145:80-145:108" data-file-name="app/page.tsx">{generatedOtp}</span></p>
                    <p className="text-xs text-green-700 mt-1" data-unique-id="6a8dda73-1363-4fdb-9512-2dc7be18ba60" data-loc="146:20-146:63" data-file-name="app/page.tsx">Use this code to log in</p>
                  </div>}
                <div className="flex justify-between mt-2 text-sm" data-unique-id="8e88c1e8-088f-4d77-8276-beac6828e231" data-loc="148:16-148:67" data-file-name="app/page.tsx">
                  <span className="text-gray-500" data-unique-id="1d32c5fb-7293-4539-98d7-66a6cd63c902" data-loc="149:18-149:50" data-file-name="app/page.tsx">
                    OTP sent to: +91 {phone}
                  </span>
                  {countdown > 0 ? <span className="text-gray-500" data-unique-id="db6b4090-fd75-4cea-a091-3c3116457053" data-loc="152:35-152:67" data-file-name="app/page.tsx">Resend in {countdown}s</span> : <button className="text-blue-600 hover:text-blue-800" onClick={handleSendOtp} disabled={isLoading} data-unique-id="4a116705-f5a6-4e84-8673-3bed0f4254e1" data-loc="152:99-152:198" data-file-name="app/page.tsx">
                      Resend OTP
                    </button>}
                </div>
              </div>

              <button onClick={handleVerifyOtp} disabled={isLoading} className={cn("w-full py-3 bg-blue-600 text-white rounded-md font-medium flex items-center justify-center", isLoading && "opacity-70 cursor-not-allowed")} data-unique-id="1940c572-0781-474f-bf6a-45eaf67a0fb5" data-loc="158:14-158:224" data-file-name="app/page.tsx">
                {isLoading ? <span className="flex items-center" data-unique-id="df35fc65-f475-43c7-997a-089900ea83a5" data-loc="159:29-159:65" data-file-name="app/page.tsx">
                    <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" data-unique-id="2b6feefe-11a9-45f8-ab57-eccbc6b74eae" data-loc="160:20-160:147" data-file-name="app/page.tsx">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Verifying...
                  </span> : <span className="flex items-center" data-unique-id="12b1611c-94f5-4481-a35d-47986f373f13" data-loc="165:28-165:64" data-file-name="app/page.tsx">
                    Verify & Login
                    <ArrowRight className="ml-2 h-5 w-5" />
                  </span>}
              </button>

              <button onClick={() => setIsOtpSent(false)} className="w-full py-2 text-gray-600 font-medium" data-unique-id="9e49cc5c-ab1d-4d64-a340-75e6203bdbf5" data-loc="171:14-171:108" data-file-name="app/page.tsx">
                Change Phone Number
              </button>
            </div>}
        </div>

        <div className="text-center mt-8 text-sm text-gray-500" data-unique-id="0b59b3c0-bb22-48d1-925d-e0a3ebae8ec6" data-loc="177:8-177:64" data-file-name="app/page.tsx">
          <p data-unique-id="bfa13cf0-4d80-4d04-8c01-ec5f149be520" data-loc="178:10-178:13" data-file-name="app/page.tsx">Admin login? <a href="/admin" className="text-blue-600 hover:text-blue-800" data-unique-id="817a72a6-7075-43ae-a629-1763d061d429" data-loc="178:26-178:89" data-file-name="app/page.tsx">Click here</a></p>
        </div>
      </div>
    </div>;
}