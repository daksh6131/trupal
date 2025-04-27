"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Users, CreditCard, Activity, LogOut, Edit, Trash2, Plus, Filter, Search, ArrowUp, ArrowDown, CheckCircle, XCircle, Phone, Mail, AlertTriangle } from "lucide-react";
import { CreditCard as CreditCardType } from "@/types";
import { cn } from "@/lib/utils";
import { toast } from "react-hot-toast";
import { authApi, creditCardsApi, customersApi, logsApi, supabaseApi } from "@/lib/api-service";
import AdminPhonesManager from "@/components/admin-phones-manager";
import DemoLoginInfo from "@/components/demo-login-info";
export default function AdminPage() {
  const router = useRouter();
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [activeTab, setActiveTab] = useState<"cards" | "customers" | "logs">("cards");
  const [creditCards, setCreditCards] = useState<CreditCardType[]>([]);
  const [editingCard, setEditingCard] = useState<CreditCardType | null>(null);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [sortBy, setSortBy] = useState<"name" | "minCibilScore">("name");
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("asc");
  const [filter, setFilter] = useState("");
  const [phone, setPhone] = useState("8076492495"); // Pre-filled with admin demo number
  const [otp, setOtp] = useState("");
  const [isOtpSent, setIsOtpSent] = useState(false);
  const [otpCountdown, setOtpCountdown] = useState(0);
  const [generatedOtp, setGeneratedOtp] = useState<string | null>(null);
  useEffect(() => {
    // Check if admin is logged in
    const isBrowser = typeof window !== 'undefined';
    const admin = isBrowser ? localStorage.getItem("adminUser") : null;
    if (admin) {
      setIsLoggedIn(true);
      loadCreditCards();
    }
  }, []);
  useEffect(() => {
    if (otpCountdown > 0) {
      const timer = setTimeout(() => setOtpCountdown(otpCountdown - 1), 1000);
      return () => clearTimeout(timer);
    }
  }, [otpCountdown]);
  const loadCreditCards = async () => {
    try {
      const {
        creditCards
      } = await creditCardsApi.getAll();
      setCreditCards(sortCards(creditCards, sortBy, sortOrder));
    } catch (error) {
      toast.error("Failed to load credit cards");
      console.error(error);
    }
  };

  // Subscribe to real-time updates for credit cards
  useEffect(() => {
    if (!isLoggedIn) return;
    const unsubscribe = supabaseApi.subscribeToTable('credit_cards', payload => {
      console.log('Credit card data changed:', payload);
      // Refresh credit card data when changes occur
      loadCreditCards();
    });

    // Clean up subscription on unmount
    return () => {
      unsubscribe();
    };
  }, [isLoggedIn]);
  const sortCards = (cards: CreditCardType[], by: string, order: "asc" | "desc") => {
    return [...cards].sort((a: any, b: any) => {
      if (a[by] < b[by]) return order === "asc" ? -1 : 1;
      if (a[by] > b[by]) return order === "asc" ? 1 : -1;
      return 0;
    });
  };
  const handleSort = (by: "name" | "minCibilScore") => {
    const newOrder = sortBy === by && sortOrder === "asc" ? "desc" : "asc";
    setSortBy(by);
    setSortOrder(newOrder);
    setCreditCards(sortCards(creditCards, by, newOrder));
  };
  const handleSendOtp = async () => {
    if (!phone || phone.length !== 10 || !/^\d+$/.test(phone)) {
      toast.error("Please enter a valid 10-digit phone number");
      return;
    }
    try {
      // Call OTP generation API
      const response = await authApi.generateOTP(phone);
      if (response.success) {
        setIsOtpSent(true);
        setOtpCountdown(30);
        // For demo purposes, store and display the OTP
        if (response.otp) {
          setGeneratedOtp(response.otp);
          console.log("Demo Admin OTP:", response.otp);
        }
        toast.success("OTP sent successfully");
      } else {
        toast.error(response.error || "Failed to send OTP");
      }
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Failed to send OTP");
    }
  };
  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!otp || otp.length !== 6) {
      toast.error("Please enter a valid 6-digit OTP");
      return;
    }
    try {
      // Call admin OTP verification API
      const response = await authApi.verifyAdminOTP(phone, otp);
      if (response.success) {
        // Store token and admin info
        const isBrowser = typeof window !== 'undefined';
        if (isBrowser) {
          localStorage.setItem("adminToken", response.token);
          localStorage.setItem("adminUser", JSON.stringify(response.admin));
        }
        setIsLoggedIn(true);
        loadCreditCards();
        toast.success("Logged in successfully");
      } else {
        toast.error(response.error || "Invalid OTP or unauthorized");
      }
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Invalid credentials");
    }
  };
  const handleLogout = () => {
    localStorage.removeItem("adminUser");
    setIsLoggedIn(false);
    toast.success("Logged out successfully");
  };
  const handleDeleteCard = async (id: string) => {
    if (window.confirm("Are you sure you want to delete this card?")) {
      try {
        await creditCardsApi.delete(id);
        loadCreditCards();
        toast.success("Card deleted successfully");
      } catch (error) {
        toast.error("Failed to delete card");
        console.error(error);
      }
    }
  };
  const handleEditCard = (card: CreditCardType) => {
    setEditingCard(card);
    setIsFormOpen(true);
  };
  const handleAddNewCard = () => {
    setEditingCard(null);
    setIsFormOpen(true);
  };
  const handleSubmitCard = async (e: React.FormEvent) => {
    e.preventDefault();
    const form = e.target as HTMLFormElement;
    const cardData = {
      name: (form.elements.namedItem('name') as HTMLInputElement).value,
      minCibilScore: parseInt((form.elements.namedItem('minCibilScore') as HTMLInputElement).value),
      annualFee: parseInt((form.elements.namedItem('annualFee') as HTMLInputElement).value),
      utmLink: (form.elements.namedItem('utmLink') as HTMLInputElement).value,
      benefits: (form.elements.namedItem('benefits') as HTMLTextAreaElement).value.split('\n').filter(Boolean),
      tags: (form.elements.namedItem('tags') as HTMLInputElement).value.split(',').map((tag: string) => tag.trim()).filter(Boolean),
      status: (form.elements.namedItem('status') as HTMLSelectElement).value as "active" | "inactive",
      imageUrl: (form.elements.namedItem('imageUrl') as HTMLInputElement).value || "https://images.unsplash.com/photo-1523281353252-5e14672131b0?q=80&w=500&auto=format&fit=crop"
    };
    try {
      if (editingCard) {
        await creditCardsApi.update(editingCard._id, cardData);
        toast.success("Card updated successfully");
      } else {
        await creditCardsApi.create({
          ...cardData,
          _id: "",
          createdAt: "",
          updatedAt: ""
        });
        toast.success("New card added successfully");
      }
      setIsFormOpen(false);
      loadCreditCards();
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Failed to save card");
    }
  };
  const filteredCards = creditCards.filter(card => card.name.toLowerCase().includes(filter.toLowerCase()) || card.tags.some(tag => tag.toLowerCase().includes(filter.toLowerCase())));
  if (!isLoggedIn) {
    return <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8" data-unique-id="9151ad61-a1fc-4245-9e22-2cceb3da900e" data-loc="190:11-190:112" data-file-name="app/admin/page.tsx">
        <div className="max-w-md w-full space-y-8" data-unique-id="63a89b15-4e9f-47b1-b28b-5fc6ed32fd33" data-loc="191:8-191:51" data-file-name="app/admin/page.tsx">
          <div data-unique-id="4c8cf101-f9a3-4958-9dfe-86b1eb98610f" data-loc="192:10-192:15" data-file-name="app/admin/page.tsx">
            <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900" data-unique-id="201269de-7b93-4440-b524-301f0f9f5763" data-loc="193:12-193:83" data-file-name="app/admin/page.tsx">
              Admin Login
            </h2>
            <p className="mt-2 text-center text-sm text-gray-600" data-unique-id="bf825c8a-51ab-45cc-aa78-233f78d72059" data-loc="196:12-196:66" data-file-name="app/admin/page.tsx">
              Access the admin dashboard
            </p>
          </div>
          
          <DemoLoginInfo type="admin" />
          
          {!isOtpSent ? <div className="mt-8 space-y-6" data-unique-id="ebea21f2-4740-4a7e-8a23-e7cc1d2fbb52" data-loc="203:24-203:56" data-file-name="app/admin/page.tsx">
              <div className="rounded-md shadow-sm" data-unique-id="5123ec0f-c7a4-46ae-8f63-39d5cde0a91e" data-loc="204:14-204:52" data-file-name="app/admin/page.tsx">
                <div data-unique-id="523c4695-35b0-4392-a5b8-95a652e6c3e7" data-loc="205:16-205:21" data-file-name="app/admin/page.tsx">
                  <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-1" data-unique-id="10c24262-a148-4e0e-bf1f-095c36da55f6" data-loc="206:18-206:98" data-file-name="app/admin/page.tsx">
                    Phone Number
                  </label>
                  <div className="relative" data-unique-id="f9d65821-480c-4e39-9b0e-10fbdb1155eb" data-loc="209:18-209:44" data-file-name="app/admin/page.tsx">
                    <span className="absolute left-3 top-3 text-gray-500" data-unique-id="7d4fefce-51e4-479f-b608-6d986cca0747" data-loc="210:20-210:74" data-file-name="app/admin/page.tsx">+91</span>
                    <input id="phone" name="phone" type="tel" maxLength={10} value={phone} onChange={e => setPhone(e.target.value)} className="appearance-none block w-full pl-10 px-3 py-2 border border-gray-300 rounded-md placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm" placeholder="Enter admin phone number" data-unique-id="bcfad4e0-f496-4e68-b60d-a10f75d029f3" data-loc="211:20-211:371" data-file-name="app/admin/page.tsx" />
                  </div>
                  <p className="mt-1 text-xs text-gray-500 font-medium" data-unique-id="583cf816-372a-40e8-a596-a39eefd57222" data-loc="213:18-213:72" data-file-name="app/admin/page.tsx">
                    Demo admin: 8076492495 (pre-filled)
                  </p>
                </div>
              </div>
              
              <div data-unique-id="d77d295d-c0c7-4395-a899-f84072347bde" data-loc="219:14-219:19" data-file-name="app/admin/page.tsx">
                <button type="button" onClick={handleSendOtp} className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500" data-unique-id="830793a1-8694-438c-a533-4e1fa10316f7" data-loc="220:16-220:296" data-file-name="app/admin/page.tsx">
                  Send OTP
                </button>
              </div>
            </div> : <form className="mt-8 space-y-6" onSubmit={handleLogin} data-unique-id="bc295e63-04f9-40cf-b074-4b2fbe5858a1" data-loc="224:21-224:77" data-file-name="app/admin/page.tsx">
              <div className="rounded-md shadow-sm" data-unique-id="98fa77f7-a59d-4bdb-8acb-15692189f64b" data-loc="225:14-225:52" data-file-name="app/admin/page.tsx">
                <div data-unique-id="0d967c75-5410-4ee8-8f29-45f7faec3f50" data-loc="226:16-226:21" data-file-name="app/admin/page.tsx">
                  <label htmlFor="otp" className="block text-sm font-medium text-gray-700 mb-1" data-unique-id="f646ce3d-8290-4a6f-aef7-5682193cd68c" data-loc="227:18-227:96" data-file-name="app/admin/page.tsx">
                    One-Time Password
                  </label>
                  <input id="otp" name="otp" type="text" maxLength={6} value={otp} onChange={e => setOtp(e.target.value)} className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm" placeholder="Enter 6-digit OTP" required data-unique-id="95365e40-7d93-41de-b264-6ae9d8733829" data-loc="230:18-230:357" data-file-name="app/admin/page.tsx" />
                </div>
                
                {generatedOtp && <div className="mt-2 bg-green-50 border border-green-200 rounded p-2" data-unique-id="99c9dd57-8d1a-4779-87ef-3b2437e6f5d2" data-loc="233:33-233:103" data-file-name="app/admin/page.tsx">
                    <p className="text-sm font-medium text-green-800" data-unique-id="30b94759-7d8a-4ffa-8dcd-381ee8594f20" data-loc="234:20-234:70" data-file-name="app/admin/page.tsx">Demo Admin OTP: <span className="font-bold" data-unique-id="be629fc2-9c46-4343-bf93-b31f0404954a" data-loc="234:86-234:114" data-file-name="app/admin/page.tsx">{generatedOtp}</span></p>
                    <p className="text-xs text-green-700 mt-1" data-unique-id="b6d6ae16-1a4c-4485-9906-84248f2c8eaf" data-loc="235:20-235:63" data-file-name="app/admin/page.tsx">Use this code to log in as admin</p>
                  </div>}
                
                <div className="flex justify-between mt-2 text-sm" data-unique-id="1bfce121-fd5f-4bb0-b1f9-ccd9bb7dac25" data-loc="238:16-238:67" data-file-name="app/admin/page.tsx">
                  <span className="text-gray-500" data-unique-id="ffb22a17-52a0-459a-a1df-4de191cbe70d" data-loc="239:18-239:50" data-file-name="app/admin/page.tsx">
                    OTP sent to: +91 {phone}
                  </span>
                  {otpCountdown > 0 ? <span className="text-gray-500" data-unique-id="85c3725b-43af-4e8d-b084-c835884d5526" data-loc="242:38-242:70" data-file-name="app/admin/page.tsx">Resend in {otpCountdown}s</span> : <button type="button" className="text-blue-600 hover:text-blue-800" onClick={handleSendOtp} data-unique-id="2547297f-73b0-4f07-8694-7aa6412231d8" data-loc="242:105-242:197" data-file-name="app/admin/page.tsx">
                      Resend OTP
                    </button>}
                </div>
              </div>
              
              <div className="flex space-x-4" data-unique-id="99f7a52d-dd95-4d0d-a2cf-40747abd33bd" data-loc="248:14-248:46" data-file-name="app/admin/page.tsx">
                <button type="button" onClick={() => setIsOtpSent(false)} className="py-2 px-4 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 flex-1" data-unique-id="a37aa99e-ac6f-4f22-9248-f5df8571f5ce" data-loc="249:16-249:279" data-file-name="app/admin/page.tsx">
                  Back
                </button>
                <button type="submit" className="py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 flex-1" data-unique-id="211d7b2b-b728-4703-ace5-8b9562cbcf58" data-loc="252:16-252:247" data-file-name="app/admin/page.tsx">
                  Verify & Login
                </button>
              </div>
            </form>}
          
          <div className="text-center mt-4" data-unique-id="c2b37b20-a695-4435-bf75-525379e6459e" data-loc="258:10-258:44" data-file-name="app/admin/page.tsx">
            <a href="/" className="font-medium text-blue-600 hover:text-blue-500" data-unique-id="0bc95655-dfde-495f-8b20-812616c09b27" data-loc="259:12-259:82" data-file-name="app/admin/page.tsx">
              Back to sales agent login
            </a>
          </div>
        </div>
      </div>;
  }
  return <div className="min-h-screen bg-gray-50" data-unique-id="48ec52df-88af-4911-8f90-66af92d3dfed" data-loc="266:9-266:50" data-file-name="app/admin/page.tsx">
      {/* Header */}
      <header className="bg-white shadow" data-unique-id="613b9ec6-627c-4cc8-8630-a1e4fb841319" data-loc="268:6-268:42" data-file-name="app/admin/page.tsx">
        <div className="max-w-7xl mx-auto px-4 py-4 sm:px-6 flex justify-between items-center" data-unique-id="7d5223a9-4886-4c92-aaa7-5310a70ce64a" data-loc="269:8-269:95" data-file-name="app/admin/page.tsx">
          <h1 className="text-2xl font-bold text-gray-900" data-unique-id="2f0cebf4-5a87-4e72-a17e-d43ef94bc2dd" data-loc="270:10-270:59" data-file-name="app/admin/page.tsx">CardSales Pro - Admin</h1>
          <button onClick={handleLogout} className="flex items-center text-sm font-medium text-red-600 hover:text-red-800" data-unique-id="b03d2d60-33a9-43fc-8a71-445fed748d81" data-loc="271:10-271:123" data-file-name="app/admin/page.tsx">
            <LogOut className="h-4 w-4 mr-1" /> Logout
          </button>
        </div>
      </header>
      
      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 py-8 sm:px-6" data-unique-id="0368ac22-db68-4daf-b471-3861184ad3b2" data-loc="278:6-278:60" data-file-name="app/admin/page.tsx">
        {/* Tabs */}
        <div className="flex border-b border-gray-200 mb-6" data-unique-id="0f3c3771-dc75-4765-86f3-14d07c2a9215" data-loc="280:8-280:60" data-file-name="app/admin/page.tsx">
          <button className={cn("py-4 px-6 text-sm font-medium", activeTab === "cards" ? "border-b-2 border-blue-500 text-blue-600" : "text-gray-500 hover:text-gray-700 hover:border-gray-300")} onClick={() => setActiveTab("cards")} data-unique-id="4ca2d172-252e-47ef-b4aa-e38da9f6ba4a" data-loc="281:10-281:232" data-file-name="app/admin/page.tsx">
            <div className="flex items-center" data-unique-id="0761ddd4-dd7e-4d4b-a8cc-e5b24cb51685" data-loc="282:12-282:47" data-file-name="app/admin/page.tsx">
              <CreditCard className="h-5 w-5 mr-2" /> Credit Cards
            </div>
          </button>
          <button className={cn("py-4 px-6 text-sm font-medium", activeTab === "customers" ? "border-b-2 border-blue-500 text-blue-600" : "text-gray-500 hover:text-gray-700 hover:border-gray-300")} onClick={() => setActiveTab("customers")} data-unique-id="2f7b9cd1-2ef2-4d38-b11b-f6e7f1d6f2d3" data-loc="286:10-286:240" data-file-name="app/admin/page.tsx">
            <div className="flex items-center" data-unique-id="93f6e6c4-077b-480a-a425-01dbb578f1df" data-loc="287:12-287:47" data-file-name="app/admin/page.tsx">
              <Users className="h-5 w-5 mr-2" /> Customers
            </div>
          </button>
          <button className={cn("py-4 px-6 text-sm font-medium", activeTab === "logs" ? "border-b-2 border-blue-500 text-blue-600" : "text-gray-500 hover:text-gray-700 hover:border-gray-300")} onClick={() => setActiveTab("logs")} data-unique-id="3e039fc9-41a7-44b2-9d68-bf8feb506390" data-loc="291:10-291:230" data-file-name="app/admin/page.tsx">
            <div className="flex items-center" data-unique-id="08ba2a8b-57f7-4b79-93d3-814e1d046500" data-loc="292:12-292:47" data-file-name="app/admin/page.tsx">
              <Activity className="h-5 w-5 mr-2" /> Activity Logs
            </div>
          </button>
          <a href="/admin/errors" className="py-4 px-6 text-sm font-medium text-gray-500 hover:text-gray-700 hover:border-gray-300" data-unique-id="d2a0dc60-a55e-44d3-9142-df66095f53bd" data-loc="296:10-296:132" data-file-name="app/admin/page.tsx">
            <div className="flex items-center" data-unique-id="b64efd56-a81d-4a8d-9787-e4161a6537e6" data-loc="297:12-297:47" data-file-name="app/admin/page.tsx">
              <AlertTriangle className="h-5 w-5 mr-2" /> Error Logs
            </div>
          </a>
        </div>
        
        {/* Credit Cards Tab */}
        {activeTab === "cards" && <div data-unique-id="772094da-ee29-421a-a8ed-e94a975effdc" data-loc="304:34-304:39" data-file-name="app/admin/page.tsx">
            <div className="flex justify-between items-center mb-6" data-unique-id="bfcea8f5-d392-47dc-89d2-515ded9eda18" data-loc="305:12-305:68" data-file-name="app/admin/page.tsx">
              <h2 className="text-xl font-semibold text-gray-900" data-unique-id="b3754d3e-314e-487f-8343-5fd606904c49" data-loc="306:14-306:66" data-file-name="app/admin/page.tsx">Credit Cards</h2>
              <button onClick={handleAddNewCard} className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500" data-unique-id="c1950e3e-e107-4da4-98c0-b9a298f8f441" data-loc="307:14-307:276" data-file-name="app/admin/page.tsx">
                <Plus className="h-4 w-4 mr-2" /> Add New Card
              </button>
            </div>
            
            {/* Filter and Search */}
            <div className="mb-6 flex" data-unique-id="8ecb96c8-d949-472a-9328-6ccfa7334642" data-loc="313:12-313:39" data-file-name="app/admin/page.tsx">
              <div className="relative flex-grow" data-unique-id="072607b1-483c-4042-9ec8-e0e60f7e42e2" data-loc="314:14-314:50" data-file-name="app/admin/page.tsx">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none" data-unique-id="cbe10e74-34db-4498-bb4d-949528861f9c" data-loc="315:16-315:102" data-file-name="app/admin/page.tsx">
                  <Search className="h-5 w-5 text-gray-400" />
                </div>
                <input type="text" className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:placeholder-gray-400 focus:ring-1 focus:ring-blue-500 focus:border-blue-500 sm:text-sm" placeholder="Search cards by name or tag" value={filter} onChange={e => setFilter(e.target.value)} data-unique-id="2bd7a6f8-442b-4c31-8d40-092015ad5f61" data-loc="318:16-318:363" data-file-name="app/admin/page.tsx" />
              </div>
            </div>
            
            {/* Cards List */}
            <div className="bg-white shadow overflow-hidden sm:rounded-md" data-unique-id="b007db4c-cc3b-4f1d-be50-9dd92127838a" data-loc="323:12-323:75" data-file-name="app/admin/page.tsx">
              <table className="min-w-full divide-y divide-gray-200" data-unique-id="290329e3-ded2-4005-88f8-a4b81f3c41a2" data-loc="324:14-324:69" data-file-name="app/admin/page.tsx">
                <thead className="bg-gray-50" data-unique-id="0de8390c-0616-4d63-adfe-2fa2c7f646e7" data-loc="325:16-325:46" data-file-name="app/admin/page.tsx">
                  <tr data-unique-id="8767b14e-189a-4402-ac6c-8ea9877bea2c" data-loc="326:18-326:22" data-file-name="app/admin/page.tsx">
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer" onClick={() => handleSort("name")} data-unique-id="83e8bc80-ad9b-495f-8bcc-779514591cc0" data-loc="327:20-327:177" data-file-name="app/admin/page.tsx">
                      <div className="flex items-center" data-unique-id="064d11f8-5775-4dc7-9e38-36cb500860d4" data-loc="328:22-328:57" data-file-name="app/admin/page.tsx">
                        Name
                        {sortBy === "name" && (sortOrder === "asc" ? <ArrowUp className="w-4 h-4 ml-1" /> : <ArrowDown className="w-4 h-4 ml-1" />)}
                      </div>
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer" onClick={() => handleSort("minCibilScore")} data-unique-id="466e93fc-e0f3-463b-a668-acbb134ec40e" data-loc="333:20-333:186" data-file-name="app/admin/page.tsx">
                      <div className="flex items-center" data-unique-id="aae02d6b-011f-453a-9cf1-f0fb84685cf0" data-loc="334:22-334:57" data-file-name="app/admin/page.tsx">
                        Min CIBIL Score
                        {sortBy === "minCibilScore" && (sortOrder === "asc" ? <ArrowUp className="w-4 h-4 ml-1" /> : <ArrowDown className="w-4 h-4 ml-1" />)}
                      </div>
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider" data-unique-id="21cbe28c-84da-4734-84e5-2582e0a045c3" data-loc="339:20-339:127" data-file-name="app/admin/page.tsx">
                      Annual Fee
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider" data-unique-id="e0f1a65f-908d-4419-85d9-84858c8f2aa7" data-loc="342:20-342:127" data-file-name="app/admin/page.tsx">
                      Tags
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider" data-unique-id="7c2fea0d-8662-4014-ab68-d54702e3d284" data-loc="345:20-345:127" data-file-name="app/admin/page.tsx">
                      Status
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider" data-unique-id="8059359b-da8a-45f3-beb4-55c89208210e" data-loc="348:20-348:127" data-file-name="app/admin/page.tsx">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200" data-unique-id="8b320260-97b0-4b57-89db-1956ad126fcd" data-loc="353:16-353:69" data-file-name="app/admin/page.tsx">
                  {filteredCards.map(card => <tr key={card._id} data-unique-id="2afa1d41-be48-4548-9949-e93db4eb55e4" data-loc="354:45-354:64" data-file-name="app/admin/page.tsx">
                      <td className="px-6 py-4 whitespace-nowrap" data-unique-id="9d6f3a44-e484-4b28-9825-3c2224a3ef17" data-loc="355:22-355:66" data-file-name="app/admin/page.tsx">
                        <div className="text-sm font-medium text-gray-900" data-unique-id="941e39ac-e933-4cd5-90b5-e1fe99ea895c" data-loc="356:24-356:75" data-file-name="app/admin/page.tsx">{card.name}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap" data-unique-id="0faefb74-b5ff-4fa0-89fd-55e4fe2a2b56" data-loc="358:22-358:66" data-file-name="app/admin/page.tsx">
                        <div className="text-sm text-gray-500" data-unique-id="20fa721f-df6b-4dd1-a1e4-df65e0f577c4" data-loc="359:24-359:63" data-file-name="app/admin/page.tsx">{card.minCibilScore}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap" data-unique-id="39ff2f11-11b2-4d76-825e-dc6e2cde4ea7" data-loc="361:22-361:66" data-file-name="app/admin/page.tsx">
                        <div className="text-sm text-gray-500" data-unique-id="c3235ba1-176a-4882-8a50-b7787e70cb23" data-loc="362:24-362:63" data-file-name="app/admin/page.tsx">₹{card.annualFee}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap" data-unique-id="3b61b504-bafc-4339-8053-a015bcf391af" data-loc="364:22-364:66" data-file-name="app/admin/page.tsx">
                        <div className="flex flex-wrap gap-1" data-unique-id="ab5554b0-8bab-4e26-b4de-a521f69ff37f" data-loc="365:24-365:62" data-file-name="app/admin/page.tsx">
                          {card.tags.map((tag, idx) => <span key={idx} className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-blue-100 text-blue-800" data-unique-id="c988641d-75ea-422c-8781-bc5173c9be92" data-loc="366:55-366:174" data-file-name="app/admin/page.tsx">
                              {tag}
                            </span>)}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap" data-unique-id="8586a844-3638-4a5f-a662-ba241f651df7" data-loc="371:22-371:66" data-file-name="app/admin/page.tsx">
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${card.status === "active" ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"}`} data-unique-id="3c243b58-dfe1-4f7f-9341-35e28a363d3b" data-loc="372:24-372:204" data-file-name="app/admin/page.tsx">
                          {card.status === "active" ? <CheckCircle className="w-3 h-3 mr-1" /> : <XCircle className="w-3 h-3 mr-1" />}
                          {card.status}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500" data-unique-id="224e8808-d10c-4f6d-8e0f-7edd5f5db419" data-loc="377:22-377:88" data-file-name="app/admin/page.tsx">
                        <button onClick={() => handleEditCard(card)} className="text-blue-600 hover:text-blue-900 mr-4" data-unique-id="b5b4c89b-8800-459d-919a-23d4c1d6bea7" data-loc="378:24-378:120" data-file-name="app/admin/page.tsx">
                          <Edit className="h-4 w-4" />
                        </button>
                        <button onClick={() => handleDeleteCard(card._id)} className="text-red-600 hover:text-red-900" data-unique-id="f0f05f3b-d456-44f7-a1da-bc92ad276dbe" data-loc="381:24-381:119" data-file-name="app/admin/page.tsx">
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </td>
                    </tr>)}
                </tbody>
              </table>
              
              {filteredCards.length === 0 && <div className="text-center py-8" data-unique-id="9087210b-5a0b-4eda-98ad-fa0ede99d75b" data-loc="389:45-389:79" data-file-name="app/admin/page.tsx">
                  <p className="text-gray-500" data-unique-id="587d4774-7c35-4e06-bba9-3217245ed384" data-loc="390:18-390:47" data-file-name="app/admin/page.tsx">No credit cards found</p>
                </div>}
            </div>
            
            {/* Card Form Modal */}
            {isFormOpen && <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50" data-unique-id="d93f38e9-16c2-4cb1-9433-49460c341f2c" data-loc="395:27-395:119" data-file-name="app/admin/page.tsx">
                <div className="bg-white rounded-lg p-8 max-w-2xl w-full max-h-screen overflow-y-auto" data-unique-id="3824d318-a84c-483c-b138-eb6571f68815" data-loc="396:16-396:103" data-file-name="app/admin/page.tsx">
                  <h3 className="text-lg font-medium text-gray-900 mb-6" data-unique-id="64c0b5c7-5725-42ed-8297-3da78b567753" data-loc="397:18-397:73" data-file-name="app/admin/page.tsx">
                    {editingCard ? "Edit Credit Card" : "Add New Credit Card"}
                  </h3>
                  
                  <form onSubmit={handleSubmitCard} data-unique-id="5a07bc27-27b7-4f27-9fd4-648b15b9372e" data-loc="401:18-401:52" data-file-name="app/admin/page.tsx">
                    <div className="space-y-6" data-unique-id="d15b70f4-f0e2-4d52-b3e5-7110c223731e" data-loc="402:20-402:47" data-file-name="app/admin/page.tsx">
                      <div data-unique-id="bf09f86d-17f9-4387-8327-ae3d733ee61a" data-loc="403:22-403:27" data-file-name="app/admin/page.tsx">
                        <label htmlFor="name" className="block text-sm font-medium text-gray-700" data-unique-id="bb62421a-2ef9-4d97-9364-3da565fb41c5" data-loc="404:24-404:98" data-file-name="app/admin/page.tsx">
                          Card Name
                        </label>
                        <input type="text" id="name" name="name" className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500" defaultValue={editingCard?.name ?? ""} required data-unique-id="1961c44c-5dff-4dca-bc3a-d17acb762e45" data-loc="407:24-407:260" data-file-name="app/admin/page.tsx" />
                      </div>
                      
                      <div className="grid grid-cols-2 gap-4" data-unique-id="e3935d94-ee36-47eb-a7fd-be8f70780297" data-loc="410:22-410:62" data-file-name="app/admin/page.tsx">
                        <div data-unique-id="c0cfc048-03ed-47bf-a34b-c65456f614d7" data-loc="411:24-411:29" data-file-name="app/admin/page.tsx">
                          <label htmlFor="minCibilScore" className="block text-sm font-medium text-gray-700" data-unique-id="634a74f7-bc57-4c87-b0d9-dbe284d49af5" data-loc="412:26-412:109" data-file-name="app/admin/page.tsx">
                            Min CIBIL Score
                          </label>
                          <input type="number" id="minCibilScore" name="minCibilScore" min="300" max="900" className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500" defaultValue={editingCard?.minCibilScore ?? "700"} required data-unique-id="7600f2b9-172e-4aa6-a127-798fddb8fb3b" data-loc="415:26-415:314" data-file-name="app/admin/page.tsx" />
                        </div>
                        
                        <div data-unique-id="4a8bbc2e-b58e-46ec-9983-dc626f71b300" data-loc="418:24-418:29" data-file-name="app/admin/page.tsx">
                          <label htmlFor="annualFee" className="block text-sm font-medium text-gray-700" data-unique-id="c6a68daa-cd99-4a6c-a270-5b891c54bf75" data-loc="419:26-419:105" data-file-name="app/admin/page.tsx">
                            Annual Fee (₹)
                          </label>
                          <input type="number" id="annualFee" name="annualFee" min="0" className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500" defaultValue={editingCard?.annualFee ?? "0"} required data-unique-id="305319e7-b112-49b6-91f3-36d4aa1c4f27" data-loc="422:26-422:288" data-file-name="app/admin/page.tsx" />
                        </div>
                      </div>
                      
                      <div data-unique-id="d0d8aee7-272e-450f-ba19-f35af07dcde1" data-loc="426:22-426:27" data-file-name="app/admin/page.tsx">
                        <label htmlFor="utmLink" className="block text-sm font-medium text-gray-700" data-unique-id="4244f896-d92e-4cde-a91c-ce52d581ecc7" data-loc="427:24-427:101" data-file-name="app/admin/page.tsx">
                          UTM Link
                        </label>
                        <input type="url" id="utmLink" name="utmLink" className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500" defaultValue={editingCard?.utmLink ?? "https://example.com/card?utm=agent"} required data-unique-id="cd1657d5-3a16-411f-81e0-535df55e86db" data-loc="430:24-430:302" data-file-name="app/admin/page.tsx" />
                      </div>
                      
                      <div data-unique-id="743be502-4c94-4daa-9708-c9270a26a0f4" data-loc="433:22-433:27" data-file-name="app/admin/page.tsx">
                        <label htmlFor="benefits" className="block text-sm font-medium text-gray-700" data-unique-id="623af246-85ec-4245-9b1c-01d97fc17777" data-loc="434:24-434:102" data-file-name="app/admin/page.tsx">
                          Benefits (one per line)
                        </label>
                        <textarea id="benefits" name="benefits" rows={4} className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500" defaultValue={editingCard?.benefits.join('\n') ?? ""} required data-unique-id="978a7d85-85e8-498e-a145-e1d51c631f70" data-loc="437:24-437:281" data-file-name="app/admin/page.tsx"></textarea>
                      </div>
                      
                      <div data-unique-id="89627798-c729-47db-b75e-83cc13f96c37" data-loc="440:22-440:27" data-file-name="app/admin/page.tsx">
                        <label htmlFor="tags" className="block text-sm font-medium text-gray-700" data-unique-id="b01c81e7-7e87-4b67-a06d-d6939c5da341" data-loc="441:24-441:98" data-file-name="app/admin/page.tsx">
                          Tags (comma separated)
                        </label>
                        <input type="text" id="tags" name="tags" className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500" defaultValue={editingCard?.tags.join(', ') ?? ""} required data-unique-id="50ff3947-f5a7-4a14-94bc-be44d491652e" data-loc="444:24-444:271" data-file-name="app/admin/page.tsx" />
                      </div>
                      
                      <div data-unique-id="8fe72db6-ba19-4821-a111-ba7887d7874b" data-loc="447:22-447:27" data-file-name="app/admin/page.tsx">
                        <label htmlFor="imageUrl" className="block text-sm font-medium text-gray-700" data-unique-id="eda51b56-a8ac-4934-9c84-ed70affc6a24" data-loc="448:24-448:102" data-file-name="app/admin/page.tsx">
                          Card Image URL
                        </label>
                        <input type="url" id="imageUrl" name="imageUrl" className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500" defaultValue={editingCard?.imageUrl ?? "https://images.unsplash.com/photo-1523281353252-5e14672131b0?q=80&w=500&auto=format&fit=crop"} data-unique-id="2d494bdc-5ff6-43a4-8245-1577e5b9757d" data-loc="451:24-451:354" data-file-name="app/admin/page.tsx" />
                        <p className="mt-1 text-sm text-gray-500" data-unique-id="66486fc8-8674-4b29-8dee-1d1087eecbcc" data-loc="452:24-452:66" data-file-name="app/admin/page.tsx">Leave empty for default image</p>
                      </div>
                      
                      <div data-unique-id="8db7611f-721a-41fa-a69f-da6148d8b030" data-loc="455:22-455:27" data-file-name="app/admin/page.tsx">
                        <label htmlFor="status" className="block text-sm font-medium text-gray-700" data-unique-id="6c158de1-b100-417e-b6ad-670ff65971b7" data-loc="456:24-456:100" data-file-name="app/admin/page.tsx">
                          Status
                        </label>
                        <select id="status" name="status" className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500" defaultValue={editingCard?.status ?? "active"} data-unique-id="94f05716-c4fd-44c3-942f-0130434d2193" data-loc="459:24-459:250" data-file-name="app/admin/page.tsx">
                          <option value="active" data-unique-id="37cb29ef-f447-454a-8229-aae20229b78a" data-loc="460:26-460:49" data-file-name="app/admin/page.tsx">Active</option>
                          <option value="inactive" data-unique-id="d6e77910-b7bb-449c-a42c-128e804f41f0" data-loc="461:26-461:51" data-file-name="app/admin/page.tsx">Inactive</option>
                        </select>
                      </div>
                      
                      <div className="flex justify-end space-x-3" data-unique-id="bf1797e6-1120-4aed-99cd-9c8aefef67b9" data-loc="465:22-465:66" data-file-name="app/admin/page.tsx">
                        <button type="button" onClick={() => setIsFormOpen(false)} className="py-2 px-4 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500" data-unique-id="4bd000d8-7abe-492b-b266-02661e31df46" data-loc="466:24-466:262" data-file-name="app/admin/page.tsx">
                          Cancel
                        </button>
                        <button type="submit" className="py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500" data-unique-id="f208a6f9-6b12-49b0-a4fb-1f75ee5d1a5c" data-loc="469:24-469:248" data-file-name="app/admin/page.tsx">
                          {editingCard ? "Update Card" : "Add Card"}
                        </button>
                      </div>
                    </div>
                  </form>
                </div>
              </div>}
          </div>}
        
        {/* Customers Tab */}
        {activeTab === "customers" && <div data-unique-id="8bb6a2c2-2966-472b-aa98-757eb71f0361" data-loc="480:38-480:43" data-file-name="app/admin/page.tsx">
            <div className="mb-6" data-unique-id="c7b416c7-4bb4-4c1f-9c70-cec2cb2bfa99" data-loc="481:12-481:34" data-file-name="app/admin/page.tsx">
              <h2 className="text-xl font-semibold text-gray-900" data-unique-id="3165cf19-fb4d-4a6a-bf48-a3224f7887f7" data-loc="482:14-482:66" data-file-name="app/admin/page.tsx">Registered Customers</h2>
              <p className="text-gray-500 mt-1" data-unique-id="f51dacf4-419d-4087-996a-f361f7e0c02e" data-loc="483:14-483:48" data-file-name="app/admin/page.tsx">View all customer information</p>
            </div>
            
            <div className="bg-white shadow overflow-hidden sm:rounded-md" data-unique-id="b1090ae7-47fa-4bf8-847f-625f03be4731" data-loc="486:12-486:75" data-file-name="app/admin/page.tsx">
              <table className="min-w-full divide-y divide-gray-200" data-unique-id="4e6a2aef-8d0e-4ded-b6d3-010d079d3caa" data-loc="487:14-487:69" data-file-name="app/admin/page.tsx">
                <thead className="bg-gray-50" data-unique-id="9d1fc9d5-1d87-4328-92fd-c39454824a8f" data-loc="488:16-488:46" data-file-name="app/admin/page.tsx">
                  <tr data-unique-id="2a67dd94-4b7f-4f3f-8fb2-cc7d9a965070" data-loc="489:18-489:22" data-file-name="app/admin/page.tsx">
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider" data-unique-id="5bed3f46-b46a-4f04-8258-eb82ffbd4e6a" data-loc="490:20-490:127" data-file-name="app/admin/page.tsx">
                      Customer
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider" data-unique-id="34834cb8-e409-4673-a28b-ee958e3baccf" data-loc="493:20-493:127" data-file-name="app/admin/page.tsx">
                      Contact
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider" data-unique-id="3b02ff0e-609a-419d-b733-a5beb25e5a9d" data-loc="496:20-496:127" data-file-name="app/admin/page.tsx">
                      CIBIL
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider" data-unique-id="2137f26a-28f7-4439-a3a1-43ab579f1ab0" data-loc="499:20-499:127" data-file-name="app/admin/page.tsx">
                      Registered By
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider" data-unique-id="02ec5ceb-4cfd-4a9c-8433-f3e98ec48bba" data-loc="502:20-502:127" data-file-name="app/admin/page.tsx">
                      Date
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200" data-unique-id="7db706b8-9064-4c70-af3a-1c9d6c363f5d" data-loc="507:16-507:69" data-file-name="app/admin/page.tsx">
                  {/* Customer data will be fetched from API */}
                  <tr data-unique-id="d3498084-cf84-4d87-b227-408bebf9ec1b" data-loc="509:18-509:22" data-file-name="app/admin/page.tsx">
                    <td colSpan={5} className="px-6 py-4 text-center text-gray-500" data-unique-id="7ccf0ab4-396a-43ab-b480-e2f066dbb76f" data-loc="510:20-510:84" data-file-name="app/admin/page.tsx">
                      Customer data will be available via API
                    </td>
                  </tr>
                </tbody>
              </table>
              
              {/* Empty state handled above */}
            </div>
          </div>}
        
        {/* Activity Logs Tab */}
        {activeTab === "logs" && <div data-unique-id="c09cdb78-2556-4713-a668-05e06cd34df7" data-loc="522:33-522:38" data-file-name="app/admin/page.tsx">
            <div className="mb-6" data-unique-id="5f034ac1-6c09-40e5-84d3-eb9ac30947ce" data-loc="523:12-523:34" data-file-name="app/admin/page.tsx">
              <h2 className="text-xl font-semibold text-gray-900" data-unique-id="d573d4e9-1555-4922-8ce6-8d54c01db18a" data-loc="524:14-524:66" data-file-name="app/admin/page.tsx">Activity Logs</h2>
              <p className="text-gray-500 mt-1" data-unique-id="5f5e9d44-44ce-4405-bad6-c5ecf8b4bf12" data-loc="525:14-525:48" data-file-name="app/admin/page.tsx">Track all system activities</p>
            </div>
            
            <div className="bg-white shadow overflow-hidden sm:rounded-md" data-unique-id="2c1b6faa-3b45-4003-85e4-7b4b98b24855" data-loc="528:12-528:75" data-file-name="app/admin/page.tsx">
              <table className="min-w-full divide-y divide-gray-200" data-unique-id="9a34b199-6aac-470a-81c8-cb8ba2359f83" data-loc="529:14-529:69" data-file-name="app/admin/page.tsx">
                <thead className="bg-gray-50" data-unique-id="b0223d23-dbd8-4177-a7f0-2f489df4effa" data-loc="530:16-530:46" data-file-name="app/admin/page.tsx">
                  <tr data-unique-id="3b9b6d4a-c8ae-4134-864a-1eb692ab9eec" data-loc="531:18-531:22" data-file-name="app/admin/page.tsx">
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider" data-unique-id="77109cca-c983-4100-836d-373ebb90c64e" data-loc="532:20-532:127" data-file-name="app/admin/page.tsx">
                      Timestamp
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider" data-unique-id="b98515b9-4781-4f93-9154-17163dca6649" data-loc="535:20-535:127" data-file-name="app/admin/page.tsx">
                      Action
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider" data-unique-id="8a39769c-1066-4940-9c6e-6637d23c0039" data-loc="538:20-538:127" data-file-name="app/admin/page.tsx">
                      Agent
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider" data-unique-id="d9106026-2d0b-4631-8c06-7b6d17146c03" data-loc="541:20-541:127" data-file-name="app/admin/page.tsx">
                      Customer
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider" data-unique-id="e577c264-6ada-43b4-9cff-fcdeba006845" data-loc="544:20-544:127" data-file-name="app/admin/page.tsx">
                      Details
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200" data-unique-id="048e6b42-3901-43b6-bba1-92d6a5ebb71f" data-loc="549:16-549:69" data-file-name="app/admin/page.tsx">
                  {/* Activity logs will be fetched from API */}
                  <tr data-unique-id="9bae3c1c-a99c-4d04-85d4-0d4bdae7d15e" data-loc="551:18-551:22" data-file-name="app/admin/page.tsx">
                    <td colSpan={5} className="px-6 py-4 text-center text-gray-500" data-unique-id="ebacb1bb-b9c2-4101-b32c-dc2050ae5cc1" data-loc="552:20-552:84" data-file-name="app/admin/page.tsx">
                      Activity logs will be available via API
                    </td>
                  </tr>
                </tbody>
              </table>
              
              {/* Empty state handled above */}
            </div>
            
            {/* Export Button */}
            <div className="mt-6 flex justify-end" data-unique-id="3efddb6d-c7fa-4c4e-b915-9688d3952342" data-loc="563:12-563:51" data-file-name="app/admin/page.tsx">
              <button onClick={() => {
            // In a real app, this would generate a CSV export
            toast.success("Data exported successfully (simulated)");
          }} className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500" data-unique-id="b058524c-e30a-4c1e-86d5-b04426ddc772" data-loc="564:14-567:243" data-file-name="app/admin/page.tsx">
                Export to CSV
              </button>
            </div>
            
            {/* Admin Phones Manager */}
            <div className="mt-8" data-unique-id="3ccfaa40-04b9-4b98-83bf-b99f3c2f65c0" data-loc="573:12-573:34" data-file-name="app/admin/page.tsx">
              <AdminPhonesManager />
            </div>
          </div>}
      </main>
    </div>;
}