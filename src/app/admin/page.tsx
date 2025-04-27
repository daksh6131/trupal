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
    return <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8" data-unique-id="7487f9fa-8066-40fa-b57a-be1ca7eb4af0" data-loc="190:11-190:112" data-file-name="app/admin/page.tsx">
        <div className="max-w-md w-full space-y-8" data-unique-id="ffa58bfd-39aa-4c11-8bc5-4ccc68e6a67f" data-loc="191:8-191:51" data-file-name="app/admin/page.tsx">
          <div data-unique-id="c022767e-fee4-4664-a252-c8b74df9ecee" data-loc="192:10-192:15" data-file-name="app/admin/page.tsx">
            <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900" data-unique-id="251da466-aeaa-4b62-ad01-691b40ddf41f" data-loc="193:12-193:83" data-file-name="app/admin/page.tsx">
              Admin Login
            </h2>
            <p className="mt-2 text-center text-sm text-gray-600" data-unique-id="05b65c7b-332e-49e8-a023-946c79499ee6" data-loc="196:12-196:66" data-file-name="app/admin/page.tsx">
              Access the admin dashboard
            </p>
          </div>
          
          <DemoLoginInfo type="admin" />
          
          {!isOtpSent ? <div className="mt-8 space-y-6" data-unique-id="866251c8-6ba5-447d-8055-e3fa944b24d2" data-loc="203:24-203:56" data-file-name="app/admin/page.tsx">
              <div className="rounded-md shadow-sm" data-unique-id="4d06d4a0-123f-4914-a811-50b04075da29" data-loc="204:14-204:52" data-file-name="app/admin/page.tsx">
                <div data-unique-id="51a9ee60-36ca-4651-a75f-07f3cecef576" data-loc="205:16-205:21" data-file-name="app/admin/page.tsx">
                  <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-1" data-unique-id="da80ad9d-d2e0-456f-93e9-7c694d40fb58" data-loc="206:18-206:98" data-file-name="app/admin/page.tsx">
                    Phone Number
                  </label>
                  <div className="relative" data-unique-id="7d44f099-45a7-4c83-bb2b-b8123e10c052" data-loc="209:18-209:44" data-file-name="app/admin/page.tsx">
                    <span className="absolute left-3 top-3 text-gray-500" data-unique-id="99e22399-d389-4f76-91e2-bf2d42b7ecb8" data-loc="210:20-210:74" data-file-name="app/admin/page.tsx">+91</span>
                    <input id="phone" name="phone" type="tel" maxLength={10} value={phone} onChange={e => setPhone(e.target.value)} className="appearance-none block w-full pl-10 px-3 py-2 border border-gray-300 rounded-md placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm" placeholder="Enter admin phone number" data-unique-id="aa4b0d07-b883-48bd-8ab0-20b91b0b7cd0" data-loc="211:20-211:371" data-file-name="app/admin/page.tsx" />
                  </div>
                  <p className="mt-1 text-xs text-gray-500 font-medium" data-unique-id="0c949e0f-a6ba-49d8-843e-b2788f2872fe" data-loc="213:18-213:72" data-file-name="app/admin/page.tsx">
                    Demo admin: 8076492495 (pre-filled)
                  </p>
                </div>
              </div>
              
              <div data-unique-id="c1926dbb-162a-40cd-bc6e-4ae180b089d0" data-loc="219:14-219:19" data-file-name="app/admin/page.tsx">
                <button type="button" onClick={handleSendOtp} className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500" data-unique-id="c972ebd1-5e49-461d-b16c-641bf22231d1" data-loc="220:16-220:296" data-file-name="app/admin/page.tsx">
                  Send OTP
                </button>
              </div>
            </div> : <form className="mt-8 space-y-6" onSubmit={handleLogin} data-unique-id="b9c4de40-ceee-43a1-badd-7f42f2a71007" data-loc="224:21-224:77" data-file-name="app/admin/page.tsx">
              <div className="rounded-md shadow-sm" data-unique-id="742fd023-b817-4d5e-9847-8df57c6fa7c1" data-loc="225:14-225:52" data-file-name="app/admin/page.tsx">
                <div data-unique-id="040fae82-b98f-48a3-bead-e39baa9dc2e7" data-loc="226:16-226:21" data-file-name="app/admin/page.tsx">
                  <label htmlFor="otp" className="block text-sm font-medium text-gray-700 mb-1" data-unique-id="cd2f31c4-6bf8-4f77-89fc-9fc7c96a8ac5" data-loc="227:18-227:96" data-file-name="app/admin/page.tsx">
                    One-Time Password
                  </label>
                  <input id="otp" name="otp" type="text" maxLength={6} value={otp} onChange={e => setOtp(e.target.value)} className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm" placeholder="Enter 6-digit OTP" required data-unique-id="4273022c-6e7a-42dd-9b0f-0e127ddf721f" data-loc="230:18-230:357" data-file-name="app/admin/page.tsx" />
                </div>
                
                {generatedOtp && <div className="mt-2 bg-green-50 border border-green-200 rounded p-2" data-unique-id="7d1c9593-50d6-49fe-856c-439c6a595ce8" data-loc="233:33-233:103" data-file-name="app/admin/page.tsx">
                    <p className="text-sm font-medium text-green-800" data-unique-id="66011432-97c7-46aa-82df-3da80e92784e" data-loc="234:20-234:70" data-file-name="app/admin/page.tsx">Demo Admin OTP: <span className="font-bold" data-unique-id="8b1e4c53-558b-4f82-a23e-a422324dfa41" data-loc="234:86-234:114" data-file-name="app/admin/page.tsx">{generatedOtp}</span></p>
                    <p className="text-xs text-green-700 mt-1" data-unique-id="00fecfb8-248a-43ad-805c-631888fb7ae9" data-loc="235:20-235:63" data-file-name="app/admin/page.tsx">Use this code to log in as admin</p>
                  </div>}
                
                <div className="flex justify-between mt-2 text-sm" data-unique-id="46975343-8744-4858-9a05-a30a9ddfc6d9" data-loc="238:16-238:67" data-file-name="app/admin/page.tsx">
                  <span className="text-gray-500" data-unique-id="0efc3efe-5ba3-4f73-93df-3845e2dc9b94" data-loc="239:18-239:50" data-file-name="app/admin/page.tsx">
                    OTP sent to: +91 {phone}
                  </span>
                  {otpCountdown > 0 ? <span className="text-gray-500" data-unique-id="02bc1885-eaae-4d72-8be8-0689dc89c9ec" data-loc="242:38-242:70" data-file-name="app/admin/page.tsx">Resend in {otpCountdown}s</span> : <button type="button" className="text-blue-600 hover:text-blue-800" onClick={handleSendOtp} data-unique-id="a0c66cd6-079a-4250-9891-c8c9cdc0ef4c" data-loc="242:105-242:197" data-file-name="app/admin/page.tsx">
                      Resend OTP
                    </button>}
                </div>
              </div>
              
              <div className="flex space-x-4" data-unique-id="3297ac4d-7b35-4217-af7c-fcba381358ac" data-loc="248:14-248:46" data-file-name="app/admin/page.tsx">
                <button type="button" onClick={() => setIsOtpSent(false)} className="py-2 px-4 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 flex-1" data-unique-id="b729a777-6925-4215-855a-cbebb70a9d9c" data-loc="249:16-249:279" data-file-name="app/admin/page.tsx">
                  Back
                </button>
                <button type="submit" className="py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 flex-1" data-unique-id="d43a3e39-577a-4c07-b998-21a0d06ab167" data-loc="252:16-252:247" data-file-name="app/admin/page.tsx">
                  Verify & Login
                </button>
              </div>
            </form>}
          
          <div className="text-center mt-4" data-unique-id="9bb26942-725a-4e0b-b02d-19dbfa138438" data-loc="258:10-258:44" data-file-name="app/admin/page.tsx">
            <a href="/" className="font-medium text-blue-600 hover:text-blue-500" data-unique-id="9e4e8d53-407d-4526-936c-97aed98d65f3" data-loc="259:12-259:82" data-file-name="app/admin/page.tsx">
              Back to sales agent login
            </a>
          </div>
        </div>
      </div>;
  }
  return <div className="min-h-screen bg-gray-50" data-unique-id="ef7d3ccb-c856-4017-8637-5933d8406480" data-loc="266:9-266:50" data-file-name="app/admin/page.tsx">
      {/* Header */}
      <header className="bg-white shadow" data-unique-id="3105bc57-5828-447a-ad5f-b5b37c872689" data-loc="268:6-268:42" data-file-name="app/admin/page.tsx">
        <div className="max-w-7xl mx-auto px-4 py-4 sm:px-6 flex justify-between items-center" data-unique-id="709a48fa-9fd2-47ee-8f7b-8552ce5c06ad" data-loc="269:8-269:95" data-file-name="app/admin/page.tsx">
          <h1 className="text-2xl font-bold text-gray-900" data-unique-id="f76f4e12-f616-4aaf-8308-8899fba8dfbf" data-loc="270:10-270:59" data-file-name="app/admin/page.tsx">CardSales Pro - Admin</h1>
          <button onClick={handleLogout} className="flex items-center text-sm font-medium text-red-600 hover:text-red-800" data-unique-id="be02166a-ac7c-43a0-ab0b-dd52cec84c59" data-loc="271:10-271:123" data-file-name="app/admin/page.tsx">
            <LogOut className="h-4 w-4 mr-1" /> Logout
          </button>
        </div>
      </header>
      
      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 py-8 sm:px-6" data-unique-id="54b6d410-8bc6-4d45-b869-fb4aae574547" data-loc="278:6-278:60" data-file-name="app/admin/page.tsx">
        {/* Tabs */}
        <div className="flex border-b border-gray-200 mb-6" data-unique-id="21dc2514-9732-45e4-9b10-86352ab7f715" data-loc="280:8-280:60" data-file-name="app/admin/page.tsx">
          <button className={cn("py-4 px-6 text-sm font-medium", activeTab === "cards" ? "border-b-2 border-blue-500 text-blue-600" : "text-gray-500 hover:text-gray-700 hover:border-gray-300")} onClick={() => setActiveTab("cards")} data-unique-id="18e93844-16dd-442e-9e7d-f36a2038ebcd" data-loc="281:10-281:232" data-file-name="app/admin/page.tsx">
            <div className="flex items-center" data-unique-id="0947057f-2248-44f5-800c-1767c8cbc7b5" data-loc="282:12-282:47" data-file-name="app/admin/page.tsx">
              <CreditCard className="h-5 w-5 mr-2" /> Credit Cards
            </div>
          </button>
          <button className={cn("py-4 px-6 text-sm font-medium", activeTab === "customers" ? "border-b-2 border-blue-500 text-blue-600" : "text-gray-500 hover:text-gray-700 hover:border-gray-300")} onClick={() => setActiveTab("customers")} data-unique-id="dc9c826f-a0ca-48db-9f7c-5fc0cd3c88e8" data-loc="286:10-286:240" data-file-name="app/admin/page.tsx">
            <div className="flex items-center" data-unique-id="aa7e428b-d888-4165-8273-42d983ef326a" data-loc="287:12-287:47" data-file-name="app/admin/page.tsx">
              <Users className="h-5 w-5 mr-2" /> Customers
            </div>
          </button>
          <button className={cn("py-4 px-6 text-sm font-medium", activeTab === "logs" ? "border-b-2 border-blue-500 text-blue-600" : "text-gray-500 hover:text-gray-700 hover:border-gray-300")} onClick={() => setActiveTab("logs")} data-unique-id="eaea47fb-e3a6-4c72-a5df-cdc374393216" data-loc="291:10-291:230" data-file-name="app/admin/page.tsx">
            <div className="flex items-center" data-unique-id="46e2a84c-f036-4e5b-8db6-713d01462b4d" data-loc="292:12-292:47" data-file-name="app/admin/page.tsx">
              <Activity className="h-5 w-5 mr-2" /> Activity Logs
            </div>
          </button>
          <a href="/admin/errors" className="py-4 px-6 text-sm font-medium text-gray-500 hover:text-gray-700 hover:border-gray-300" data-unique-id="a690fc63-3c95-4b20-b2ed-b759dfd66923" data-loc="296:10-296:132" data-file-name="app/admin/page.tsx">
            <div className="flex items-center" data-unique-id="1f5a9574-b6a4-4483-822d-842e003fa5eb" data-loc="297:12-297:47" data-file-name="app/admin/page.tsx">
              <AlertTriangle className="h-5 w-5 mr-2" /> Error Logs
            </div>
          </a>
        </div>
        
        {/* Credit Cards Tab */}
        {activeTab === "cards" && <div data-unique-id="0bbd67bd-4bb8-4b58-8b56-30d995f9549d" data-loc="304:34-304:39" data-file-name="app/admin/page.tsx">
            <div className="flex justify-between items-center mb-6" data-unique-id="dbf7515f-d58a-44ff-bc1d-5939e6761de5" data-loc="305:12-305:68" data-file-name="app/admin/page.tsx">
              <h2 className="text-xl font-semibold text-gray-900" data-unique-id="7859801d-dad2-4eec-9f4c-30580f8b2080" data-loc="306:14-306:66" data-file-name="app/admin/page.tsx">Credit Cards</h2>
              <button onClick={handleAddNewCard} className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500" data-unique-id="21075fc0-d6ce-42bd-aa0b-908ce8b8b3e9" data-loc="307:14-307:276" data-file-name="app/admin/page.tsx">
                <Plus className="h-4 w-4 mr-2" /> Add New Card
              </button>
            </div>
            
            {/* Filter and Search */}
            <div className="mb-6 flex" data-unique-id="7b46d3cd-9eff-4491-9e3b-e3ab0f3e9683" data-loc="313:12-313:39" data-file-name="app/admin/page.tsx">
              <div className="relative flex-grow" data-unique-id="c275a89e-7892-4add-834c-862c6661a8ff" data-loc="314:14-314:50" data-file-name="app/admin/page.tsx">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none" data-unique-id="c3027d05-aa9d-4529-bfaa-88523b9f8d70" data-loc="315:16-315:102" data-file-name="app/admin/page.tsx">
                  <Search className="h-5 w-5 text-gray-400" />
                </div>
                <input type="text" className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:placeholder-gray-400 focus:ring-1 focus:ring-blue-500 focus:border-blue-500 sm:text-sm" placeholder="Search cards by name or tag" value={filter} onChange={e => setFilter(e.target.value)} data-unique-id="4be7e89a-1d8e-4763-9e5f-ce7370525bda" data-loc="318:16-318:363" data-file-name="app/admin/page.tsx" />
              </div>
            </div>
            
            {/* Cards List */}
            <div className="bg-white shadow overflow-hidden sm:rounded-md" data-unique-id="e0e78601-f963-441a-abcf-10370c1af087" data-loc="323:12-323:75" data-file-name="app/admin/page.tsx">
              <table className="min-w-full divide-y divide-gray-200" data-unique-id="d8cfc24a-522b-4ef1-9fd5-1dfb4c668009" data-loc="324:14-324:69" data-file-name="app/admin/page.tsx">
                <thead className="bg-gray-50" data-unique-id="827e6a74-16bb-4efd-b950-419aa983d4ad" data-loc="325:16-325:46" data-file-name="app/admin/page.tsx">
                  <tr data-unique-id="d1fc960c-c53b-4e1e-96d3-7b97cdb54997" data-loc="326:18-326:22" data-file-name="app/admin/page.tsx">
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer" onClick={() => handleSort("name")} data-unique-id="0548afea-4b56-446e-b459-37bb75481689" data-loc="327:20-327:177" data-file-name="app/admin/page.tsx">
                      <div className="flex items-center" data-unique-id="faa091bb-9c3a-47f7-b8e1-674881ff83d4" data-loc="328:22-328:57" data-file-name="app/admin/page.tsx">
                        Name
                        {sortBy === "name" && (sortOrder === "asc" ? <ArrowUp className="w-4 h-4 ml-1" /> : <ArrowDown className="w-4 h-4 ml-1" />)}
                      </div>
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer" onClick={() => handleSort("minCibilScore")} data-unique-id="8745a04a-f6f7-4d42-b140-05ee31f0b2c7" data-loc="333:20-333:186" data-file-name="app/admin/page.tsx">
                      <div className="flex items-center" data-unique-id="9b3a07be-1c12-4d80-87c0-8829420fe9de" data-loc="334:22-334:57" data-file-name="app/admin/page.tsx">
                        Min CIBIL Score
                        {sortBy === "minCibilScore" && (sortOrder === "asc" ? <ArrowUp className="w-4 h-4 ml-1" /> : <ArrowDown className="w-4 h-4 ml-1" />)}
                      </div>
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider" data-unique-id="921792e1-44d8-4f3e-8f2c-5c9cab1dfb08" data-loc="339:20-339:127" data-file-name="app/admin/page.tsx">
                      Annual Fee
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider" data-unique-id="9b375d1e-3b9f-466f-9ec4-294d3771c90c" data-loc="342:20-342:127" data-file-name="app/admin/page.tsx">
                      Tags
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider" data-unique-id="1355b38c-c1ed-485f-8e47-420425cbe3b1" data-loc="345:20-345:127" data-file-name="app/admin/page.tsx">
                      Status
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider" data-unique-id="64f332bf-a7fc-4ccd-a7fd-d393ef097cd4" data-loc="348:20-348:127" data-file-name="app/admin/page.tsx">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200" data-unique-id="5da648db-8b12-4085-8f2d-f7e956038734" data-loc="353:16-353:69" data-file-name="app/admin/page.tsx">
                  {filteredCards.map(card => <tr key={card._id} data-unique-id="f17e9879-27bd-4b64-9daf-035010c5f739" data-loc="354:45-354:64" data-file-name="app/admin/page.tsx">
                      <td className="px-6 py-4 whitespace-nowrap" data-unique-id="e8fa376d-d552-4c10-9fe3-ed311d1f7872" data-loc="355:22-355:66" data-file-name="app/admin/page.tsx">
                        <div className="text-sm font-medium text-gray-900" data-unique-id="1bdea320-2af6-4ebb-b477-91ec38c4564c" data-loc="356:24-356:75" data-file-name="app/admin/page.tsx">{card.name}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap" data-unique-id="77ee8b1f-1eb6-4d99-9135-95d1c4e6dea6" data-loc="358:22-358:66" data-file-name="app/admin/page.tsx">
                        <div className="text-sm text-gray-500" data-unique-id="c5e32fb1-bcb1-4003-93b7-8512e08de916" data-loc="359:24-359:63" data-file-name="app/admin/page.tsx">{card.minCibilScore}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap" data-unique-id="c3adc33f-d951-4564-b450-0cc0e5bbd5e2" data-loc="361:22-361:66" data-file-name="app/admin/page.tsx">
                        <div className="text-sm text-gray-500" data-unique-id="dae9e94e-4043-46bb-b4db-2d23be6ea9bd" data-loc="362:24-362:63" data-file-name="app/admin/page.tsx">₹{card.annualFee}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap" data-unique-id="605cf7a4-f4a3-4e6f-bfc0-ff4a710f352b" data-loc="364:22-364:66" data-file-name="app/admin/page.tsx">
                        <div className="flex flex-wrap gap-1" data-unique-id="a7383084-5061-44bc-a69a-4960fa962ad6" data-loc="365:24-365:62" data-file-name="app/admin/page.tsx">
                          {card.tags.map((tag, idx) => <span key={idx} className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-blue-100 text-blue-800" data-unique-id="3ee546f4-4121-4dde-9a27-7f4efea7a22e" data-loc="366:55-366:174" data-file-name="app/admin/page.tsx">
                              {tag}
                            </span>)}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap" data-unique-id="d4ec550e-251e-492a-a634-9a8899b4b8e0" data-loc="371:22-371:66" data-file-name="app/admin/page.tsx">
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${card.status === "active" ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"}`} data-unique-id="a7ae7ad0-c996-4dfb-8214-f6a8f00c95fd" data-loc="372:24-372:204" data-file-name="app/admin/page.tsx">
                          {card.status === "active" ? <CheckCircle className="w-3 h-3 mr-1" /> : <XCircle className="w-3 h-3 mr-1" />}
                          {card.status}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500" data-unique-id="d75948b8-b8ad-431e-89ff-e88a89dc64cf" data-loc="377:22-377:88" data-file-name="app/admin/page.tsx">
                        <button onClick={() => handleEditCard(card)} className="text-blue-600 hover:text-blue-900 mr-4" data-unique-id="79529022-1579-49be-aa08-3430728f8520" data-loc="378:24-378:120" data-file-name="app/admin/page.tsx">
                          <Edit className="h-4 w-4" />
                        </button>
                        <button onClick={() => handleDeleteCard(card._id)} className="text-red-600 hover:text-red-900" data-unique-id="f48f1d3d-2d98-4e67-a655-5bbf0828527d" data-loc="381:24-381:119" data-file-name="app/admin/page.tsx">
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </td>
                    </tr>)}
                </tbody>
              </table>
              
              {filteredCards.length === 0 && <div className="text-center py-8" data-unique-id="e85e37f8-8d19-4cad-8863-645c18e06425" data-loc="389:45-389:79" data-file-name="app/admin/page.tsx">
                  <p className="text-gray-500" data-unique-id="07519512-d9df-43b1-952f-bab9e1c4c1dd" data-loc="390:18-390:47" data-file-name="app/admin/page.tsx">No credit cards found</p>
                </div>}
            </div>
            
            {/* Card Form Modal */}
            {isFormOpen && <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50" data-unique-id="c0d692bb-048c-4bbb-b5ca-6ccca1c54ab9" data-loc="395:27-395:119" data-file-name="app/admin/page.tsx">
                <div className="bg-white rounded-lg p-8 max-w-2xl w-full max-h-screen overflow-y-auto" data-unique-id="6e988154-80c5-41cf-9424-3901f8514af4" data-loc="396:16-396:103" data-file-name="app/admin/page.tsx">
                  <h3 className="text-lg font-medium text-gray-900 mb-6" data-unique-id="416e2193-187a-431d-a08b-c4fdd0be6556" data-loc="397:18-397:73" data-file-name="app/admin/page.tsx">
                    {editingCard ? "Edit Credit Card" : "Add New Credit Card"}
                  </h3>
                  
                  <form onSubmit={handleSubmitCard} data-unique-id="12842303-6d2e-4fe2-a98e-1487c889cb53" data-loc="401:18-401:52" data-file-name="app/admin/page.tsx">
                    <div className="space-y-6" data-unique-id="efb44bd7-aa9d-4b12-9476-adefca25d3ed" data-loc="402:20-402:47" data-file-name="app/admin/page.tsx">
                      <div data-unique-id="56b04dc8-f75d-4ba3-bcab-fd6e071c0008" data-loc="403:22-403:27" data-file-name="app/admin/page.tsx">
                        <label htmlFor="name" className="block text-sm font-medium text-gray-700" data-unique-id="957b3696-01b4-4df0-af61-fe13508d68bd" data-loc="404:24-404:98" data-file-name="app/admin/page.tsx">
                          Card Name
                        </label>
                        <input type="text" id="name" name="name" className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500" defaultValue={editingCard?.name ?? ""} required data-unique-id="0453c23d-53fa-41d3-8422-d4e226befe63" data-loc="407:24-407:260" data-file-name="app/admin/page.tsx" />
                      </div>
                      
                      <div className="grid grid-cols-2 gap-4" data-unique-id="775a3587-fc75-4fb6-b97b-373a23784b2b" data-loc="410:22-410:62" data-file-name="app/admin/page.tsx">
                        <div data-unique-id="99351c4d-5d87-44b9-bb91-44622d2cbc79" data-loc="411:24-411:29" data-file-name="app/admin/page.tsx">
                          <label htmlFor="minCibilScore" className="block text-sm font-medium text-gray-700" data-unique-id="db7c35fa-bb96-43c8-80f7-95067c05d02d" data-loc="412:26-412:109" data-file-name="app/admin/page.tsx">
                            Min CIBIL Score
                          </label>
                          <input type="number" id="minCibilScore" name="minCibilScore" min="300" max="900" className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500" defaultValue={editingCard?.minCibilScore ?? "700"} required data-unique-id="bb85d7e8-1865-498b-8deb-bf6631589ac1" data-loc="415:26-415:314" data-file-name="app/admin/page.tsx" />
                        </div>
                        
                        <div data-unique-id="25b6fc9c-65c0-46a2-9106-5be5f5ed7019" data-loc="418:24-418:29" data-file-name="app/admin/page.tsx">
                          <label htmlFor="annualFee" className="block text-sm font-medium text-gray-700" data-unique-id="cfe9261e-7b5a-4821-922a-7e9b769d9634" data-loc="419:26-419:105" data-file-name="app/admin/page.tsx">
                            Annual Fee (₹)
                          </label>
                          <input type="number" id="annualFee" name="annualFee" min="0" className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500" defaultValue={editingCard?.annualFee ?? "0"} required data-unique-id="2ef86a74-b84e-47bb-b8b7-7b3b54a639c6" data-loc="422:26-422:288" data-file-name="app/admin/page.tsx" />
                        </div>
                      </div>
                      
                      <div data-unique-id="11338ad5-a5dc-49b4-9ac1-48773912da50" data-loc="426:22-426:27" data-file-name="app/admin/page.tsx">
                        <label htmlFor="utmLink" className="block text-sm font-medium text-gray-700" data-unique-id="b0f4b2d4-1d63-450b-89f3-b7780c9a529f" data-loc="427:24-427:101" data-file-name="app/admin/page.tsx">
                          UTM Link
                        </label>
                        <input type="url" id="utmLink" name="utmLink" className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500" defaultValue={editingCard?.utmLink ?? "https://example.com/card?utm=agent"} required data-unique-id="66d340c9-22b8-45de-83ba-7fd56d71ae80" data-loc="430:24-430:302" data-file-name="app/admin/page.tsx" />
                      </div>
                      
                      <div data-unique-id="e91779d5-01b4-4f79-9613-230d104cdec9" data-loc="433:22-433:27" data-file-name="app/admin/page.tsx">
                        <label htmlFor="benefits" className="block text-sm font-medium text-gray-700" data-unique-id="a6f4e0aa-63b9-4efd-bbdd-46e37cf04ea0" data-loc="434:24-434:102" data-file-name="app/admin/page.tsx">
                          Benefits (one per line)
                        </label>
                        <textarea id="benefits" name="benefits" rows={4} className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500" defaultValue={editingCard?.benefits.join('\n') ?? ""} required data-unique-id="d496b5d2-0625-464c-8066-51b9c8a8b649" data-loc="437:24-437:281" data-file-name="app/admin/page.tsx"></textarea>
                      </div>
                      
                      <div data-unique-id="60c249b3-3e6a-4347-864e-1cae3caaab2b" data-loc="440:22-440:27" data-file-name="app/admin/page.tsx">
                        <label htmlFor="tags" className="block text-sm font-medium text-gray-700" data-unique-id="211da5a2-08ef-4e46-94b0-58c70cfc2d28" data-loc="441:24-441:98" data-file-name="app/admin/page.tsx">
                          Tags (comma separated)
                        </label>
                        <input type="text" id="tags" name="tags" className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500" defaultValue={editingCard?.tags.join(', ') ?? ""} required data-unique-id="29ae6120-c627-49c1-ac89-b0489a772bc8" data-loc="444:24-444:271" data-file-name="app/admin/page.tsx" />
                      </div>
                      
                      <div data-unique-id="f241ccb4-4778-4152-82ad-e6b870371dbf" data-loc="447:22-447:27" data-file-name="app/admin/page.tsx">
                        <label htmlFor="imageUrl" className="block text-sm font-medium text-gray-700" data-unique-id="17b33bb1-330e-45e9-b3fe-54a09b1e6937" data-loc="448:24-448:102" data-file-name="app/admin/page.tsx">
                          Card Image URL
                        </label>
                        <input type="url" id="imageUrl" name="imageUrl" className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500" defaultValue={editingCard?.imageUrl ?? "https://images.unsplash.com/photo-1523281353252-5e14672131b0?q=80&w=500&auto=format&fit=crop"} data-unique-id="28434f8d-c0ba-4a17-a074-abb69ac37c18" data-loc="451:24-451:354" data-file-name="app/admin/page.tsx" />
                        <p className="mt-1 text-sm text-gray-500" data-unique-id="26b21fd6-228a-4c36-b1c3-9d34cab644bb" data-loc="452:24-452:66" data-file-name="app/admin/page.tsx">Leave empty for default image</p>
                      </div>
                      
                      <div data-unique-id="1af1514b-d900-4035-8748-43dfbba3787a" data-loc="455:22-455:27" data-file-name="app/admin/page.tsx">
                        <label htmlFor="status" className="block text-sm font-medium text-gray-700" data-unique-id="288d1760-1bbd-4784-9160-8a9eba17df00" data-loc="456:24-456:100" data-file-name="app/admin/page.tsx">
                          Status
                        </label>
                        <select id="status" name="status" className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500" defaultValue={editingCard?.status ?? "active"} data-unique-id="e463c3d5-7df4-4450-afa3-84f77de5a793" data-loc="459:24-459:250" data-file-name="app/admin/page.tsx">
                          <option value="active" data-unique-id="01f69fbf-ee9e-41b8-bca5-3b4ffe29aebc" data-loc="460:26-460:49" data-file-name="app/admin/page.tsx">Active</option>
                          <option value="inactive" data-unique-id="381e014a-d9ba-4113-a02e-74036848cd3d" data-loc="461:26-461:51" data-file-name="app/admin/page.tsx">Inactive</option>
                        </select>
                      </div>
                      
                      <div className="flex justify-end space-x-3" data-unique-id="8adc33c1-aade-41d1-b4d7-44b31a7ce119" data-loc="465:22-465:66" data-file-name="app/admin/page.tsx">
                        <button type="button" onClick={() => setIsFormOpen(false)} className="py-2 px-4 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500" data-unique-id="037373d6-305f-4dc6-865d-50f958f1dcf7" data-loc="466:24-466:262" data-file-name="app/admin/page.tsx">
                          Cancel
                        </button>
                        <button type="submit" className="py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500" data-unique-id="273ce43d-8533-408d-9679-fab58086c317" data-loc="469:24-469:248" data-file-name="app/admin/page.tsx">
                          {editingCard ? "Update Card" : "Add Card"}
                        </button>
                      </div>
                    </div>
                  </form>
                </div>
              </div>}
          </div>}
        
        {/* Customers Tab */}
        {activeTab === "customers" && <div data-unique-id="3f502494-0b9d-448c-9c9c-2c8420e781f4" data-loc="480:38-480:43" data-file-name="app/admin/page.tsx">
            <div className="mb-6" data-unique-id="86789fb9-b77d-4405-a4d6-e2c901727194" data-loc="481:12-481:34" data-file-name="app/admin/page.tsx">
              <h2 className="text-xl font-semibold text-gray-900" data-unique-id="31c6a3ec-1133-468a-a6d0-b7a4811da4af" data-loc="482:14-482:66" data-file-name="app/admin/page.tsx">Registered Customers</h2>
              <p className="text-gray-500 mt-1" data-unique-id="cf74f042-8fd5-441c-b0cd-72b865ce5d1a" data-loc="483:14-483:48" data-file-name="app/admin/page.tsx">View all customer information</p>
            </div>
            
            <div className="bg-white shadow overflow-hidden sm:rounded-md" data-unique-id="6dfbac48-63e0-4a4f-84dc-13b12956557a" data-loc="486:12-486:75" data-file-name="app/admin/page.tsx">
              <table className="min-w-full divide-y divide-gray-200" data-unique-id="a155c693-eb1b-466d-bca3-92c9ab90d8c3" data-loc="487:14-487:69" data-file-name="app/admin/page.tsx">
                <thead className="bg-gray-50" data-unique-id="50fd1503-6316-4fed-af97-4a705a62de3e" data-loc="488:16-488:46" data-file-name="app/admin/page.tsx">
                  <tr data-unique-id="1e1ef2df-a049-42d8-843c-6439fc743358" data-loc="489:18-489:22" data-file-name="app/admin/page.tsx">
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider" data-unique-id="919918e9-bd15-4d2f-81bb-ee7f6e3c782c" data-loc="490:20-490:127" data-file-name="app/admin/page.tsx">
                      Customer
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider" data-unique-id="c8e340d3-7d6a-4a3d-80cd-3648532075ad" data-loc="493:20-493:127" data-file-name="app/admin/page.tsx">
                      Contact
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider" data-unique-id="a27dbc58-173e-45ce-8895-4802757f606a" data-loc="496:20-496:127" data-file-name="app/admin/page.tsx">
                      CIBIL
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider" data-unique-id="3ee90285-0167-4d2a-9e28-639cd2615e39" data-loc="499:20-499:127" data-file-name="app/admin/page.tsx">
                      Registered By
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider" data-unique-id="a7a5d57b-0a21-42d1-9074-13d46a66ca72" data-loc="502:20-502:127" data-file-name="app/admin/page.tsx">
                      Date
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200" data-unique-id="9d9f42ad-df01-4bd6-a7af-8eb2bcf6fb96" data-loc="507:16-507:69" data-file-name="app/admin/page.tsx">
                  {/* Customer data will be fetched from API */}
                  <tr data-unique-id="83a27579-6a9b-4139-94f0-16799ef572de" data-loc="509:18-509:22" data-file-name="app/admin/page.tsx">
                    <td colSpan={5} className="px-6 py-4 text-center text-gray-500" data-unique-id="336fdecd-ad00-4e1c-a12d-b48cd5162b23" data-loc="510:20-510:84" data-file-name="app/admin/page.tsx">
                      Customer data will be available via API
                    </td>
                  </tr>
                </tbody>
              </table>
              
              {/* Empty state handled above */}
            </div>
          </div>}
        
        {/* Activity Logs Tab */}
        {activeTab === "logs" && <div data-unique-id="2a788340-1fcb-4727-9c89-0eaea02490e9" data-loc="522:33-522:38" data-file-name="app/admin/page.tsx">
            <div className="mb-6" data-unique-id="1508a223-4fbf-4765-a1e1-5bea1e9cbce3" data-loc="523:12-523:34" data-file-name="app/admin/page.tsx">
              <h2 className="text-xl font-semibold text-gray-900" data-unique-id="5bc047b0-3a7a-46b6-991d-e182abe97e34" data-loc="524:14-524:66" data-file-name="app/admin/page.tsx">Activity Logs</h2>
              <p className="text-gray-500 mt-1" data-unique-id="0740e01d-c695-436b-9f36-76bbbfb88888" data-loc="525:14-525:48" data-file-name="app/admin/page.tsx">Track all system activities</p>
            </div>
            
            <div className="bg-white shadow overflow-hidden sm:rounded-md" data-unique-id="fa36566a-93d0-4330-b15a-5ff4d4511a37" data-loc="528:12-528:75" data-file-name="app/admin/page.tsx">
              <table className="min-w-full divide-y divide-gray-200" data-unique-id="8a11ef3c-6d99-456c-afa9-458e9026d79c" data-loc="529:14-529:69" data-file-name="app/admin/page.tsx">
                <thead className="bg-gray-50" data-unique-id="9c2840e4-bf28-4b8f-8077-4d1f5dce4aed" data-loc="530:16-530:46" data-file-name="app/admin/page.tsx">
                  <tr data-unique-id="ba6b642e-2786-4bc2-bbe0-65b847e53ba1" data-loc="531:18-531:22" data-file-name="app/admin/page.tsx">
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider" data-unique-id="296fc349-3f1e-46d4-8c55-f2621b87c910" data-loc="532:20-532:127" data-file-name="app/admin/page.tsx">
                      Timestamp
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider" data-unique-id="cac2fbcf-db04-40d7-a955-a70758b02426" data-loc="535:20-535:127" data-file-name="app/admin/page.tsx">
                      Action
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider" data-unique-id="03f9527a-5cdd-459b-a07d-b92183afb56e" data-loc="538:20-538:127" data-file-name="app/admin/page.tsx">
                      Agent
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider" data-unique-id="c580cafe-56d4-449a-82ef-eabc39476ea6" data-loc="541:20-541:127" data-file-name="app/admin/page.tsx">
                      Customer
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider" data-unique-id="0fadeb8f-124e-4a0d-9e16-8b3c4250bf31" data-loc="544:20-544:127" data-file-name="app/admin/page.tsx">
                      Details
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200" data-unique-id="a28726d8-1820-4f12-80fa-1987d82cfd59" data-loc="549:16-549:69" data-file-name="app/admin/page.tsx">
                  {/* Activity logs will be fetched from API */}
                  <tr data-unique-id="21c68871-07b7-4ee2-b0ec-83a068b49c4b" data-loc="551:18-551:22" data-file-name="app/admin/page.tsx">
                    <td colSpan={5} className="px-6 py-4 text-center text-gray-500" data-unique-id="c5e7ff1d-98b2-4cbf-b8a5-25eb30537b19" data-loc="552:20-552:84" data-file-name="app/admin/page.tsx">
                      Activity logs will be available via API
                    </td>
                  </tr>
                </tbody>
              </table>
              
              {/* Empty state handled above */}
            </div>
            
            {/* Export Button */}
            <div className="mt-6 flex justify-end" data-unique-id="494a0b66-2672-4776-bc94-6687e952e20d" data-loc="563:12-563:51" data-file-name="app/admin/page.tsx">
              <button onClick={() => {
            // In a real app, this would generate a CSV export
            toast.success("Data exported successfully (simulated)");
          }} className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500" data-unique-id="756c549d-7d68-4244-b52d-e79430b6a4a8" data-loc="564:14-567:243" data-file-name="app/admin/page.tsx">
                Export to CSV
              </button>
            </div>
            
            {/* Admin Phones Manager */}
            <div className="mt-8" data-unique-id="18996fe4-0966-49f6-8eeb-e45c7a42dea3" data-loc="573:12-573:34" data-file-name="app/admin/page.tsx">
              <AdminPhonesManager />
            </div>
          </div>}
      </main>
    </div>;
}