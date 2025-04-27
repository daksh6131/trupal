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
    return <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8" data-unique-id="3ca5ca88-4073-49e7-a5d9-8131eada61c6" data-loc="190:11-190:112" data-file-name="app/admin/page.tsx">
        <div className="max-w-md w-full space-y-8" data-unique-id="4773ffd8-43a2-43eb-95c2-0dbc69b7ceee" data-loc="191:8-191:51" data-file-name="app/admin/page.tsx">
          <div data-unique-id="c730fcaf-7729-452a-8b10-dcc17a13b2ad" data-loc="192:10-192:15" data-file-name="app/admin/page.tsx">
            <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900" data-unique-id="7fdef047-50fd-4aaf-9de2-8a35728d3514" data-loc="193:12-193:83" data-file-name="app/admin/page.tsx">
              Admin Login
            </h2>
            <p className="mt-2 text-center text-sm text-gray-600" data-unique-id="295e4f43-6643-4496-85d1-dd31db7e9d8f" data-loc="196:12-196:66" data-file-name="app/admin/page.tsx">
              Access the admin dashboard
            </p>
          </div>
          
          <DemoLoginInfo type="admin" />
          
          {!isOtpSent ? <div className="mt-8 space-y-6" data-unique-id="be5eb03c-b0af-4c19-93d2-50b381af2fac" data-loc="203:24-203:56" data-file-name="app/admin/page.tsx">
              <div className="rounded-md shadow-sm" data-unique-id="3a591eef-85b0-43ba-b769-d4636134b82f" data-loc="204:14-204:52" data-file-name="app/admin/page.tsx">
                <div data-unique-id="283dddfd-d9f3-4ae5-9eb6-34bfb3f6073d" data-loc="205:16-205:21" data-file-name="app/admin/page.tsx">
                  <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-1" data-unique-id="c417d733-561d-409e-935a-eaed218b907e" data-loc="206:18-206:98" data-file-name="app/admin/page.tsx">
                    Phone Number
                  </label>
                  <div className="relative" data-unique-id="3e2cdb6c-a6b6-477f-8752-f463600a063f" data-loc="209:18-209:44" data-file-name="app/admin/page.tsx">
                    <span className="absolute left-3 top-3 text-gray-500" data-unique-id="4541725e-556b-49e0-a3ab-f65a9e00e4fa" data-loc="210:20-210:74" data-file-name="app/admin/page.tsx">+91</span>
                    <input id="phone" name="phone" type="tel" maxLength={10} value={phone} onChange={e => setPhone(e.target.value)} className="appearance-none block w-full pl-10 px-3 py-2 border border-gray-300 rounded-md placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm" placeholder="Enter admin phone number" data-unique-id="2f3cdafc-2b08-4e5b-ab47-b8dd20fa6ca5" data-loc="211:20-211:371" data-file-name="app/admin/page.tsx" />
                  </div>
                  <p className="mt-1 text-xs text-gray-500 font-medium" data-unique-id="f37ba4ea-eea1-446c-875f-b62155004a75" data-loc="213:18-213:72" data-file-name="app/admin/page.tsx">
                    Demo admin: 8076492495 (pre-filled)
                  </p>
                </div>
              </div>
              
              <div data-unique-id="5765bdb3-afb9-4f41-a9b5-f5487e255d56" data-loc="219:14-219:19" data-file-name="app/admin/page.tsx">
                <button type="button" onClick={handleSendOtp} className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500" data-unique-id="cb6e5a67-1e95-487c-8cb0-163aae5fa696" data-loc="220:16-220:296" data-file-name="app/admin/page.tsx">
                  Send OTP
                </button>
              </div>
            </div> : <form className="mt-8 space-y-6" onSubmit={handleLogin} data-unique-id="d031133e-e0eb-4ab5-a152-2c0ec1587ac2" data-loc="224:21-224:77" data-file-name="app/admin/page.tsx">
              <div className="rounded-md shadow-sm" data-unique-id="f1f14639-e10f-4669-b627-2aca1f5d1aad" data-loc="225:14-225:52" data-file-name="app/admin/page.tsx">
                <div data-unique-id="da21a273-088d-4ec2-a7b1-f19e4e56d800" data-loc="226:16-226:21" data-file-name="app/admin/page.tsx">
                  <label htmlFor="otp" className="block text-sm font-medium text-gray-700 mb-1" data-unique-id="2d71faef-ccc0-4201-918c-5207c65b7d5f" data-loc="227:18-227:96" data-file-name="app/admin/page.tsx">
                    One-Time Password
                  </label>
                  <input id="otp" name="otp" type="text" maxLength={6} value={otp} onChange={e => setOtp(e.target.value)} className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm" placeholder="Enter 6-digit OTP" required data-unique-id="208c1696-d979-4bb8-a7e8-20433cce092c" data-loc="230:18-230:357" data-file-name="app/admin/page.tsx" />
                </div>
                
                {generatedOtp && <div className="mt-2 bg-green-50 border border-green-200 rounded p-2" data-unique-id="f88b2108-f012-4df7-a60a-496e2db973ac" data-loc="233:33-233:103" data-file-name="app/admin/page.tsx">
                    <p className="text-sm font-medium text-green-800" data-unique-id="d85aa6fa-f44f-4d8b-82eb-ccf742d4a6b6" data-loc="234:20-234:70" data-file-name="app/admin/page.tsx">Demo Admin OTP: <span className="font-bold" data-unique-id="1d2dc613-05ec-4d8d-a268-b13b23619c10" data-loc="234:86-234:114" data-file-name="app/admin/page.tsx">{generatedOtp}</span></p>
                    <p className="text-xs text-green-700 mt-1" data-unique-id="f5aab557-cf89-490b-b996-f22e8a553189" data-loc="235:20-235:63" data-file-name="app/admin/page.tsx">Use this code to log in as admin</p>
                  </div>}
                
                <div className="flex justify-between mt-2 text-sm" data-unique-id="4e28cfec-266c-41c8-bb90-f1eb689937bf" data-loc="238:16-238:67" data-file-name="app/admin/page.tsx">
                  <span className="text-gray-500" data-unique-id="c96dabcd-f63c-40ca-81ec-b0800a61c797" data-loc="239:18-239:50" data-file-name="app/admin/page.tsx">
                    OTP sent to: +91 {phone}
                  </span>
                  {otpCountdown > 0 ? <span className="text-gray-500" data-unique-id="7d9cb30b-ebf8-461d-ab40-c5bc9d3de6f4" data-loc="242:38-242:70" data-file-name="app/admin/page.tsx">Resend in {otpCountdown}s</span> : <button type="button" className="text-blue-600 hover:text-blue-800" onClick={handleSendOtp} data-unique-id="875e77b3-448c-4ee3-853a-43c0c9ec9503" data-loc="242:105-242:197" data-file-name="app/admin/page.tsx">
                      Resend OTP
                    </button>}
                </div>
              </div>
              
              <div className="flex space-x-4" data-unique-id="603c2617-1bd0-4f8e-acba-aa618adc4c37" data-loc="248:14-248:46" data-file-name="app/admin/page.tsx">
                <button type="button" onClick={() => setIsOtpSent(false)} className="py-2 px-4 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 flex-1" data-unique-id="da4d9a6b-0d3d-40d3-a69a-62814e73c7a4" data-loc="249:16-249:279" data-file-name="app/admin/page.tsx">
                  Back
                </button>
                <button type="submit" className="py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 flex-1" data-unique-id="cff7090d-706b-4715-ba19-92952110a23f" data-loc="252:16-252:247" data-file-name="app/admin/page.tsx">
                  Verify & Login
                </button>
              </div>
            </form>}
          
          <div className="text-center mt-4" data-unique-id="6f7f2309-0948-40c1-906e-c72c56bcad74" data-loc="258:10-258:44" data-file-name="app/admin/page.tsx">
            <a href="/" className="font-medium text-blue-600 hover:text-blue-500" data-unique-id="9bfc8ea4-4011-4975-a1a4-3f43dc42597c" data-loc="259:12-259:82" data-file-name="app/admin/page.tsx">
              Back to sales agent login
            </a>
          </div>
        </div>
      </div>;
  }
  return <div className="min-h-screen bg-gray-50" data-unique-id="8bad6e09-ec59-44bf-9535-bc7835f6ada4" data-loc="266:9-266:50" data-file-name="app/admin/page.tsx">
      {/* Header */}
      <header className="bg-white shadow" data-unique-id="cb547d6a-2036-45dc-847d-3519a735c941" data-loc="268:6-268:42" data-file-name="app/admin/page.tsx">
        <div className="max-w-7xl mx-auto px-4 py-4 sm:px-6 flex justify-between items-center" data-unique-id="d6cd5792-358e-4a7b-a7b0-4d06726c6ab0" data-loc="269:8-269:95" data-file-name="app/admin/page.tsx">
          <h1 className="text-2xl font-bold text-gray-900" data-unique-id="59662f2e-1885-4e3f-ac31-43cd6af8154a" data-loc="270:10-270:59" data-file-name="app/admin/page.tsx">CardSales Pro - Admin</h1>
          <button onClick={handleLogout} className="flex items-center text-sm font-medium text-red-600 hover:text-red-800" data-unique-id="ef58f876-76a1-49b5-9253-4f9581e1174e" data-loc="271:10-271:123" data-file-name="app/admin/page.tsx">
            <LogOut className="h-4 w-4 mr-1" /> Logout
          </button>
        </div>
      </header>
      
      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 py-8 sm:px-6" data-unique-id="155ce48c-b50f-43a6-bf6d-317a44b0caec" data-loc="278:6-278:60" data-file-name="app/admin/page.tsx">
        {/* Tabs */}
        <div className="flex border-b border-gray-200 mb-6" data-unique-id="b8310453-e09e-4a1f-97b3-e52927aabd19" data-loc="280:8-280:60" data-file-name="app/admin/page.tsx">
          <button className={cn("py-4 px-6 text-sm font-medium", activeTab === "cards" ? "border-b-2 border-blue-500 text-blue-600" : "text-gray-500 hover:text-gray-700 hover:border-gray-300")} onClick={() => setActiveTab("cards")} data-unique-id="f34e070a-2d2a-4485-bea7-6b8bc9199382" data-loc="281:10-281:232" data-file-name="app/admin/page.tsx">
            <div className="flex items-center" data-unique-id="c3e2b81f-f2a0-47a6-a29a-9416a320e2e6" data-loc="282:12-282:47" data-file-name="app/admin/page.tsx">
              <CreditCard className="h-5 w-5 mr-2" /> Credit Cards
            </div>
          </button>
          <button className={cn("py-4 px-6 text-sm font-medium", activeTab === "customers" ? "border-b-2 border-blue-500 text-blue-600" : "text-gray-500 hover:text-gray-700 hover:border-gray-300")} onClick={() => setActiveTab("customers")} data-unique-id="20ff8f67-9770-423d-aba0-a56c480edfdc" data-loc="286:10-286:240" data-file-name="app/admin/page.tsx">
            <div className="flex items-center" data-unique-id="84877fc7-d607-4238-b514-01a9da6ca2cd" data-loc="287:12-287:47" data-file-name="app/admin/page.tsx">
              <Users className="h-5 w-5 mr-2" /> Customers
            </div>
          </button>
          <button className={cn("py-4 px-6 text-sm font-medium", activeTab === "logs" ? "border-b-2 border-blue-500 text-blue-600" : "text-gray-500 hover:text-gray-700 hover:border-gray-300")} onClick={() => setActiveTab("logs")} data-unique-id="2ac630d9-ffd5-4839-9a71-bf1dfc7232b4" data-loc="291:10-291:230" data-file-name="app/admin/page.tsx">
            <div className="flex items-center" data-unique-id="22b6e4d2-9189-4f5b-aea9-6495a530c363" data-loc="292:12-292:47" data-file-name="app/admin/page.tsx">
              <Activity className="h-5 w-5 mr-2" /> Activity Logs
            </div>
          </button>
          <a href="/admin/errors" className="py-4 px-6 text-sm font-medium text-gray-500 hover:text-gray-700 hover:border-gray-300" data-unique-id="7c5bc57f-2c2e-4be5-b85c-ad2bfd26843c" data-loc="296:10-296:132" data-file-name="app/admin/page.tsx">
            <div className="flex items-center" data-unique-id="13785160-f874-49a9-9ff0-0e3dd8bd8a4d" data-loc="297:12-297:47" data-file-name="app/admin/page.tsx">
              <AlertTriangle className="h-5 w-5 mr-2" /> Error Logs
            </div>
          </a>
        </div>
        
        {/* Credit Cards Tab */}
        {activeTab === "cards" && <div data-unique-id="fd7bee0e-fe0e-4720-88ac-934d539f3789" data-loc="304:34-304:39" data-file-name="app/admin/page.tsx">
            <div className="flex justify-between items-center mb-6" data-unique-id="34c4224e-beb0-4a53-9ba4-b52511cbc9c6" data-loc="305:12-305:68" data-file-name="app/admin/page.tsx">
              <h2 className="text-xl font-semibold text-gray-900" data-unique-id="a152e2e3-29da-458b-bfe5-07dbb81495b7" data-loc="306:14-306:66" data-file-name="app/admin/page.tsx">Credit Cards</h2>
              <button onClick={handleAddNewCard} className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500" data-unique-id="9de7917a-477e-441f-98f0-8144bce8f283" data-loc="307:14-307:276" data-file-name="app/admin/page.tsx">
                <Plus className="h-4 w-4 mr-2" /> Add New Card
              </button>
            </div>
            
            {/* Filter and Search */}
            <div className="mb-6 flex" data-unique-id="aab257a7-fad3-4939-bfec-9f71f0aa36a1" data-loc="313:12-313:39" data-file-name="app/admin/page.tsx">
              <div className="relative flex-grow" data-unique-id="ca05209e-d465-469d-ab08-4600447f36f1" data-loc="314:14-314:50" data-file-name="app/admin/page.tsx">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none" data-unique-id="4c7a36f3-636b-45ea-a88a-b88e751c726a" data-loc="315:16-315:102" data-file-name="app/admin/page.tsx">
                  <Search className="h-5 w-5 text-gray-400" />
                </div>
                <input type="text" className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:placeholder-gray-400 focus:ring-1 focus:ring-blue-500 focus:border-blue-500 sm:text-sm" placeholder="Search cards by name or tag" value={filter} onChange={e => setFilter(e.target.value)} data-unique-id="a2a982ae-0781-4a1a-b936-faabc0168b8f" data-loc="318:16-318:363" data-file-name="app/admin/page.tsx" />
              </div>
            </div>
            
            {/* Cards List */}
            <div className="bg-white shadow overflow-hidden sm:rounded-md" data-unique-id="b0304f4c-72b0-4f16-bbae-d275b3dba7ca" data-loc="323:12-323:75" data-file-name="app/admin/page.tsx">
              <table className="min-w-full divide-y divide-gray-200" data-unique-id="e757cbf5-25fd-4a94-8990-7669839e29d0" data-loc="324:14-324:69" data-file-name="app/admin/page.tsx">
                <thead className="bg-gray-50" data-unique-id="09eb65ac-b43f-4229-8c38-b8ebfbb9c19b" data-loc="325:16-325:46" data-file-name="app/admin/page.tsx">
                  <tr data-unique-id="cbed9e40-574f-451e-85e1-1a0eade26fdc" data-loc="326:18-326:22" data-file-name="app/admin/page.tsx">
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer" onClick={() => handleSort("name")} data-unique-id="a93b8966-babd-4fc8-b970-aa389e80c97f" data-loc="327:20-327:177" data-file-name="app/admin/page.tsx">
                      <div className="flex items-center" data-unique-id="865db7f6-875a-4bb8-a6a6-38bd8c878fa1" data-loc="328:22-328:57" data-file-name="app/admin/page.tsx">
                        Name
                        {sortBy === "name" && (sortOrder === "asc" ? <ArrowUp className="w-4 h-4 ml-1" /> : <ArrowDown className="w-4 h-4 ml-1" />)}
                      </div>
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer" onClick={() => handleSort("minCibilScore")} data-unique-id="b16ea064-d4d2-4017-b47b-c5c5bb52a088" data-loc="333:20-333:186" data-file-name="app/admin/page.tsx">
                      <div className="flex items-center" data-unique-id="7d64c23b-1af8-4e79-989b-9a5a2b87deba" data-loc="334:22-334:57" data-file-name="app/admin/page.tsx">
                        Min CIBIL Score
                        {sortBy === "minCibilScore" && (sortOrder === "asc" ? <ArrowUp className="w-4 h-4 ml-1" /> : <ArrowDown className="w-4 h-4 ml-1" />)}
                      </div>
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider" data-unique-id="7b9f64ac-03df-4d3b-be14-eaf8d5a98739" data-loc="339:20-339:127" data-file-name="app/admin/page.tsx">
                      Annual Fee
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider" data-unique-id="9d048a7e-f22b-47a5-a240-ca589e90ae3a" data-loc="342:20-342:127" data-file-name="app/admin/page.tsx">
                      Tags
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider" data-unique-id="a1c5e5e7-67d8-4c5d-803a-7fa97dd57211" data-loc="345:20-345:127" data-file-name="app/admin/page.tsx">
                      Status
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider" data-unique-id="574f3ce0-8009-4869-89cc-61fc6e5d165b" data-loc="348:20-348:127" data-file-name="app/admin/page.tsx">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200" data-unique-id="fee7f955-5c2c-4baa-a6a7-5969ef0a0f05" data-loc="353:16-353:69" data-file-name="app/admin/page.tsx">
                  {filteredCards.map(card => <tr key={card._id} data-unique-id="ad5654e0-b913-4b94-9471-3537a8a3f5ed" data-loc="354:45-354:64" data-file-name="app/admin/page.tsx">
                      <td className="px-6 py-4 whitespace-nowrap" data-unique-id="4eb64a9a-ed2b-43a6-a570-179df45ac638" data-loc="355:22-355:66" data-file-name="app/admin/page.tsx">
                        <div className="text-sm font-medium text-gray-900" data-unique-id="6e8d5641-314b-405d-af4a-e9ec6100ffac" data-loc="356:24-356:75" data-file-name="app/admin/page.tsx">{card.name}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap" data-unique-id="362f9bef-ae14-441f-911f-2fc4317d5e3d" data-loc="358:22-358:66" data-file-name="app/admin/page.tsx">
                        <div className="text-sm text-gray-500" data-unique-id="cda1a631-c808-46b4-8ff5-440081672f81" data-loc="359:24-359:63" data-file-name="app/admin/page.tsx">{card.minCibilScore}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap" data-unique-id="502eb5fc-6290-4ae8-8b93-ec2bd5ad29d7" data-loc="361:22-361:66" data-file-name="app/admin/page.tsx">
                        <div className="text-sm text-gray-500" data-unique-id="9ec7b962-5a30-45ac-8829-cd8c5d125201" data-loc="362:24-362:63" data-file-name="app/admin/page.tsx">₹{card.annualFee}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap" data-unique-id="74690e76-0158-4815-89f4-9f3b3ee0a1c3" data-loc="364:22-364:66" data-file-name="app/admin/page.tsx">
                        <div className="flex flex-wrap gap-1" data-unique-id="5379c631-63bf-4b2a-9f6e-c0a7efea836b" data-loc="365:24-365:62" data-file-name="app/admin/page.tsx">
                          {card.tags.map((tag, idx) => <span key={idx} className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-blue-100 text-blue-800" data-unique-id="b38198bd-48d7-461a-a952-9284292486c2" data-loc="366:55-366:174" data-file-name="app/admin/page.tsx">
                              {tag}
                            </span>)}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap" data-unique-id="7bb941b1-84af-42fc-9a5b-d30cb2625943" data-loc="371:22-371:66" data-file-name="app/admin/page.tsx">
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${card.status === "active" ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"}`} data-unique-id="ddb3b128-4e40-436a-99b8-c34ded0cbd28" data-loc="372:24-372:204" data-file-name="app/admin/page.tsx">
                          {card.status === "active" ? <CheckCircle className="w-3 h-3 mr-1" /> : <XCircle className="w-3 h-3 mr-1" />}
                          {card.status}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500" data-unique-id="70be0a60-503d-4be9-8b69-71842434875d" data-loc="377:22-377:88" data-file-name="app/admin/page.tsx">
                        <button onClick={() => handleEditCard(card)} className="text-blue-600 hover:text-blue-900 mr-4" data-unique-id="dff6cdea-5567-4ecd-ba39-8fe1cc08c72e" data-loc="378:24-378:120" data-file-name="app/admin/page.tsx">
                          <Edit className="h-4 w-4" />
                        </button>
                        <button onClick={() => handleDeleteCard(card._id)} className="text-red-600 hover:text-red-900" data-unique-id="f49dbdce-9340-40ac-8b2c-c2f057fc0428" data-loc="381:24-381:119" data-file-name="app/admin/page.tsx">
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </td>
                    </tr>)}
                </tbody>
              </table>
              
              {filteredCards.length === 0 && <div className="text-center py-8" data-unique-id="97bef012-fe20-40c7-949d-5b0bce9941b7" data-loc="389:45-389:79" data-file-name="app/admin/page.tsx">
                  <p className="text-gray-500" data-unique-id="aceb2e6a-13b5-4b91-8a2c-fcf43f704d6c" data-loc="390:18-390:47" data-file-name="app/admin/page.tsx">No credit cards found</p>
                </div>}
            </div>
            
            {/* Card Form Modal */}
            {isFormOpen && <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50" data-unique-id="e37d6712-7ff4-4bfa-8926-79ffdbc7900f" data-loc="395:27-395:119" data-file-name="app/admin/page.tsx">
                <div className="bg-white rounded-lg p-8 max-w-2xl w-full max-h-screen overflow-y-auto" data-unique-id="5ee659ba-ea9b-4a20-a59a-ead1ae64e676" data-loc="396:16-396:103" data-file-name="app/admin/page.tsx">
                  <h3 className="text-lg font-medium text-gray-900 mb-6" data-unique-id="5e999fa1-aff9-4168-b8c6-6dc003dc4f08" data-loc="397:18-397:73" data-file-name="app/admin/page.tsx">
                    {editingCard ? "Edit Credit Card" : "Add New Credit Card"}
                  </h3>
                  
                  <form onSubmit={handleSubmitCard} data-unique-id="991134f4-285a-4b41-beb7-34bf9e46fdfe" data-loc="401:18-401:52" data-file-name="app/admin/page.tsx">
                    <div className="space-y-6" data-unique-id="c09aa37f-589f-4b78-a78e-bff7c43336af" data-loc="402:20-402:47" data-file-name="app/admin/page.tsx">
                      <div data-unique-id="c1afe702-6f5c-47e6-a38d-c00154331e07" data-loc="403:22-403:27" data-file-name="app/admin/page.tsx">
                        <label htmlFor="name" className="block text-sm font-medium text-gray-700" data-unique-id="8721c001-5164-4b5a-929b-09065de3dd82" data-loc="404:24-404:98" data-file-name="app/admin/page.tsx">
                          Card Name
                        </label>
                        <input type="text" id="name" name="name" className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500" defaultValue={editingCard?.name ?? ""} required data-unique-id="c90c7036-2e5b-4b85-8922-79fea0f5b817" data-loc="407:24-407:260" data-file-name="app/admin/page.tsx" />
                      </div>
                      
                      <div className="grid grid-cols-2 gap-4" data-unique-id="d9a6dc65-31cb-451d-97dd-2c1cb97ef5f7" data-loc="410:22-410:62" data-file-name="app/admin/page.tsx">
                        <div data-unique-id="7d1071cb-d0a0-4878-901f-67c50e048a9f" data-loc="411:24-411:29" data-file-name="app/admin/page.tsx">
                          <label htmlFor="minCibilScore" className="block text-sm font-medium text-gray-700" data-unique-id="23ab7709-fa78-40c0-8401-3dfc13804b12" data-loc="412:26-412:109" data-file-name="app/admin/page.tsx">
                            Min CIBIL Score
                          </label>
                          <input type="number" id="minCibilScore" name="minCibilScore" min="300" max="900" className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500" defaultValue={editingCard?.minCibilScore ?? "700"} required data-unique-id="af03f6ec-54be-4697-a322-16108297e111" data-loc="415:26-415:314" data-file-name="app/admin/page.tsx" />
                        </div>
                        
                        <div data-unique-id="41ce0102-36ce-44d5-83f8-8010416655e3" data-loc="418:24-418:29" data-file-name="app/admin/page.tsx">
                          <label htmlFor="annualFee" className="block text-sm font-medium text-gray-700" data-unique-id="54816a5f-19f3-4bce-ab9b-3f4dbebb4de0" data-loc="419:26-419:105" data-file-name="app/admin/page.tsx">
                            Annual Fee (₹)
                          </label>
                          <input type="number" id="annualFee" name="annualFee" min="0" className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500" defaultValue={editingCard?.annualFee ?? "0"} required data-unique-id="145362a7-90ea-48ce-a1e5-5c10f06aa2ae" data-loc="422:26-422:288" data-file-name="app/admin/page.tsx" />
                        </div>
                      </div>
                      
                      <div data-unique-id="11c1b1ff-87a1-41cc-81de-5b890bf97f40" data-loc="426:22-426:27" data-file-name="app/admin/page.tsx">
                        <label htmlFor="utmLink" className="block text-sm font-medium text-gray-700" data-unique-id="d47f5153-c59e-4c6d-8313-d1db6cd4ff7a" data-loc="427:24-427:101" data-file-name="app/admin/page.tsx">
                          UTM Link
                        </label>
                        <input type="url" id="utmLink" name="utmLink" className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500" defaultValue={editingCard?.utmLink ?? "https://example.com/card?utm=agent"} required data-unique-id="0b44a714-6d6c-4897-bd46-7a5a5da40539" data-loc="430:24-430:302" data-file-name="app/admin/page.tsx" />
                      </div>
                      
                      <div data-unique-id="9b92fb1b-65f1-4603-894e-ecd1c0217710" data-loc="433:22-433:27" data-file-name="app/admin/page.tsx">
                        <label htmlFor="benefits" className="block text-sm font-medium text-gray-700" data-unique-id="d5eec613-e6bb-4642-b1a1-fc06ab8e74e2" data-loc="434:24-434:102" data-file-name="app/admin/page.tsx">
                          Benefits (one per line)
                        </label>
                        <textarea id="benefits" name="benefits" rows={4} className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500" defaultValue={editingCard?.benefits.join('\n') ?? ""} required data-unique-id="ec0e8ced-27b5-412a-b958-f551f4bdf92c" data-loc="437:24-437:281" data-file-name="app/admin/page.tsx"></textarea>
                      </div>
                      
                      <div data-unique-id="fd6abc24-8cf0-4a08-97c3-eb7407a3f536" data-loc="440:22-440:27" data-file-name="app/admin/page.tsx">
                        <label htmlFor="tags" className="block text-sm font-medium text-gray-700" data-unique-id="59064cfb-0922-4a44-86d9-8cc9039dc4a2" data-loc="441:24-441:98" data-file-name="app/admin/page.tsx">
                          Tags (comma separated)
                        </label>
                        <input type="text" id="tags" name="tags" className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500" defaultValue={editingCard?.tags.join(', ') ?? ""} required data-unique-id="8733a8ac-9942-412b-a956-b136bf376c5a" data-loc="444:24-444:271" data-file-name="app/admin/page.tsx" />
                      </div>
                      
                      <div data-unique-id="5b82aa5c-12d3-4b49-81c4-77aae3044ff3" data-loc="447:22-447:27" data-file-name="app/admin/page.tsx">
                        <label htmlFor="imageUrl" className="block text-sm font-medium text-gray-700" data-unique-id="638c73c3-41a7-412e-9454-ad722e27a4cf" data-loc="448:24-448:102" data-file-name="app/admin/page.tsx">
                          Card Image URL
                        </label>
                        <input type="url" id="imageUrl" name="imageUrl" className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500" defaultValue={editingCard?.imageUrl ?? "https://images.unsplash.com/photo-1523281353252-5e14672131b0?q=80&w=500&auto=format&fit=crop"} data-unique-id="5740e708-583c-4d1f-9ef4-caf0390cb903" data-loc="451:24-451:354" data-file-name="app/admin/page.tsx" />
                        <p className="mt-1 text-sm text-gray-500" data-unique-id="20bfdcd1-4f62-442c-939f-4f8d1413b758" data-loc="452:24-452:66" data-file-name="app/admin/page.tsx">Leave empty for default image</p>
                      </div>
                      
                      <div data-unique-id="872c5130-21ff-4552-ae6a-2bbe56bfd9bb" data-loc="455:22-455:27" data-file-name="app/admin/page.tsx">
                        <label htmlFor="status" className="block text-sm font-medium text-gray-700" data-unique-id="fe251e4b-ce07-4215-8d9e-6c2cf4f8b399" data-loc="456:24-456:100" data-file-name="app/admin/page.tsx">
                          Status
                        </label>
                        <select id="status" name="status" className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500" defaultValue={editingCard?.status ?? "active"} data-unique-id="cc451833-e5b3-4f39-9de7-1bc98534dc94" data-loc="459:24-459:250" data-file-name="app/admin/page.tsx">
                          <option value="active" data-unique-id="cde41a3f-04b8-4579-ba6e-526e23d9a8f6" data-loc="460:26-460:49" data-file-name="app/admin/page.tsx">Active</option>
                          <option value="inactive" data-unique-id="376215e2-1fb2-4371-9650-f50b8ebd4ff3" data-loc="461:26-461:51" data-file-name="app/admin/page.tsx">Inactive</option>
                        </select>
                      </div>
                      
                      <div className="flex justify-end space-x-3" data-unique-id="4e3b83c9-e2d4-4b4a-8ced-7a67381c097e" data-loc="465:22-465:66" data-file-name="app/admin/page.tsx">
                        <button type="button" onClick={() => setIsFormOpen(false)} className="py-2 px-4 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500" data-unique-id="85243a93-ac06-442d-be32-f2e818dcb327" data-loc="466:24-466:262" data-file-name="app/admin/page.tsx">
                          Cancel
                        </button>
                        <button type="submit" className="py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500" data-unique-id="b760da78-d840-45fc-96ae-5941bf7fb6d2" data-loc="469:24-469:248" data-file-name="app/admin/page.tsx">
                          {editingCard ? "Update Card" : "Add Card"}
                        </button>
                      </div>
                    </div>
                  </form>
                </div>
              </div>}
          </div>}
        
        {/* Customers Tab */}
        {activeTab === "customers" && <div data-unique-id="c6f29f4e-1de7-4f7e-a051-753b3f5203ef" data-loc="480:38-480:43" data-file-name="app/admin/page.tsx">
            <div className="mb-6" data-unique-id="39791bbb-1db2-44cd-8120-9cf792d9b177" data-loc="481:12-481:34" data-file-name="app/admin/page.tsx">
              <h2 className="text-xl font-semibold text-gray-900" data-unique-id="287148e0-ab56-4c0d-aa87-ec3f36a87719" data-loc="482:14-482:66" data-file-name="app/admin/page.tsx">Registered Customers</h2>
              <p className="text-gray-500 mt-1" data-unique-id="019679b6-9350-44a4-9f67-0f1b22059715" data-loc="483:14-483:48" data-file-name="app/admin/page.tsx">View all customer information</p>
            </div>
            
            <div className="bg-white shadow overflow-hidden sm:rounded-md" data-unique-id="8711c3bd-5b11-4c43-be03-6ba90588eec2" data-loc="486:12-486:75" data-file-name="app/admin/page.tsx">
              <table className="min-w-full divide-y divide-gray-200" data-unique-id="cec166f1-c2c0-446b-bedb-d5cfad4b1f8b" data-loc="487:14-487:69" data-file-name="app/admin/page.tsx">
                <thead className="bg-gray-50" data-unique-id="71bc7ec9-d9e7-4afa-94d2-7396358d2478" data-loc="488:16-488:46" data-file-name="app/admin/page.tsx">
                  <tr data-unique-id="f5c4d404-6293-4ba6-b7f2-2b2e539da68c" data-loc="489:18-489:22" data-file-name="app/admin/page.tsx">
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider" data-unique-id="a3d8ee05-76a8-462e-af44-90b7ae7ef411" data-loc="490:20-490:127" data-file-name="app/admin/page.tsx">
                      Customer
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider" data-unique-id="8798c1e8-4071-4fd8-ae47-8477c4705292" data-loc="493:20-493:127" data-file-name="app/admin/page.tsx">
                      Contact
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider" data-unique-id="9a5e3d9e-6c3a-490c-8a77-b128bc8eaef3" data-loc="496:20-496:127" data-file-name="app/admin/page.tsx">
                      CIBIL
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider" data-unique-id="34299fcf-219f-49f1-82ac-e1b50f4c16bf" data-loc="499:20-499:127" data-file-name="app/admin/page.tsx">
                      Registered By
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider" data-unique-id="c07b5af9-6a7a-4a64-acc8-577fb73dcd92" data-loc="502:20-502:127" data-file-name="app/admin/page.tsx">
                      Date
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200" data-unique-id="e8d9fe0b-172b-4671-892f-c6aa68a424c5" data-loc="507:16-507:69" data-file-name="app/admin/page.tsx">
                  {/* Customer data will be fetched from API */}
                  <tr data-unique-id="41de3f75-6a61-4211-a011-fc8c6f61f5de" data-loc="509:18-509:22" data-file-name="app/admin/page.tsx">
                    <td colSpan={5} className="px-6 py-4 text-center text-gray-500" data-unique-id="3e7d7fdd-1c31-4efe-9f91-7459b34edfa5" data-loc="510:20-510:84" data-file-name="app/admin/page.tsx">
                      Customer data will be available via API
                    </td>
                  </tr>
                </tbody>
              </table>
              
              {/* Empty state handled above */}
            </div>
          </div>}
        
        {/* Activity Logs Tab */}
        {activeTab === "logs" && <div data-unique-id="3e80d2a1-06ab-4313-b146-a37a44ffaa29" data-loc="522:33-522:38" data-file-name="app/admin/page.tsx">
            <div className="mb-6" data-unique-id="b1952bef-c9a7-43fb-a347-936a37ee98b6" data-loc="523:12-523:34" data-file-name="app/admin/page.tsx">
              <h2 className="text-xl font-semibold text-gray-900" data-unique-id="e47fc0fc-6e34-47b8-b64b-20a1d274949f" data-loc="524:14-524:66" data-file-name="app/admin/page.tsx">Activity Logs</h2>
              <p className="text-gray-500 mt-1" data-unique-id="807045e6-bf51-4ced-a8c6-f7656f51c46a" data-loc="525:14-525:48" data-file-name="app/admin/page.tsx">Track all system activities</p>
            </div>
            
            <div className="bg-white shadow overflow-hidden sm:rounded-md" data-unique-id="08eaf762-9022-4850-8378-d50e387a09fe" data-loc="528:12-528:75" data-file-name="app/admin/page.tsx">
              <table className="min-w-full divide-y divide-gray-200" data-unique-id="4b4a7c80-d0e1-41e2-bdd7-0da195cc5fa9" data-loc="529:14-529:69" data-file-name="app/admin/page.tsx">
                <thead className="bg-gray-50" data-unique-id="5696d4b2-4e3b-4f53-92cc-f9d2bdfea2c1" data-loc="530:16-530:46" data-file-name="app/admin/page.tsx">
                  <tr data-unique-id="8368a0ec-225a-441d-bfe2-2d84d4955acd" data-loc="531:18-531:22" data-file-name="app/admin/page.tsx">
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider" data-unique-id="7e60b1ce-912e-4080-81ff-d2221daf53c4" data-loc="532:20-532:127" data-file-name="app/admin/page.tsx">
                      Timestamp
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider" data-unique-id="68f47e5e-ddeb-44ed-b519-d07f4edcdb76" data-loc="535:20-535:127" data-file-name="app/admin/page.tsx">
                      Action
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider" data-unique-id="97a697ac-c49d-4e9f-9790-b28f41c9cc04" data-loc="538:20-538:127" data-file-name="app/admin/page.tsx">
                      Agent
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider" data-unique-id="db84ea39-3ef9-468e-9b1c-d839f7ef74f7" data-loc="541:20-541:127" data-file-name="app/admin/page.tsx">
                      Customer
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider" data-unique-id="ba84149d-c983-4995-b3ef-7aa7f5a87a5c" data-loc="544:20-544:127" data-file-name="app/admin/page.tsx">
                      Details
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200" data-unique-id="1f3ddc44-6277-4f9f-876a-d6740a55fd78" data-loc="549:16-549:69" data-file-name="app/admin/page.tsx">
                  {/* Activity logs will be fetched from API */}
                  <tr data-unique-id="e43e1313-a388-4ebb-920f-67db5ffc9bba" data-loc="551:18-551:22" data-file-name="app/admin/page.tsx">
                    <td colSpan={5} className="px-6 py-4 text-center text-gray-500" data-unique-id="38228ea7-4ef2-4c31-8b05-c4ff680a8304" data-loc="552:20-552:84" data-file-name="app/admin/page.tsx">
                      Activity logs will be available via API
                    </td>
                  </tr>
                </tbody>
              </table>
              
              {/* Empty state handled above */}
            </div>
            
            {/* Export Button */}
            <div className="mt-6 flex justify-end" data-unique-id="5dc1a8fa-2f3f-47f9-8728-d7dcda7b014c" data-loc="563:12-563:51" data-file-name="app/admin/page.tsx">
              <button onClick={() => {
            // In a real app, this would generate a CSV export
            toast.success("Data exported successfully (simulated)");
          }} className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500" data-unique-id="b9ba41e0-c145-4987-a385-dee59491f20e" data-loc="564:14-567:243" data-file-name="app/admin/page.tsx">
                Export to CSV
              </button>
            </div>
            
            {/* Admin Phones Manager */}
            <div className="mt-8" data-unique-id="6e141735-f2b1-498b-bafb-63c8319e44ef" data-loc="573:12-573:34" data-file-name="app/admin/page.tsx">
              <AdminPhonesManager />
            </div>
          </div>}
      </main>
    </div>;
}