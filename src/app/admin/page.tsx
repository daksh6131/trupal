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
    return <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8" data-unique-id="3bd3b13d-9180-49e2-b50e-25d236d143af" data-loc="190:11-190:112" data-file-name="app/admin/page.tsx">
        <div className="max-w-md w-full space-y-8" data-unique-id="50d639c1-c37a-4f02-9130-7e22bb93a4d7" data-loc="191:8-191:51" data-file-name="app/admin/page.tsx">
          <div data-unique-id="0c2a4e8a-e234-4286-9514-797372d93d06" data-loc="192:10-192:15" data-file-name="app/admin/page.tsx">
            <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900" data-unique-id="fe1c195a-9922-4cd5-a4ae-09690dfca805" data-loc="193:12-193:83" data-file-name="app/admin/page.tsx">
              Admin Login
            </h2>
            <p className="mt-2 text-center text-sm text-gray-600" data-unique-id="59c18ad2-f4fe-4fb0-9903-d0d92dac318a" data-loc="196:12-196:66" data-file-name="app/admin/page.tsx">
              Access the admin dashboard
            </p>
          </div>
          
          <DemoLoginInfo type="admin" />
          
          {!isOtpSent ? <div className="mt-8 space-y-6" data-unique-id="a72faae4-8680-4f7f-a585-cb7aad0f020b" data-loc="203:24-203:56" data-file-name="app/admin/page.tsx">
              <div className="rounded-md shadow-sm" data-unique-id="d11960da-6b23-446c-ba58-e3c5c4418dbb" data-loc="204:14-204:52" data-file-name="app/admin/page.tsx">
                <div data-unique-id="a5817436-82dd-47dd-95c4-2f9711a1ad7f" data-loc="205:16-205:21" data-file-name="app/admin/page.tsx">
                  <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-1" data-unique-id="ad4b3709-ad60-406c-af19-e005eb6405cb" data-loc="206:18-206:98" data-file-name="app/admin/page.tsx">
                    Phone Number
                  </label>
                  <div className="relative" data-unique-id="492f9e87-abe5-403d-97ed-d4fa56c5749e" data-loc="209:18-209:44" data-file-name="app/admin/page.tsx">
                    <span className="absolute left-3 top-3 text-gray-500" data-unique-id="b7a24494-a373-4ec5-ab02-ad08c0b482be" data-loc="210:20-210:74" data-file-name="app/admin/page.tsx">+91</span>
                    <input id="phone" name="phone" type="tel" maxLength={10} value={phone} onChange={e => setPhone(e.target.value)} className="appearance-none block w-full pl-10 px-3 py-2 border border-gray-300 rounded-md placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm" placeholder="Enter admin phone number" data-unique-id="55b34efc-74ac-4a23-a19c-568229b15422" data-loc="211:20-211:371" data-file-name="app/admin/page.tsx" />
                  </div>
                  <p className="mt-1 text-xs text-gray-500 font-medium" data-unique-id="74f487f2-6c0d-4c6b-b914-5c3a86b8b629" data-loc="213:18-213:72" data-file-name="app/admin/page.tsx">
                    Demo admin: 8076492495 (pre-filled)
                  </p>
                </div>
              </div>
              
              <div data-unique-id="6df34151-0653-4ba8-b799-c0ab5ee740f8" data-loc="219:14-219:19" data-file-name="app/admin/page.tsx">
                <button type="button" onClick={handleSendOtp} className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500" data-unique-id="3a946e44-2307-4934-9f73-d4be24363a6e" data-loc="220:16-220:296" data-file-name="app/admin/page.tsx">
                  Send OTP
                </button>
              </div>
            </div> : <form className="mt-8 space-y-6" onSubmit={handleLogin} data-unique-id="db5c6512-c4d7-4d17-a234-0d6c87294d2b" data-loc="224:21-224:77" data-file-name="app/admin/page.tsx">
              <div className="rounded-md shadow-sm" data-unique-id="6e6d5da4-f626-46e4-b9f7-e2619b804544" data-loc="225:14-225:52" data-file-name="app/admin/page.tsx">
                <div data-unique-id="737ce225-3f6a-480d-98e9-cf77e42ef3c2" data-loc="226:16-226:21" data-file-name="app/admin/page.tsx">
                  <label htmlFor="otp" className="block text-sm font-medium text-gray-700 mb-1" data-unique-id="e05992ef-b5b9-4c50-8bb6-a60b4ad238af" data-loc="227:18-227:96" data-file-name="app/admin/page.tsx">
                    One-Time Password
                  </label>
                  <input id="otp" name="otp" type="text" maxLength={6} value={otp} onChange={e => setOtp(e.target.value)} className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm" placeholder="Enter 6-digit OTP" required data-unique-id="0ae856e6-edf3-4f32-8bf9-6af0e9097600" data-loc="230:18-230:357" data-file-name="app/admin/page.tsx" />
                </div>
                
                {generatedOtp && <div className="mt-2 bg-green-50 border border-green-200 rounded p-2" data-unique-id="56b6af70-88da-4c2b-91c2-d57d456364a4" data-loc="233:33-233:103" data-file-name="app/admin/page.tsx">
                    <p className="text-sm font-medium text-green-800" data-unique-id="25709e42-b038-46a2-8126-9317624e22d0" data-loc="234:20-234:70" data-file-name="app/admin/page.tsx">Demo Admin OTP: <span className="font-bold" data-unique-id="3bd09e1d-2124-4894-93f7-8f2c80f624f5" data-loc="234:86-234:114" data-file-name="app/admin/page.tsx">{generatedOtp}</span></p>
                    <p className="text-xs text-green-700 mt-1" data-unique-id="2e5edcf5-e3b7-4bbe-8769-ade169de3619" data-loc="235:20-235:63" data-file-name="app/admin/page.tsx">Use this code to log in as admin</p>
                  </div>}
                
                <div className="flex justify-between mt-2 text-sm" data-unique-id="53a0eebe-7b42-443c-958e-e9d990ccf9d0" data-loc="238:16-238:67" data-file-name="app/admin/page.tsx">
                  <span className="text-gray-500" data-unique-id="bfa62ba8-1aa3-4e5d-8d20-75b74c062a5e" data-loc="239:18-239:50" data-file-name="app/admin/page.tsx">
                    OTP sent to: +91 {phone}
                  </span>
                  {otpCountdown > 0 ? <span className="text-gray-500" data-unique-id="210d8296-064b-4548-95b6-3d6d8b22617b" data-loc="242:38-242:70" data-file-name="app/admin/page.tsx">Resend in {otpCountdown}s</span> : <button type="button" className="text-blue-600 hover:text-blue-800" onClick={handleSendOtp} data-unique-id="d60d2a36-f0a0-4370-a925-2f7fa2eb2302" data-loc="242:105-242:197" data-file-name="app/admin/page.tsx">
                      Resend OTP
                    </button>}
                </div>
              </div>
              
              <div className="flex space-x-4" data-unique-id="a69d5408-7ded-4a96-95c8-1b2a849128d8" data-loc="248:14-248:46" data-file-name="app/admin/page.tsx">
                <button type="button" onClick={() => setIsOtpSent(false)} className="py-2 px-4 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 flex-1" data-unique-id="6da33bb7-0314-4457-a005-2247dcaa4deb" data-loc="249:16-249:279" data-file-name="app/admin/page.tsx">
                  Back
                </button>
                <button type="submit" className="py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 flex-1" data-unique-id="744983c2-79f9-4b2b-947c-3482d7d5de88" data-loc="252:16-252:247" data-file-name="app/admin/page.tsx">
                  Verify & Login
                </button>
              </div>
            </form>}
          
          <div className="text-center mt-4" data-unique-id="7c7f85af-4f7d-4e3c-b860-6d34c6331f78" data-loc="258:10-258:44" data-file-name="app/admin/page.tsx">
            <a href="/" className="font-medium text-blue-600 hover:text-blue-500" data-unique-id="bbc097e2-a595-4a0f-92ea-52c2c247ede4" data-loc="259:12-259:82" data-file-name="app/admin/page.tsx">
              Back to sales agent login
            </a>
          </div>
        </div>
      </div>;
  }
  return <div className="min-h-screen bg-gray-50" data-unique-id="612c81ee-08ca-444f-8af3-fcdc626e1f7d" data-loc="266:9-266:50" data-file-name="app/admin/page.tsx">
      {/* Header */}
      <header className="bg-white shadow" data-unique-id="62da7941-d6f2-45ac-bece-7c886f700a7d" data-loc="268:6-268:42" data-file-name="app/admin/page.tsx">
        <div className="max-w-7xl mx-auto px-4 py-4 sm:px-6 flex justify-between items-center" data-unique-id="ebc8a004-daa2-4048-839c-b060a39e01bd" data-loc="269:8-269:95" data-file-name="app/admin/page.tsx">
          <h1 className="text-2xl font-bold text-gray-900" data-unique-id="2007a6eb-9c43-416a-9b0e-af3442209355" data-loc="270:10-270:59" data-file-name="app/admin/page.tsx">CardSales Pro - Admin</h1>
          <button onClick={handleLogout} className="flex items-center text-sm font-medium text-red-600 hover:text-red-800" data-unique-id="76c11f32-f17b-433d-8e15-f77bbf4df4ea" data-loc="271:10-271:123" data-file-name="app/admin/page.tsx">
            <LogOut className="h-4 w-4 mr-1" /> Logout
          </button>
        </div>
      </header>
      
      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 py-8 sm:px-6" data-unique-id="5e9f9179-33bd-4333-b663-2a3d362a7707" data-loc="278:6-278:60" data-file-name="app/admin/page.tsx">
        {/* Tabs */}
        <div className="flex border-b border-gray-200 mb-6" data-unique-id="3978a939-3ed9-4740-9102-45435705ce3f" data-loc="280:8-280:60" data-file-name="app/admin/page.tsx">
          <button className={cn("py-4 px-6 text-sm font-medium", activeTab === "cards" ? "border-b-2 border-blue-500 text-blue-600" : "text-gray-500 hover:text-gray-700 hover:border-gray-300")} onClick={() => setActiveTab("cards")} data-unique-id="14fe6adb-30cb-4295-a895-1b2d1e63f76e" data-loc="281:10-281:232" data-file-name="app/admin/page.tsx">
            <div className="flex items-center" data-unique-id="386f445e-2ed1-4017-9758-26772c804677" data-loc="282:12-282:47" data-file-name="app/admin/page.tsx">
              <CreditCard className="h-5 w-5 mr-2" /> Credit Cards
            </div>
          </button>
          <button className={cn("py-4 px-6 text-sm font-medium", activeTab === "customers" ? "border-b-2 border-blue-500 text-blue-600" : "text-gray-500 hover:text-gray-700 hover:border-gray-300")} onClick={() => setActiveTab("customers")} data-unique-id="6cd3c320-8b1f-4e3e-a624-f7d43836db81" data-loc="286:10-286:240" data-file-name="app/admin/page.tsx">
            <div className="flex items-center" data-unique-id="371ff88c-d982-4aa3-8462-6d97ba75ed6c" data-loc="287:12-287:47" data-file-name="app/admin/page.tsx">
              <Users className="h-5 w-5 mr-2" /> Customers
            </div>
          </button>
          <button className={cn("py-4 px-6 text-sm font-medium", activeTab === "logs" ? "border-b-2 border-blue-500 text-blue-600" : "text-gray-500 hover:text-gray-700 hover:border-gray-300")} onClick={() => setActiveTab("logs")} data-unique-id="899472ac-5745-4c5c-b9a1-da1efc38bb6a" data-loc="291:10-291:230" data-file-name="app/admin/page.tsx">
            <div className="flex items-center" data-unique-id="cb919faf-ec93-4746-a16c-d11613a71bc9" data-loc="292:12-292:47" data-file-name="app/admin/page.tsx">
              <Activity className="h-5 w-5 mr-2" /> Activity Logs
            </div>
          </button>
          <a href="/admin/errors" className="py-4 px-6 text-sm font-medium text-gray-500 hover:text-gray-700 hover:border-gray-300" data-unique-id="5f0d9c00-6c24-4328-8eb3-182e3d7252a4" data-loc="296:10-296:132" data-file-name="app/admin/page.tsx">
            <div className="flex items-center" data-unique-id="31a93298-0397-4a27-ad68-7311ee7df6e2" data-loc="297:12-297:47" data-file-name="app/admin/page.tsx">
              <AlertTriangle className="h-5 w-5 mr-2" /> Error Logs
            </div>
          </a>
        </div>
        
        {/* Credit Cards Tab */}
        {activeTab === "cards" && <div data-unique-id="ed4dbbc9-5393-49b2-b885-ed74fea2eb05" data-loc="304:34-304:39" data-file-name="app/admin/page.tsx">
            <div className="flex justify-between items-center mb-6" data-unique-id="57a72ed7-63e0-45b5-bbd5-d2773c6c8a00" data-loc="305:12-305:68" data-file-name="app/admin/page.tsx">
              <h2 className="text-xl font-semibold text-gray-900" data-unique-id="53ca970c-ecc3-4886-8852-c79f8af8a4ea" data-loc="306:14-306:66" data-file-name="app/admin/page.tsx">Credit Cards</h2>
              <button onClick={handleAddNewCard} className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500" data-unique-id="59fd5519-6fa0-415c-bc53-1a2f23b5a950" data-loc="307:14-307:276" data-file-name="app/admin/page.tsx">
                <Plus className="h-4 w-4 mr-2" /> Add New Card
              </button>
            </div>
            
            {/* Filter and Search */}
            <div className="mb-6 flex" data-unique-id="95e73e1a-b1ef-493d-b624-17a0bd0e4a9c" data-loc="313:12-313:39" data-file-name="app/admin/page.tsx">
              <div className="relative flex-grow" data-unique-id="c941044e-3a6b-45ad-a561-8e979be250b3" data-loc="314:14-314:50" data-file-name="app/admin/page.tsx">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none" data-unique-id="c38a7244-8023-4386-8ce9-63be7455ec33" data-loc="315:16-315:102" data-file-name="app/admin/page.tsx">
                  <Search className="h-5 w-5 text-gray-400" />
                </div>
                <input type="text" className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:placeholder-gray-400 focus:ring-1 focus:ring-blue-500 focus:border-blue-500 sm:text-sm" placeholder="Search cards by name or tag" value={filter} onChange={e => setFilter(e.target.value)} data-unique-id="09763d6e-9084-4681-bfa1-a03cf8628171" data-loc="318:16-318:363" data-file-name="app/admin/page.tsx" />
              </div>
            </div>
            
            {/* Cards List */}
            <div className="bg-white shadow overflow-hidden sm:rounded-md" data-unique-id="47b6fb95-6175-4348-b105-db268fbb224e" data-loc="323:12-323:75" data-file-name="app/admin/page.tsx">
              <table className="min-w-full divide-y divide-gray-200" data-unique-id="de95cd3a-e24b-4d09-8ab9-857604f1e5de" data-loc="324:14-324:69" data-file-name="app/admin/page.tsx">
                <thead className="bg-gray-50" data-unique-id="93b4bf2b-4058-41c4-9b7c-37deabe69bfd" data-loc="325:16-325:46" data-file-name="app/admin/page.tsx">
                  <tr data-unique-id="4e311283-a8ab-4429-a6f2-91c72ddaa9c7" data-loc="326:18-326:22" data-file-name="app/admin/page.tsx">
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer" onClick={() => handleSort("name")} data-unique-id="e175ba6b-d43f-4cfe-874b-9eb74550fb58" data-loc="327:20-327:177" data-file-name="app/admin/page.tsx">
                      <div className="flex items-center" data-unique-id="5f3ce343-0111-4bf0-9993-67ca2288b649" data-loc="328:22-328:57" data-file-name="app/admin/page.tsx">
                        Name
                        {sortBy === "name" && (sortOrder === "asc" ? <ArrowUp className="w-4 h-4 ml-1" /> : <ArrowDown className="w-4 h-4 ml-1" />)}
                      </div>
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer" onClick={() => handleSort("minCibilScore")} data-unique-id="e949c9a0-84bf-4e46-8f6e-72c01c0c1ea1" data-loc="333:20-333:186" data-file-name="app/admin/page.tsx">
                      <div className="flex items-center" data-unique-id="262512c0-c616-4950-8805-f0f3e55db5b1" data-loc="334:22-334:57" data-file-name="app/admin/page.tsx">
                        Min CIBIL Score
                        {sortBy === "minCibilScore" && (sortOrder === "asc" ? <ArrowUp className="w-4 h-4 ml-1" /> : <ArrowDown className="w-4 h-4 ml-1" />)}
                      </div>
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider" data-unique-id="78789ab3-7ba6-446a-a53c-8896a1c73895" data-loc="339:20-339:127" data-file-name="app/admin/page.tsx">
                      Annual Fee
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider" data-unique-id="9cef077b-1280-47a1-97e7-dcc24a09e662" data-loc="342:20-342:127" data-file-name="app/admin/page.tsx">
                      Tags
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider" data-unique-id="e1e6dd08-0e9c-4d8c-a0fa-8923388f8912" data-loc="345:20-345:127" data-file-name="app/admin/page.tsx">
                      Status
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider" data-unique-id="07734140-e504-41e3-9f07-48b6d63cf5ae" data-loc="348:20-348:127" data-file-name="app/admin/page.tsx">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200" data-unique-id="3411287d-5f68-4408-b988-7fcc41f6298b" data-loc="353:16-353:69" data-file-name="app/admin/page.tsx">
                  {filteredCards.map(card => <tr key={card._id} data-unique-id="21849961-46f3-4732-bdf8-6513e16658d2" data-loc="354:45-354:64" data-file-name="app/admin/page.tsx">
                      <td className="px-6 py-4 whitespace-nowrap" data-unique-id="5140a120-1336-4f52-a393-5b86a7316548" data-loc="355:22-355:66" data-file-name="app/admin/page.tsx">
                        <div className="text-sm font-medium text-gray-900" data-unique-id="f485a223-2dbd-419b-8057-1796b1d72f4c" data-loc="356:24-356:75" data-file-name="app/admin/page.tsx">{card.name}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap" data-unique-id="6c61db36-7615-454e-b0d0-b713188ee1ff" data-loc="358:22-358:66" data-file-name="app/admin/page.tsx">
                        <div className="text-sm text-gray-500" data-unique-id="578f2eaa-1e29-47b3-829e-3654aa7917f8" data-loc="359:24-359:63" data-file-name="app/admin/page.tsx">{card.minCibilScore}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap" data-unique-id="34627bd1-6c1a-4765-8067-76e5e0c938a3" data-loc="361:22-361:66" data-file-name="app/admin/page.tsx">
                        <div className="text-sm text-gray-500" data-unique-id="95624049-7dac-4cd5-a073-15a72eb86943" data-loc="362:24-362:63" data-file-name="app/admin/page.tsx">₹{card.annualFee}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap" data-unique-id="57920713-cdb4-44c8-8dfd-5543cc99ff50" data-loc="364:22-364:66" data-file-name="app/admin/page.tsx">
                        <div className="flex flex-wrap gap-1" data-unique-id="f9010c8d-db07-4d34-8c1e-99be978dc956" data-loc="365:24-365:62" data-file-name="app/admin/page.tsx">
                          {card.tags.map((tag, idx) => <span key={idx} className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-blue-100 text-blue-800" data-unique-id="9c226ec8-2b70-4080-bcc4-4093be5b3b98" data-loc="366:55-366:174" data-file-name="app/admin/page.tsx">
                              {tag}
                            </span>)}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap" data-unique-id="47f2b1c1-2e94-40e5-9ea3-a2455875343c" data-loc="371:22-371:66" data-file-name="app/admin/page.tsx">
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${card.status === "active" ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"}`} data-unique-id="4218b3f0-4fbc-426a-b701-29eef977e5de" data-loc="372:24-372:204" data-file-name="app/admin/page.tsx">
                          {card.status === "active" ? <CheckCircle className="w-3 h-3 mr-1" /> : <XCircle className="w-3 h-3 mr-1" />}
                          {card.status}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500" data-unique-id="642d35fa-c656-48a1-81de-8d8f1ad8a85d" data-loc="377:22-377:88" data-file-name="app/admin/page.tsx">
                        <button onClick={() => handleEditCard(card)} className="text-blue-600 hover:text-blue-900 mr-4" data-unique-id="302d67ab-3e75-4bc9-ba54-0952380f1de8" data-loc="378:24-378:120" data-file-name="app/admin/page.tsx">
                          <Edit className="h-4 w-4" />
                        </button>
                        <button onClick={() => handleDeleteCard(card._id)} className="text-red-600 hover:text-red-900" data-unique-id="9a9d141b-96c5-4610-a05c-0925682f79c0" data-loc="381:24-381:119" data-file-name="app/admin/page.tsx">
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </td>
                    </tr>)}
                </tbody>
              </table>
              
              {filteredCards.length === 0 && <div className="text-center py-8" data-unique-id="a427c432-bec8-4c4f-8db1-d2d950b25b08" data-loc="389:45-389:79" data-file-name="app/admin/page.tsx">
                  <p className="text-gray-500" data-unique-id="2e0b63fd-70d7-42d3-8f42-32666ca6a1cf" data-loc="390:18-390:47" data-file-name="app/admin/page.tsx">No credit cards found</p>
                </div>}
            </div>
            
            {/* Card Form Modal */}
            {isFormOpen && <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50" data-unique-id="cdb51291-dcc1-4413-b532-c9c27035c8b7" data-loc="395:27-395:119" data-file-name="app/admin/page.tsx">
                <div className="bg-white rounded-lg p-8 max-w-2xl w-full max-h-screen overflow-y-auto" data-unique-id="cc3b625e-89e9-49c1-b2cb-c8b0ee692c50" data-loc="396:16-396:103" data-file-name="app/admin/page.tsx">
                  <h3 className="text-lg font-medium text-gray-900 mb-6" data-unique-id="954a0657-c552-4eca-9831-a58ed81cbb2c" data-loc="397:18-397:73" data-file-name="app/admin/page.tsx">
                    {editingCard ? "Edit Credit Card" : "Add New Credit Card"}
                  </h3>
                  
                  <form onSubmit={handleSubmitCard} data-unique-id="d11b3955-54de-4343-a0f7-bd79912378ce" data-loc="401:18-401:52" data-file-name="app/admin/page.tsx">
                    <div className="space-y-6" data-unique-id="4619303e-0c8f-477a-ac7b-739cc2c13657" data-loc="402:20-402:47" data-file-name="app/admin/page.tsx">
                      <div data-unique-id="ecceb8f9-8a77-4e90-a997-b719329561c7" data-loc="403:22-403:27" data-file-name="app/admin/page.tsx">
                        <label htmlFor="name" className="block text-sm font-medium text-gray-700" data-unique-id="547c19b2-9253-400b-8aee-e5bad28270e4" data-loc="404:24-404:98" data-file-name="app/admin/page.tsx">
                          Card Name
                        </label>
                        <input type="text" id="name" name="name" className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500" defaultValue={editingCard?.name ?? ""} required data-unique-id="8ea31e24-a16f-43e9-afdc-b853961f755d" data-loc="407:24-407:260" data-file-name="app/admin/page.tsx" />
                      </div>
                      
                      <div className="grid grid-cols-2 gap-4" data-unique-id="84727131-d2b0-4375-bc2b-feceb357ef3a" data-loc="410:22-410:62" data-file-name="app/admin/page.tsx">
                        <div data-unique-id="58b40cf8-af50-483d-8c35-fe5a03bcbe6a" data-loc="411:24-411:29" data-file-name="app/admin/page.tsx">
                          <label htmlFor="minCibilScore" className="block text-sm font-medium text-gray-700" data-unique-id="1a6434f8-a957-408c-bb48-da4b09b5b194" data-loc="412:26-412:109" data-file-name="app/admin/page.tsx">
                            Min CIBIL Score
                          </label>
                          <input type="number" id="minCibilScore" name="minCibilScore" min="300" max="900" className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500" defaultValue={editingCard?.minCibilScore ?? "700"} required data-unique-id="0e17b70e-347e-4332-bea2-4ece314a2ba4" data-loc="415:26-415:314" data-file-name="app/admin/page.tsx" />
                        </div>
                        
                        <div data-unique-id="c06414ce-17a8-4474-bb85-bde8ce0adb33" data-loc="418:24-418:29" data-file-name="app/admin/page.tsx">
                          <label htmlFor="annualFee" className="block text-sm font-medium text-gray-700" data-unique-id="92171f86-fd69-4ded-8673-53919e58ea2e" data-loc="419:26-419:105" data-file-name="app/admin/page.tsx">
                            Annual Fee (₹)
                          </label>
                          <input type="number" id="annualFee" name="annualFee" min="0" className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500" defaultValue={editingCard?.annualFee ?? "0"} required data-unique-id="03f8d62b-e82e-469c-baa2-43e9b28ba2e1" data-loc="422:26-422:288" data-file-name="app/admin/page.tsx" />
                        </div>
                      </div>
                      
                      <div data-unique-id="64023106-5eb1-435f-ba01-c1b68320852f" data-loc="426:22-426:27" data-file-name="app/admin/page.tsx">
                        <label htmlFor="utmLink" className="block text-sm font-medium text-gray-700" data-unique-id="0ef7e064-ae28-409e-b9f7-10f94e74d7b9" data-loc="427:24-427:101" data-file-name="app/admin/page.tsx">
                          UTM Link
                        </label>
                        <input type="url" id="utmLink" name="utmLink" className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500" defaultValue={editingCard?.utmLink ?? "https://example.com/card?utm=agent"} required data-unique-id="3e942c76-c0be-4512-9876-9971ee3893d7" data-loc="430:24-430:302" data-file-name="app/admin/page.tsx" />
                      </div>
                      
                      <div data-unique-id="1d5f86ef-f3f7-4413-81b9-ec7e1a2c90f0" data-loc="433:22-433:27" data-file-name="app/admin/page.tsx">
                        <label htmlFor="benefits" className="block text-sm font-medium text-gray-700" data-unique-id="6ea54352-f7d3-4f3d-b0e4-616777655d79" data-loc="434:24-434:102" data-file-name="app/admin/page.tsx">
                          Benefits (one per line)
                        </label>
                        <textarea id="benefits" name="benefits" rows={4} className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500" defaultValue={editingCard?.benefits.join('\n') ?? ""} required data-unique-id="08f5649e-ca78-45c7-baec-fce3de5cadc7" data-loc="437:24-437:281" data-file-name="app/admin/page.tsx"></textarea>
                      </div>
                      
                      <div data-unique-id="ba10075d-a1f1-438d-881e-3b74584cd0e3" data-loc="440:22-440:27" data-file-name="app/admin/page.tsx">
                        <label htmlFor="tags" className="block text-sm font-medium text-gray-700" data-unique-id="55f8067d-cbcb-4a24-abb7-80f4699b25ce" data-loc="441:24-441:98" data-file-name="app/admin/page.tsx">
                          Tags (comma separated)
                        </label>
                        <input type="text" id="tags" name="tags" className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500" defaultValue={editingCard?.tags.join(', ') ?? ""} required data-unique-id="002eea80-146b-4bf4-8786-62f7429078b9" data-loc="444:24-444:271" data-file-name="app/admin/page.tsx" />
                      </div>
                      
                      <div data-unique-id="e0d392a8-9efb-4ae1-a5a0-40013faba2be" data-loc="447:22-447:27" data-file-name="app/admin/page.tsx">
                        <label htmlFor="imageUrl" className="block text-sm font-medium text-gray-700" data-unique-id="bdb67312-f3dd-4c54-a818-933bf79375dc" data-loc="448:24-448:102" data-file-name="app/admin/page.tsx">
                          Card Image URL
                        </label>
                        <input type="url" id="imageUrl" name="imageUrl" className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500" defaultValue={editingCard?.imageUrl ?? "https://images.unsplash.com/photo-1523281353252-5e14672131b0?q=80&w=500&auto=format&fit=crop"} data-unique-id="31016fb5-1992-46df-af5a-29d9c4b8c27c" data-loc="451:24-451:354" data-file-name="app/admin/page.tsx" />
                        <p className="mt-1 text-sm text-gray-500" data-unique-id="7b5a041f-dd30-4ab7-9b87-70759a0d301c" data-loc="452:24-452:66" data-file-name="app/admin/page.tsx">Leave empty for default image</p>
                      </div>
                      
                      <div data-unique-id="b26c30a9-ca8e-429d-9048-1c2ab9714b1d" data-loc="455:22-455:27" data-file-name="app/admin/page.tsx">
                        <label htmlFor="status" className="block text-sm font-medium text-gray-700" data-unique-id="71f117c8-f491-449f-8fe3-c7b16b8a7564" data-loc="456:24-456:100" data-file-name="app/admin/page.tsx">
                          Status
                        </label>
                        <select id="status" name="status" className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500" defaultValue={editingCard?.status ?? "active"} data-unique-id="7658a8ae-a7a5-4a34-8251-5097c33abe75" data-loc="459:24-459:250" data-file-name="app/admin/page.tsx">
                          <option value="active" data-unique-id="2b4c3b06-0047-4a41-9187-ee936c722366" data-loc="460:26-460:49" data-file-name="app/admin/page.tsx">Active</option>
                          <option value="inactive" data-unique-id="beb7e855-b7f3-49b8-8ad7-50d29947b7f2" data-loc="461:26-461:51" data-file-name="app/admin/page.tsx">Inactive</option>
                        </select>
                      </div>
                      
                      <div className="flex justify-end space-x-3" data-unique-id="2f77eb92-0939-4f2a-ba6a-0ab83e276d7b" data-loc="465:22-465:66" data-file-name="app/admin/page.tsx">
                        <button type="button" onClick={() => setIsFormOpen(false)} className="py-2 px-4 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500" data-unique-id="57a0dd1a-904c-4fb3-b270-21e14da6689e" data-loc="466:24-466:262" data-file-name="app/admin/page.tsx">
                          Cancel
                        </button>
                        <button type="submit" className="py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500" data-unique-id="40948e3f-ddac-4b3e-ba50-0b2e95a58208" data-loc="469:24-469:248" data-file-name="app/admin/page.tsx">
                          {editingCard ? "Update Card" : "Add Card"}
                        </button>
                      </div>
                    </div>
                  </form>
                </div>
              </div>}
          </div>}
        
        {/* Customers Tab */}
        {activeTab === "customers" && <div data-unique-id="452c803f-ea47-4c4f-bb74-7d24143309db" data-loc="480:38-480:43" data-file-name="app/admin/page.tsx">
            <div className="mb-6" data-unique-id="7498c30c-fac3-40fd-ba29-d6eee199e8b7" data-loc="481:12-481:34" data-file-name="app/admin/page.tsx">
              <h2 className="text-xl font-semibold text-gray-900" data-unique-id="d1a8fbd0-b1a3-44df-86f8-2a1aab34cd00" data-loc="482:14-482:66" data-file-name="app/admin/page.tsx">Registered Customers</h2>
              <p className="text-gray-500 mt-1" data-unique-id="4ec18d64-8750-4ea5-9b6c-a6456c96049e" data-loc="483:14-483:48" data-file-name="app/admin/page.tsx">View all customer information</p>
            </div>
            
            <div className="bg-white shadow overflow-hidden sm:rounded-md" data-unique-id="c9c5e9d0-331f-49a2-b713-34185728f0b3" data-loc="486:12-486:75" data-file-name="app/admin/page.tsx">
              <table className="min-w-full divide-y divide-gray-200" data-unique-id="782b25e5-53c2-4697-821d-e68913e862f8" data-loc="487:14-487:69" data-file-name="app/admin/page.tsx">
                <thead className="bg-gray-50" data-unique-id="ce8ec83d-9b8e-4988-8746-e08429bc7a11" data-loc="488:16-488:46" data-file-name="app/admin/page.tsx">
                  <tr data-unique-id="f6d1a445-c37e-45ca-9c05-65c6757707ba" data-loc="489:18-489:22" data-file-name="app/admin/page.tsx">
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider" data-unique-id="3ffff137-00ec-4aa9-87fd-2be5e0cf552f" data-loc="490:20-490:127" data-file-name="app/admin/page.tsx">
                      Customer
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider" data-unique-id="de03b77f-6d69-439d-9d85-08d70aae063c" data-loc="493:20-493:127" data-file-name="app/admin/page.tsx">
                      Contact
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider" data-unique-id="aa5ade88-360e-4edd-bc13-2d96f632915c" data-loc="496:20-496:127" data-file-name="app/admin/page.tsx">
                      CIBIL
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider" data-unique-id="fa086871-5884-4794-9428-2b2546581c42" data-loc="499:20-499:127" data-file-name="app/admin/page.tsx">
                      Registered By
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider" data-unique-id="f1a65d04-d336-4acd-8866-c7a2421cb79a" data-loc="502:20-502:127" data-file-name="app/admin/page.tsx">
                      Date
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200" data-unique-id="544dbbe2-8a13-4a18-88dd-ed63689ff5b5" data-loc="507:16-507:69" data-file-name="app/admin/page.tsx">
                  {/* Customer data will be fetched from API */}
                  <tr data-unique-id="86e15518-18f8-499c-ac3a-0ea6ba92f23c" data-loc="509:18-509:22" data-file-name="app/admin/page.tsx">
                    <td colSpan={5} className="px-6 py-4 text-center text-gray-500" data-unique-id="a81712f5-0bd7-4965-b086-42a702310935" data-loc="510:20-510:84" data-file-name="app/admin/page.tsx">
                      Customer data will be available via API
                    </td>
                  </tr>
                </tbody>
              </table>
              
              {/* Empty state handled above */}
            </div>
          </div>}
        
        {/* Activity Logs Tab */}
        {activeTab === "logs" && <div data-unique-id="1419feee-2ea6-43b0-a86b-c3800867cf78" data-loc="522:33-522:38" data-file-name="app/admin/page.tsx">
            <div className="mb-6" data-unique-id="3ab3b5c8-ad5c-4c5f-a04b-554bd670ecd0" data-loc="523:12-523:34" data-file-name="app/admin/page.tsx">
              <h2 className="text-xl font-semibold text-gray-900" data-unique-id="115b4e99-7f5f-4b17-9d1f-4a99b9c30318" data-loc="524:14-524:66" data-file-name="app/admin/page.tsx">Activity Logs</h2>
              <p className="text-gray-500 mt-1" data-unique-id="09c1c3d1-c0a7-450c-a740-532a95c504e9" data-loc="525:14-525:48" data-file-name="app/admin/page.tsx">Track all system activities</p>
            </div>
            
            <div className="bg-white shadow overflow-hidden sm:rounded-md" data-unique-id="346cb336-55fc-4cd6-9dc6-093153d2b559" data-loc="528:12-528:75" data-file-name="app/admin/page.tsx">
              <table className="min-w-full divide-y divide-gray-200" data-unique-id="0e0b87ac-2938-4398-8859-0263bcfdbcfb" data-loc="529:14-529:69" data-file-name="app/admin/page.tsx">
                <thead className="bg-gray-50" data-unique-id="00f4fe0a-ed74-4013-8cbf-5851eadb2375" data-loc="530:16-530:46" data-file-name="app/admin/page.tsx">
                  <tr data-unique-id="a24976d4-6cfc-4c07-a27d-d95c9d89c2f7" data-loc="531:18-531:22" data-file-name="app/admin/page.tsx">
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider" data-unique-id="cf17d506-e6a0-483f-b328-92e0d78ebcaa" data-loc="532:20-532:127" data-file-name="app/admin/page.tsx">
                      Timestamp
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider" data-unique-id="f5a44bba-93f8-4b28-a8c7-212b94b2dbc5" data-loc="535:20-535:127" data-file-name="app/admin/page.tsx">
                      Action
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider" data-unique-id="cc47c9be-1f1a-4b97-a929-d230735f755b" data-loc="538:20-538:127" data-file-name="app/admin/page.tsx">
                      Agent
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider" data-unique-id="3d1130b7-1750-4e26-807d-815bc5a56254" data-loc="541:20-541:127" data-file-name="app/admin/page.tsx">
                      Customer
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider" data-unique-id="578ad1db-4dd0-4ed4-9b2d-7ce70e60b45e" data-loc="544:20-544:127" data-file-name="app/admin/page.tsx">
                      Details
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200" data-unique-id="ccef06ca-318f-470c-82aa-bc8844892a5e" data-loc="549:16-549:69" data-file-name="app/admin/page.tsx">
                  {/* Activity logs will be fetched from API */}
                  <tr data-unique-id="6f1250b0-ecf8-433d-95f7-c70ed11b1ed0" data-loc="551:18-551:22" data-file-name="app/admin/page.tsx">
                    <td colSpan={5} className="px-6 py-4 text-center text-gray-500" data-unique-id="cc74986e-81ae-428c-969c-8f9b0b324eda" data-loc="552:20-552:84" data-file-name="app/admin/page.tsx">
                      Activity logs will be available via API
                    </td>
                  </tr>
                </tbody>
              </table>
              
              {/* Empty state handled above */}
            </div>
            
            {/* Export Button */}
            <div className="mt-6 flex justify-end" data-unique-id="1ede315b-e496-4742-8d47-df08fcbd848d" data-loc="563:12-563:51" data-file-name="app/admin/page.tsx">
              <button onClick={() => {
            // In a real app, this would generate a CSV export
            toast.success("Data exported successfully (simulated)");
          }} className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500" data-unique-id="8dcdf36d-a0f7-4e68-9da5-6ab2156abdde" data-loc="564:14-567:243" data-file-name="app/admin/page.tsx">
                Export to CSV
              </button>
            </div>
            
            {/* Admin Phones Manager */}
            <div className="mt-8" data-unique-id="b0a80e0a-a163-483a-9c97-ff0080ade438" data-loc="573:12-573:34" data-file-name="app/admin/page.tsx">
              <AdminPhonesManager />
            </div>
          </div>}
      </main>
    </div>;
}