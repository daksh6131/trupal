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
    return <div className="flex items-center justify-center min-h-screen" data-unique-id="15c95ac2-1df5-49fa-aa82-e199dea14019" data-loc="76:11-76:74" data-file-name="app/dashboard/customers/page.tsx">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-600" data-unique-id="68043edf-191a-43ca-bc02-79a0c0161074" data-loc="77:8-77:99" data-file-name="app/dashboard/customers/page.tsx"></div>
      </div>;
  }
  return <div className="min-h-screen bg-gray-50" data-unique-id="d792c8b9-0640-4d27-8790-6c3871fb085d" data-loc="80:9-80:50" data-file-name="app/dashboard/customers/page.tsx">
      {/* Header */}
      <header className="bg-white shadow" data-unique-id="feea2f6f-fbb8-4fe7-9f18-eb084d8da868" data-loc="82:6-82:42" data-file-name="app/dashboard/customers/page.tsx">
        <div className="max-w-7xl mx-auto px-4 py-4 sm:px-6" data-unique-id="438b759d-3e24-442e-8784-23a2550822f3" data-loc="83:8-83:61" data-file-name="app/dashboard/customers/page.tsx">
          <div className="flex items-center" data-unique-id="b4ba669a-432d-437d-bfe9-f734034bcbf4" data-loc="84:10-84:45" data-file-name="app/dashboard/customers/page.tsx">
            <button onClick={() => router.push("/dashboard")} className="mr-4 p-1 rounded-full hover:bg-gray-100" data-unique-id="bbe772dd-2057-4706-a963-9b4ccb781b56" data-loc="85:12-85:114" data-file-name="app/dashboard/customers/page.tsx">
              <ArrowLeft className="h-5 w-5 text-gray-600" />
            </button>
            <h1 className="text-xl font-bold text-gray-900" data-unique-id="364832b1-116c-4541-bd1e-05ebfd3ea434" data-loc="88:12-88:60" data-file-name="app/dashboard/customers/page.tsx">My Customers</h1>
          </div>
        </div>
      </header>
      
      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 py-8 sm:px-6" data-unique-id="f1d375f9-54fa-4bc5-8fd5-edece14a9678" data-loc="94:6-94:60" data-file-name="app/dashboard/customers/page.tsx">
        {/* Search and Filter */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 space-y-4 md:space-y-0" data-unique-id="aae5880e-e21b-4d2d-a38d-e4d377c66a41" data-loc="96:8-96:123" data-file-name="app/dashboard/customers/page.tsx">
          <div className="w-full md:w-auto" data-unique-id="7e1b2616-9bf2-4e59-9c5a-4d9ec38e82d8" data-loc="97:10-97:44" data-file-name="app/dashboard/customers/page.tsx">
            <div className="relative" data-unique-id="9bebc6bb-dd48-45d6-85d6-a6e00da17b94" data-loc="98:12-98:38" data-file-name="app/dashboard/customers/page.tsx">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none" data-unique-id="d95bb03f-8050-4a4d-ac45-81d1ec6a9a16" data-loc="99:14-99:100" data-file-name="app/dashboard/customers/page.tsx">
                <Search className="h-5 w-5 text-gray-400" />
              </div>
              <input type="text" className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:placeholder-gray-400 focus:ring-1 focus:ring-blue-500 focus:border-blue-500 sm:text-sm" placeholder="Search by name, phone, email, or PAN" value={searchTerm} onChange={e => setSearchTerm(e.target.value)} data-unique-id="97e1ed6e-188f-4477-9411-62d0bf102b36" data-loc="102:14-102:378" data-file-name="app/dashboard/customers/page.tsx" />
            </div>
          </div>
          
          <div className="flex space-x-3" data-unique-id="52902214-4e84-4900-9ccf-d9cbbbacc923" data-loc="106:10-106:42" data-file-name="app/dashboard/customers/page.tsx">
            <button onClick={() => router.push("/dashboard/customer-form")} className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500" data-unique-id="7f800edb-9322-4a3b-a1af-1a22c60f1cd2" data-loc="107:12-107:303" data-file-name="app/dashboard/customers/page.tsx">
              <UserPlus className="h-4 w-4 mr-2" /> Add New Customer
            </button>
          </div>
        </div>
        
        {/* Customer List */}
        <div className="bg-white shadow overflow-hidden sm:rounded-md" data-unique-id="a0428ae2-b34b-40f2-ac4b-4f070094f863" data-loc="114:8-114:71" data-file-name="app/dashboard/customers/page.tsx">
          {filteredCustomers.length > 0 ? <table className="min-w-full divide-y divide-gray-200" data-unique-id="c5e9c17c-8f6f-4fa6-8ddd-323ec4ff10cc" data-loc="115:42-115:97" data-file-name="app/dashboard/customers/page.tsx">
              <thead className="bg-gray-50" data-unique-id="449dfa5d-af8a-4cb7-989d-b4883308d7e2" data-loc="116:14-116:44" data-file-name="app/dashboard/customers/page.tsx">
                <tr data-unique-id="2a767205-d45d-4807-8671-fa29d022ccfe" data-loc="117:16-117:20" data-file-name="app/dashboard/customers/page.tsx">
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer" onClick={() => handleSort("name")} data-unique-id="6a79fd42-25bf-468a-a0e1-ba343f517dac" data-loc="118:18-118:175" data-file-name="app/dashboard/customers/page.tsx">
                    <div className="flex items-center" data-unique-id="4c6137ea-669e-4d0e-9a5a-ad4c538b7dde" data-loc="119:20-119:55" data-file-name="app/dashboard/customers/page.tsx">
                      Name
                      {sortField === "name" && (sortDirection === "asc" ? <SortAsc className="w-4 h-4 ml-1" /> : <SortDesc className="w-4 h-4 ml-1" />)}
                    </div>
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider" data-unique-id="cea8bfe0-4e97-474e-ba45-381eaf25a4ae" data-loc="124:18-124:125" data-file-name="app/dashboard/customers/page.tsx">
                    Contact
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer" onClick={() => handleSort("cibilScore")} data-unique-id="2cc01f1d-6505-46f9-9b9d-1858435d8f1c" data-loc="127:18-127:181" data-file-name="app/dashboard/customers/page.tsx">
                    <div className="flex items-center" data-unique-id="3e0d3cf5-ce30-4a04-8457-21619ca007ae" data-loc="128:20-128:55" data-file-name="app/dashboard/customers/page.tsx">
                      CIBIL Score
                      {sortField === "cibilScore" && (sortDirection === "asc" ? <SortAsc className="w-4 h-4 ml-1" /> : <SortDesc className="w-4 h-4 ml-1" />)}
                    </div>
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer" onClick={() => handleSort("timestamp")} data-unique-id="e7e60ce7-efd5-4c67-a65a-203af7c60e3b" data-loc="133:18-133:180" data-file-name="app/dashboard/customers/page.tsx">
                    <div className="flex items-center" data-unique-id="ef696579-2ecd-4393-a6fe-cd6505ab8504" data-loc="134:20-134:55" data-file-name="app/dashboard/customers/page.tsx">
                      Registered On
                      {sortField === "timestamp" && (sortDirection === "asc" ? <SortAsc className="w-4 h-4 ml-1" /> : <SortDesc className="w-4 h-4 ml-1" />)}
                    </div>
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider" data-unique-id="92865642-a100-4653-8b37-4c7b9fa603ec" data-loc="139:18-139:125" data-file-name="app/dashboard/customers/page.tsx">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200" data-unique-id="17616f15-e81d-48b6-a879-eeff1ad4d0a9" data-loc="144:14-144:67" data-file-name="app/dashboard/customers/page.tsx">
                {filteredCustomers.map(customer => <tr key={customer._id} className="hover:bg-gray-50" data-unique-id="a60f1453-e0bd-4a17-a01a-2b8c0fb91500" data-loc="145:51-145:103" data-file-name="app/dashboard/customers/page.tsx">
                    <td className="px-6 py-4 whitespace-nowrap" data-unique-id="2c4f9e58-5ba3-417f-847d-7f5a995a7cb1" data-loc="146:20-146:64" data-file-name="app/dashboard/customers/page.tsx">
                      <div className="text-sm font-medium text-gray-900" data-unique-id="736281a6-c7c7-4f08-a189-edb1ad74d106" data-loc="147:22-147:73" data-file-name="app/dashboard/customers/page.tsx">{customer.name}</div>
                      <div className="text-sm text-gray-500" data-unique-id="34d42a39-99f1-4f6b-8534-6f50c6fdc6c4" data-loc="148:22-148:61" data-file-name="app/dashboard/customers/page.tsx">{customer.pan}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap" data-unique-id="e69be3b5-9105-4b4a-8751-af5f0fbf0335" data-loc="150:20-150:64" data-file-name="app/dashboard/customers/page.tsx">
                      <div className="flex items-center text-sm text-gray-500" data-unique-id="b78d4533-6a4d-4e0a-aac6-f052a24b3a69" data-loc="151:22-151:79" data-file-name="app/dashboard/customers/page.tsx">
                        <Phone className="h-4 w-4 mr-1" /> {customer.phone}
                      </div>
                      <div className="flex items-center text-sm text-gray-500" data-unique-id="41b3696a-a706-4cd3-a0be-bacb87c25861" data-loc="154:22-154:79" data-file-name="app/dashboard/customers/page.tsx">
                        <Mail className="h-4 w-4 mr-1" /> {customer.email}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap" data-unique-id="4294d328-db03-4b01-b972-a90b9bac448c" data-loc="158:20-158:64" data-file-name="app/dashboard/customers/page.tsx">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${(customer.cibilScore ?? 0) >= 750 ? 'bg-green-100 text-green-800' : (customer.cibilScore ?? 0) >= 700 ? 'bg-blue-100 text-blue-800' : (customer.cibilScore ?? 0) >= 650 ? 'bg-yellow-100 text-yellow-800' : (customer.cibilScore ?? 0) > 0 ? 'bg-red-100 text-red-800' : 'bg-gray-100 text-gray-800'}`} data-unique-id="5124d16b-5741-48c8-8cc4-e4aa51590eef" data-loc="159:22-159:410" data-file-name="app/dashboard/customers/page.tsx">
                        {customer.cibilScore ?? 'Not Available'}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500" data-unique-id="f3177381-b7cf-440c-b0c6-b5d948c5b7ef" data-loc="163:20-163:86" data-file-name="app/dashboard/customers/page.tsx">
                      <div className="flex items-center" data-unique-id="0497b3aa-cf89-4cbc-b41f-90a764447a1d" data-loc="164:22-164:57" data-file-name="app/dashboard/customers/page.tsx">
                        <Calendar className="h-4 w-4 mr-1" data-unique-id="e8d3b518-4344-4ee6-b753-e57dcdacf49c" data-loc="165:24-165:61" data-file-name="app/dashboard/customers/page.tsx" />
                        {format(new Date(customer.createdAt), 'dd MMM yyyy')}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm" data-unique-id="cbdfbba4-22b6-4454-aa61-73ff6453dbe8" data-loc="169:20-169:72" data-file-name="app/dashboard/customers/page.tsx">
                      <button onClick={() => router.push(`/dashboard/eligibility/${customer._id}`)} className="text-blue-600 hover:text-blue-900" data-unique-id="582c2502-0e75-433a-9805-73035eb51404" data-loc="170:22-170:146" data-file-name="app/dashboard/customers/page.tsx">
                        View Eligibility
                      </button>
                    </td>
                  </tr>)}
              </tbody>
            </table> : <div className="text-center py-12" data-unique-id="044a1d6e-404a-49b0-b416-8bc567ff4037" data-loc="176:23-176:58" data-file-name="app/dashboard/customers/page.tsx">
              <div className="flex justify-center mb-4" data-unique-id="6fafbcb9-8344-4936-a857-532e1f4321ea" data-loc="177:14-177:56" data-file-name="app/dashboard/customers/page.tsx">
                <CreditCard className="h-12 w-12 text-gray-300" />
              </div>
              <h3 className="text-lg font-medium text-gray-900 mb-1" data-unique-id="e92d87c4-322c-4ba4-8e29-7f7869adb1c1" data-loc="180:14-180:69" data-file-name="app/dashboard/customers/page.tsx">No customers found</h3>
              {searchTerm ? <p className="text-gray-500 mb-4" data-unique-id="17795d81-b4db-4191-895c-6c2b0a5bff39" data-loc="181:28-181:62" data-file-name="app/dashboard/customers/page.tsx">No results match your search criteria</p> : <p className="text-gray-500 mb-4" data-unique-id="b6efc9ee-0141-45a1-9faa-57775040d2e4" data-loc="181:106-181:140" data-file-name="app/dashboard/customers/page.tsx">Start by registering your first customer</p>}
              <button onClick={() => router.push("/dashboard/customer-form")} className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700" data-unique-id="18c9f483-1353-4e79-9028-2300345b95c2" data-loc="182:14-182:233" data-file-name="app/dashboard/customers/page.tsx">
                <UserPlus className="h-4 w-4 mr-2" /> Add Customer
              </button>
            </div>}
        </div>
      </main>
    </div>;
}