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
    return <div className="flex items-center justify-center min-h-screen" data-unique-id="6d0e0deb-25c2-4c83-a9d1-aa8063692957" data-loc="76:11-76:74" data-file-name="app/dashboard/customers/page.tsx">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-600" data-unique-id="2dd03882-d1e0-40f0-98fe-8a750d6b8c52" data-loc="77:8-77:99" data-file-name="app/dashboard/customers/page.tsx"></div>
      </div>;
  }
  return <div className="min-h-screen bg-gray-50" data-unique-id="b547bcbe-72af-47ff-9461-49d3254bd1c0" data-loc="80:9-80:50" data-file-name="app/dashboard/customers/page.tsx">
      {/* Header */}
      <header className="bg-white shadow" data-unique-id="f8f746c5-c070-4196-b825-88cf1f5fcb3a" data-loc="82:6-82:42" data-file-name="app/dashboard/customers/page.tsx">
        <div className="max-w-7xl mx-auto px-4 py-4 sm:px-6" data-unique-id="1545f2a0-accd-403f-b6a2-d0ea3c80040d" data-loc="83:8-83:61" data-file-name="app/dashboard/customers/page.tsx">
          <div className="flex items-center" data-unique-id="576d8815-8fed-4c5e-bee5-dddf2848e15a" data-loc="84:10-84:45" data-file-name="app/dashboard/customers/page.tsx">
            <button onClick={() => router.push("/dashboard")} className="mr-4 p-1 rounded-full hover:bg-gray-100" data-unique-id="64f3c6b6-381d-4950-b766-9f70341cda36" data-loc="85:12-85:114" data-file-name="app/dashboard/customers/page.tsx">
              <ArrowLeft className="h-5 w-5 text-gray-600" />
            </button>
            <h1 className="text-xl font-bold text-gray-900" data-unique-id="224e0bf8-b6a5-4fef-995e-4bdedc35e610" data-loc="88:12-88:60" data-file-name="app/dashboard/customers/page.tsx">My Customers</h1>
          </div>
        </div>
      </header>
      
      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 py-8 sm:px-6" data-unique-id="b745bcaa-57da-4457-948e-57a303af9720" data-loc="94:6-94:60" data-file-name="app/dashboard/customers/page.tsx">
        {/* Search and Filter */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 space-y-4 md:space-y-0" data-unique-id="b4c2b61a-ae8b-4ba5-a4ce-e2cd8d33aaea" data-loc="96:8-96:123" data-file-name="app/dashboard/customers/page.tsx">
          <div className="w-full md:w-auto" data-unique-id="5dd5e053-8720-40a0-83cf-0104a4c6ca8b" data-loc="97:10-97:44" data-file-name="app/dashboard/customers/page.tsx">
            <div className="relative" data-unique-id="700548e9-fca6-48fb-8265-d6f6e037c43c" data-loc="98:12-98:38" data-file-name="app/dashboard/customers/page.tsx">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none" data-unique-id="2eedac6c-7af4-4717-8f33-4c9df2d363c8" data-loc="99:14-99:100" data-file-name="app/dashboard/customers/page.tsx">
                <Search className="h-5 w-5 text-gray-400" />
              </div>
              <input type="text" className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:placeholder-gray-400 focus:ring-1 focus:ring-blue-500 focus:border-blue-500 sm:text-sm" placeholder="Search by name, phone, email, or PAN" value={searchTerm} onChange={e => setSearchTerm(e.target.value)} data-unique-id="576368fb-eebf-4c21-a381-2e442de1e11b" data-loc="102:14-102:378" data-file-name="app/dashboard/customers/page.tsx" />
            </div>
          </div>
          
          <div className="flex space-x-3" data-unique-id="8bc3e91c-ef90-4f3f-a45c-9b1dc95918af" data-loc="106:10-106:42" data-file-name="app/dashboard/customers/page.tsx">
            <button onClick={() => router.push("/dashboard/customer-form")} className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500" data-unique-id="177595c5-ab4b-4ab7-936b-553a0e9bab42" data-loc="107:12-107:303" data-file-name="app/dashboard/customers/page.tsx">
              <UserPlus className="h-4 w-4 mr-2" /> Add New Customer
            </button>
          </div>
        </div>
        
        {/* Customer List */}
        <div className="bg-white shadow overflow-hidden sm:rounded-md" data-unique-id="05f18fd8-c3f9-409d-bbf8-48e84d379813" data-loc="114:8-114:71" data-file-name="app/dashboard/customers/page.tsx">
          {filteredCustomers.length > 0 ? <table className="min-w-full divide-y divide-gray-200" data-unique-id="c7b70fcd-ec49-4683-bc75-2a2f396ea209" data-loc="115:42-115:97" data-file-name="app/dashboard/customers/page.tsx">
              <thead className="bg-gray-50" data-unique-id="2330628a-d77b-434c-8f97-6ca3da6eef2b" data-loc="116:14-116:44" data-file-name="app/dashboard/customers/page.tsx">
                <tr data-unique-id="5ae7fed1-5fd5-479e-bba2-a89fbbc94c1e" data-loc="117:16-117:20" data-file-name="app/dashboard/customers/page.tsx">
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer" onClick={() => handleSort("name")} data-unique-id="8e1e28ff-7912-4d3a-b39b-8569ef154c43" data-loc="118:18-118:175" data-file-name="app/dashboard/customers/page.tsx">
                    <div className="flex items-center" data-unique-id="89aa8881-cc12-4b6e-8d71-2ad6326d0bf3" data-loc="119:20-119:55" data-file-name="app/dashboard/customers/page.tsx">
                      Name
                      {sortField === "name" && (sortDirection === "asc" ? <SortAsc className="w-4 h-4 ml-1" /> : <SortDesc className="w-4 h-4 ml-1" />)}
                    </div>
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider" data-unique-id="3c03190d-488e-482d-b43f-2c576f16b059" data-loc="124:18-124:125" data-file-name="app/dashboard/customers/page.tsx">
                    Contact
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer" onClick={() => handleSort("cibilScore")} data-unique-id="c4ac7364-c318-4b6e-b6eb-863561a5d4b2" data-loc="127:18-127:181" data-file-name="app/dashboard/customers/page.tsx">
                    <div className="flex items-center" data-unique-id="532f9e0b-169e-450c-b28b-de8ba0597f9c" data-loc="128:20-128:55" data-file-name="app/dashboard/customers/page.tsx">
                      CIBIL Score
                      {sortField === "cibilScore" && (sortDirection === "asc" ? <SortAsc className="w-4 h-4 ml-1" /> : <SortDesc className="w-4 h-4 ml-1" />)}
                    </div>
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer" onClick={() => handleSort("timestamp")} data-unique-id="7ab6d838-4f66-4724-9147-6022dd6ced79" data-loc="133:18-133:180" data-file-name="app/dashboard/customers/page.tsx">
                    <div className="flex items-center" data-unique-id="81b9beae-de3a-48b9-ba8c-07a6ca9f7b27" data-loc="134:20-134:55" data-file-name="app/dashboard/customers/page.tsx">
                      Registered On
                      {sortField === "timestamp" && (sortDirection === "asc" ? <SortAsc className="w-4 h-4 ml-1" /> : <SortDesc className="w-4 h-4 ml-1" />)}
                    </div>
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider" data-unique-id="66f4ce35-b58c-48be-90ab-35adddcbae1d" data-loc="139:18-139:125" data-file-name="app/dashboard/customers/page.tsx">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200" data-unique-id="74ceeb63-d9c5-4b2f-b68b-7c40ec10e225" data-loc="144:14-144:67" data-file-name="app/dashboard/customers/page.tsx">
                {filteredCustomers.map(customer => <tr key={customer._id} className="hover:bg-gray-50" data-unique-id="8c8bfd29-ef78-4908-a03c-1d60b3531422" data-loc="145:51-145:103" data-file-name="app/dashboard/customers/page.tsx">
                    <td className="px-6 py-4 whitespace-nowrap" data-unique-id="18ef315d-5b94-4106-aa09-a275a79bec13" data-loc="146:20-146:64" data-file-name="app/dashboard/customers/page.tsx">
                      <div className="text-sm font-medium text-gray-900" data-unique-id="3e1e11c0-c7b8-4ca0-b150-3a9e8cdb5ab6" data-loc="147:22-147:73" data-file-name="app/dashboard/customers/page.tsx">{customer.name}</div>
                      <div className="text-sm text-gray-500" data-unique-id="d727e22a-8273-4a8b-a4da-502efa1b2e4f" data-loc="148:22-148:61" data-file-name="app/dashboard/customers/page.tsx">{customer.pan}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap" data-unique-id="af3f9132-b25a-45bc-8aec-81bddcceec35" data-loc="150:20-150:64" data-file-name="app/dashboard/customers/page.tsx">
                      <div className="flex items-center text-sm text-gray-500" data-unique-id="66a28854-9af0-428f-852f-e29388b9f416" data-loc="151:22-151:79" data-file-name="app/dashboard/customers/page.tsx">
                        <Phone className="h-4 w-4 mr-1" /> {customer.phone}
                      </div>
                      <div className="flex items-center text-sm text-gray-500" data-unique-id="6ec56db2-a205-47a5-8927-5938cb98b23c" data-loc="154:22-154:79" data-file-name="app/dashboard/customers/page.tsx">
                        <Mail className="h-4 w-4 mr-1" /> {customer.email}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap" data-unique-id="9dbba514-11d9-4fb3-984e-16d02afee68b" data-loc="158:20-158:64" data-file-name="app/dashboard/customers/page.tsx">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${(customer.cibilScore ?? 0) >= 750 ? 'bg-green-100 text-green-800' : (customer.cibilScore ?? 0) >= 700 ? 'bg-blue-100 text-blue-800' : (customer.cibilScore ?? 0) >= 650 ? 'bg-yellow-100 text-yellow-800' : (customer.cibilScore ?? 0) > 0 ? 'bg-red-100 text-red-800' : 'bg-gray-100 text-gray-800'}`} data-unique-id="103ad6dd-9526-4077-873f-e90eb056dcd9" data-loc="159:22-159:410" data-file-name="app/dashboard/customers/page.tsx">
                        {customer.cibilScore ?? 'Not Available'}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500" data-unique-id="481abdad-ba75-4301-9120-8157a932d306" data-loc="163:20-163:86" data-file-name="app/dashboard/customers/page.tsx">
                      <div className="flex items-center" data-unique-id="f2bff114-de4b-4e02-acba-3f45ea06f8a2" data-loc="164:22-164:57" data-file-name="app/dashboard/customers/page.tsx">
                        <Calendar className="h-4 w-4 mr-1" data-unique-id="490a586b-c96c-4c4b-8fd3-5664f689bb11" data-loc="165:24-165:61" data-file-name="app/dashboard/customers/page.tsx" />
                        {format(new Date(customer.createdAt), 'dd MMM yyyy')}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm" data-unique-id="bc422710-833a-4db5-b1b8-631020a84f43" data-loc="169:20-169:72" data-file-name="app/dashboard/customers/page.tsx">
                      <button onClick={() => router.push(`/dashboard/eligibility/${customer._id}`)} className="text-blue-600 hover:text-blue-900" data-unique-id="d0d6b654-24ca-463e-a341-61a456fc9981" data-loc="170:22-170:146" data-file-name="app/dashboard/customers/page.tsx">
                        View Eligibility
                      </button>
                    </td>
                  </tr>)}
              </tbody>
            </table> : <div className="text-center py-12" data-unique-id="594a3067-2d11-4bd2-afbe-bbdd8915ffe1" data-loc="176:23-176:58" data-file-name="app/dashboard/customers/page.tsx">
              <div className="flex justify-center mb-4" data-unique-id="ff19a740-5293-4b1b-ab79-e671225eba10" data-loc="177:14-177:56" data-file-name="app/dashboard/customers/page.tsx">
                <CreditCard className="h-12 w-12 text-gray-300" />
              </div>
              <h3 className="text-lg font-medium text-gray-900 mb-1" data-unique-id="94b52fde-a65f-4718-88f1-33ca18d2c32d" data-loc="180:14-180:69" data-file-name="app/dashboard/customers/page.tsx">No customers found</h3>
              {searchTerm ? <p className="text-gray-500 mb-4" data-unique-id="a02906a3-aaec-4451-a446-a9fa6fe1c19b" data-loc="181:28-181:62" data-file-name="app/dashboard/customers/page.tsx">No results match your search criteria</p> : <p className="text-gray-500 mb-4" data-unique-id="c9e93d91-bad7-449b-889d-a8ce9eebf5d2" data-loc="181:106-181:140" data-file-name="app/dashboard/customers/page.tsx">Start by registering your first customer</p>}
              <button onClick={() => router.push("/dashboard/customer-form")} className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700" data-unique-id="912193ea-6089-45ef-8e87-f95531c77c4e" data-loc="182:14-182:233" data-file-name="app/dashboard/customers/page.tsx">
                <UserPlus className="h-4 w-4 mr-2" /> Add Customer
              </button>
            </div>}
        </div>
      </main>
    </div>;
}