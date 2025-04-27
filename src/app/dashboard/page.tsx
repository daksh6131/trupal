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
    return <div className="flex items-center justify-center min-h-screen" data-unique-id="23910b30-6417-47e4-8cb1-9cc43f6bf97f" data-loc="66:11-66:74" data-file-name="app/dashboard/page.tsx">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-600" data-unique-id="491ba0fb-bb51-4346-b550-c9d6d07a09da" data-loc="67:8-67:99" data-file-name="app/dashboard/page.tsx"></div>
      </div>;
  }
  return <div className="min-h-screen bg-gray-50" data-unique-id="57148f6f-792d-47fd-9326-2ff436f12bef" data-loc="70:9-70:50" data-file-name="app/dashboard/page.tsx">
      {/* Header */}
      <header className="bg-white shadow" data-unique-id="6d0797ec-20e2-41e1-a625-0b7e0aa5d20b" data-loc="72:6-72:42" data-file-name="app/dashboard/page.tsx">
        <div className="max-w-7xl mx-auto px-4 py-4 sm:px-6 flex justify-between items-center" data-unique-id="a5a427dc-fc7f-4d64-bf37-efb71ccce58d" data-loc="73:8-73:95" data-file-name="app/dashboard/page.tsx">
          <h1 className="text-2xl font-bold text-gray-900" data-unique-id="0b6d06c2-0ea2-4102-a3f7-3c204df7283b" data-loc="74:10-74:59" data-file-name="app/dashboard/page.tsx">CardSales Pro</h1>
          <div className="flex items-center" data-unique-id="dc754266-66a8-4e0d-bbfc-332417d3839b" data-loc="75:10-75:45" data-file-name="app/dashboard/page.tsx">
            <span className="text-sm font-medium text-gray-600 mr-4" data-unique-id="cb73a045-459e-4f23-b355-a30165094284" data-loc="76:12-76:69" data-file-name="app/dashboard/page.tsx">
              Welcome, {agent.name}
            </span>
            <button onClick={handleLogout} className="flex items-center text-sm font-medium text-red-600 hover:text-red-800" data-unique-id="2fe4f52d-358c-419e-ba93-1fe7673197a5" data-loc="79:12-79:125" data-file-name="app/dashboard/page.tsx">
              <LogOut className="h-4 w-4 mr-1" /> Logout
            </button>
          </div>
        </div>
      </header>
      
      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 py-8 sm:px-6" data-unique-id="dfeb8686-9809-4ce1-bc09-4898cdd1bf04" data-loc="87:6-87:60" data-file-name="app/dashboard/page.tsx">
        {/* Action Cards */}
        <div className="grid grid-cols-2 gap-6 mb-8" data-unique-id="4c5cb0e5-d5a7-4652-b24f-d9782fd3d8d9" data-loc="89:8-89:53" data-file-name="app/dashboard/page.tsx">
          <button onClick={() => router.push("/dashboard/customer-form")} className="flex flex-col items-center justify-center p-6 bg-white rounded-lg shadow-md border border-gray-100 hover:border-blue-500 transition-colors" data-unique-id="4c2961e1-8686-4fcd-9931-1c79cf02771f" data-loc="90:10-90:225" data-file-name="app/dashboard/page.tsx">
            <div className="h-16 w-16 rounded-full bg-blue-50 flex items-center justify-center mb-4" data-unique-id="eea30535-c1bc-400a-a3cb-3eaf12dd7d47" data-loc="91:12-91:101" data-file-name="app/dashboard/page.tsx">
              <UserPlus className="h-8 w-8 text-blue-600" />
            </div>
            <h2 className="text-lg font-medium text-gray-900" data-unique-id="4eba88b7-eea0-483a-bbb6-1f42172074d8" data-loc="94:12-94:62" data-file-name="app/dashboard/page.tsx">New Customer</h2>
            <p className="text-sm text-gray-500 mt-1 text-center" data-unique-id="a4377279-5277-4626-b44b-4f11601d3899" data-loc="95:12-95:66" data-file-name="app/dashboard/page.tsx">
              Register a new customer and check card eligibility
            </p>
          </button>
          
          <button onClick={() => router.push("/dashboard/customers")} className="flex flex-col items-center justify-center p-6 bg-white rounded-lg shadow-md border border-gray-100 hover:border-blue-500 transition-colors" data-unique-id="64be4add-2338-4465-aa4a-76dbc79369c8" data-loc="100:10-100:221" data-file-name="app/dashboard/page.tsx">
            <div className="h-16 w-16 rounded-full bg-green-50 flex items-center justify-center mb-4" data-unique-id="9129e1dc-a209-4333-a769-3e7e7af908c3" data-loc="101:12-101:102" data-file-name="app/dashboard/page.tsx">
              <ClipboardList className="h-8 w-8 text-green-600" />
            </div>
            <h2 className="text-lg font-medium text-gray-900" data-unique-id="256c4ca0-345d-4d3c-bb2b-dd1da32b52c2" data-loc="104:12-104:62" data-file-name="app/dashboard/page.tsx">My Customers</h2>
            <p className="text-sm text-gray-500 mt-1 text-center" data-unique-id="366ede61-aec7-4146-86aa-0ab832892b0a" data-loc="105:12-105:66" data-file-name="app/dashboard/page.tsx">
              View and manage your registered customers
            </p>
          </button>
        </div>
        
        {/* Recent Customers */}
        <div className="bg-white rounded-lg shadow-md p-6" data-unique-id="11293fce-9cd4-4109-a184-77caf279f022" data-loc="112:8-112:59" data-file-name="app/dashboard/page.tsx">
          <div className="flex items-center justify-between mb-6" data-unique-id="1e680193-c3ec-466f-bd1e-fa8ff541c96f" data-loc="113:10-113:66" data-file-name="app/dashboard/page.tsx">
            <h2 className="text-lg font-medium text-gray-900" data-unique-id="7f1e6f1b-7231-4ad3-bf11-cd7b39d397fc" data-loc="114:12-114:62" data-file-name="app/dashboard/page.tsx">Recent Customers</h2>
            <button onClick={() => router.push("/dashboard/customers")} className="text-sm text-blue-600 hover:text-blue-800 flex items-center" data-unique-id="5458e138-6d79-406a-be92-6b82875bac01" data-loc="115:12-115:144" data-file-name="app/dashboard/page.tsx">
              View all <ChevronRight className="h-4 w-4 ml-1" />
            </button>
          </div>
            
          {recentCustomers.length > 0 ? <div className="overflow-x-auto" data-unique-id="a4af62d7-3983-42ea-b31e-543e4d0f36f8" data-loc="120:40-120:73" data-file-name="app/dashboard/page.tsx">
              <table className="min-w-full divide-y divide-gray-200" data-unique-id="626baa1e-9fc2-43ca-a5cd-3a290800a994" data-loc="121:14-121:69" data-file-name="app/dashboard/page.tsx">
                <thead className="bg-gray-50" data-unique-id="2b809511-de94-4c94-986b-c9c875026312" data-loc="122:16-122:46" data-file-name="app/dashboard/page.tsx">
                  <tr data-unique-id="645ee754-5b3b-40a1-8813-a669553e3cf9" data-loc="123:18-123:22" data-file-name="app/dashboard/page.tsx">
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider" data-unique-id="3fdd798b-fb7e-4d55-b844-09ddcdcd61b3" data-loc="124:20-124:115" data-file-name="app/dashboard/page.tsx">
                      Name
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider" data-unique-id="47ab4d21-978d-4eb6-b283-a4ed03b0d92e" data-loc="127:20-127:115" data-file-name="app/dashboard/page.tsx">
                      Contact
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider" data-unique-id="981e0ed8-c4f4-4fa7-b27b-33bc016d94e4" data-loc="130:20-130:115" data-file-name="app/dashboard/page.tsx">
                      CIBIL
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider" data-unique-id="328237ef-fdaa-4aa7-85b3-99f0f4a75c40" data-loc="133:20-133:115" data-file-name="app/dashboard/page.tsx">
                      Date
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider" data-unique-id="38b31c2e-51b1-4383-b648-401e5c8edc88" data-loc="136:20-136:115" data-file-name="app/dashboard/page.tsx">
                      Action
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200" data-unique-id="1734596e-4f6f-4270-98ba-c70b2828b6c3" data-loc="141:16-141:69" data-file-name="app/dashboard/page.tsx">
                  {recentCustomers.map(customer => <tr key={customer._id} className="hover:bg-gray-50" data-unique-id="53104537-428e-4804-a586-691ae7f52fb3" data-loc="142:51-142:103" data-file-name="app/dashboard/page.tsx">
                      <td className="px-6 py-4 whitespace-nowrap" data-unique-id="4a8407fb-e9aa-4e60-b44e-5a4f6355e5ff" data-loc="143:22-143:66" data-file-name="app/dashboard/page.tsx">
                        <div className="text-sm font-medium text-gray-900" data-unique-id="7cee1511-7c6b-46fb-acd8-198f151af8dc" data-loc="144:24-144:75" data-file-name="app/dashboard/page.tsx">{customer.name}</div>
                        <div className="text-sm text-gray-500" data-unique-id="01f16e26-fd67-481a-ac05-e659349b0b06" data-loc="145:24-145:63" data-file-name="app/dashboard/page.tsx">{customer.pan}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap" data-unique-id="2579c136-b718-4a8c-b5a9-9f52c85ed52e" data-loc="147:22-147:66" data-file-name="app/dashboard/page.tsx">
                        <div className="flex items-center text-sm text-gray-500" data-unique-id="6b35639c-b644-48da-a3c4-381828564ace" data-loc="148:24-148:81" data-file-name="app/dashboard/page.tsx">
                          <Phone className="h-4 w-4 mr-1" /> {customer.phone}
                        </div>
                        <div className="flex items-center text-sm text-gray-500" data-unique-id="a53caa86-626f-489d-8eed-a5eaf8665508" data-loc="151:24-151:81" data-file-name="app/dashboard/page.tsx">
                          <Mail className="h-4 w-4 mr-1" /> {customer.email}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap" data-unique-id="11d1e4a0-5710-4dde-8961-9b2359e80516" data-loc="155:22-155:66" data-file-name="app/dashboard/page.tsx">
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${(customer.cibilScore ?? 0) >= 750 ? 'bg-green-100 text-green-800' : (customer.cibilScore ?? 0) >= 700 ? 'bg-blue-100 text-blue-800' : (customer.cibilScore ?? 0) >= 650 ? 'bg-yellow-100 text-yellow-800' : 'bg-red-100 text-red-800'}`} data-unique-id="4d975abf-7166-478f-90d4-597c0d2927cd" data-loc="156:24-156:349" data-file-name="app/dashboard/page.tsx">
                          {customer.cibilScore ?? 'N/A'}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500" data-unique-id="7eb16b06-99d9-47f0-a798-42c0ff8874d1" data-loc="160:22-160:88" data-file-name="app/dashboard/page.tsx">
                        {format(new Date(customer.createdAt), 'dd MMM yyyy')}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm" data-unique-id="132addfc-b8b4-45ba-a2ee-1f058306400d" data-loc="163:22-163:74" data-file-name="app/dashboard/page.tsx">
                        <button onClick={() => router.push(`/dashboard/eligibility/${customer._id}`)} className="text-blue-600 hover:text-blue-900" data-unique-id="4c1f812f-eda3-429c-bcab-f1bd250b553c" data-loc="164:24-164:148" data-file-name="app/dashboard/page.tsx">
                          View Cards
                        </button>
                      </td>
                    </tr>)}
                </tbody>
              </table>
            </div> : <div className="text-center py-8" data-unique-id="47b96721-1d2c-418d-965c-3bb18c090f12" data-loc="171:21-171:55" data-file-name="app/dashboard/page.tsx">
              <div className="flex justify-center mb-4" data-unique-id="3f443140-3b87-4dcd-88fb-ba84f971911f" data-loc="172:14-172:56" data-file-name="app/dashboard/page.tsx">
                <CreditCard className="h-12 w-12 text-gray-300" />
              </div>
              <h3 className="text-lg font-medium text-gray-900 mb-1" data-unique-id="71114dde-615a-4613-b858-069b25a912b4" data-loc="175:14-175:69" data-file-name="app/dashboard/page.tsx">No customers yet</h3>
              <p className="text-gray-500 mb-4" data-unique-id="91e7f6fe-6b22-4093-8cfa-172828ed8269" data-loc="176:14-176:48" data-file-name="app/dashboard/page.tsx">Start by registering your first customer</p>
              <button onClick={() => router.push("/dashboard/customer-form")} className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700" data-unique-id="a0bb8377-c5a5-4921-b5b4-485de3fcfa42" data-loc="177:14-177:233" data-file-name="app/dashboard/page.tsx">
                <UserPlus className="h-4 w-4 mr-2" /> Add Customer
              </button>
            </div>}
        </div>
        
        {/* Error Test Component (for development/testing) */}
        <div className="mt-8" data-unique-id="11f29823-856e-4e14-9860-b34c61d64b12" data-loc="184:8-184:30" data-file-name="app/dashboard/page.tsx">
          <ErrorTest />
        </div>
        
        {/* Agent Stats */}
        <div className="grid grid-cols-3 gap-6 mt-8" data-unique-id="2df30809-7823-4535-ba82-e9a5d1e15132" data-loc="189:8-189:53" data-file-name="app/dashboard/page.tsx">
          <div className="bg-white rounded-lg shadow-md p-6" data-unique-id="00506db0-e805-441f-be81-101c38a036ab" data-loc="190:10-190:61" data-file-name="app/dashboard/page.tsx">
            <div className="flex items-center" data-unique-id="09a6b10c-2995-4d03-95e4-9cb07497c460" data-loc="191:12-191:47" data-file-name="app/dashboard/page.tsx">
              <div className="flex-shrink-0 bg-blue-100 rounded-md p-3" data-unique-id="ad15fb20-5c15-42a3-9ade-5539060310e4" data-loc="192:14-192:72" data-file-name="app/dashboard/page.tsx">
                <UserPlus className="h-6 w-6 text-blue-600" />
              </div>
              <div className="ml-5 w-0 flex-1" data-unique-id="f30464d2-e5d3-489d-a03d-1bb7d09b4088" data-loc="195:14-195:47" data-file-name="app/dashboard/page.tsx">
                <dl data-unique-id="2ba5ddbf-14cf-4c42-858a-d616a60b5be6" data-loc="196:16-196:20" data-file-name="app/dashboard/page.tsx">
                  <dt className="text-sm font-medium text-gray-500 truncate" data-unique-id="7c599f05-8091-4bf8-a0af-1b350c9b6f84" data-loc="197:18-197:77" data-file-name="app/dashboard/page.tsx">
                    Total Customers
                  </dt>
                  <dd className="text-lg font-semibold text-gray-900" data-unique-id="1f20a78b-d0b6-4daf-9379-ceb4dcfe8278" data-loc="200:18-200:70" data-file-name="app/dashboard/page.tsx">
                    {recentCustomers.length}
                  </dd>
                </dl>
              </div>
            </div>
          </div>
          
          <div className="bg-white rounded-lg shadow-md p-6" data-unique-id="e14b5f85-9ef8-415e-92c7-6b2abb1a7c19" data-loc="208:10-208:61" data-file-name="app/dashboard/page.tsx">
            <div className="flex items-center" data-unique-id="a603af3a-14dd-471d-8879-c5117b2611b1" data-loc="209:12-209:47" data-file-name="app/dashboard/page.tsx">
              <div className="flex-shrink-0 bg-green-100 rounded-md p-3" data-unique-id="062933ca-df6a-4236-966f-42e0f294160e" data-loc="210:14-210:73" data-file-name="app/dashboard/page.tsx">
                <CreditCard className="h-6 w-6 text-green-600" />
              </div>
              <div className="ml-5 w-0 flex-1" data-unique-id="54a6bcc7-e50b-4b8d-8567-25a75e7fa555" data-loc="213:14-213:47" data-file-name="app/dashboard/page.tsx">
                <dl data-unique-id="1af098f3-9d98-4d9c-9aab-c326d1b1d5af" data-loc="214:16-214:20" data-file-name="app/dashboard/page.tsx">
                  <dt className="text-sm font-medium text-gray-500 truncate" data-unique-id="09ccaef7-88d4-4545-8b0d-2937ad5e8264" data-loc="215:18-215:77" data-file-name="app/dashboard/page.tsx">
                    Cards Recommended
                  </dt>
                  <dd className="text-lg font-semibold text-gray-900" data-unique-id="d8c1b3d3-027e-4f1e-b2ee-349c2bde3cf3" data-loc="218:18-218:70" data-file-name="app/dashboard/page.tsx">
                    {0} {/* Will be implemented with API */}
                  </dd>
                </dl>
              </div>
            </div>
          </div>
          
          <div className="bg-white rounded-lg shadow-md p-6" data-unique-id="07cf6f6c-6374-48d0-8cdb-7682ab89f901" data-loc="226:10-226:61" data-file-name="app/dashboard/page.tsx">
            <div className="flex items-center" data-unique-id="e61a1d0b-96ba-4d09-87cd-45b3edf885c6" data-loc="227:12-227:47" data-file-name="app/dashboard/page.tsx">
              <div className="flex-shrink-0 bg-yellow-100 rounded-md p-3" data-unique-id="c82fc5e6-58cb-452d-b714-694ce340b2b9" data-loc="228:14-228:74" data-file-name="app/dashboard/page.tsx">
                <Calendar className="h-6 w-6 text-yellow-600" data-unique-id="e33e762f-8c31-4eed-8b2f-86962846b863" data-loc="229:16-229:64" data-file-name="app/dashboard/page.tsx" />
              </div>
              <div className="ml-5 w-0 flex-1" data-unique-id="f9c18661-be02-4bd1-9330-de81cf7f5179" data-loc="231:14-231:47" data-file-name="app/dashboard/page.tsx">
                <dl data-unique-id="a5574260-77a9-47bb-ae1b-1eaa68adaa4d" data-loc="232:16-232:20" data-file-name="app/dashboard/page.tsx">
                  <dt className="text-sm font-medium text-gray-500 truncate" data-unique-id="1505bc0a-6840-47ad-8584-d0dcca641f74" data-loc="233:18-233:77" data-file-name="app/dashboard/page.tsx">
                    Activities Today
                  </dt>
                  <dd className="text-lg font-semibold text-gray-900" data-unique-id="a546b655-2874-4fc9-a960-d9c8231278b2" data-loc="236:18-236:70" data-file-name="app/dashboard/page.tsx">
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