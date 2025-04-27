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
    return <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8" data-unique-id="a22853c9-5874-4c48-8985-a26a668b1dc2" data-loc="190:11-190:112" data-file-name="app/admin/page.tsx">
        <div className="max-w-md w-full space-y-8" data-unique-id="522bbed0-b88e-4dd3-9ab2-7f7e7887c734" data-loc="191:8-191:51" data-file-name="app/admin/page.tsx">
          <div data-unique-id="c4a02265-0b19-40a3-9c41-fa68aa865321" data-loc="192:10-192:15" data-file-name="app/admin/page.tsx">
            <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900" data-unique-id="76566c4d-2f19-4772-87c2-2fc98debd89d" data-loc="193:12-193:83" data-file-name="app/admin/page.tsx">
              Admin Login
            </h2>
            <p className="mt-2 text-center text-sm text-gray-600" data-unique-id="3dd5e9af-53f0-4e68-a684-a7f0a6614126" data-loc="196:12-196:66" data-file-name="app/admin/page.tsx">
              Access the admin dashboard
            </p>
          </div>
          
          <DemoLoginInfo type="admin" />
          
          {!isOtpSent ? <div className="mt-8 space-y-6" data-unique-id="92e1c906-c975-4db7-b93f-e398e2d33d3b" data-loc="203:24-203:56" data-file-name="app/admin/page.tsx">
              <div className="rounded-md shadow-sm" data-unique-id="69fca91b-6f20-4529-80e7-a5cd89c05a8e" data-loc="204:14-204:52" data-file-name="app/admin/page.tsx">
                <div data-unique-id="eeb29118-ba31-4fcc-87b8-45de8eb71aa2" data-loc="205:16-205:21" data-file-name="app/admin/page.tsx">
                  <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-1" data-unique-id="a798ae33-7545-4863-901f-5089f10a5b1b" data-loc="206:18-206:98" data-file-name="app/admin/page.tsx">
                    Phone Number
                  </label>
                  <div className="relative" data-unique-id="49c4bbe7-0ef7-490a-8fe9-0d41c4c7f34a" data-loc="209:18-209:44" data-file-name="app/admin/page.tsx">
                    <span className="absolute left-3 top-3 text-gray-500" data-unique-id="4836576e-b05a-4e05-bc47-20fa4b294e19" data-loc="210:20-210:74" data-file-name="app/admin/page.tsx">+91</span>
                    <input id="phone" name="phone" type="tel" maxLength={10} value={phone} onChange={e => setPhone(e.target.value)} className="appearance-none block w-full pl-10 px-3 py-2 border border-gray-300 rounded-md placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm" placeholder="Enter admin phone number" data-unique-id="c2ebda88-080f-44d3-890a-2c0b01a25325" data-loc="211:20-211:371" data-file-name="app/admin/page.tsx" />
                  </div>
                  <p className="mt-1 text-xs text-gray-500 font-medium" data-unique-id="f8fe8974-3360-4bfb-a981-5f49663b14a5" data-loc="213:18-213:72" data-file-name="app/admin/page.tsx">
                    Demo admin: 8076492495 (pre-filled)
                  </p>
                </div>
              </div>
              
              <div data-unique-id="672e87d5-cb74-4499-a2f6-852885049007" data-loc="219:14-219:19" data-file-name="app/admin/page.tsx">
                <button type="button" onClick={handleSendOtp} className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500" data-unique-id="1fbdde6e-ec65-4fde-ab98-0621ef21bf5f" data-loc="220:16-220:296" data-file-name="app/admin/page.tsx">
                  Send OTP
                </button>
              </div>
            </div> : <form className="mt-8 space-y-6" onSubmit={handleLogin} data-unique-id="94bb1300-0614-4d72-84be-ef8261c5a904" data-loc="224:21-224:77" data-file-name="app/admin/page.tsx">
              <div className="rounded-md shadow-sm" data-unique-id="9da37d44-e8d6-4b5c-82b4-e5ea1412139f" data-loc="225:14-225:52" data-file-name="app/admin/page.tsx">
                <div data-unique-id="380d5df7-ba38-4fa5-bc70-f05c47546a5d" data-loc="226:16-226:21" data-file-name="app/admin/page.tsx">
                  <label htmlFor="otp" className="block text-sm font-medium text-gray-700 mb-1" data-unique-id="069d14d9-a80b-453c-9cf2-9b415fffbc0a" data-loc="227:18-227:96" data-file-name="app/admin/page.tsx">
                    One-Time Password
                  </label>
                  <input id="otp" name="otp" type="text" maxLength={6} value={otp} onChange={e => setOtp(e.target.value)} className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm" placeholder="Enter 6-digit OTP" required data-unique-id="1a33abdc-7548-47d6-8435-af8235904cd4" data-loc="230:18-230:357" data-file-name="app/admin/page.tsx" />
                </div>
                
                {generatedOtp && <div className="mt-2 bg-green-50 border border-green-200 rounded p-2" data-unique-id="9f4cdc34-9331-4ae5-ac33-242853b91f26" data-loc="233:33-233:103" data-file-name="app/admin/page.tsx">
                    <p className="text-sm font-medium text-green-800" data-unique-id="d328e56a-8138-4f32-9480-de6cd67771a6" data-loc="234:20-234:70" data-file-name="app/admin/page.tsx">Demo Admin OTP: <span className="font-bold" data-unique-id="03b89ed7-0bdf-434e-a0f6-7b9604aa1238" data-loc="234:86-234:114" data-file-name="app/admin/page.tsx">{generatedOtp}</span></p>
                    <p className="text-xs text-green-700 mt-1" data-unique-id="e383d28a-58cd-45a6-9f12-25514b15e659" data-loc="235:20-235:63" data-file-name="app/admin/page.tsx">Use this code to log in as admin</p>
                  </div>}
                
                <div className="flex justify-between mt-2 text-sm" data-unique-id="6db29e5e-de40-4e47-9263-aa1fa447c354" data-loc="238:16-238:67" data-file-name="app/admin/page.tsx">
                  <span className="text-gray-500" data-unique-id="0e96d734-4117-4146-9fc4-bda640b6faa9" data-loc="239:18-239:50" data-file-name="app/admin/page.tsx">
                    OTP sent to: +91 {phone}
                  </span>
                  {otpCountdown > 0 ? <span className="text-gray-500" data-unique-id="968535ac-c81e-438a-9df8-d5ef9df0cbff" data-loc="242:38-242:70" data-file-name="app/admin/page.tsx">Resend in {otpCountdown}s</span> : <button type="button" className="text-blue-600 hover:text-blue-800" onClick={handleSendOtp} data-unique-id="417e6ccc-2283-4aa0-a827-c46e7bd61ab1" data-loc="242:105-242:197" data-file-name="app/admin/page.tsx">
                      Resend OTP
                    </button>}
                </div>
              </div>
              
              <div className="flex space-x-4" data-unique-id="13373eb3-dac6-49e2-bd9d-1ea1d8da6bb8" data-loc="248:14-248:46" data-file-name="app/admin/page.tsx">
                <button type="button" onClick={() => setIsOtpSent(false)} className="py-2 px-4 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 flex-1" data-unique-id="4756a89c-f54c-42de-82c0-a2318125a92c" data-loc="249:16-249:279" data-file-name="app/admin/page.tsx">
                  Back
                </button>
                <button type="submit" className="py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 flex-1" data-unique-id="b6e026a6-fe14-48e9-b0d4-7dac171aacf1" data-loc="252:16-252:247" data-file-name="app/admin/page.tsx">
                  Verify & Login
                </button>
              </div>
            </form>}
          
          <div className="text-center mt-4" data-unique-id="e6d8c2fe-e79b-4fb1-a70c-7ec77321e5bd" data-loc="258:10-258:44" data-file-name="app/admin/page.tsx">
            <a href="/" className="font-medium text-blue-600 hover:text-blue-500" data-unique-id="bbead7a4-2524-49fc-85d8-0d91ce275f83" data-loc="259:12-259:82" data-file-name="app/admin/page.tsx">
              Back to sales agent login
            </a>
          </div>
        </div>
      </div>;
  }
  return <div className="min-h-screen bg-gray-50" data-unique-id="ef0094c8-201d-4bba-b0ac-a4b6cceb5c61" data-loc="266:9-266:50" data-file-name="app/admin/page.tsx">
      {/* Header */}
      <header className="bg-white shadow" data-unique-id="56e12aff-51d2-468c-a253-05dd0717dd25" data-loc="268:6-268:42" data-file-name="app/admin/page.tsx">
        <div className="max-w-7xl mx-auto px-4 py-4 sm:px-6 flex justify-between items-center" data-unique-id="dcce28d8-6573-419e-814e-a058b634ec4a" data-loc="269:8-269:95" data-file-name="app/admin/page.tsx">
          <h1 className="text-2xl font-bold text-gray-900" data-unique-id="c6ba272f-646a-4c39-9a61-152f36071e1e" data-loc="270:10-270:59" data-file-name="app/admin/page.tsx">CardSales Pro - Admin</h1>
          <button onClick={handleLogout} className="flex items-center text-sm font-medium text-red-600 hover:text-red-800" data-unique-id="5bd40bbc-9fbd-4266-ac97-573788ac9924" data-loc="271:10-271:123" data-file-name="app/admin/page.tsx">
            <LogOut className="h-4 w-4 mr-1" /> Logout
          </button>
        </div>
      </header>
      
      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 py-8 sm:px-6" data-unique-id="b672a138-92e4-41bf-a69d-31d82467fa51" data-loc="278:6-278:60" data-file-name="app/admin/page.tsx">
        {/* Tabs */}
        <div className="flex border-b border-gray-200 mb-6" data-unique-id="ed920706-3565-453d-9d10-16929e493cf9" data-loc="280:8-280:60" data-file-name="app/admin/page.tsx">
          <button className={cn("py-4 px-6 text-sm font-medium", activeTab === "cards" ? "border-b-2 border-blue-500 text-blue-600" : "text-gray-500 hover:text-gray-700 hover:border-gray-300")} onClick={() => setActiveTab("cards")} data-unique-id="caa2fde1-f791-48b6-a171-f74a7e4e23fe" data-loc="281:10-281:232" data-file-name="app/admin/page.tsx">
            <div className="flex items-center" data-unique-id="449141e3-4f19-41be-8675-401bc4324146" data-loc="282:12-282:47" data-file-name="app/admin/page.tsx">
              <CreditCard className="h-5 w-5 mr-2" /> Credit Cards
            </div>
          </button>
          <button className={cn("py-4 px-6 text-sm font-medium", activeTab === "customers" ? "border-b-2 border-blue-500 text-blue-600" : "text-gray-500 hover:text-gray-700 hover:border-gray-300")} onClick={() => setActiveTab("customers")} data-unique-id="0c2e1d17-a2ff-4ee8-8272-23be0818e467" data-loc="286:10-286:240" data-file-name="app/admin/page.tsx">
            <div className="flex items-center" data-unique-id="07051256-b48b-4962-83ad-dd1d6e9e07c2" data-loc="287:12-287:47" data-file-name="app/admin/page.tsx">
              <Users className="h-5 w-5 mr-2" /> Customers
            </div>
          </button>
          <button className={cn("py-4 px-6 text-sm font-medium", activeTab === "logs" ? "border-b-2 border-blue-500 text-blue-600" : "text-gray-500 hover:text-gray-700 hover:border-gray-300")} onClick={() => setActiveTab("logs")} data-unique-id="e35de0dd-cf7d-4d7e-b005-3f2e1bb7a1fb" data-loc="291:10-291:230" data-file-name="app/admin/page.tsx">
            <div className="flex items-center" data-unique-id="c0829420-31e8-42fb-a704-de968fbb99e8" data-loc="292:12-292:47" data-file-name="app/admin/page.tsx">
              <Activity className="h-5 w-5 mr-2" /> Activity Logs
            </div>
          </button>
          <a href="/admin/errors" className="py-4 px-6 text-sm font-medium text-gray-500 hover:text-gray-700 hover:border-gray-300" data-unique-id="3bac2aa0-67d0-43bc-9f02-be465179617f" data-loc="296:10-296:132" data-file-name="app/admin/page.tsx">
            <div className="flex items-center" data-unique-id="abd3b514-a95b-4b0a-9b74-69e491f2fc43" data-loc="297:12-297:47" data-file-name="app/admin/page.tsx">
              <AlertTriangle className="h-5 w-5 mr-2" /> Error Logs
            </div>
          </a>
        </div>
        
        {/* Credit Cards Tab */}
        {activeTab === "cards" && <div data-unique-id="4c978769-2f65-4514-babe-7afd131d83f8" data-loc="304:34-304:39" data-file-name="app/admin/page.tsx">
            <div className="flex justify-between items-center mb-6" data-unique-id="aab5a1b1-8548-47e1-ba12-c9d5b2c3d033" data-loc="305:12-305:68" data-file-name="app/admin/page.tsx">
              <h2 className="text-xl font-semibold text-gray-900" data-unique-id="9fb9ba0b-497f-4a7b-8af8-130a9d535deb" data-loc="306:14-306:66" data-file-name="app/admin/page.tsx">Credit Cards</h2>
              <button onClick={handleAddNewCard} className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500" data-unique-id="a2d46336-f99a-4645-ab8d-f07bf31d8ca5" data-loc="307:14-307:276" data-file-name="app/admin/page.tsx">
                <Plus className="h-4 w-4 mr-2" /> Add New Card
              </button>
            </div>
            
            {/* Filter and Search */}
            <div className="mb-6 flex" data-unique-id="29905d9e-a6bc-4e38-aeed-e190aaafe31b" data-loc="313:12-313:39" data-file-name="app/admin/page.tsx">
              <div className="relative flex-grow" data-unique-id="46db5c94-6748-443a-9022-4af16b37ab3a" data-loc="314:14-314:50" data-file-name="app/admin/page.tsx">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none" data-unique-id="7ba40dc3-9d34-4dc7-a745-5d83530f798c" data-loc="315:16-315:102" data-file-name="app/admin/page.tsx">
                  <Search className="h-5 w-5 text-gray-400" />
                </div>
                <input type="text" className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:placeholder-gray-400 focus:ring-1 focus:ring-blue-500 focus:border-blue-500 sm:text-sm" placeholder="Search cards by name or tag" value={filter} onChange={e => setFilter(e.target.value)} data-unique-id="9f92de86-213a-446e-b862-ce021a311d70" data-loc="318:16-318:363" data-file-name="app/admin/page.tsx" />
              </div>
            </div>
            
            {/* Cards List */}
            <div className="bg-white shadow overflow-hidden sm:rounded-md" data-unique-id="3202b14c-dbad-4163-9725-a8a465626d22" data-loc="323:12-323:75" data-file-name="app/admin/page.tsx">
              <table className="min-w-full divide-y divide-gray-200" data-unique-id="c20f5449-10c7-4c51-a1e5-6983919b3c2e" data-loc="324:14-324:69" data-file-name="app/admin/page.tsx">
                <thead className="bg-gray-50" data-unique-id="0cbafe69-3b39-4ae7-b89a-9269918f0092" data-loc="325:16-325:46" data-file-name="app/admin/page.tsx">
                  <tr data-unique-id="30b96eb9-4804-4769-be18-a4736436f661" data-loc="326:18-326:22" data-file-name="app/admin/page.tsx">
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer" onClick={() => handleSort("name")} data-unique-id="0664dfd4-0b1b-4220-8721-ff444d43e537" data-loc="327:20-327:177" data-file-name="app/admin/page.tsx">
                      <div className="flex items-center" data-unique-id="343fdd4d-0cf8-4953-9390-2fbf31f85251" data-loc="328:22-328:57" data-file-name="app/admin/page.tsx">
                        Name
                        {sortBy === "name" && (sortOrder === "asc" ? <ArrowUp className="w-4 h-4 ml-1" /> : <ArrowDown className="w-4 h-4 ml-1" />)}
                      </div>
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer" onClick={() => handleSort("minCibilScore")} data-unique-id="bb00fecd-3677-4ab3-9cd0-c0c2a2f897b5" data-loc="333:20-333:186" data-file-name="app/admin/page.tsx">
                      <div className="flex items-center" data-unique-id="3d0ddd1a-36d3-418f-8c49-8e74353da5eb" data-loc="334:22-334:57" data-file-name="app/admin/page.tsx">
                        Min CIBIL Score
                        {sortBy === "minCibilScore" && (sortOrder === "asc" ? <ArrowUp className="w-4 h-4 ml-1" /> : <ArrowDown className="w-4 h-4 ml-1" />)}
                      </div>
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider" data-unique-id="68668abc-8ff2-4ddc-87b3-e6a789190070" data-loc="339:20-339:127" data-file-name="app/admin/page.tsx">
                      Annual Fee
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider" data-unique-id="3f1dbd78-de4f-4ecf-9e22-115a90b19832" data-loc="342:20-342:127" data-file-name="app/admin/page.tsx">
                      Tags
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider" data-unique-id="1b2de022-754b-401d-b678-a13c6691eed1" data-loc="345:20-345:127" data-file-name="app/admin/page.tsx">
                      Status
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider" data-unique-id="00a133e1-3b3c-4494-834f-6f74df8224cb" data-loc="348:20-348:127" data-file-name="app/admin/page.tsx">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200" data-unique-id="e7f82882-ab81-4f00-bd32-8a0abee05d52" data-loc="353:16-353:69" data-file-name="app/admin/page.tsx">
                  {filteredCards.map(card => <tr key={card._id} data-unique-id="497948d6-5a2e-4077-9afe-b3950ad91270" data-loc="354:45-354:64" data-file-name="app/admin/page.tsx">
                      <td className="px-6 py-4 whitespace-nowrap" data-unique-id="8a257ccd-3410-4dd9-b7c4-3139f5337d7c" data-loc="355:22-355:66" data-file-name="app/admin/page.tsx">
                        <div className="text-sm font-medium text-gray-900" data-unique-id="9c4c0d3c-ed00-47a8-b4b9-8965bf5e37e7" data-loc="356:24-356:75" data-file-name="app/admin/page.tsx">{card.name}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap" data-unique-id="b226152a-b831-4c30-ad66-91cac0c180ed" data-loc="358:22-358:66" data-file-name="app/admin/page.tsx">
                        <div className="text-sm text-gray-500" data-unique-id="9bed0348-f1b8-4208-972a-6ad3796c54a6" data-loc="359:24-359:63" data-file-name="app/admin/page.tsx">{card.minCibilScore}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap" data-unique-id="54b85c43-40a8-4dd9-a0aa-aa29e8825648" data-loc="361:22-361:66" data-file-name="app/admin/page.tsx">
                        <div className="text-sm text-gray-500" data-unique-id="86feea83-5212-4022-9d00-8045bf075aaa" data-loc="362:24-362:63" data-file-name="app/admin/page.tsx">₹{card.annualFee}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap" data-unique-id="08edb582-8fbc-4c66-9bc8-8c6d5630a80f" data-loc="364:22-364:66" data-file-name="app/admin/page.tsx">
                        <div className="flex flex-wrap gap-1" data-unique-id="7eee1407-bedc-4d36-8ed7-e1c7c66b256b" data-loc="365:24-365:62" data-file-name="app/admin/page.tsx">
                          {card.tags.map((tag, idx) => <span key={idx} className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-blue-100 text-blue-800" data-unique-id="3efb6ca3-d3fa-461d-bd8e-3e816eca451b" data-loc="366:55-366:174" data-file-name="app/admin/page.tsx">
                              {tag}
                            </span>)}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap" data-unique-id="d87f4d85-8d7b-4d11-8f16-034065652f4e" data-loc="371:22-371:66" data-file-name="app/admin/page.tsx">
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${card.status === "active" ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"}`} data-unique-id="b64e18dc-f2b8-4178-8a8c-f682d62a1d47" data-loc="372:24-372:204" data-file-name="app/admin/page.tsx">
                          {card.status === "active" ? <CheckCircle className="w-3 h-3 mr-1" /> : <XCircle className="w-3 h-3 mr-1" />}
                          {card.status}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500" data-unique-id="3a6906ab-5d20-403c-a3fb-1b458d5d19d9" data-loc="377:22-377:88" data-file-name="app/admin/page.tsx">
                        <button onClick={() => handleEditCard(card)} className="text-blue-600 hover:text-blue-900 mr-4" data-unique-id="2d48af51-f0eb-4ae1-9dea-4a65ebe1c7ba" data-loc="378:24-378:120" data-file-name="app/admin/page.tsx">
                          <Edit className="h-4 w-4" />
                        </button>
                        <button onClick={() => handleDeleteCard(card._id)} className="text-red-600 hover:text-red-900" data-unique-id="7c49cd99-82b8-4a76-9808-d198a81d0863" data-loc="381:24-381:119" data-file-name="app/admin/page.tsx">
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </td>
                    </tr>)}
                </tbody>
              </table>
              
              {filteredCards.length === 0 && <div className="text-center py-8" data-unique-id="38d3de98-1fe6-4827-afba-7b76dbf8ed06" data-loc="389:45-389:79" data-file-name="app/admin/page.tsx">
                  <p className="text-gray-500" data-unique-id="875edb59-d4e1-4059-910b-dd324b62fb9f" data-loc="390:18-390:47" data-file-name="app/admin/page.tsx">No credit cards found</p>
                </div>}
            </div>
            
            {/* Card Form Modal */}
            {isFormOpen && <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50" data-unique-id="3b86f689-2453-4648-aebc-f1071ec1a0d2" data-loc="395:27-395:119" data-file-name="app/admin/page.tsx">
                <div className="bg-white rounded-lg p-8 max-w-2xl w-full max-h-screen overflow-y-auto" data-unique-id="cb312565-2fe9-42ae-96a2-c3060e0f15bd" data-loc="396:16-396:103" data-file-name="app/admin/page.tsx">
                  <h3 className="text-lg font-medium text-gray-900 mb-6" data-unique-id="69c7af93-678f-4f49-8958-d37d9dc929e4" data-loc="397:18-397:73" data-file-name="app/admin/page.tsx">
                    {editingCard ? "Edit Credit Card" : "Add New Credit Card"}
                  </h3>
                  
                  <form onSubmit={handleSubmitCard} data-unique-id="b9e33c7e-6d9b-4d30-afcb-ec20602e35d3" data-loc="401:18-401:52" data-file-name="app/admin/page.tsx">
                    <div className="space-y-6" data-unique-id="dc18b811-ca6d-427e-9c73-0d4abd6950ba" data-loc="402:20-402:47" data-file-name="app/admin/page.tsx">
                      <div data-unique-id="b7de10e5-2d86-4299-8ebd-f4cf8ad09e20" data-loc="403:22-403:27" data-file-name="app/admin/page.tsx">
                        <label htmlFor="name" className="block text-sm font-medium text-gray-700" data-unique-id="d33219e6-5b7a-437c-bcbf-0c3c80f1fe98" data-loc="404:24-404:98" data-file-name="app/admin/page.tsx">
                          Card Name
                        </label>
                        <input type="text" id="name" name="name" className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500" defaultValue={editingCard?.name ?? ""} required data-unique-id="0303c4d0-9b5e-486a-a55e-0e5eb313573d" data-loc="407:24-407:260" data-file-name="app/admin/page.tsx" />
                      </div>
                      
                      <div className="grid grid-cols-2 gap-4" data-unique-id="361f009d-6b34-4012-895a-f35b8b4007d3" data-loc="410:22-410:62" data-file-name="app/admin/page.tsx">
                        <div data-unique-id="c7bf4ed1-8a4d-455f-a40a-fbfc9887be4b" data-loc="411:24-411:29" data-file-name="app/admin/page.tsx">
                          <label htmlFor="minCibilScore" className="block text-sm font-medium text-gray-700" data-unique-id="56a5dbb5-291d-40f5-8a66-637bacced901" data-loc="412:26-412:109" data-file-name="app/admin/page.tsx">
                            Min CIBIL Score
                          </label>
                          <input type="number" id="minCibilScore" name="minCibilScore" min="300" max="900" className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500" defaultValue={editingCard?.minCibilScore ?? "700"} required data-unique-id="8d190cfb-ae6e-48a4-ab95-f301dc3a0f31" data-loc="415:26-415:314" data-file-name="app/admin/page.tsx" />
                        </div>
                        
                        <div data-unique-id="40cdc25c-fb7d-48bf-bd3f-d835c5c7f4ec" data-loc="418:24-418:29" data-file-name="app/admin/page.tsx">
                          <label htmlFor="annualFee" className="block text-sm font-medium text-gray-700" data-unique-id="160aec68-db24-47c0-8b96-cc53d97350e6" data-loc="419:26-419:105" data-file-name="app/admin/page.tsx">
                            Annual Fee (₹)
                          </label>
                          <input type="number" id="annualFee" name="annualFee" min="0" className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500" defaultValue={editingCard?.annualFee ?? "0"} required data-unique-id="a51bf4a0-2097-451b-8d99-583d1184c6c9" data-loc="422:26-422:288" data-file-name="app/admin/page.tsx" />
                        </div>
                      </div>
                      
                      <div data-unique-id="a3c4878f-fc3b-4c58-9c79-8fc3d6b6afc7" data-loc="426:22-426:27" data-file-name="app/admin/page.tsx">
                        <label htmlFor="utmLink" className="block text-sm font-medium text-gray-700" data-unique-id="64440482-b5bd-4473-a003-5fc7aef6eaa8" data-loc="427:24-427:101" data-file-name="app/admin/page.tsx">
                          UTM Link
                        </label>
                        <input type="url" id="utmLink" name="utmLink" className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500" defaultValue={editingCard?.utmLink ?? "https://example.com/card?utm=agent"} required data-unique-id="811c3e70-c875-4d44-a574-fadcc59c3365" data-loc="430:24-430:302" data-file-name="app/admin/page.tsx" />
                      </div>
                      
                      <div data-unique-id="216cec63-f0a8-4670-b343-18587a8f2a68" data-loc="433:22-433:27" data-file-name="app/admin/page.tsx">
                        <label htmlFor="benefits" className="block text-sm font-medium text-gray-700" data-unique-id="9a549a0d-b4a4-464d-8a59-4371ab0dfff5" data-loc="434:24-434:102" data-file-name="app/admin/page.tsx">
                          Benefits (one per line)
                        </label>
                        <textarea id="benefits" name="benefits" rows={4} className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500" defaultValue={editingCard?.benefits.join('\n') ?? ""} required data-unique-id="9e8492c9-5b06-4c43-855d-05a0d66f7d5f" data-loc="437:24-437:281" data-file-name="app/admin/page.tsx"></textarea>
                      </div>
                      
                      <div data-unique-id="0af0cf86-1058-4ba6-aea1-31b46f5d55bc" data-loc="440:22-440:27" data-file-name="app/admin/page.tsx">
                        <label htmlFor="tags" className="block text-sm font-medium text-gray-700" data-unique-id="514407ea-f541-4503-9e11-b6dcdf4a690d" data-loc="441:24-441:98" data-file-name="app/admin/page.tsx">
                          Tags (comma separated)
                        </label>
                        <input type="text" id="tags" name="tags" className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500" defaultValue={editingCard?.tags.join(', ') ?? ""} required data-unique-id="546c9ec0-3bae-47c1-b350-5cfb7a865613" data-loc="444:24-444:271" data-file-name="app/admin/page.tsx" />
                      </div>
                      
                      <div data-unique-id="1e78b593-9db5-4ed7-b113-0366356c6e1c" data-loc="447:22-447:27" data-file-name="app/admin/page.tsx">
                        <label htmlFor="imageUrl" className="block text-sm font-medium text-gray-700" data-unique-id="a1dac62a-c973-46cb-a4e8-0a5ed24c92a9" data-loc="448:24-448:102" data-file-name="app/admin/page.tsx">
                          Card Image URL
                        </label>
                        <input type="url" id="imageUrl" name="imageUrl" className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500" defaultValue={editingCard?.imageUrl ?? "https://images.unsplash.com/photo-1523281353252-5e14672131b0?q=80&w=500&auto=format&fit=crop"} data-unique-id="5ed018dd-62c5-43d8-bd9b-b67cd4e0b855" data-loc="451:24-451:354" data-file-name="app/admin/page.tsx" />
                        <p className="mt-1 text-sm text-gray-500" data-unique-id="abb91c6f-e066-4834-a9bf-472b84571c60" data-loc="452:24-452:66" data-file-name="app/admin/page.tsx">Leave empty for default image</p>
                      </div>
                      
                      <div data-unique-id="abd84b21-65f4-47b8-8758-98bb0df5d744" data-loc="455:22-455:27" data-file-name="app/admin/page.tsx">
                        <label htmlFor="status" className="block text-sm font-medium text-gray-700" data-unique-id="c321ae72-3824-4dcd-bbbd-8dce37d1595b" data-loc="456:24-456:100" data-file-name="app/admin/page.tsx">
                          Status
                        </label>
                        <select id="status" name="status" className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500" defaultValue={editingCard?.status ?? "active"} data-unique-id="c6c25456-8cf1-4ce5-920d-11ceb254bd4a" data-loc="459:24-459:250" data-file-name="app/admin/page.tsx">
                          <option value="active" data-unique-id="8412b9e5-5682-480b-8723-35b27991de0b" data-loc="460:26-460:49" data-file-name="app/admin/page.tsx">Active</option>
                          <option value="inactive" data-unique-id="e8ce993d-e483-48eb-ae3a-e5b3b6c324be" data-loc="461:26-461:51" data-file-name="app/admin/page.tsx">Inactive</option>
                        </select>
                      </div>
                      
                      <div className="flex justify-end space-x-3" data-unique-id="86ed9b7b-e747-4926-9149-b681754cbed1" data-loc="465:22-465:66" data-file-name="app/admin/page.tsx">
                        <button type="button" onClick={() => setIsFormOpen(false)} className="py-2 px-4 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500" data-unique-id="a20af990-3709-41c0-bef6-0f5d6d6e6a0a" data-loc="466:24-466:262" data-file-name="app/admin/page.tsx">
                          Cancel
                        </button>
                        <button type="submit" className="py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500" data-unique-id="1dd62200-b5a0-4217-bfc7-f22ea29ea52d" data-loc="469:24-469:248" data-file-name="app/admin/page.tsx">
                          {editingCard ? "Update Card" : "Add Card"}
                        </button>
                      </div>
                    </div>
                  </form>
                </div>
              </div>}
          </div>}
        
        {/* Customers Tab */}
        {activeTab === "customers" && <div data-unique-id="f27a413d-f296-442e-8726-10228e97667d" data-loc="480:38-480:43" data-file-name="app/admin/page.tsx">
            <div className="mb-6" data-unique-id="a865fb33-096e-42de-9281-5dd4ec6c0dc7" data-loc="481:12-481:34" data-file-name="app/admin/page.tsx">
              <h2 className="text-xl font-semibold text-gray-900" data-unique-id="82aaa663-cab1-4edf-9955-93f630c85d72" data-loc="482:14-482:66" data-file-name="app/admin/page.tsx">Registered Customers</h2>
              <p className="text-gray-500 mt-1" data-unique-id="0d09d2e3-6634-4707-8dde-dedfdd5a66e0" data-loc="483:14-483:48" data-file-name="app/admin/page.tsx">View all customer information</p>
            </div>
            
            <div className="bg-white shadow overflow-hidden sm:rounded-md" data-unique-id="cb34c54d-98cc-4270-8d25-4b58a3cf8937" data-loc="486:12-486:75" data-file-name="app/admin/page.tsx">
              <table className="min-w-full divide-y divide-gray-200" data-unique-id="b3f3cf18-cd19-4ce0-855d-27ad03ad552c" data-loc="487:14-487:69" data-file-name="app/admin/page.tsx">
                <thead className="bg-gray-50" data-unique-id="717f5da9-8865-4c84-a117-f55e99c97000" data-loc="488:16-488:46" data-file-name="app/admin/page.tsx">
                  <tr data-unique-id="6c33ee62-7bc0-408b-beef-412957ebad0f" data-loc="489:18-489:22" data-file-name="app/admin/page.tsx">
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider" data-unique-id="a42b1d8f-118a-4c1e-9963-e299f26cedb0" data-loc="490:20-490:127" data-file-name="app/admin/page.tsx">
                      Customer
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider" data-unique-id="e22da324-89c9-4761-b14c-5f5d5511cf38" data-loc="493:20-493:127" data-file-name="app/admin/page.tsx">
                      Contact
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider" data-unique-id="5dd08b20-6090-4699-9128-70e94e666c70" data-loc="496:20-496:127" data-file-name="app/admin/page.tsx">
                      CIBIL
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider" data-unique-id="644a0b02-355a-4879-a4a7-28ceb242e3a4" data-loc="499:20-499:127" data-file-name="app/admin/page.tsx">
                      Registered By
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider" data-unique-id="ca5512f2-51d5-4022-a634-117fa6763483" data-loc="502:20-502:127" data-file-name="app/admin/page.tsx">
                      Date
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200" data-unique-id="6df1da75-15b6-477d-9192-28017e230aed" data-loc="507:16-507:69" data-file-name="app/admin/page.tsx">
                  {/* Customer data will be fetched from API */}
                  <tr data-unique-id="9bfe3b00-3e88-43af-b66d-98f295176e6e" data-loc="509:18-509:22" data-file-name="app/admin/page.tsx">
                    <td colSpan={5} className="px-6 py-4 text-center text-gray-500" data-unique-id="7c05fd68-0e6f-4024-a1cd-cf6cf8d56956" data-loc="510:20-510:84" data-file-name="app/admin/page.tsx">
                      Customer data will be available via API
                    </td>
                  </tr>
                </tbody>
              </table>
              
              {/* Empty state handled above */}
            </div>
          </div>}
        
        {/* Activity Logs Tab */}
        {activeTab === "logs" && <div data-unique-id="46165ad3-1304-41c9-9c03-ed8d4ff69159" data-loc="522:33-522:38" data-file-name="app/admin/page.tsx">
            <div className="mb-6" data-unique-id="962cf52d-5d60-4816-95a6-826c16890e5c" data-loc="523:12-523:34" data-file-name="app/admin/page.tsx">
              <h2 className="text-xl font-semibold text-gray-900" data-unique-id="311b56a4-a583-416a-ae5e-ea1820be7a8c" data-loc="524:14-524:66" data-file-name="app/admin/page.tsx">Activity Logs</h2>
              <p className="text-gray-500 mt-1" data-unique-id="722016eb-6583-48c2-841f-c07ba1bda2eb" data-loc="525:14-525:48" data-file-name="app/admin/page.tsx">Track all system activities</p>
            </div>
            
            <div className="bg-white shadow overflow-hidden sm:rounded-md" data-unique-id="49b72ed9-c267-4756-8931-6b259f0b62e5" data-loc="528:12-528:75" data-file-name="app/admin/page.tsx">
              <table className="min-w-full divide-y divide-gray-200" data-unique-id="7124fcf9-c23b-4cd8-9476-54e6f48dba11" data-loc="529:14-529:69" data-file-name="app/admin/page.tsx">
                <thead className="bg-gray-50" data-unique-id="4efcc83f-507b-405e-8942-684eb196b8be" data-loc="530:16-530:46" data-file-name="app/admin/page.tsx">
                  <tr data-unique-id="015cd117-126e-49c8-81d6-fd1f4a64fad3" data-loc="531:18-531:22" data-file-name="app/admin/page.tsx">
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider" data-unique-id="05f13d5d-65c9-4491-9caa-8cf0fbf8f35a" data-loc="532:20-532:127" data-file-name="app/admin/page.tsx">
                      Timestamp
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider" data-unique-id="1bdb2405-5a2f-447a-b801-f8fcb32f8172" data-loc="535:20-535:127" data-file-name="app/admin/page.tsx">
                      Action
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider" data-unique-id="603829e8-bed6-42ee-8782-0b373649325a" data-loc="538:20-538:127" data-file-name="app/admin/page.tsx">
                      Agent
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider" data-unique-id="2b9553a7-768b-4cdd-ab88-3f53ca66b4a5" data-loc="541:20-541:127" data-file-name="app/admin/page.tsx">
                      Customer
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider" data-unique-id="c75c4516-0bd7-4513-9494-205917b3547f" data-loc="544:20-544:127" data-file-name="app/admin/page.tsx">
                      Details
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200" data-unique-id="7849195f-2d66-4255-99a9-1f495fa40615" data-loc="549:16-549:69" data-file-name="app/admin/page.tsx">
                  {/* Activity logs will be fetched from API */}
                  <tr data-unique-id="bc8dd994-2953-4c9b-b35a-bee94d4c7a15" data-loc="551:18-551:22" data-file-name="app/admin/page.tsx">
                    <td colSpan={5} className="px-6 py-4 text-center text-gray-500" data-unique-id="f45cd4e1-3eaa-4feb-a1b5-572a5b8c16ea" data-loc="552:20-552:84" data-file-name="app/admin/page.tsx">
                      Activity logs will be available via API
                    </td>
                  </tr>
                </tbody>
              </table>
              
              {/* Empty state handled above */}
            </div>
            
            {/* Export Button */}
            <div className="mt-6 flex justify-end" data-unique-id="3f3cae6b-2362-4b56-adba-0a8f88e684e0" data-loc="563:12-563:51" data-file-name="app/admin/page.tsx">
              <button onClick={() => {
            // In a real app, this would generate a CSV export
            toast.success("Data exported successfully (simulated)");
          }} className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500" data-unique-id="c9a3053c-abc4-4894-ba60-313bfd263596" data-loc="564:14-567:243" data-file-name="app/admin/page.tsx">
                Export to CSV
              </button>
            </div>
            
            {/* Admin Phones Manager */}
            <div className="mt-8" data-unique-id="3bcda8a0-3faf-42ba-9b28-6cc12863f278" data-loc="573:12-573:34" data-file-name="app/admin/page.tsx">
              <AdminPhonesManager />
            </div>
          </div>}
      </main>
    </div>;
}