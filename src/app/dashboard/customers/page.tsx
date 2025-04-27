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
    return <div className="flex items-center justify-center min-h-screen" data-unique-id="255fd461-7d21-4768-a837-75d968523435" data-loc="76:11-76:74" data-file-name="app/dashboard/customers/page.tsx">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-600" data-unique-id="e04c010d-6bcc-4f06-b00b-ee822dfd991f" data-loc="77:8-77:99" data-file-name="app/dashboard/customers/page.tsx"></div>
      </div>;
  }
  return <div className="min-h-screen bg-gray-50" data-unique-id="397f0646-2223-4289-aa42-eee4a4b3378b" data-loc="80:9-80:50" data-file-name="app/dashboard/customers/page.tsx">
      {/* Header */}
      <header className="bg-white shadow" data-unique-id="a2676187-385c-4ad4-ada1-d4f5d5c21d73" data-loc="82:6-82:42" data-file-name="app/dashboard/customers/page.tsx">
        <div className="max-w-7xl mx-auto px-4 py-4 sm:px-6" data-unique-id="b88c78f0-280c-4bba-b328-34e33f463fe5" data-loc="83:8-83:61" data-file-name="app/dashboard/customers/page.tsx">
          <div className="flex items-center" data-unique-id="e636dad6-6bcb-4f04-a222-f95e6a9a5fde" data-loc="84:10-84:45" data-file-name="app/dashboard/customers/page.tsx">
            <button onClick={() => router.push("/dashboard")} className="mr-4 p-1 rounded-full hover:bg-gray-100" data-unique-id="65c1a075-2db1-4820-a605-0765e41abd74" data-loc="85:12-85:114" data-file-name="app/dashboard/customers/page.tsx">
              <ArrowLeft className="h-5 w-5 text-gray-600" />
            </button>
            <h1 className="text-xl font-bold text-gray-900" data-unique-id="8fa7a6c3-4aec-4bd0-a148-1358aa11924b" data-loc="88:12-88:60" data-file-name="app/dashboard/customers/page.tsx">My Customers</h1>
          </div>
        </div>
      </header>
      
      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 py-8 sm:px-6" data-unique-id="c9dd096b-f4cd-4732-9cdc-dcda1a8b24a4" data-loc="94:6-94:60" data-file-name="app/dashboard/customers/page.tsx">
        {/* Search and Filter */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 space-y-4 md:space-y-0" data-unique-id="fc645654-a2f6-46af-801a-80c4e326585f" data-loc="96:8-96:123" data-file-name="app/dashboard/customers/page.tsx">
          <div className="w-full md:w-auto" data-unique-id="9f9afe14-b987-45f8-8f79-9f3147c71692" data-loc="97:10-97:44" data-file-name="app/dashboard/customers/page.tsx">
            <div className="relative" data-unique-id="25378e28-31c4-453e-b566-916944fbead8" data-loc="98:12-98:38" data-file-name="app/dashboard/customers/page.tsx">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none" data-unique-id="c9def8ed-e452-4b7f-98e3-3710b2789c40" data-loc="99:14-99:100" data-file-name="app/dashboard/customers/page.tsx">
                <Search className="h-5 w-5 text-gray-400" />
              </div>
              <input type="text" className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:placeholder-gray-400 focus:ring-1 focus:ring-blue-500 focus:border-blue-500 sm:text-sm" placeholder="Search by name, phone, email, or PAN" value={searchTerm} onChange={e => setSearchTerm(e.target.value)} data-unique-id="5baeab89-1cd5-4c0d-85f6-0d1f76b82678" data-loc="102:14-102:378" data-file-name="app/dashboard/customers/page.tsx" />
            </div>
          </div>
          
          <div className="flex space-x-3" data-unique-id="092f8871-4ebd-4f6e-b737-8557c2041a01" data-loc="106:10-106:42" data-file-name="app/dashboard/customers/page.tsx">
            <button onClick={() => router.push("/dashboard/customer-form")} className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500" data-unique-id="602060ec-666a-422c-b127-90fd511d57a4" data-loc="107:12-107:303" data-file-name="app/dashboard/customers/page.tsx">
              <UserPlus className="h-4 w-4 mr-2" /> Add New Customer
            </button>
          </div>
        </div>
        
        {/* Customer List */}
        <div className="bg-white shadow overflow-hidden sm:rounded-md" data-unique-id="b8ecc2d0-3cf5-416e-8d57-0b69f130fe76" data-loc="114:8-114:71" data-file-name="app/dashboard/customers/page.tsx">
          {filteredCustomers.length > 0 ? <table className="min-w-full divide-y divide-gray-200" data-unique-id="6d71c085-00f2-4df2-b3bd-d71001e9d5a2" data-loc="115:42-115:97" data-file-name="app/dashboard/customers/page.tsx">
              <thead className="bg-gray-50" data-unique-id="8cfd2a31-8fe2-4dfe-83ef-ad56c722e6f1" data-loc="116:14-116:44" data-file-name="app/dashboard/customers/page.tsx">
                <tr data-unique-id="815b439f-1e87-44fb-bc1a-40c2f86bb049" data-loc="117:16-117:20" data-file-name="app/dashboard/customers/page.tsx">
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer" onClick={() => handleSort("name")} data-unique-id="d77ecd51-65bf-4624-b55c-413b3fb016ea" data-loc="118:18-118:175" data-file-name="app/dashboard/customers/page.tsx">
                    <div className="flex items-center" data-unique-id="6911495d-2975-4eb7-8ada-a8252dfb6c74" data-loc="119:20-119:55" data-file-name="app/dashboard/customers/page.tsx">
                      Name
                      {sortField === "name" && (sortDirection === "asc" ? <SortAsc className="w-4 h-4 ml-1" /> : <SortDesc className="w-4 h-4 ml-1" />)}
                    </div>
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider" data-unique-id="4e614ec7-0de1-4f58-b877-f2184c319720" data-loc="124:18-124:125" data-file-name="app/dashboard/customers/page.tsx">
                    Contact
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer" onClick={() => handleSort("cibilScore")} data-unique-id="c0c24c6c-90c6-4210-b133-cc96e1a5d1ed" data-loc="127:18-127:181" data-file-name="app/dashboard/customers/page.tsx">
                    <div className="flex items-center" data-unique-id="f4a8d972-620b-4e49-b328-942c9f04d056" data-loc="128:20-128:55" data-file-name="app/dashboard/customers/page.tsx">
                      CIBIL Score
                      {sortField === "cibilScore" && (sortDirection === "asc" ? <SortAsc className="w-4 h-4 ml-1" /> : <SortDesc className="w-4 h-4 ml-1" />)}
                    </div>
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer" onClick={() => handleSort("timestamp")} data-unique-id="388074e6-8abe-4035-b1d7-e1fde37ecc9e" data-loc="133:18-133:180" data-file-name="app/dashboard/customers/page.tsx">
                    <div className="flex items-center" data-unique-id="0f6a6169-3b36-4c1b-937a-c66bf2558bd8" data-loc="134:20-134:55" data-file-name="app/dashboard/customers/page.tsx">
                      Registered On
                      {sortField === "timestamp" && (sortDirection === "asc" ? <SortAsc className="w-4 h-4 ml-1" /> : <SortDesc className="w-4 h-4 ml-1" />)}
                    </div>
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider" data-unique-id="84c7f332-ef33-48a2-96d4-737e3667640e" data-loc="139:18-139:125" data-file-name="app/dashboard/customers/page.tsx">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200" data-unique-id="fc7ee9db-246b-4895-96a6-607c1461f929" data-loc="144:14-144:67" data-file-name="app/dashboard/customers/page.tsx">
                {filteredCustomers.map(customer => <tr key={customer._id} className="hover:bg-gray-50" data-unique-id="c367ee3f-f68d-41df-a740-3240a9f85674" data-loc="145:51-145:103" data-file-name="app/dashboard/customers/page.tsx">
                    <td className="px-6 py-4 whitespace-nowrap" data-unique-id="2727c7cb-b71e-4665-a4c5-1acb914e687d" data-loc="146:20-146:64" data-file-name="app/dashboard/customers/page.tsx">
                      <div className="text-sm font-medium text-gray-900" data-unique-id="af54d336-7111-40f2-9756-1aa1a5f5e61d" data-loc="147:22-147:73" data-file-name="app/dashboard/customers/page.tsx">{customer.name}</div>
                      <div className="text-sm text-gray-500" data-unique-id="42f1ffef-de71-483c-b62f-1feb9bbab036" data-loc="148:22-148:61" data-file-name="app/dashboard/customers/page.tsx">{customer.pan}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap" data-unique-id="ac67b8e7-fffc-4a70-8463-1c7845328908" data-loc="150:20-150:64" data-file-name="app/dashboard/customers/page.tsx">
                      <div className="flex items-center text-sm text-gray-500" data-unique-id="acad0780-ca15-4ccf-8a4c-121d375f76a2" data-loc="151:22-151:79" data-file-name="app/dashboard/customers/page.tsx">
                        <Phone className="h-4 w-4 mr-1" /> {customer.phone}
                      </div>
                      <div className="flex items-center text-sm text-gray-500" data-unique-id="b0022545-ef00-41c3-b546-89718e27b8ad" data-loc="154:22-154:79" data-file-name="app/dashboard/customers/page.tsx">
                        <Mail className="h-4 w-4 mr-1" /> {customer.email}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap" data-unique-id="5138f364-263f-4fea-b30e-8f3302f1a95f" data-loc="158:20-158:64" data-file-name="app/dashboard/customers/page.tsx">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${(customer.cibilScore ?? 0) >= 750 ? 'bg-green-100 text-green-800' : (customer.cibilScore ?? 0) >= 700 ? 'bg-blue-100 text-blue-800' : (customer.cibilScore ?? 0) >= 650 ? 'bg-yellow-100 text-yellow-800' : (customer.cibilScore ?? 0) > 0 ? 'bg-red-100 text-red-800' : 'bg-gray-100 text-gray-800'}`} data-unique-id="debc0664-84cf-42a9-a6e1-8abf10ffbc18" data-loc="159:22-159:410" data-file-name="app/dashboard/customers/page.tsx">
                        {customer.cibilScore ?? 'Not Available'}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500" data-unique-id="403acbbd-6b2f-44f2-8476-bc28bf58830b" data-loc="163:20-163:86" data-file-name="app/dashboard/customers/page.tsx">
                      <div className="flex items-center" data-unique-id="a5c61227-b067-4e3c-a7a5-adcf82dbca0d" data-loc="164:22-164:57" data-file-name="app/dashboard/customers/page.tsx">
                        <Calendar className="h-4 w-4 mr-1" data-unique-id="db90e313-9def-46f4-828f-6b1b7f7c3927" data-loc="165:24-165:61" data-file-name="app/dashboard/customers/page.tsx" />
                        {format(new Date(customer.createdAt), 'dd MMM yyyy')}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm" data-unique-id="d6803da8-d5cb-4ea6-a45e-7c21e89cb470" data-loc="169:20-169:72" data-file-name="app/dashboard/customers/page.tsx">
                      <button onClick={() => router.push(`/dashboard/eligibility/${customer._id}`)} className="text-blue-600 hover:text-blue-900" data-unique-id="a16f4037-f6a7-496a-afeb-406b556bec28" data-loc="170:22-170:146" data-file-name="app/dashboard/customers/page.tsx">
                        View Eligibility
                      </button>
                    </td>
                  </tr>)}
              </tbody>
            </table> : <div className="text-center py-12" data-unique-id="5f01ad7f-42dd-47dc-9cd0-1a54cd876eba" data-loc="176:23-176:58" data-file-name="app/dashboard/customers/page.tsx">
              <div className="flex justify-center mb-4" data-unique-id="52e6d8b4-1d65-421a-9f52-b210a73f9cd3" data-loc="177:14-177:56" data-file-name="app/dashboard/customers/page.tsx">
                <CreditCard className="h-12 w-12 text-gray-300" />
              </div>
              <h3 className="text-lg font-medium text-gray-900 mb-1" data-unique-id="71506bb7-4cf6-44a1-b8d6-3094d676ff75" data-loc="180:14-180:69" data-file-name="app/dashboard/customers/page.tsx">No customers found</h3>
              {searchTerm ? <p className="text-gray-500 mb-4" data-unique-id="3286125b-54e5-451c-8711-d840e3fda00a" data-loc="181:28-181:62" data-file-name="app/dashboard/customers/page.tsx">No results match your search criteria</p> : <p className="text-gray-500 mb-4" data-unique-id="c65de6fd-9022-4667-87d0-6ab7abc181fa" data-loc="181:106-181:140" data-file-name="app/dashboard/customers/page.tsx">Start by registering your first customer</p>}
              <button onClick={() => router.push("/dashboard/customer-form")} className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700" data-unique-id="1cbe437a-3caa-4fec-99b0-51fa77f76255" data-loc="182:14-182:233" data-file-name="app/dashboard/customers/page.tsx">
                <UserPlus className="h-4 w-4 mr-2" /> Add Customer
              </button>
            </div>}
        </div>
      </main>
    </div>;
}