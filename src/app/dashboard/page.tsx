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
    return <div className="flex items-center justify-center min-h-screen" data-unique-id="b54808b0-1666-4e3c-83a1-3aaf94ea7b3b" data-loc="66:11-66:74" data-file-name="app/dashboard/page.tsx">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-600" data-unique-id="1415541f-8220-44c8-a407-c3663e94f85d" data-loc="67:8-67:99" data-file-name="app/dashboard/page.tsx"></div>
      </div>;
  }
  return <div className="min-h-screen bg-gray-50" data-unique-id="e43041af-ee7c-4582-9a83-9504b67244b8" data-loc="70:9-70:50" data-file-name="app/dashboard/page.tsx">
      {/* Header */}
      <header className="bg-white shadow" data-unique-id="76039fcd-417f-47a2-a024-50275c40d7ca" data-loc="72:6-72:42" data-file-name="app/dashboard/page.tsx">
        <div className="max-w-7xl mx-auto px-4 py-4 sm:px-6 flex justify-between items-center" data-unique-id="0082aec9-83f3-40c7-a782-54668bcbab3b" data-loc="73:8-73:95" data-file-name="app/dashboard/page.tsx">
          <h1 className="text-2xl font-bold text-gray-900" data-unique-id="bed84ad3-319c-4222-92e3-d04efaf9fa45" data-loc="74:10-74:59" data-file-name="app/dashboard/page.tsx">CardSales Pro</h1>
          <div className="flex items-center" data-unique-id="e31ec289-ea09-4bff-ae8d-c07a1547dab8" data-loc="75:10-75:45" data-file-name="app/dashboard/page.tsx">
            <span className="text-sm font-medium text-gray-600 mr-4" data-unique-id="32f08bf5-923d-4294-8458-e3bcd96e4b1e" data-loc="76:12-76:69" data-file-name="app/dashboard/page.tsx">
              Welcome, {agent.name}
            </span>
            <button onClick={handleLogout} className="flex items-center text-sm font-medium text-red-600 hover:text-red-800" data-unique-id="2510219d-76a3-4746-9be1-a67591729df5" data-loc="79:12-79:125" data-file-name="app/dashboard/page.tsx">
              <LogOut className="h-4 w-4 mr-1" /> Logout
            </button>
          </div>
        </div>
      </header>
      
      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 py-8 sm:px-6" data-unique-id="1b2f5ac4-7806-4c94-9cec-37be490823c4" data-loc="87:6-87:60" data-file-name="app/dashboard/page.tsx">
        {/* Action Cards */}
        <div className="grid grid-cols-2 gap-6 mb-8" data-unique-id="f80f41de-4a35-4593-b1a3-164b53a2a906" data-loc="89:8-89:53" data-file-name="app/dashboard/page.tsx">
          <button onClick={() => router.push("/dashboard/customer-form")} className="flex flex-col items-center justify-center p-6 bg-white rounded-lg shadow-md border border-gray-100 hover:border-blue-500 transition-colors" data-unique-id="63e2c5f3-bd5b-47a6-a5a6-181d08e47fc8" data-loc="90:10-90:225" data-file-name="app/dashboard/page.tsx">
            <div className="h-16 w-16 rounded-full bg-blue-50 flex items-center justify-center mb-4" data-unique-id="06010bb0-d33a-40cf-b22f-304b8c00936b" data-loc="91:12-91:101" data-file-name="app/dashboard/page.tsx">
              <UserPlus className="h-8 w-8 text-blue-600" />
            </div>
            <h2 className="text-lg font-medium text-gray-900" data-unique-id="5e7c7e3d-9b73-4798-a725-b7b1dc874679" data-loc="94:12-94:62" data-file-name="app/dashboard/page.tsx">New Customer</h2>
            <p className="text-sm text-gray-500 mt-1 text-center" data-unique-id="5b2eb9be-9dc0-4775-af65-89f456ecc194" data-loc="95:12-95:66" data-file-name="app/dashboard/page.tsx">
              Register a new customer and check card eligibility
            </p>
          </button>
          
          <button onClick={() => router.push("/dashboard/customers")} className="flex flex-col items-center justify-center p-6 bg-white rounded-lg shadow-md border border-gray-100 hover:border-blue-500 transition-colors" data-unique-id="3bd21cae-6375-400f-93fe-b531399bb784" data-loc="100:10-100:221" data-file-name="app/dashboard/page.tsx">
            <div className="h-16 w-16 rounded-full bg-green-50 flex items-center justify-center mb-4" data-unique-id="60aad63d-42d3-415a-a99e-54cf1c37ba68" data-loc="101:12-101:102" data-file-name="app/dashboard/page.tsx">
              <ClipboardList className="h-8 w-8 text-green-600" />
            </div>
            <h2 className="text-lg font-medium text-gray-900" data-unique-id="502f2d87-429a-4999-8433-e805ce41f54f" data-loc="104:12-104:62" data-file-name="app/dashboard/page.tsx">My Customers</h2>
            <p className="text-sm text-gray-500 mt-1 text-center" data-unique-id="ca19f051-d84b-435b-9d84-7619986fa91e" data-loc="105:12-105:66" data-file-name="app/dashboard/page.tsx">
              View and manage your registered customers
            </p>
          </button>
        </div>
        
        {/* Recent Customers */}
        <div className="bg-white rounded-lg shadow-md p-6" data-unique-id="aec91360-a0e1-4f95-a69a-d975d4628586" data-loc="112:8-112:59" data-file-name="app/dashboard/page.tsx">
          <div className="flex items-center justify-between mb-6" data-unique-id="9c07bd33-80a1-4533-b0d4-b95583151ec5" data-loc="113:10-113:66" data-file-name="app/dashboard/page.tsx">
            <h2 className="text-lg font-medium text-gray-900" data-unique-id="228daacf-7380-499b-abd9-c7d402889ade" data-loc="114:12-114:62" data-file-name="app/dashboard/page.tsx">Recent Customers</h2>
            <button onClick={() => router.push("/dashboard/customers")} className="text-sm text-blue-600 hover:text-blue-800 flex items-center" data-unique-id="4c952a33-a7af-4dbc-a824-8a0f86ee4a61" data-loc="115:12-115:144" data-file-name="app/dashboard/page.tsx">
              View all <ChevronRight className="h-4 w-4 ml-1" />
            </button>
          </div>
            
          {recentCustomers.length > 0 ? <div className="overflow-x-auto" data-unique-id="fa63b3f4-1b8c-4fb3-8dde-55bedecbb3a3" data-loc="120:40-120:73" data-file-name="app/dashboard/page.tsx">
              <table className="min-w-full divide-y divide-gray-200" data-unique-id="caf71682-a8d8-4787-98fb-4ebbf813d02c" data-loc="121:14-121:69" data-file-name="app/dashboard/page.tsx">
                <thead className="bg-gray-50" data-unique-id="5ebc3ead-e993-456d-adfb-febb5d76f349" data-loc="122:16-122:46" data-file-name="app/dashboard/page.tsx">
                  <tr data-unique-id="2da1e3e3-54a3-4e4e-b850-daf845bdb4ab" data-loc="123:18-123:22" data-file-name="app/dashboard/page.tsx">
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider" data-unique-id="7b3a0a1f-25f5-4cb2-9955-2690712e79d6" data-loc="124:20-124:115" data-file-name="app/dashboard/page.tsx">
                      Name
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider" data-unique-id="e2291aee-0748-4085-8af8-1e8f7bfa0fbd" data-loc="127:20-127:115" data-file-name="app/dashboard/page.tsx">
                      Contact
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider" data-unique-id="9d405517-0889-434b-a0eb-4664973a56b6" data-loc="130:20-130:115" data-file-name="app/dashboard/page.tsx">
                      CIBIL
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider" data-unique-id="7a2c404c-ab20-4434-9250-b42085d3d098" data-loc="133:20-133:115" data-file-name="app/dashboard/page.tsx">
                      Date
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider" data-unique-id="104e0e15-2009-4d81-b972-38e866382ca2" data-loc="136:20-136:115" data-file-name="app/dashboard/page.tsx">
                      Action
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200" data-unique-id="a2a6b10e-7d6f-49c4-b9d3-e1fd6e54fd81" data-loc="141:16-141:69" data-file-name="app/dashboard/page.tsx">
                  {recentCustomers.map(customer => <tr key={customer._id} className="hover:bg-gray-50" data-unique-id="004441d9-4636-4d2d-9bfb-7927b97de7a1" data-loc="142:51-142:103" data-file-name="app/dashboard/page.tsx">
                      <td className="px-6 py-4 whitespace-nowrap" data-unique-id="2035366b-9704-4de3-b584-b7cae923923f" data-loc="143:22-143:66" data-file-name="app/dashboard/page.tsx">
                        <div className="text-sm font-medium text-gray-900" data-unique-id="e37b55ed-6ea6-40d2-bcee-789c587b3182" data-loc="144:24-144:75" data-file-name="app/dashboard/page.tsx">{customer.name}</div>
                        <div className="text-sm text-gray-500" data-unique-id="73fcfaf3-4602-491b-8151-c65de01e4992" data-loc="145:24-145:63" data-file-name="app/dashboard/page.tsx">{customer.pan}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap" data-unique-id="150bc295-4a14-4aef-a82b-eff8615db3b2" data-loc="147:22-147:66" data-file-name="app/dashboard/page.tsx">
                        <div className="flex items-center text-sm text-gray-500" data-unique-id="97ac1892-bfd0-4bd1-9c36-d6852b298a10" data-loc="148:24-148:81" data-file-name="app/dashboard/page.tsx">
                          <Phone className="h-4 w-4 mr-1" /> {customer.phone}
                        </div>
                        <div className="flex items-center text-sm text-gray-500" data-unique-id="b7684034-74ef-467c-9230-a2e893382cbe" data-loc="151:24-151:81" data-file-name="app/dashboard/page.tsx">
                          <Mail className="h-4 w-4 mr-1" /> {customer.email}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap" data-unique-id="982628d6-89ad-49a0-8f66-459b01e170c7" data-loc="155:22-155:66" data-file-name="app/dashboard/page.tsx">
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${(customer.cibilScore ?? 0) >= 750 ? 'bg-green-100 text-green-800' : (customer.cibilScore ?? 0) >= 700 ? 'bg-blue-100 text-blue-800' : (customer.cibilScore ?? 0) >= 650 ? 'bg-yellow-100 text-yellow-800' : 'bg-red-100 text-red-800'}`} data-unique-id="353d2dda-f25c-42f6-acbf-dd08e7b9de74" data-loc="156:24-156:349" data-file-name="app/dashboard/page.tsx">
                          {customer.cibilScore ?? 'N/A'}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500" data-unique-id="31f0b769-274c-4992-981d-313b39e76937" data-loc="160:22-160:88" data-file-name="app/dashboard/page.tsx">
                        {format(new Date(customer.createdAt), 'dd MMM yyyy')}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm" data-unique-id="b8840981-4519-45c2-82fb-48fe697b04d6" data-loc="163:22-163:74" data-file-name="app/dashboard/page.tsx">
                        <button onClick={() => router.push(`/dashboard/eligibility/${customer._id}`)} className="text-blue-600 hover:text-blue-900" data-unique-id="3c5f9e1d-3e00-4046-947f-f35c83746480" data-loc="164:24-164:148" data-file-name="app/dashboard/page.tsx">
                          View Cards
                        </button>
                      </td>
                    </tr>)}
                </tbody>
              </table>
            </div> : <div className="text-center py-8" data-unique-id="0d3f68c9-563b-43a9-9e13-00283009595c" data-loc="171:21-171:55" data-file-name="app/dashboard/page.tsx">
              <div className="flex justify-center mb-4" data-unique-id="c097c8b2-9754-4633-bbb2-03b28da99e18" data-loc="172:14-172:56" data-file-name="app/dashboard/page.tsx">
                <CreditCard className="h-12 w-12 text-gray-300" />
              </div>
              <h3 className="text-lg font-medium text-gray-900 mb-1" data-unique-id="2617152c-bdc9-4c68-865b-6623aee95162" data-loc="175:14-175:69" data-file-name="app/dashboard/page.tsx">No customers yet</h3>
              <p className="text-gray-500 mb-4" data-unique-id="b434e612-d368-4b84-bbf5-2d4027ab0d39" data-loc="176:14-176:48" data-file-name="app/dashboard/page.tsx">Start by registering your first customer</p>
              <button onClick={() => router.push("/dashboard/customer-form")} className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700" data-unique-id="01110d93-07d6-41e0-8648-23737bb75149" data-loc="177:14-177:233" data-file-name="app/dashboard/page.tsx">
                <UserPlus className="h-4 w-4 mr-2" /> Add Customer
              </button>
            </div>}
        </div>
        
        {/* Error Test Component (for development/testing) */}
        <div className="mt-8" data-unique-id="2452da26-ad3e-4217-8e00-2cc69cd9b247" data-loc="184:8-184:30" data-file-name="app/dashboard/page.tsx">
          <ErrorTest />
        </div>
        
        {/* Agent Stats */}
        <div className="grid grid-cols-3 gap-6 mt-8" data-unique-id="de876a00-fb50-4962-9304-c5d965dc4f9e" data-loc="189:8-189:53" data-file-name="app/dashboard/page.tsx">
          <div className="bg-white rounded-lg shadow-md p-6" data-unique-id="54c6ca71-fec5-4f91-bf51-0ee2188026b5" data-loc="190:10-190:61" data-file-name="app/dashboard/page.tsx">
            <div className="flex items-center" data-unique-id="294693f3-ed1a-4e84-adf3-400b88c9d2fb" data-loc="191:12-191:47" data-file-name="app/dashboard/page.tsx">
              <div className="flex-shrink-0 bg-blue-100 rounded-md p-3" data-unique-id="23f009a7-2c78-4386-b74f-114ad77a4f2f" data-loc="192:14-192:72" data-file-name="app/dashboard/page.tsx">
                <UserPlus className="h-6 w-6 text-blue-600" />
              </div>
              <div className="ml-5 w-0 flex-1" data-unique-id="af874786-f758-4604-b200-613111d189a1" data-loc="195:14-195:47" data-file-name="app/dashboard/page.tsx">
                <dl data-unique-id="da9fd3a0-32bb-4fc8-99cb-0ffca8f254b5" data-loc="196:16-196:20" data-file-name="app/dashboard/page.tsx">
                  <dt className="text-sm font-medium text-gray-500 truncate" data-unique-id="0a065ef2-d8c3-46b4-9819-72d7ada85b0c" data-loc="197:18-197:77" data-file-name="app/dashboard/page.tsx">
                    Total Customers
                  </dt>
                  <dd className="text-lg font-semibold text-gray-900" data-unique-id="bac46884-183b-409a-b1d6-bf1174f97b94" data-loc="200:18-200:70" data-file-name="app/dashboard/page.tsx">
                    {recentCustomers.length}
                  </dd>
                </dl>
              </div>
            </div>
          </div>
          
          <div className="bg-white rounded-lg shadow-md p-6" data-unique-id="59117f97-4a97-4ac3-8d9f-0d268a8736a9" data-loc="208:10-208:61" data-file-name="app/dashboard/page.tsx">
            <div className="flex items-center" data-unique-id="0c1bbe18-5d6f-4e67-a2c7-4a5b5ae01f0d" data-loc="209:12-209:47" data-file-name="app/dashboard/page.tsx">
              <div className="flex-shrink-0 bg-green-100 rounded-md p-3" data-unique-id="d202f087-53ae-4654-b819-0fa1ab802baa" data-loc="210:14-210:73" data-file-name="app/dashboard/page.tsx">
                <CreditCard className="h-6 w-6 text-green-600" />
              </div>
              <div className="ml-5 w-0 flex-1" data-unique-id="adf3e8a8-aaae-44c9-a781-e3189638228c" data-loc="213:14-213:47" data-file-name="app/dashboard/page.tsx">
                <dl data-unique-id="389e8f04-3111-40f1-a96f-3480bf35adb6" data-loc="214:16-214:20" data-file-name="app/dashboard/page.tsx">
                  <dt className="text-sm font-medium text-gray-500 truncate" data-unique-id="0990fa77-a374-4ced-9f32-8816e88eff1c" data-loc="215:18-215:77" data-file-name="app/dashboard/page.tsx">
                    Cards Recommended
                  </dt>
                  <dd className="text-lg font-semibold text-gray-900" data-unique-id="90d7c50a-9ffc-4e19-bf60-40f6e04aa631" data-loc="218:18-218:70" data-file-name="app/dashboard/page.tsx">
                    {0} {/* Will be implemented with API */}
                  </dd>
                </dl>
              </div>
            </div>
          </div>
          
          <div className="bg-white rounded-lg shadow-md p-6" data-unique-id="c94e6a9b-1c49-4fb4-ad57-d4b9888e210e" data-loc="226:10-226:61" data-file-name="app/dashboard/page.tsx">
            <div className="flex items-center" data-unique-id="bdb0a37d-2a32-4f4c-85f0-02ca0e8ddc32" data-loc="227:12-227:47" data-file-name="app/dashboard/page.tsx">
              <div className="flex-shrink-0 bg-yellow-100 rounded-md p-3" data-unique-id="473f5d06-00b4-4a8a-90db-bbc6cce6dbdb" data-loc="228:14-228:74" data-file-name="app/dashboard/page.tsx">
                <Calendar className="h-6 w-6 text-yellow-600" data-unique-id="2535f127-e4b7-4358-a931-0eaa2fe636db" data-loc="229:16-229:64" data-file-name="app/dashboard/page.tsx" />
              </div>
              <div className="ml-5 w-0 flex-1" data-unique-id="1d17342f-2d87-4527-a12f-c59f5607e475" data-loc="231:14-231:47" data-file-name="app/dashboard/page.tsx">
                <dl data-unique-id="2c2ed1e7-db1f-4f11-9512-e58deff38650" data-loc="232:16-232:20" data-file-name="app/dashboard/page.tsx">
                  <dt className="text-sm font-medium text-gray-500 truncate" data-unique-id="00c4fc90-c32d-4a5d-a961-6d490d8b1a1d" data-loc="233:18-233:77" data-file-name="app/dashboard/page.tsx">
                    Activities Today
                  </dt>
                  <dd className="text-lg font-semibold text-gray-900" data-unique-id="b4927b94-f499-49c4-8bbd-c77b8ab3b000" data-loc="236:18-236:70" data-file-name="app/dashboard/page.tsx">
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