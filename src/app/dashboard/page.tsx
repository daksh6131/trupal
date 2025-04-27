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
    return <div className="flex items-center justify-center min-h-screen" data-unique-id="7f872036-da61-4a4e-9d84-92d4166fa7a6" data-loc="66:11-66:74" data-file-name="app/dashboard/page.tsx">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-600" data-unique-id="dc9e2d23-7a19-4bef-89fd-044c2029c88c" data-loc="67:8-67:99" data-file-name="app/dashboard/page.tsx"></div>
      </div>;
  }
  return <div className="min-h-screen bg-gray-50" data-unique-id="8cab90dd-fad7-4fe9-976a-b6f27b3f5a58" data-loc="70:9-70:50" data-file-name="app/dashboard/page.tsx">
      {/* Header */}
      <header className="bg-white shadow" data-unique-id="818b3b23-f2ca-4d3d-972c-d87c43b7e998" data-loc="72:6-72:42" data-file-name="app/dashboard/page.tsx">
        <div className="max-w-7xl mx-auto px-4 py-4 sm:px-6 flex justify-between items-center" data-unique-id="548e755d-ee70-4158-9d50-64e46668af6d" data-loc="73:8-73:95" data-file-name="app/dashboard/page.tsx">
          <h1 className="text-2xl font-bold text-gray-900" data-unique-id="aedcda2b-caba-45ec-b5e8-755b7f798186" data-loc="74:10-74:59" data-file-name="app/dashboard/page.tsx">CardSales Pro</h1>
          <div className="flex items-center" data-unique-id="0958ad24-695b-4c95-9cd0-309b1f26efe8" data-loc="75:10-75:45" data-file-name="app/dashboard/page.tsx">
            <span className="text-sm font-medium text-gray-600 mr-4" data-unique-id="d398d35d-b72a-409c-963c-6f26cc5255a5" data-loc="76:12-76:69" data-file-name="app/dashboard/page.tsx">
              Welcome, {agent.name}
            </span>
            <button onClick={handleLogout} className="flex items-center text-sm font-medium text-red-600 hover:text-red-800" data-unique-id="e3bedbf1-65cf-4372-a629-ee8ed38df85b" data-loc="79:12-79:125" data-file-name="app/dashboard/page.tsx">
              <LogOut className="h-4 w-4 mr-1" /> Logout
            </button>
          </div>
        </div>
      </header>
      
      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 py-8 sm:px-6" data-unique-id="9c828da9-147b-4d6b-8e92-cb19d3d9989a" data-loc="87:6-87:60" data-file-name="app/dashboard/page.tsx">
        {/* Action Cards */}
        <div className="grid grid-cols-2 gap-6 mb-8" data-unique-id="943b39c9-9e13-46d0-a5dd-d314c15fd322" data-loc="89:8-89:53" data-file-name="app/dashboard/page.tsx">
          <button onClick={() => router.push("/dashboard/customer-form")} className="flex flex-col items-center justify-center p-6 bg-white rounded-lg shadow-md border border-gray-100 hover:border-blue-500 transition-colors" data-unique-id="9f84ed2a-c058-4e13-aae9-9b75810ddead" data-loc="90:10-90:225" data-file-name="app/dashboard/page.tsx">
            <div className="h-16 w-16 rounded-full bg-blue-50 flex items-center justify-center mb-4" data-unique-id="69e06c22-9308-4423-932b-11ddfae75161" data-loc="91:12-91:101" data-file-name="app/dashboard/page.tsx">
              <UserPlus className="h-8 w-8 text-blue-600" />
            </div>
            <h2 className="text-lg font-medium text-gray-900" data-unique-id="cf49b64f-3938-40db-8341-7e8ec8486de3" data-loc="94:12-94:62" data-file-name="app/dashboard/page.tsx">New Customer</h2>
            <p className="text-sm text-gray-500 mt-1 text-center" data-unique-id="c71b90ec-15a0-488e-89a1-3a3d2d2e8d00" data-loc="95:12-95:66" data-file-name="app/dashboard/page.tsx">
              Register a new customer and check card eligibility
            </p>
          </button>
          
          <button onClick={() => router.push("/dashboard/customers")} className="flex flex-col items-center justify-center p-6 bg-white rounded-lg shadow-md border border-gray-100 hover:border-blue-500 transition-colors" data-unique-id="d021f502-c442-415c-b1d7-4d165cb3651c" data-loc="100:10-100:221" data-file-name="app/dashboard/page.tsx">
            <div className="h-16 w-16 rounded-full bg-green-50 flex items-center justify-center mb-4" data-unique-id="32549cd3-8ae5-48e7-bc33-2645357ef358" data-loc="101:12-101:102" data-file-name="app/dashboard/page.tsx">
              <ClipboardList className="h-8 w-8 text-green-600" />
            </div>
            <h2 className="text-lg font-medium text-gray-900" data-unique-id="3cbcc4a3-fcc8-4d80-a34c-ded467f813dc" data-loc="104:12-104:62" data-file-name="app/dashboard/page.tsx">My Customers</h2>
            <p className="text-sm text-gray-500 mt-1 text-center" data-unique-id="bd03e018-7118-43fd-8913-dabdd4f107b6" data-loc="105:12-105:66" data-file-name="app/dashboard/page.tsx">
              View and manage your registered customers
            </p>
          </button>
        </div>
        
        {/* Recent Customers */}
        <div className="bg-white rounded-lg shadow-md p-6" data-unique-id="713af60e-f841-4887-b8b9-868878fedd3d" data-loc="112:8-112:59" data-file-name="app/dashboard/page.tsx">
          <div className="flex items-center justify-between mb-6" data-unique-id="fae49ab1-79a1-4995-821f-4827e77a2e01" data-loc="113:10-113:66" data-file-name="app/dashboard/page.tsx">
            <h2 className="text-lg font-medium text-gray-900" data-unique-id="261f7b28-3f85-4849-955b-88bdacd90760" data-loc="114:12-114:62" data-file-name="app/dashboard/page.tsx">Recent Customers</h2>
            <button onClick={() => router.push("/dashboard/customers")} className="text-sm text-blue-600 hover:text-blue-800 flex items-center" data-unique-id="f2b60d52-c68f-44a4-a4c6-0b79a976b91c" data-loc="115:12-115:144" data-file-name="app/dashboard/page.tsx">
              View all <ChevronRight className="h-4 w-4 ml-1" />
            </button>
          </div>
            
          {recentCustomers.length > 0 ? <div className="overflow-x-auto" data-unique-id="e434b5a5-e777-4ce3-8e5b-4d9206c2ec28" data-loc="120:40-120:73" data-file-name="app/dashboard/page.tsx">
              <table className="min-w-full divide-y divide-gray-200" data-unique-id="47fb8ceb-fd97-4e18-92bb-e8984676a64b" data-loc="121:14-121:69" data-file-name="app/dashboard/page.tsx">
                <thead className="bg-gray-50" data-unique-id="a3a6d13d-fdd2-4958-8ac0-2e53313c4416" data-loc="122:16-122:46" data-file-name="app/dashboard/page.tsx">
                  <tr data-unique-id="f32d9dab-6547-4cce-99d8-1e9b826afd56" data-loc="123:18-123:22" data-file-name="app/dashboard/page.tsx">
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider" data-unique-id="2ddfd8b9-a490-4f9e-8835-558389bc2b18" data-loc="124:20-124:115" data-file-name="app/dashboard/page.tsx">
                      Name
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider" data-unique-id="4ea71a40-2f5f-46ff-a41d-d99936802b1c" data-loc="127:20-127:115" data-file-name="app/dashboard/page.tsx">
                      Contact
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider" data-unique-id="034e8b46-b66b-40c2-8f4f-5dfa0a73c7ee" data-loc="130:20-130:115" data-file-name="app/dashboard/page.tsx">
                      CIBIL
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider" data-unique-id="a599c43e-8708-49aa-a73b-7c894b6b4905" data-loc="133:20-133:115" data-file-name="app/dashboard/page.tsx">
                      Date
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider" data-unique-id="2a961f93-db80-429e-833e-940c926c8ab6" data-loc="136:20-136:115" data-file-name="app/dashboard/page.tsx">
                      Action
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200" data-unique-id="edaaafc0-e259-4d34-9350-994b37f6e8df" data-loc="141:16-141:69" data-file-name="app/dashboard/page.tsx">
                  {recentCustomers.map(customer => <tr key={customer._id} className="hover:bg-gray-50" data-unique-id="6ad79710-944f-4dc4-a636-d27838e238ae" data-loc="142:51-142:103" data-file-name="app/dashboard/page.tsx">
                      <td className="px-6 py-4 whitespace-nowrap" data-unique-id="86fa50ee-8c94-4313-b541-0fd91a4c30a4" data-loc="143:22-143:66" data-file-name="app/dashboard/page.tsx">
                        <div className="text-sm font-medium text-gray-900" data-unique-id="79a22683-73af-4252-8761-0375d39de337" data-loc="144:24-144:75" data-file-name="app/dashboard/page.tsx">{customer.name}</div>
                        <div className="text-sm text-gray-500" data-unique-id="b310d720-aa42-45c2-894c-613599e09be3" data-loc="145:24-145:63" data-file-name="app/dashboard/page.tsx">{customer.pan}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap" data-unique-id="3d593b9b-500c-469e-8b57-08b7a831237f" data-loc="147:22-147:66" data-file-name="app/dashboard/page.tsx">
                        <div className="flex items-center text-sm text-gray-500" data-unique-id="7ff33259-2e7b-49cf-9e29-44a322a1b2c0" data-loc="148:24-148:81" data-file-name="app/dashboard/page.tsx">
                          <Phone className="h-4 w-4 mr-1" /> {customer.phone}
                        </div>
                        <div className="flex items-center text-sm text-gray-500" data-unique-id="44b4fc59-bf7d-418d-acc9-9e400d9251c9" data-loc="151:24-151:81" data-file-name="app/dashboard/page.tsx">
                          <Mail className="h-4 w-4 mr-1" /> {customer.email}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap" data-unique-id="cbd4cb1e-1f17-4cfb-8ec7-a02716f891ac" data-loc="155:22-155:66" data-file-name="app/dashboard/page.tsx">
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${(customer.cibilScore ?? 0) >= 750 ? 'bg-green-100 text-green-800' : (customer.cibilScore ?? 0) >= 700 ? 'bg-blue-100 text-blue-800' : (customer.cibilScore ?? 0) >= 650 ? 'bg-yellow-100 text-yellow-800' : 'bg-red-100 text-red-800'}`} data-unique-id="97531cb2-e0e0-44c9-bc96-d7f7507ca49a" data-loc="156:24-156:349" data-file-name="app/dashboard/page.tsx">
                          {customer.cibilScore ?? 'N/A'}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500" data-unique-id="19df63af-b029-4947-a70a-4fe4b94f8611" data-loc="160:22-160:88" data-file-name="app/dashboard/page.tsx">
                        {format(new Date(customer.createdAt), 'dd MMM yyyy')}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm" data-unique-id="1e1d4021-e377-4431-89d6-29ed5b9cf8a8" data-loc="163:22-163:74" data-file-name="app/dashboard/page.tsx">
                        <button onClick={() => router.push(`/dashboard/eligibility/${customer._id}`)} className="text-blue-600 hover:text-blue-900" data-unique-id="21161500-8e44-4c26-934c-bb000f0abda1" data-loc="164:24-164:148" data-file-name="app/dashboard/page.tsx">
                          View Cards
                        </button>
                      </td>
                    </tr>)}
                </tbody>
              </table>
            </div> : <div className="text-center py-8" data-unique-id="5f3d10e9-380d-4765-94fa-2d744207b131" data-loc="171:21-171:55" data-file-name="app/dashboard/page.tsx">
              <div className="flex justify-center mb-4" data-unique-id="03304e08-efc4-4668-9a40-3a924308d270" data-loc="172:14-172:56" data-file-name="app/dashboard/page.tsx">
                <CreditCard className="h-12 w-12 text-gray-300" />
              </div>
              <h3 className="text-lg font-medium text-gray-900 mb-1" data-unique-id="fa82aae8-fb9b-447c-a883-859eb44472dd" data-loc="175:14-175:69" data-file-name="app/dashboard/page.tsx">No customers yet</h3>
              <p className="text-gray-500 mb-4" data-unique-id="49b48e7a-a01f-4c1c-bc7e-275ec47e5fb7" data-loc="176:14-176:48" data-file-name="app/dashboard/page.tsx">Start by registering your first customer</p>
              <button onClick={() => router.push("/dashboard/customer-form")} className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700" data-unique-id="dfb02c91-2618-4b20-b024-ffb3a789406c" data-loc="177:14-177:233" data-file-name="app/dashboard/page.tsx">
                <UserPlus className="h-4 w-4 mr-2" /> Add Customer
              </button>
            </div>}
        </div>
        
        {/* Error Test Component (for development/testing) */}
        <div className="mt-8" data-unique-id="a9a9ae96-a13f-4d98-8605-3c49d2a4c21c" data-loc="184:8-184:30" data-file-name="app/dashboard/page.tsx">
          <ErrorTest />
        </div>
        
        {/* Agent Stats */}
        <div className="grid grid-cols-3 gap-6 mt-8" data-unique-id="f4307786-5eb5-4ec9-89a0-c52827d6501f" data-loc="189:8-189:53" data-file-name="app/dashboard/page.tsx">
          <div className="bg-white rounded-lg shadow-md p-6" data-unique-id="8090bf7c-89f3-4771-8e28-e6c857878bfc" data-loc="190:10-190:61" data-file-name="app/dashboard/page.tsx">
            <div className="flex items-center" data-unique-id="59e1c59c-0406-42c4-a162-0bb16eaabab0" data-loc="191:12-191:47" data-file-name="app/dashboard/page.tsx">
              <div className="flex-shrink-0 bg-blue-100 rounded-md p-3" data-unique-id="594ed4d0-80ad-4d03-8cec-6375a2da4afd" data-loc="192:14-192:72" data-file-name="app/dashboard/page.tsx">
                <UserPlus className="h-6 w-6 text-blue-600" />
              </div>
              <div className="ml-5 w-0 flex-1" data-unique-id="cff859a7-3770-4635-8280-2af83277d699" data-loc="195:14-195:47" data-file-name="app/dashboard/page.tsx">
                <dl data-unique-id="22bc9a4d-51c1-4fb3-975b-17f73af75f9d" data-loc="196:16-196:20" data-file-name="app/dashboard/page.tsx">
                  <dt className="text-sm font-medium text-gray-500 truncate" data-unique-id="1c915e63-f48f-4cb5-86c8-b47157e6db13" data-loc="197:18-197:77" data-file-name="app/dashboard/page.tsx">
                    Total Customers
                  </dt>
                  <dd className="text-lg font-semibold text-gray-900" data-unique-id="ae577f27-f77b-4eec-a7ff-7ea83b3d0946" data-loc="200:18-200:70" data-file-name="app/dashboard/page.tsx">
                    {recentCustomers.length}
                  </dd>
                </dl>
              </div>
            </div>
          </div>
          
          <div className="bg-white rounded-lg shadow-md p-6" data-unique-id="454dad6d-b4aa-41f7-84b1-89346349a74e" data-loc="208:10-208:61" data-file-name="app/dashboard/page.tsx">
            <div className="flex items-center" data-unique-id="f8b81e8c-88cd-4bbe-9b2d-1157050c3590" data-loc="209:12-209:47" data-file-name="app/dashboard/page.tsx">
              <div className="flex-shrink-0 bg-green-100 rounded-md p-3" data-unique-id="218aa668-a72e-42ca-bb8a-3272e8854085" data-loc="210:14-210:73" data-file-name="app/dashboard/page.tsx">
                <CreditCard className="h-6 w-6 text-green-600" />
              </div>
              <div className="ml-5 w-0 flex-1" data-unique-id="5b473718-8e9f-49eb-9449-4a0b70614321" data-loc="213:14-213:47" data-file-name="app/dashboard/page.tsx">
                <dl data-unique-id="e37ebcbd-164c-4513-9641-9c063cfd426c" data-loc="214:16-214:20" data-file-name="app/dashboard/page.tsx">
                  <dt className="text-sm font-medium text-gray-500 truncate" data-unique-id="76590719-8473-48ff-8b6c-11a411322b74" data-loc="215:18-215:77" data-file-name="app/dashboard/page.tsx">
                    Cards Recommended
                  </dt>
                  <dd className="text-lg font-semibold text-gray-900" data-unique-id="62516718-9886-4c37-bcd6-742df31413c8" data-loc="218:18-218:70" data-file-name="app/dashboard/page.tsx">
                    {0} {/* Will be implemented with API */}
                  </dd>
                </dl>
              </div>
            </div>
          </div>
          
          <div className="bg-white rounded-lg shadow-md p-6" data-unique-id="4ed978d4-923e-453a-848c-08d9e77ea663" data-loc="226:10-226:61" data-file-name="app/dashboard/page.tsx">
            <div className="flex items-center" data-unique-id="db79698f-878f-4430-a5ec-f4dfb683f112" data-loc="227:12-227:47" data-file-name="app/dashboard/page.tsx">
              <div className="flex-shrink-0 bg-yellow-100 rounded-md p-3" data-unique-id="2467411a-a8f1-4b95-bbfe-41861d07c58b" data-loc="228:14-228:74" data-file-name="app/dashboard/page.tsx">
                <Calendar className="h-6 w-6 text-yellow-600" data-unique-id="5305a7be-50e6-46e7-9328-9fe537f1b80d" data-loc="229:16-229:64" data-file-name="app/dashboard/page.tsx" />
              </div>
              <div className="ml-5 w-0 flex-1" data-unique-id="f84d9d37-220e-475e-885a-8d8fb0d412f8" data-loc="231:14-231:47" data-file-name="app/dashboard/page.tsx">
                <dl data-unique-id="e5658028-7359-4cda-ba14-571b3eb48653" data-loc="232:16-232:20" data-file-name="app/dashboard/page.tsx">
                  <dt className="text-sm font-medium text-gray-500 truncate" data-unique-id="39954c19-cfb0-4fa9-a34b-12e5561689af" data-loc="233:18-233:77" data-file-name="app/dashboard/page.tsx">
                    Activities Today
                  </dt>
                  <dd className="text-lg font-semibold text-gray-900" data-unique-id="b7730b02-b985-4495-8f42-6671753be843" data-loc="236:18-236:70" data-file-name="app/dashboard/page.tsx">
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