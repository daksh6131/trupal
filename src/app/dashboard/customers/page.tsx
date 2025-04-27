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
    return <div className="flex items-center justify-center min-h-screen" data-unique-id="ca8141c2-9728-4692-955f-635818c06cf9" data-loc="76:11-76:74" data-file-name="app/dashboard/customers/page.tsx">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-600" data-unique-id="896b8912-9e51-4362-8850-63dc7a4409ce" data-loc="77:8-77:99" data-file-name="app/dashboard/customers/page.tsx"></div>
      </div>;
  }
  return <div className="min-h-screen bg-gray-50" data-unique-id="d09cc5ed-7f24-412c-b6b7-9401502e7ecc" data-loc="80:9-80:50" data-file-name="app/dashboard/customers/page.tsx">
      {/* Header */}
      <header className="bg-white shadow" data-unique-id="41da280d-7c82-4707-a3fe-9bf1ff8f3df2" data-loc="82:6-82:42" data-file-name="app/dashboard/customers/page.tsx">
        <div className="max-w-7xl mx-auto px-4 py-4 sm:px-6" data-unique-id="d2cb8079-4053-4e33-be7b-0ceae9bfba6b" data-loc="83:8-83:61" data-file-name="app/dashboard/customers/page.tsx">
          <div className="flex items-center" data-unique-id="72c7347c-94bf-407e-9217-9f1967c4d717" data-loc="84:10-84:45" data-file-name="app/dashboard/customers/page.tsx">
            <button onClick={() => router.push("/dashboard")} className="mr-4 p-1 rounded-full hover:bg-gray-100" data-unique-id="e5b10a98-71c2-4f95-ae22-b1a51b721cd6" data-loc="85:12-85:114" data-file-name="app/dashboard/customers/page.tsx">
              <ArrowLeft className="h-5 w-5 text-gray-600" />
            </button>
            <h1 className="text-xl font-bold text-gray-900" data-unique-id="a54b2f2c-3838-4c3c-bc0c-70517f54818c" data-loc="88:12-88:60" data-file-name="app/dashboard/customers/page.tsx">My Customers</h1>
          </div>
        </div>
      </header>
      
      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 py-8 sm:px-6" data-unique-id="4c08650e-6f87-44c3-b056-dd417594f708" data-loc="94:6-94:60" data-file-name="app/dashboard/customers/page.tsx">
        {/* Search and Filter */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 space-y-4 md:space-y-0" data-unique-id="04513163-c972-437c-98f1-7551f9cafc7d" data-loc="96:8-96:123" data-file-name="app/dashboard/customers/page.tsx">
          <div className="w-full md:w-auto" data-unique-id="85ea01ae-ab98-497b-bd17-4347341a9a69" data-loc="97:10-97:44" data-file-name="app/dashboard/customers/page.tsx">
            <div className="relative" data-unique-id="c1710916-f1c1-4107-8dfd-ec31312717f1" data-loc="98:12-98:38" data-file-name="app/dashboard/customers/page.tsx">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none" data-unique-id="968d4f26-8623-464a-a8f5-279c2b703cf0" data-loc="99:14-99:100" data-file-name="app/dashboard/customers/page.tsx">
                <Search className="h-5 w-5 text-gray-400" />
              </div>
              <input type="text" className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:placeholder-gray-400 focus:ring-1 focus:ring-blue-500 focus:border-blue-500 sm:text-sm" placeholder="Search by name, phone, email, or PAN" value={searchTerm} onChange={e => setSearchTerm(e.target.value)} data-unique-id="caecab77-3b6b-49e6-a7f7-3519be06d370" data-loc="102:14-102:378" data-file-name="app/dashboard/customers/page.tsx" />
            </div>
          </div>
          
          <div className="flex space-x-3" data-unique-id="5e8e788d-6835-45a1-992d-26ef8f2d3975" data-loc="106:10-106:42" data-file-name="app/dashboard/customers/page.tsx">
            <button onClick={() => router.push("/dashboard/customer-form")} className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500" data-unique-id="54682604-21e1-42da-bdfd-3def01edd995" data-loc="107:12-107:303" data-file-name="app/dashboard/customers/page.tsx">
              <UserPlus className="h-4 w-4 mr-2" /> Add New Customer
            </button>
          </div>
        </div>
        
        {/* Customer List */}
        <div className="bg-white shadow overflow-hidden sm:rounded-md" data-unique-id="c85652cc-b257-48ad-b4cf-be1faee93208" data-loc="114:8-114:71" data-file-name="app/dashboard/customers/page.tsx">
          {filteredCustomers.length > 0 ? <table className="min-w-full divide-y divide-gray-200" data-unique-id="6e0081ea-505b-49e5-9a92-66dd355cf6ba" data-loc="115:42-115:97" data-file-name="app/dashboard/customers/page.tsx">
              <thead className="bg-gray-50" data-unique-id="111fe5df-65b6-4aa2-8a00-1234af17a5dc" data-loc="116:14-116:44" data-file-name="app/dashboard/customers/page.tsx">
                <tr data-unique-id="81242bd8-6741-4c8b-8c0a-858092e81757" data-loc="117:16-117:20" data-file-name="app/dashboard/customers/page.tsx">
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer" onClick={() => handleSort("name")} data-unique-id="2f5baf09-3458-437b-bf68-29cb570a652d" data-loc="118:18-118:175" data-file-name="app/dashboard/customers/page.tsx">
                    <div className="flex items-center" data-unique-id="56c27c91-5689-40b8-991c-cc67ec82d1d2" data-loc="119:20-119:55" data-file-name="app/dashboard/customers/page.tsx">
                      Name
                      {sortField === "name" && (sortDirection === "asc" ? <SortAsc className="w-4 h-4 ml-1" /> : <SortDesc className="w-4 h-4 ml-1" />)}
                    </div>
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider" data-unique-id="f3e356c7-b489-477d-b613-2bb5cc5feae1" data-loc="124:18-124:125" data-file-name="app/dashboard/customers/page.tsx">
                    Contact
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer" onClick={() => handleSort("cibilScore")} data-unique-id="56d1d35d-8734-4d2a-bee5-43f7513fcfbd" data-loc="127:18-127:181" data-file-name="app/dashboard/customers/page.tsx">
                    <div className="flex items-center" data-unique-id="5024cb3e-9e65-4491-a467-d941087740b8" data-loc="128:20-128:55" data-file-name="app/dashboard/customers/page.tsx">
                      CIBIL Score
                      {sortField === "cibilScore" && (sortDirection === "asc" ? <SortAsc className="w-4 h-4 ml-1" /> : <SortDesc className="w-4 h-4 ml-1" />)}
                    </div>
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer" onClick={() => handleSort("timestamp")} data-unique-id="b06ef168-729b-4590-bdf2-bfe5eae85147" data-loc="133:18-133:180" data-file-name="app/dashboard/customers/page.tsx">
                    <div className="flex items-center" data-unique-id="0f65cabb-aebb-4e3c-affd-071a226daf98" data-loc="134:20-134:55" data-file-name="app/dashboard/customers/page.tsx">
                      Registered On
                      {sortField === "timestamp" && (sortDirection === "asc" ? <SortAsc className="w-4 h-4 ml-1" /> : <SortDesc className="w-4 h-4 ml-1" />)}
                    </div>
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider" data-unique-id="e7d5d9bd-a54a-445b-9961-088da93e671a" data-loc="139:18-139:125" data-file-name="app/dashboard/customers/page.tsx">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200" data-unique-id="603e0562-cc93-4326-8608-8359b136195a" data-loc="144:14-144:67" data-file-name="app/dashboard/customers/page.tsx">
                {filteredCustomers.map(customer => <tr key={customer._id} className="hover:bg-gray-50" data-unique-id="8d8a5910-e4d0-478a-ab99-e5bf637a8d83" data-loc="145:51-145:103" data-file-name="app/dashboard/customers/page.tsx">
                    <td className="px-6 py-4 whitespace-nowrap" data-unique-id="aa031682-8931-44f8-9c46-e659dd390cf4" data-loc="146:20-146:64" data-file-name="app/dashboard/customers/page.tsx">
                      <div className="text-sm font-medium text-gray-900" data-unique-id="85b72b8d-0130-434a-8097-ce1c25b48ea1" data-loc="147:22-147:73" data-file-name="app/dashboard/customers/page.tsx">{customer.name}</div>
                      <div className="text-sm text-gray-500" data-unique-id="035d6a4b-63f9-4dfe-bd6f-e9acadff2d3e" data-loc="148:22-148:61" data-file-name="app/dashboard/customers/page.tsx">{customer.pan}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap" data-unique-id="76f61624-27d7-47c5-ad64-79f27760f0c7" data-loc="150:20-150:64" data-file-name="app/dashboard/customers/page.tsx">
                      <div className="flex items-center text-sm text-gray-500" data-unique-id="d58ca21a-0053-4988-a433-a1d3510ffd13" data-loc="151:22-151:79" data-file-name="app/dashboard/customers/page.tsx">
                        <Phone className="h-4 w-4 mr-1" /> {customer.phone}
                      </div>
                      <div className="flex items-center text-sm text-gray-500" data-unique-id="687e67a2-0503-43b9-b219-69df3123d5bf" data-loc="154:22-154:79" data-file-name="app/dashboard/customers/page.tsx">
                        <Mail className="h-4 w-4 mr-1" /> {customer.email}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap" data-unique-id="32b86ec4-9816-4b0c-b362-f755325d0431" data-loc="158:20-158:64" data-file-name="app/dashboard/customers/page.tsx">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${(customer.cibilScore ?? 0) >= 750 ? 'bg-green-100 text-green-800' : (customer.cibilScore ?? 0) >= 700 ? 'bg-blue-100 text-blue-800' : (customer.cibilScore ?? 0) >= 650 ? 'bg-yellow-100 text-yellow-800' : (customer.cibilScore ?? 0) > 0 ? 'bg-red-100 text-red-800' : 'bg-gray-100 text-gray-800'}`} data-unique-id="d48c2632-660b-4c07-ac3f-0b913a16ca50" data-loc="159:22-159:410" data-file-name="app/dashboard/customers/page.tsx">
                        {customer.cibilScore ?? 'Not Available'}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500" data-unique-id="d0fb55f6-68a6-4d49-b274-fbb43ec371f1" data-loc="163:20-163:86" data-file-name="app/dashboard/customers/page.tsx">
                      <div className="flex items-center" data-unique-id="cad4f7ee-fe7a-4ffa-9f3d-a12617cf9b3e" data-loc="164:22-164:57" data-file-name="app/dashboard/customers/page.tsx">
                        <Calendar className="h-4 w-4 mr-1" data-unique-id="ffd98e2c-7453-449a-8011-6b76b7021961" data-loc="165:24-165:61" data-file-name="app/dashboard/customers/page.tsx" />
                        {format(new Date(customer.createdAt), 'dd MMM yyyy')}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm" data-unique-id="2ed60503-f14b-4137-8112-7dbae834a1dc" data-loc="169:20-169:72" data-file-name="app/dashboard/customers/page.tsx">
                      <button onClick={() => router.push(`/dashboard/eligibility/${customer._id}`)} className="text-blue-600 hover:text-blue-900" data-unique-id="7bc94d96-b296-4c5e-8e47-86a958ed735d" data-loc="170:22-170:146" data-file-name="app/dashboard/customers/page.tsx">
                        View Eligibility
                      </button>
                    </td>
                  </tr>)}
              </tbody>
            </table> : <div className="text-center py-12" data-unique-id="177d005e-c6ce-4261-bb95-1b9909e237ff" data-loc="176:23-176:58" data-file-name="app/dashboard/customers/page.tsx">
              <div className="flex justify-center mb-4" data-unique-id="6e35edce-aace-4588-9362-fead318e8c4f" data-loc="177:14-177:56" data-file-name="app/dashboard/customers/page.tsx">
                <CreditCard className="h-12 w-12 text-gray-300" />
              </div>
              <h3 className="text-lg font-medium text-gray-900 mb-1" data-unique-id="276aa7eb-60e9-4798-85d9-a03f398afa47" data-loc="180:14-180:69" data-file-name="app/dashboard/customers/page.tsx">No customers found</h3>
              {searchTerm ? <p className="text-gray-500 mb-4" data-unique-id="a8d20972-79eb-4311-8f88-37fb2e2ebd1a" data-loc="181:28-181:62" data-file-name="app/dashboard/customers/page.tsx">No results match your search criteria</p> : <p className="text-gray-500 mb-4" data-unique-id="575b5b3b-43c8-4513-ab5b-535b82e8bb60" data-loc="181:106-181:140" data-file-name="app/dashboard/customers/page.tsx">Start by registering your first customer</p>}
              <button onClick={() => router.push("/dashboard/customer-form")} className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700" data-unique-id="f2fbaed8-57ba-4eec-aa4e-9dfce9cde27e" data-loc="182:14-182:233" data-file-name="app/dashboard/customers/page.tsx">
                <UserPlus className="h-4 w-4 mr-2" /> Add Customer
              </button>
            </div>}
        </div>
      </main>
    </div>;
}