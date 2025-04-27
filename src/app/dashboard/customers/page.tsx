"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { ArrowLeft, Phone, Mail, Calendar, CreditCard, Search, Filter, SortAsc, SortDesc, UserPlus } from "lucide-react";
import { Customer } from "@/types";
import { cn } from "@/lib/utils";
import { format } from "date-fns";
import { customersApi, supabaseApi } from "@/lib/api-service";
export default function CustomersPage() {
  const router = useRouter();
  const [agent, setAgent] = useState<{
    name: string;
    phone: string;
  } | null>(null);
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [sortField, setSortField] = useState<"name" | "timestamp" | "cibilScore">("timestamp");
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("desc");
  useEffect(() => {
    // Check if user is logged in
    const isBrowser = typeof window !== 'undefined';
    const agentData = isBrowser ? localStorage.getItem("salesAgent") : null;
    if (!agentData) {
      router.push("/");
      return;
    }
    const parsedAgent = JSON.parse(agentData);
    setAgent(parsedAgent);

    // Get customers for this agent via API
    const fetchCustomers = async () => {
      try {
        const {
          customers: agentCustomers
        } = await customersApi.getAll();
        setCustomers(sortCustomers(agentCustomers, sortField, sortDirection));
      } catch (error) {
        console.error("Error fetching customers:", error);
      }
    };
    fetchCustomers();

    // Subscribe to real-time updates for customers
    const unsubscribe = supabaseApi.subscribeToTable('customers', payload => {
      console.log('Customer data changed:', payload);
      // Refresh customer data when changes occur
      fetchCustomers();
    });

    // Clean up subscription on unmount
    return () => {
      unsubscribe();
    };
  }, [router, sortField, sortDirection]);
  const sortCustomers = (customersList: Customer[], field: string, direction: string) => {
    return [...customersList].sort((a: any, b: any) => {
      if (field === "cibilScore") {
        const scoreA = a.cibilScore ?? 0;
        const scoreB = b.cibilScore ?? 0;
        return direction === "asc" ? scoreA - scoreB : scoreB - scoreA;
      }
      if (a[field] < b[field]) return direction === "asc" ? -1 : 1;
      if (a[field] > b[field]) return direction === "asc" ? 1 : -1;
      return 0;
    });
  };
  const handleSort = (field: "name" | "timestamp" | "cibilScore") => {
    const direction = field === sortField && sortDirection === "asc" ? "desc" : "asc";
    setSortField(field);
    setSortDirection(direction);
    setCustomers(sortCustomers(customers, field, direction));
  };
  const filteredCustomers = customers.filter(customer => customer.name.toLowerCase().includes(searchTerm.toLowerCase()) || customer.phone.includes(searchTerm) || customer.email.toLowerCase().includes(searchTerm.toLowerCase()) || customer.pan && customer.pan.toLowerCase().includes(searchTerm.toLowerCase()));
  if (!agent) {
    return <div className="flex items-center justify-center min-h-screen" data-unique-id="84a995bd-c730-4d8a-b705-fd17f483782d" data-loc="76:11-76:74" data-file-name="app/dashboard/customers/page.tsx">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-600" data-unique-id="d437001f-12de-46e0-9dfa-017f7e4100bd" data-loc="77:8-77:99" data-file-name="app/dashboard/customers/page.tsx"></div>
      </div>;
  }
  return <div className="min-h-screen bg-gray-50" data-unique-id="c8e8d13c-1b82-4252-b625-112e023d3a41" data-loc="80:9-80:50" data-file-name="app/dashboard/customers/page.tsx">
      {/* Header */}
      <header className="bg-white shadow" data-unique-id="b10d6e19-0cf8-4438-9981-b3b8604a4f9d" data-loc="82:6-82:42" data-file-name="app/dashboard/customers/page.tsx">
        <div className="max-w-7xl mx-auto px-4 py-4 sm:px-6" data-unique-id="8af62a14-618f-47af-947a-6aab3883f2de" data-loc="83:8-83:61" data-file-name="app/dashboard/customers/page.tsx">
          <div className="flex items-center" data-unique-id="ec5afa5f-2203-4db0-a691-73fdc344c020" data-loc="84:10-84:45" data-file-name="app/dashboard/customers/page.tsx">
            <button onClick={() => router.push("/dashboard")} className="mr-4 p-1 rounded-full hover:bg-gray-100" data-unique-id="d45697d3-9169-4960-8e5b-e9bd8a14c8a6" data-loc="85:12-85:114" data-file-name="app/dashboard/customers/page.tsx">
              <ArrowLeft className="h-5 w-5 text-gray-600" />
            </button>
            <h1 className="text-xl font-bold text-gray-900" data-unique-id="27c02213-7e09-4b87-8380-82167a7fa00f" data-loc="88:12-88:60" data-file-name="app/dashboard/customers/page.tsx">My Customers</h1>
          </div>
        </div>
      </header>
      
      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 py-8 sm:px-6" data-unique-id="6ebedaab-a4b8-43aa-b640-ac33eabd838c" data-loc="94:6-94:60" data-file-name="app/dashboard/customers/page.tsx">
        {/* Search and Filter */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 space-y-4 md:space-y-0" data-unique-id="eafa0972-4779-4aff-b0be-922e2e9fd868" data-loc="96:8-96:123" data-file-name="app/dashboard/customers/page.tsx">
          <div className="w-full md:w-auto" data-unique-id="80c3dc10-8401-4339-8801-4ef7040a00bc" data-loc="97:10-97:44" data-file-name="app/dashboard/customers/page.tsx">
            <div className="relative" data-unique-id="c931a7af-7816-40cc-9666-82e846cf73b3" data-loc="98:12-98:38" data-file-name="app/dashboard/customers/page.tsx">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none" data-unique-id="2d3e7bb7-c1d6-415b-a443-177d77e71911" data-loc="99:14-99:100" data-file-name="app/dashboard/customers/page.tsx">
                <Search className="h-5 w-5 text-gray-400" />
              </div>
              <input type="text" className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:placeholder-gray-400 focus:ring-1 focus:ring-blue-500 focus:border-blue-500 sm:text-sm" placeholder="Search by name, phone, email, or PAN" value={searchTerm} onChange={e => setSearchTerm(e.target.value)} data-unique-id="30122b10-2c5a-4224-a7a7-a70b2446d7ec" data-loc="102:14-102:378" data-file-name="app/dashboard/customers/page.tsx" />
            </div>
          </div>
          
          <div className="flex space-x-3" data-unique-id="07216c12-c075-49fa-9f46-48294a0a11ed" data-loc="106:10-106:42" data-file-name="app/dashboard/customers/page.tsx">
            <button onClick={() => router.push("/dashboard/customer-form")} className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500" data-unique-id="82b96c0a-4fc5-4f6b-869e-e21b09a13db5" data-loc="107:12-107:303" data-file-name="app/dashboard/customers/page.tsx">
              <UserPlus className="h-4 w-4 mr-2" /> Add New Customer
            </button>
          </div>
        </div>
        
        {/* Customer List */}
        <div className="bg-white shadow overflow-hidden sm:rounded-md" data-unique-id="dd6d7aed-aa56-4ca4-9592-af81fd1ae0e9" data-loc="114:8-114:71" data-file-name="app/dashboard/customers/page.tsx">
          {filteredCustomers.length > 0 ? <table className="min-w-full divide-y divide-gray-200" data-unique-id="5943dae2-6a0d-4099-af48-f1b0e158c9cd" data-loc="115:42-115:97" data-file-name="app/dashboard/customers/page.tsx">
              <thead className="bg-gray-50" data-unique-id="75658c8d-f6d6-48bd-9623-43c5b45fc6d9" data-loc="116:14-116:44" data-file-name="app/dashboard/customers/page.tsx">
                <tr data-unique-id="63f288fd-a32c-4dfe-8993-a6c7329679ce" data-loc="117:16-117:20" data-file-name="app/dashboard/customers/page.tsx">
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer" onClick={() => handleSort("name")} data-unique-id="441ebfd7-f80e-4d6d-b68b-6c0ca3f91727" data-loc="118:18-118:175" data-file-name="app/dashboard/customers/page.tsx">
                    <div className="flex items-center" data-unique-id="e15f99ee-2ebf-4fad-9594-d4c0bbaaa041" data-loc="119:20-119:55" data-file-name="app/dashboard/customers/page.tsx">
                      Name
                      {sortField === "name" && (sortDirection === "asc" ? <SortAsc className="w-4 h-4 ml-1" /> : <SortDesc className="w-4 h-4 ml-1" />)}
                    </div>
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider" data-unique-id="d029dab7-e0e8-438c-8f56-bc8b2f58f17c" data-loc="124:18-124:125" data-file-name="app/dashboard/customers/page.tsx">
                    Contact
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer" onClick={() => handleSort("cibilScore")} data-unique-id="a7a28f0c-6b67-44af-9181-41f30db8e215" data-loc="127:18-127:181" data-file-name="app/dashboard/customers/page.tsx">
                    <div className="flex items-center" data-unique-id="d2ed51d9-45f1-49bd-a99e-b2d2a5911a40" data-loc="128:20-128:55" data-file-name="app/dashboard/customers/page.tsx">
                      CIBIL Score
                      {sortField === "cibilScore" && (sortDirection === "asc" ? <SortAsc className="w-4 h-4 ml-1" /> : <SortDesc className="w-4 h-4 ml-1" />)}
                    </div>
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer" onClick={() => handleSort("timestamp")} data-unique-id="16682513-8b87-4fcf-9e35-e86c2cb7f070" data-loc="133:18-133:180" data-file-name="app/dashboard/customers/page.tsx">
                    <div className="flex items-center" data-unique-id="22f247ca-e53b-4bfe-9c27-b3e5c2882aa9" data-loc="134:20-134:55" data-file-name="app/dashboard/customers/page.tsx">
                      Registered On
                      {sortField === "timestamp"