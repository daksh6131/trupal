"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { UserPlus, ClipboardList, LogOut, ChevronRight, Phone, Mail, Calendar, CreditCard, DollarSign } from "lucide-react";
import { Customer } from "@/types";
import { format } from "date-fns";
import { authApi, customersApi, supabaseApi } from "@/lib/api-service";
import ErrorTest from "@/components/error-test";
export default function DashboardPage() {
  const router = useRouter();
  const [agent, setAgent] = useState<{
    name: string;
    phone: string;
  } | null>(null);
  const [recentCustomers, setRecentCustomers] = useState<Customer[]>([]);
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

    // Get recent customers for this agent
    const fetchCustomers = async () => {
      try {
        const {
          customers
        } = await customersApi.getAll();
        setRecentCustomers(customers.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()).slice(0, 5));
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
  }, [router]);
  const handleLogout = async () => {
    try {
      await authApi.logout();
      router.push("/");
    } catch (error) {
      console.error("Logout error:", error);
      // Even if API fails, clear local storage and redirect
      localStorage.removeItem("salesAgent");
      localStorage.removeItem("authToken");
      router.push("/");
    }
  };
  if (!agent) {
    return <div className="flex items-center justify-center min-h-screen" data-unique-id="7ed0a5c6-7948-4123-a409-c0b2cb8eaee0" data-loc="66:11-66:74" data-file-name="app/dashboard/page.tsx">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-600" data-unique-id="9dcb12a0-e1c9-48eb-b048-763b50ba852e" data-loc="67:8-67:99" data-file-name="app/dashboard/page.tsx"></div>
      </div>;
  }
  return <div className="min-h-screen bg-gray-50" data-unique-id="47fb434d-c1fd-4ec8-b26d-ff33ce2e3e93" data-loc="70:9-70:50" data-file-name="app/dashboard/page.tsx">
      {/* Header */}
      <header className="bg-white shadow" data-unique-id="59a46135-cdc9-489b-9ac9-38c668f39ce6" data-loc="72:6-72:42" data-file-name="app/dashboard/page.tsx">
        <div className="max-w-7xl mx-auto px-4 py-4 sm:px-6 flex justify-between items-center" data-unique-id="27100ffd-4488-4775-9e85-370f93dd7e89" data-loc="73:8-73:95" data-file-name="app/dashboard/page.tsx">
          <h1 className="text-2xl font-bold text-gray-900" data-unique-id="44bd2fa5-4af2-4d75-842c-e6b109fb6dea" data-loc="74:10-74:59" data-file-name="app/dashboard/page.tsx">CardSales Pro</h1>
          <div className="flex items-center" data-unique-id="e0bfa2ff-a730-4b71-af2c-564f92be4ca3" data-loc="75:10-75:45" data-file-name="app/dashboard/page.tsx">
            <span className="text-sm font-medium text-gray-600 mr-4" data-unique-id="0902d77b-fe53-40ab-b111-63b7beb3bd22" data-loc="76:12-76:69" data-file-name="app/dashboard/page.tsx">
              Welcome, {agent.name}
            </span>
            <button onClick={handleLogout} className="flex items-center text-sm font-medium text-red-600 hover:text-red-800" data-unique-id="ec7a7b6a-40e0-4f4e-8a58-1973eefed2c6" data-loc="79:12-79:125" data-file-name="app/dashboard/page.tsx">
              <LogOut className="h-4 w-4 mr-1" /> Logout
            </button>
          </div>
        </div>
      </header>
      
      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 py-8 sm:px-6" data-unique-id="d4b5da1e-76de-4f78-b18a-996ba31108f4" data-loc="87:6-87:60" data-file-name="app/dashboard/page.tsx">
        {/* Action Cards */}
        <div className="grid grid-cols-2 gap-6 mb-8" data-unique-id="d54758ed-c97c-4f7e-9dd4-00e7350c085c" data-loc="89:8-89:53" data-file-name="app/dashboard/page.tsx">
          <button onClick={() => router.push("/dashboard/customer-form")} className="flex flex-col items-center justify-center p-6 bg-white rounded-lg shadow-md border border-gray-100 hover:border-blue-500 transition-colors" data-unique-id="932ed45c-b1a5-4be9-b698-ed2d6c684b22" data-loc="90:10-90:225" data-file-name="app/dashboard/page.tsx">
            <div className="h-16 w-16 rounded-full bg-blue-50 flex items-center justify-center mb-4" data-unique-id="ccac2117-b3b8-40d4-81d8-27680ec010c4" data-loc="91:12-91:101" data-file-name="app/dashboard/page.tsx">
              <UserPlus className="h-8 w-8 text-blue-600" />
            </div>
            <h2 className="text-lg font-medium text-gray-900" data-unique-id="0e7c38f1-3f7a-4e3a-a8de-7f309c5ce860" data-loc="94:12-94:62" data-file-name="app/dashboard/page.tsx">New Customer</h2>
            <p className="text-sm text-gray-500 mt-1 text-center" data-unique-id="e876b39f-079a-4c73-93eb-06dc67c31fb2" data-loc="95:12-95:66" data-file-name="app/dashboard/page.tsx">
              Register a new customer and check card eligibility
            </p>
          </button>
          
          <button onClick={() => router.push("/dashboard/customers")} className="flex flex-col items-center justify-center p-6 bg-white rounded-lg shadow-md border border-gray-100 hover:border-blue-500 transition-colors" data-unique-id="5480088b-e3ff-43c8-adee-2c617a3ad657" data-loc="100:10-100:221" data-file-name="app/dashboard/page.tsx">
            <div className="h-16 w-16 rounded-full bg-green-50 flex items-center justify-center mb-4" data-unique-id="4a461456-6d90-46dd-9240-cc1e3330c60b" data-loc="101:12-101:102" data-file-name="app/dashboard/page.tsx">
              <ClipboardList className="h-8 w-8 text-green-600" />
            </div>
            <h2 className="text-lg font-medium text-gray-900" data-unique-id="03a94b12-f2a5-4f92-aad1-e48fb96e81f5" data-loc="104:12-104:62" data-file-name="app/dashboard/page.tsx">My Customers</h2>
            <p className="text-sm text-gray-500 mt-1 text-center" data-unique-id="7a8b6110-c2cb-4aec-8f51-75337820eb71" data-loc="105:12-105:66" data-file-name="app/dashboard/page.tsx">
              View and manage your registered customers
            </p>
          </button>
        </div>
        
        {/* Recent Customers */}
        <div className="bg-white rounded-lg shadow-md p-6" data-unique-id="4669f2f8-02cb-4310-9228-20d4c5b6fbc0" data-loc="112:8-112:59" data-file-name="app/dashboard/page.tsx">
          <div className="flex items-center justify-between mb-6" data-unique-id="0f563a12-b51c-47a0-9716-d1673eadbed8" data-loc="113:10-113:66" data-file-name="app/dashboard/page.tsx">
            <h2 className="text-lg font-medium text-gray-900" data-unique-id="4f3ad6da-c1de-4d81-bcde-6512e885c7de" data-loc="114:12-114:62" data-file-name="app/dashboard/page.tsx">Recent Customers</h2>
            <button onClick={() => router.push("/dashboard/customers")} className="text-sm text-blue-600 hover:text-blue-800 flex items-center" data-unique-id="4176a807-6d3f-4a9f-a6f2-037b7fb82523" data-loc="115:12-115:144" data-file-name="app/dashboard/page.tsx">
              View all <ChevronRight className="h-4 w-4 ml-1" />
            </button>
          </div>
            
          {recentCustomers.length > 0 ? <div className="overflow-x-auto" data-unique-id="4ceaeec1-f89e-4db3-aff5-408ede2ab832" data-loc="120:40-120:73" data-file-name="app/dashboard/page.tsx">
              <table className="min-w-full divide-y divide-gray-200" data-unique-id="18330ccc-ba21-49e4-a1ed-1a73cc423318" data-loc="121:14-121:69" data-file-name="app/dashboard/page.tsx">
                <thead className="bg-gray-50" data-unique-id="b0d0dcd6-de4f-4da5-a651-6b45aaccf281" data-loc="122:16-122:46" data-file-name="app/dashboard/page.tsx">
                  <tr data-unique-id="9230e062-c0be-4d9c-b8be-64aa2a70675b" data-loc="123:18-123:22" data-file-name="app/dashboard/page.tsx">
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider" data-unique-id="2acc152c-2f9d-4969-b361-feaf61c67940" data-loc="124:20-124:115" data-file-name="app/dashboard/page.tsx">
                      Name
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider" data-unique-id="24b00a81-f790-4077-9665-ced4fb4869f4" data-loc="127:20-127:115" data-file-name="app/dashboard/page.tsx">
                      Contact
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider" data-unique-id="08776a58-94ec-49fc-aeb3-3498e8d4c421" data-loc="130:20-130:115" data-file-name="app/dashboard/page.tsx">
                      CIBIL
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider" data-unique-id="3b15ba8a-f873-4fba-a723-6ec01bd2c976" data-loc="133:20-133:115" data-file-name="app/dashboard/page.tsx">
                      Date
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider" data-unique-id="38f89284-cf63-47d2-a870-bb8b236753d6" data-loc="136:20-136:115" data-file-name="app/dashboard/page.tsx">
                      Action
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200" data-unique-id="185b0e8f-244a-41dd-bbaf-6a798d2497e3" data-loc="141:16-141:69" data-file-name="app/dashboard/page.tsx">
                  {recentCustomers.map(customer => <tr key={customer._id} className="hover:bg-gray-50" data-unique-id="7f03f25f-1592-4f5e-9c2d-94178bf7db8c" data-loc="142:51-142:103" data-file-name="app/dashboard/page.tsx">
                      <td className="px-6 py-4 whitespace-nowrap" data-unique-id="9423cdd7-6d13-4467-94f4-65f0b27c80f2" data-loc="143:22-143:66" data-file-name="app/dashboard/page.tsx">
                        <div className="text-sm font-medium text-gray-900" data-unique-id="afc83c04-455f-437f-897a-61534f13a5c1" data-loc="144:24-144:75" data-file-name="app/dashboard/page.tsx">{customer.name}</div>
                        <div className="text-sm text-gray-500" data-unique-id="18c3dd40-8133-435b-80e7-2e6557531316" data-loc="145:24-145:63" data-file-name="app/dashboard/page.tsx">{customer.pan}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap" data-unique-id="e32a9d7a-6fc2-4975-b30e-aa718ed6ecd4" data-loc="147:22-147:66" data-file-name="app/dashboard/page.tsx">
                        <div className="flex items-center text-sm text-gray-500" data-unique-id="ef81b2da-0a7c-4e9e-9f88-531aad5096c8" data-loc="148:24-148:81" data-file-name="app/dashboard/page.tsx">
                          <Phone className="h-4 w-4 mr-1" /> {customer.phone}
                        </div>
                        <div className="flex items-center text-sm text-gray-500" data-unique-id="3a1292ac-1f5c-40c0-976e-5679a851f08e" data-loc="151:24-151:81" data-file-name="app/dashboard/page.tsx">
                          <Mail className="h-4 w-4 mr-1" /> {customer.email}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap" data-unique-id="a679ea4a-b005-49cb-adc9-9c71c7133920" data-loc="155:22-155:66" data-file-name="app/dashboard/page.tsx">
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${(customer.cibilScore ?? 0) >= 750 ? 'bg-green-100 text-green-800' : (customer.cibilScore ?? 0) >= 700 ? 'bg-blue-100 text-blue-800' : (customer.cibilScore ?? 0) >= 650 ? 'bg-yellow-100 text-yellow-800' : 'bg-red-100 text-red-800'}`} data-unique-id="c19d3624-9b8a-45ff-87e4-ddcddbda3ace" data-loc="156:24-156:349" data-file-name="app/dashboard/page.tsx">
                          {customer.cibilScore ?? 'N/A'}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500" data-unique-id="4e44e92f-689f-4bed-8e31-23379ed5c0f2" data-loc="160:22-160:88" data-file-name="app/dashboard/page.tsx">
                        {format(new Date(customer.createdAt), 'dd MMM yyyy')}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm" data-unique-id="e22926ba-14b0-46b8-8cab-c45823f0e2d0" data-loc="163:22-163:74" data-file-name="app/dashboard/page.tsx">
                        <button onClick={() => router.push(`/dashboard/eligibility/${customer._id}`)} className="text-blue-600 hover:text-blue-900" data-unique-id="c6b15430-8a8b-4cdd-a5ac-f565b53f7448" data-loc="164:24-164:148" data-file-name="app/dashboard/page.tsx">
                          View Cards
                        </button>
                      </td>
                    </tr>)}
                </tbody>
              </table>
            </div> : <div className="text-center py-8" data-unique-id="5c95d4aa-6b4f-4dfc-b35a-5c817b9b0041" data-loc="171:21-171:55" data-file-name="app/dashboard/page.tsx">
              <div className="flex justify-center mb-4" data-unique-id="380f8ff1-93f4-4cea-95dd-5cb11f1b3705" data-loc="172:14-172:56" data-file-name="app/dashboard/page.tsx">
                <CreditCard className="h-12 w-12 text-gray-300" />
              </div>
              <h3 className="text-lg font-medium text-gray-900 mb-1" data-unique-id="75b0dad5-a21e-49a1-af6c-c9d3e58eefbf" data-loc="175:14-175:69" data-file-name="app/dashboard/page.tsx">No customers yet</h3>
              <p className="text-gray-500 mb-4" data-unique-id="7b235dbf-3d2d-4be4-82a8-60a1933a02df" data-loc="176:14-176:48" data-file-name="app/dashboard/page.tsx">Start by registering your first customer</p>
              <button onClick={() => router.push("/dashboard/customer-form")} className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700" data-unique-id="a9d3b3cb-993d-465f-8684-d08c34457d74" data-loc="177:14-177:233" data-file-name="app/dashboard/page.tsx">
                <UserPlus className="h-4 w-4 mr-2" /> Add Customer
              </button>
            </div>}
        </div>
        
        {/* Error Test Component (for development/testing) */}
        <div className="mt-8" data-unique-id="0ed88d50-3624-4a01-8bc0-91bdecbae96e" data-loc="184:8-184:30" data-file-name="app/dashboard/page.tsx">
          <ErrorTest />
        </div>
        
        {/* Agent Stats */}
        <div className="grid grid-cols-3 gap-6 mt-8" data-unique-id="d86cbb23-0242-4ba7-938a-693247fce84b" data-loc="189:8-189:53" data-file-name="app/dashboard/page.tsx">
          <div className="bg-white rounded-lg shadow-md p-6" data-unique-id="55c745b4-6219-4508-95ba-5cb9b130513f" data-loc="190:10-190:61" data-file-name="app/dashboard/page.tsx">
            <div className="flex items-center" data-unique-id="802b8604-52ad-4e36-be67-905614ff1733" data-loc="191:12-191:47" data-file-name="app/dashboard/page.tsx">
              <div className="flex-shrink-0 bg-blue-100 rounded-md p-3" data-unique-id="cecb1e01-a859-48a1-a762-e35d40c890e7" data-loc="192:14-192:72" data-file-name="app/dashboard/page.tsx">
                <UserPlus className="h-6 w-6 text-blue-600" />
              </div>
              <div className="ml-5 w-0 flex-1" data-unique-id="a2f678d1-d695-4803-b9fa-a4132e51fca5" data-loc="195:14-195:47" data-file-name="app/dashboard/page.tsx">
                <dl data-unique-id="52f38ddc-daeb-4761-9024-4a22c70604ec" data-loc="196:16-196:20" data-file-name="app/dashboard/page.tsx">
                  <dt className="text-sm font-medium text-gray-500 truncate" data-unique-id="0930d6a4-fd83-48eb-9ab7-d1d1a9737307" data-loc="197:18-197:77" data-file-name="app/dashboard/page.tsx">
                    Total Customers
                  </dt>
                  <dd className="text-lg font-semibold text-gray-900" data-unique-id="0f9e756a-3aba-440f-9478-bbc09a273e9c" data-loc="200:18-200:70" data-file-name="app/dashboard/page.tsx">
                    {recentCustomers.length}
                  </dd>
                </dl>
              </div>
            </div>
          </div>
          
          <div className="bg-white rounded-lg shadow-md p-6" data-unique-id="fe3aa452-0d26-4a4e-81a7-61d717ae5eec" data-loc="208:10-208:61" data-file-name="app/dashboard/page.tsx">
            <div className="flex items-center" data-unique-id="c67a9b63-67ac-4bd9-bc7e-53a656326773" data-loc="209:12-209:47" data-file-name="app/dashboard/page.tsx">
              <div className="flex-shrink-0 bg-green-100 rounded-md p-3" data-unique-id="22972138-9a4e-4cd9-8ea8-1a8c5c0ee902" data-loc="210:14-210:73" data-file-name="app/dashboard/page.tsx">
                <CreditCard className="h-6 w-6 text-green-600" />
              </div>
              <div className="ml-5 w-0 flex-1" data-unique-id="ffb8ea46-7c30-4846-8097-4b115d8ba539" data-loc="213:14-213:47" data-file-name="app/dashboard/page.tsx">
                <dl data-unique-id="1198dd97-f9cb-4e5e-9293-d91eb310f484" data-loc="214:16-214:20" data-file-name="app/dashboard/page.tsx">
                  <dt className="text-sm font-medium text-gray-500 truncate" data-unique-id="bc755074-d4ff-4f17-873a-503be5cfcd9a" data-loc="215:18-215:77" data-file-name="app/dashboard/page.tsx">
                    Cards Recommended
                  </dt>
                  <dd className="text-lg font-semibold text-gray-900" data-unique-id="7377be3d-ff80-413a-bcfd-5f76a11ea087" data-loc="218:18-218:70" data-file-name="app/dashboard/page.tsx">
                    {0} {/* Will be implemented with API */}
                  </dd>
                </dl>
              </div>
            </div>
          </div>
          
          <div className="bg-white rounded-lg shadow-md p-6" data-unique-id="cc8d81cc-22cd-4bfa-913f-36a33a38b96d" data-loc="226:10-226:61" data-file-name="app/dashboard/page.tsx">
            <div className="flex items-center" data-unique-id="beb4a706-6205-45cb-a5ed-50ace890b466" data-loc="227:12-227:47" data-file-name="app/dashboard/page.tsx">
              <div className="flex-shrink-0 bg-yellow-100 rounded-md p-3" data-unique-id="98ef2c6b-2d04-4fd5-b02f-ebf938c6ec3e" data-loc="228:14-228:74" data-file-name="app/dashboard/page.tsx">
                <Calendar className="h-6 w-6 text-yellow-600" data-unique-id="a85b5ab2-5fc3-4874-a26b-c67b4451b2da" data-loc="229:16-229:64" data-file-name="app/dashboard/page.tsx" />
              </div>
              <div className="ml-5 w-0 flex-1" data-unique-id="fde10a72-241b-4d60-a53e-91f17a19a73f" data-loc="231:14-231:47" data-file-name="app/dashboard/page.tsx">
                <dl data-unique-id="67e0423a-270d-4324-bb82-16960bb52191" data-loc="232:16-232:20" data-file-name="app/dashboard/page.tsx">
                  <dt className="text-sm font-medium text-gray-500 truncate" data-unique-id="b4a0ce13-a7c2-43bf-b5ea-f2d233f72252" data-loc="233:18-233:77" data-file-name="app/dashboard/page.tsx">
                    Activities Today
                  </dt>
                  <dd className="text-lg font-semibold text-gray-900" data-unique-id="fc938225-32e9-4de9-8514-0667a080789c" data-loc="236:18-236:70" data-file-name="app/dashboard/page.tsx">
                    {0} {/* Will be implemented with API */}
                  </dd>
                </dl>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>;
}