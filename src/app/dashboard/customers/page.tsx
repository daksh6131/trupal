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
    return <div className="flex items-center justify-center min-h-screen" data-unique-id="f6cb8b3c-6359-45a1-a12d-f200729213b3" data-loc="76:11-76:74" data-file-name="app/dashboard/customers/page.tsx">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-600" data-unique-id="ec5903fd-a77a-448a-b63b-647c61c8a5bc" data-loc="77:8-77:99" data-file-name="app/dashboard/customers/page.tsx"></div>
      </div>;
  }
  return <div className="min-h-screen bg-gray-50" data-unique-id="1df076e3-501d-4a62-8a10-ba4c75291879" data-loc="80:9-80:50" data-file-name="app/dashboard/customers/page.tsx">
      {/* Header */}
      <header className="bg-white shadow" data-unique-id="7e94f046-3daf-461a-b82a-2a49caab7b5c" data-loc="82:6-82:42" data-file-name="app/dashboard/customers/page.tsx">
        <div className="max-w-7xl mx-auto px-4 py-4 sm:px-6" data-unique-id="954a28eb-7357-4586-a347-21332843af79" data-loc="83:8-83:61" data-file-name="app/dashboard/customers/page.tsx">
          <div className="flex items-center" data-unique-id="eea8c490-4af3-46f1-a2ad-b38f04c48bfd" data-loc="84:10-84:45" data-file-name="app/dashboard/customers/page.tsx">
            <button onClick={() => router.push("/dashboard")} className="mr-4 p-1 rounded-full hover:bg-gray-100" data-unique-id="6fa598eb-bf31-4a0b-8e47-56b1cbb1a859" data-loc="85:12-85:114" data-file-name="app/dashboard/customers/page.tsx">
              <ArrowLeft className="h-5 w-5 text-gray-600" />
            </button>
            <h1 className="text-xl font-bold text-gray-900" data-unique-id="49d667d3-7c79-408d-8731-c540c41133cb" data-loc="88:12-88:60" data-file-name="app/dashboard/customers/page.tsx">My Customers</h1>
          </div>
        </div>
      </header>
      
      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 py-8 sm:px-6" data-unique-id="105ca101-fe66-46f4-be35-45a313a04d76" data-loc="94:6-94:60" data-file-name="app/dashboard/customers/page.tsx">
        {/* Search and Filter */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 space-y-4 md:space-y-0" data-unique-id="8ef1dc90-a02c-413c-bf48-b11f028daa90" data-loc="96:8-96:123" data-file-name="app/dashboard/customers/page.tsx">
          <div className="w-full md:w-auto" data-unique-id="d486059e-0bd8-4c91-8ef8-1ae57f57edec" data-loc="97:10-97:44" data-file-name="app/dashboard/customers/page.tsx">
            <div className="relative" data-unique-id="dde0a6d3-b054-4548-abfd-99d7b1838634" data-loc="98:12-98:38" data-file-name="app/dashboard/customers/page.tsx">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none" data-unique-id="bc2a9420-1a2d-478d-bfd1-e7683ffcc6a0" data-loc="99:14-99:100" data-file-name="app/dashboard/customers/page.tsx">
                <Search className="h-5 w-5 text-gray-400" />
              </div>
              <input type="text" className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:placeholder-gray-400 focus:ring-1 focus:ring-blue-500 focus:border-blue-500 sm:text-sm" placeholder="Search by name, phone, email, or PAN" value={searchTerm} onChange={e => setSearchTerm(e.target.value)} data-unique-id="64bd1a50-ec4a-4287-92d5-427feb79a290" data-loc="102:14-102:378" data-file-name="app/dashboard/customers/page.tsx" />
            </div>
          </div>
          
          <div className="flex space-x-3" data-unique-id="252bcc07-d2b0-42ac-8138-2d38760bf5a5" data-loc="106:10-106:42" data-file-name="app/dashboard/customers/page.tsx">
            <button onClick={() => router.push("/dashboard/customer-form")} className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500" data-unique-id="62a927e5-311f-4b00-965d-07d1761c81b9" data-loc="107:12-107:303" data-file-name="app/dashboard/customers/page.tsx">
              <UserPlus className="h-4 w-4 mr-2" /> Add New Customer
            </button>
          </div>
        </div>
        
        {/* Customer List */}
        <div className="bg-white shadow overflow-hidden sm:rounded-md" data-unique-id="66650c42-d9cd-4e23-a2be-ee23a4d620f9" data-loc="114:8-114:71" data-file-name="app/dashboard/customers/page.tsx">
          {filteredCustomers.length > 0 ? <table className="min-w-full divide-y divide-gray-200" data-unique-id="ed6333a3-e807-4860-8df3-321342a2c31f" data-loc="115:42-115:97" data-file-name="app/dashboard/customers/page.tsx">
              <thead className="bg-gray-50" data-unique-id="f8cb5d78-7a24-43f5-b94d-6a42d940a207" data-loc="116:14-116:44" data-file-name="app/dashboard/customers/page.tsx">
                <tr data-unique-id="dd97a30c-882b-4b23-bdc5-08adff925199" data-loc="117:16-117:20" data-file-name="app/dashboard/customers/page.tsx">
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer" onClick={() => handleSort("name")} data-unique-id="af700294-09ff-403d-9636-9650ba29705d" data-loc="118:18-118:175" data-file-name="app/dashboard/customers/page.tsx">
                    <div className="flex items-center" data-unique-id="b135c1cc-4e5d-4694-9c37-32654f7078a1" data-loc="119:20-119:55" data-file-name="app/dashboard/customers/page.tsx">
                      Name
                      {sortField === "name" && (sortDirection === "asc" ? <SortAsc className="w-4 h-4 ml-1" /> : <SortDesc className="w-4 h-4 ml-1" />)}
                    </div>
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider" data-unique-id="a772cb61-39f6-433b-b3cc-f8ef147d4963" data-loc="124:18-124:125" data-file-name="app/dashboard/customers/page.tsx">
                    Contact
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer" onClick={() => handleSort("cibilScore")} data-unique-id="54063209-ec9a-4711-9aae-ebe665448e19" data-loc="127:18-127:181" data-file-name="app/dashboard/customers/page.tsx">
                    <div className="flex items-center" data-unique-id="0a835c1f-e22d-43df-9137-61fc27e8ff1e" data-loc="128:20-128:55" data-file-name="app/dashboard/customers/page.tsx">
                      CIBIL Score
                      {sortField === "cibilScore" && (sortDirection === "asc" ? <SortAsc className="w-4 h-4 ml-1" /> : <SortDesc className="w-4 h-4 ml-1" />)}
                    </div>
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer" onClick={() => handleSort("timestamp")} data-unique-id="1b1334c2-a231-4fac-a27c-f897875cc901" data-loc="133:18-133:180" data-file-name="app/dashboard/customers/page.tsx">
                    <div className="flex items-center" data-unique-id="85783987-ae80-4216-8fc5-9d425ff9148a" data-loc="134:20-134:55" data-file-name="app/dashboard/customers/page.tsx">
                      Registered On
                      {sortField === "timestamp" && (sortDirection === "asc" ? <SortAsc className="w-4 h-4 ml-1" /> : <SortDesc className="w-4 h-4 ml-1" />)}
                    </div>
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider" data-unique-id="81fa2ebe-ec2d-4b70-8250-ffc21c57e2a8" data-loc="139:18-139:125" data-file-name="app/dashboard/customers/page.tsx">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200" data-unique-id="8d828bdd-f200-4492-b79a-4b16e9a184f4" data-loc="144:14-144:67" data-file-name="app/dashboard/customers/page.tsx">
                {filteredCustomers.map(customer => <tr key={customer._id} className="hover:bg-gray-50" data-unique-id="9aa44e79-e0a0-4e8e-8730-f162b14cdd61" data-loc="145:51-145:103" data-file-name="app/dashboard/customers/page.tsx">
                    <td className="px-6 py-4 whitespace-nowrap" data-unique-id="ae4bc1cc-31fb-4021-a12d-610042325922" data-loc="146:20-146:64" data-file-name="app/dashboard/customers/page.tsx">
                      <div className="text-sm font-medium text-gray-900" data-unique-id="5da0f2a6-c9ae-4a19-a78a-bca3bb1217e9" data-loc="147:22-147:73" data-file-name="app/dashboard/customers/page.tsx">{customer.name}</div>
                      <div className="text-sm text-gray-500" data-unique-id="182278b4-592a-40c5-8f31-77a7cb8c8ffa" data-loc="148:22-148:61" data-file-name="app/dashboard/customers/page.tsx">{customer.pan}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap" data-unique-id="7456a220-9f47-4830-8849-2b005826a086" data-loc="150:20-150:64" data-file-name="app/dashboard/customers/page.tsx">
                      <div className="flex items-center text-sm text-gray-500" data-unique-id="36f3a15c-357c-40b8-b612-602206112fdc" data-loc="151:22-151:79" data-file-name="app/dashboard/customers/page.tsx">
                        <Phone className="h-4 w-4 mr-1" /> {customer.phone}
                      </div>
                      <div className="flex items-center text-sm text-gray-500" data-unique-id="36172de6-166c-43c5-ac1c-1a47c30c5826" data-loc="154:22-154:79" data-file-name="app/dashboard/customers/page.tsx">
                        <Mail className="h-4 w-4 mr-1" /> {customer.email}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap" data-unique-id="6f8e4e40-dbd3-42ca-9a85-17ac142d3b60" data-loc="158:20-158:64" data-file-name="app/dashboard/customers/page.tsx">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${(customer.cibilScore ?? 0) >= 750 ? 'bg-green-100 text-green-800' : (customer.cibilScore ?? 0) >= 700 ? 'bg-blue-100 text-blue-800' : (customer.cibilScore ?? 0) >= 650 ? 'bg-yellow-100 text-yellow-800' : (customer.cibilScore ?? 0) > 0 ? 'bg-red-100 text-red-800' : 'bg-gray-100 text-gray-800'}`} data-unique-id="39fe8731-1c74-46e6-ba1c-7c7a6f927167" data-loc="159:22-159:410" data-file-name="app/dashboard/customers/page.tsx">
                        {customer.cibilScore ?? 'Not Available'}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500" data-unique-id="8e9bbba9-5717-4d31-a935-ddf0626d53b0" data-loc="163:20-163:86" data-file-name="app/dashboard/customers/page.tsx">
                      <div className="flex items-center" data-unique-id="06f61ee2-e629-4353-bd6b-043edb0a8ef0" data-loc="164:22-164:57" data-file-name="app/dashboard/customers/page.tsx">
                        <Calendar className="h-4 w-4 mr-1" data-unique-id="71f3ce21-d8c8-49a2-91e5-e1dfe62790d6" data-loc="165:24-165:61" data-file-name="app/dashboard/customers/page.tsx" />
                        {format(new Date(customer.createdAt), 'dd MMM yyyy')}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm" data-unique-id="5fbcb86c-b04f-4d0c-9bf5-576ceb5282a5" data-loc="169:20-169:72" data-file-name="app/dashboard/customers/page.tsx">
                      <button onClick={() => router.push(`/dashboard/eligibility/${customer._id}`)} className="text-blue-600 hover:text-blue-900" data-unique-id="79ac95d0-a885-4894-b8c1-1193bc473bd5" data-loc="170:22-170:146" data-file-name="app/dashboard/customers/page.tsx">
                        View Eligibility
                      </button>
                    </td>
                  </tr>)}
              </tbody>
            </table> : <div className="text-center py-12" data-unique-id="2c537d73-e8f0-4add-813d-6b1e6b7454c6" data-loc="176:23-176:58" data-file-name="app/dashboard/customers/page.tsx">
              <div className="flex justify-center mb-4" data-unique-id="87d3c697-a1d4-4c2a-aa47-d2abb1d93527" data-loc="177:14-177:56" data-file-name="app/dashboard/customers/page.tsx">
                <CreditCard className="h-12 w-12 text-gray-300" />
              </div>
              <h3 className="text-lg font-medium text-gray-900 mb-1" data-unique-id="17107109-6624-4562-8f54-7caa7ea39a99" data-loc="180:14-180:69" data-file-name="app/dashboard/customers/page.tsx">No customers found</h3>
              {searchTerm ? <p className="text-gray-500 mb-4" data-unique-id="b977f245-5add-4ed7-82db-72dd16f27cce" data-loc="181:28-181:62" data-file-name="app/dashboard/customers/page.tsx">No results match your search criteria</p> : <p className="text-gray-500 mb-4" data-unique-id="ed597624-fbde-49e5-9bdb-02432deee479" data-loc="181:106-181:140" data-file-name="app/dashboard/customers/page.tsx">Start by registering your first customer</p>}
              <button onClick={() => router.push("/dashboard/customer-form")} className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700" data-unique-id="465cc0bc-88bb-4266-b09f-b87e5ae1aac7" data-loc="182:14-182:233" data-file-name="app/dashboard/customers/page.tsx">
                <UserPlus className="h-4 w-4 mr-2" /> Add Customer
              </button>
            </div>}
        </div>
      </main>
    </div>;
}