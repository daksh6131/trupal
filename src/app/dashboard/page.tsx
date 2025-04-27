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
    return <div className="flex items-center justify-center min-h-screen" data-unique-id="b48ff11d-ec6b-4af9-b06e-3a4a2bf6428a" data-loc="66:11-66:74" data-file-name="app/dashboard/page.tsx">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-600" data-unique-id="27110431-b3aa-4b7b-99bf-29f5b14465a2" data-loc="67:8-67:99" data-file-name="app/dashboard/page.tsx"></div>
      </div>;
  }
  return <div className="min-h-screen bg-gray-50" data-unique-id="c5b98120-e5b3-4e14-900a-ec53e5de96a6" data-loc="70:9-70:50" data-file-name="app/dashboard/page.tsx">
      {/* Header */}
      <header className="bg-white shadow" data-unique-id="5595b744-1237-4409-9bcc-2dddea1526f1" data-loc="72:6-72:42" data-file-name="app/dashboard/page.tsx">
        <div className="max-w-7xl mx-auto px-4 py-4 sm:px-6 flex justify-between items-center" data-unique-id="c407c048-2766-4206-8f22-ef1c91dd1220" data-loc="73:8-73:95" data-file-name="app/dashboard/page.tsx">
          <h1 className="text-2xl font-bold text-gray-900" data-unique-id="62f5e033-d088-474c-a50a-4f65324d9e31" data-loc="74:10-74:59" data-file-name="app/dashboard/page.tsx">CardSales Pro</h1>
          <div className="flex items-center" data-unique-id="4f0d3cb9-b96e-4ff9-a3d1-31f171438644" data-loc="75:10-75:45" data-file-name="app/dashboard/page.tsx">
            <span className="text-sm font-medium text-gray-600 mr-4" data-unique-id="a8d9fcd4-b026-4313-a14c-391be88eb3a6" data-loc="76:12-76:69" data-file-name="app/dashboard/page.tsx">
              Welcome, {agent.name}
            </span>
            <button onClick={handleLogout} className="flex items-center text-sm font-medium text-red-600 hover:text-red-800" data-unique-id="e4af8d64-9f69-489f-b862-cc672cab8483" data-loc="79:12-79:125" data-file-name="app/dashboard/page.tsx">
              <LogOut className="h-4 w-4 mr-1" /> Logout
            </button>
          </div>
        </div>
      </header>
      
      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 py-8 sm:px-6" data-unique-id="1cabe3ce-f3db-49b1-8f26-917cd1926bb3" data-loc="87:6-87:60" data-file-name="app/dashboard/page.tsx">
        {/* Action Cards */}
        <div className="grid grid-cols-2 gap-6 mb-8" data-unique-id="c5080633-9022-4c33-86ba-7f7be68c797d" data-loc="89:8-89:53" data-file-name="app/dashboard/page.tsx">
          <button onClick={() => router.push("/dashboard/customer-form")} className="flex flex-col items-center justify-center p-6 bg-white rounded-lg shadow-md border border-gray-100 hover:border-blue-500 transition-colors" data-unique-id="850d1187-6d1f-4803-8154-a813ffeb7aff" data-loc="90:10-90:225" data-file-name="app/dashboard/page.tsx">
            <div className="h-16 w-16 rounded-full bg-blue-50 flex items-center justify-center mb-4" data-unique-id="b2b25015-68e6-4eff-8715-b1d3a9f0d694" data-loc="91:12-91:101" data-file-name="app/dashboard/page.tsx">
              <UserPlus className="h-8 w-8 text-blue-600" />
            </div>
            <h2 className="text-lg font-medium text-gray-900" data-unique-id="c153c4a8-fa2a-46f0-b299-704ea57e53d9" data-loc="94:12-94:62" data-file-name="app/dashboard/page.tsx">New Customer</h2>
            <p className="text-sm text-gray-500 mt-1 text-center" data-unique-id="42f63dd7-7dd6-4c39-b8f2-d89dc17853e5" data-loc="95:12-95:66" data-file-name="app/dashboard/page.tsx">
              Register a new customer and check card eligibility
            </p>
          </button>
          
          <button onClick={() => router.push("/dashboard/customers")} className="flex flex-col items-center justify-center p-6 bg-white rounded-lg shadow-md border border-gray-100 hover:border-blue-500 transition-colors" data-unique-id="a79fe1ec-b0c2-49c9-8e00-93e7ae66ac12" data-loc="100:10-100:221" data-file-name="app/dashboard/page.tsx">
            <div className="h-16 w-16 rounded-full bg-green-50 flex items-center justify-center mb-4" data-unique-id="597089d5-d326-49da-86a3-bb49e52368ea" data-loc="101:12-101:102" data-file-name="app/dashboard/page.tsx">
              <ClipboardList className="h-8 w-8 text-green-600" />
            </div>
            <h2 className="text-lg font-medium text-gray-900" data-unique-id="756cbb01-49ec-405b-b158-4a9f4669a346" data-loc="104:12-104:62" data-file-name="app/dashboard/page.tsx">My Customers</h2>
            <p className="text-sm text-gray-500 mt-1 text-center" data-unique-id="c65abe0f-411d-470e-93ed-2f53d2baeda5" data-loc="105:12-105:66" data-file-name="app/dashboard/page.tsx">
              View and manage your registered customers
            </p>
          </button>
        </div>
        
        {/* Recent Customers */}
        <div className="bg-white rounded-lg shadow-md p-6" data-unique-id="cd9bd406-dd6d-4d64-8c6d-fdec28875098" data-loc="112:8-112:59" data-file-name="app/dashboard/page.tsx">
          <div className="flex items-center justify-between mb-6" data-unique-id="0461671e-cf76-481f-82d9-994f94928394" data-loc="113:10-113:66" data-file-name="app/dashboard/page.tsx">
            <h2 className="text-lg font-medium text-gray-900" data-unique-id="df13836a-c37a-4fe8-ac87-df8cfeb26536" data-loc="114:12-114:62" data-file-name="app/dashboard/page.tsx">Recent Customers</h2>
            <button onClick={() => router.push("/dashboard/customers")} className="text-sm text-blue-600 hover:text-blue-800 flex items-center" data-unique-id="ce5a57e9-0c95-42a7-a256-6f8a44e4fb0a" data-loc="115:12-115:144" data-file-name="app/dashboard/page.tsx">
              View all <ChevronRight className="h-4 w-4 ml-1" />
            </button>
          </div>
            
          {recentCustomers.length > 0 ? <div className="overflow-x-auto" data-unique-id="ac5481ba-d4c9-41bd-abce-69ac40d20cd9" data-loc="120:40-120:73" data-file-name="app/dashboard/page.tsx">
              <table className="min-w-full divide-y divide-gray-200" data-unique-id="4129bc7a-121f-4484-95a0-8ebee6e2a275" data-loc="121:14-121:69" data-file-name="app/dashboard/page.tsx">
                <thead className="bg-gray-50" data-unique-id="237cd4cd-6074-4bb7-931f-5ebfbefe08da" data-loc="122:16-122:46" data-file-name="app/dashboard/page.tsx">
                  <tr data-unique-id="530fb777-3640-4cb4-a30e-e32703521d78" data-loc="123:18-123:22" data-file-name="app/dashboard/page.tsx">
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider" data-unique-id="c5a43f5b-e513-495c-b4d2-4aadefedcefe" data-loc="124:20-124:115" data-file-name="app/dashboard/page.tsx">
                      Name
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider" data-unique-id="bf7ec80c-e738-4585-ab04-b0df0c03d80c" data-loc="127:20-127:115" data-file-name="app/dashboard/page.tsx">
                      Contact
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider" data-unique-id="9d9ef520-9c11-4a9d-89d6-04f62e0a926f" data-loc="130:20-130:115" data-file-name="app/dashboard/page.tsx">
                      CIBIL
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider" data-unique-id="2fcfeced-4f7c-4aad-b614-ddfa665494aa" data-loc="133:20-133:115" data-file-name="app/dashboard/page.tsx">
                      Date
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider" data-unique-id="f0892f41-d491-4c48-a0df-fa5dd7c8a2a6" data-loc="136:20-136:115" data-file-name="app/dashboard/page.tsx">
                      Action
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200" data-unique-id="837202d9-4d0a-4eb3-bb6e-22ca07f70364" data-loc="141:16-141:69" data-file-name="app/dashboard/page.tsx">
                  {recentCustomers.map(customer => <tr key={customer._id} className="hover:bg-gray-50" data-unique-id="f308d963-c09a-44c6-af22-1b6ebbc40b2b" data-loc="142:51-142:103" data-file-name="app/dashboard/page.tsx">
                      <td className="px-6 py-4 whitespace-nowrap" data-unique-id="a1388034-196f-454f-a31e-46383e18bfea" data-loc="143:22-143:66" data-file-name="app/dashboard/page.tsx">
                        <div className="text-sm font-medium text-gray-900" data-unique-id="f5e8c8d7-ebaa-4dd9-9cca-073e3a0fc62d" data-loc="144:24-144:75" data-file-name="app/dashboard/page.tsx">{customer.name}</div>
                        <div className="text-sm text-gray-500" data-unique-id="947cd69e-839f-435b-99c8-fe47956bd942" data-loc="145:24-145:63" data-file-name="app/dashboard/page.tsx">{customer.pan}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap" data-unique-id="eb375cb1-8b1f-4c45-be00-d69f9d810265" data-loc="147:22-147:66" data-file-name="app/dashboard/page.tsx">
                        <div className="flex items-center text-sm text-gray-500" data-unique-id="f5f37439-c120-4f92-a023-364a28f89430" data-loc="148:24-148:81" data-file-name="app/dashboard/page.tsx">
                          <Phone className="h-4 w-4 mr-1" /> {customer.phone}
                        </div>
                        <div className="flex items-center text-sm text-gray-500" data-unique-id="e4e1796c-fd52-4e18-b279-98ca5a29a508" data-loc="151:24-151:81" data-file-name="app/dashboard/page.tsx">
                          <Mail className="h-4 w-4 mr-1" /> {customer.email}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap" data-unique-id="63cfb115-e737-4f59-bd96-dfec45ecd642" data-loc="155:22-155:66" data-file-name="app/dashboard/page.tsx">
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${(customer.cibilScore ?? 0) >= 750 ? 'bg-green-100 text-green-800' : (customer.cibilScore ?? 0) >= 700 ? 'bg-blue-100 text-blue-800' : (customer.cibilScore ?? 0) >= 650 ? 'bg-yellow-100 text-yellow-800' : 'bg-red-100 text-red-800'}`} data-unique-id="823691ae-5f17-4d66-9039-7f7339b2ffe2" data-loc="156:24-156:349" data-file-name="app/dashboard/page.tsx">
                          {customer.cibilScore ?? 'N/A'}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500" data-unique-id="36823fbe-5365-4850-83dd-093a67df718c" data-loc="160:22-160:88" data-file-name="app/dashboard/page.tsx">
                        {format(new Date(customer.createdAt), 'dd MMM yyyy')}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm" data-unique-id="ac1f1047-8d82-46df-be92-ffd5deb2bc7b" data-loc="163:22-163:74" data-file-name="app/dashboard/page.tsx">
                        <button onClick={() => router.push(`/dashboard/eligibility/${customer._id}`)} className="text-blue-600 hover:text-blue-900" data-unique-id="06c9170e-6ff0-45c4-b02f-299ec64f4611" data-loc="164:24-164:148" data-file-name="app/dashboard/page.tsx">
                          View Cards
                        </button>
                      </td>
                    </tr>)}
                </tbody>
              </table>
            </div> : <div className="text-center py-8" data-unique-id="fe73a544-1635-4d02-812c-93799c425e00" data-loc="171:21-171:55" data-file-name="app/dashboard/page.tsx">
              <div className="flex justify-center mb-4" data-unique-id="0c7863d9-0bda-4134-a733-76f697dd3a3b" data-loc="172:14-172:56" data-file-name="app/dashboard/page.tsx">
                <CreditCard className="h-12 w-12 text-gray-300" />
              </div>
              <h3 className="text-lg font-medium text-gray-900 mb-1" data-unique-id="6962503f-2f66-4161-8b9f-af88b9a9a8d6" data-loc="175:14-175:69" data-file-name="app/dashboard/page.tsx">No customers yet</h3>
              <p className="text-gray-500 mb-4" data-unique-id="3a743fa4-e7d6-4782-91a3-77da5107a90b" data-loc="176:14-176:48" data-file-name="app/dashboard/page.tsx">Start by registering your first customer</p>
              <button onClick={() => router.push("/dashboard/customer-form")} className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700" data-unique-id="bcf82384-973f-4e31-8770-95e54b3de5d3" data-loc="177:14-177:233" data-file-name="app/dashboard/page.tsx">
                <UserPlus className="h-4 w-4 mr-2" /> Add Customer
              </button>
            </div>}
        </div>
        
        {/* Error Test Component (for development/testing) */}
        <div className="mt-8" data-unique-id="59540d0b-02c6-4593-aa02-e94d2ad18f7d" data-loc="184:8-184:30" data-file-name="app/dashboard/page.tsx">
          <ErrorTest />
        </div>
        
        {/* Agent Stats */}
        <div className="grid grid-cols-3 gap-6 mt-8" data-unique-id="4d0cd25e-9442-4164-bb3a-9383e3f5e933" data-loc="189:8-189:53" data-file-name="app/dashboard/page.tsx">
          <div className="bg-white rounded-lg shadow-md p-6" data-unique-id="2499c723-64c1-49ca-af78-8a15cf050e8b" data-loc="190:10-190:61" data-file-name="app/dashboard/page.tsx">
            <div className="flex items-center" data-unique-id="8006dbbe-c604-43d8-9527-a66d68d3dd99" data-loc="191:12-191:47" data-file-name="app/dashboard/page.tsx">
              <div className="flex-shrink-0 bg-blue-100 rounded-md p-3" data-unique-id="5255cf55-3610-4ef8-a962-56fcc6f1a8fc" data-loc="192:14-192:72" data-file-name="app/dashboard/page.tsx">
                <UserPlus className="h-6 w-6 text-blue-600" />
              </div>
              <div className="ml-5 w-0 flex-1" data-unique-id="b6dbe05f-b9c9-4ad8-a6ce-2757ecf1ca7a" data-loc="195:14-195:47" data-file-name="app/dashboard/page.tsx">
                <dl data-unique-id="841642a7-72cc-4b0f-bfc8-5960b0a5b923" data-loc="196:16-196:20" data-file-name="app/dashboard/page.tsx">
                  <dt className="text-sm font-medium text-gray-500 truncate" data-unique-id="ae71bb52-3f3e-464a-b20a-b14fa10ce83d" data-loc="197:18-197:77" data-file-name="app/dashboard/page.tsx">
                    Total Customers
                  </dt>
                  <dd className="text-lg font-semibold text-gray-900" data-unique-id="21901a35-0345-4890-9359-7ffca0cc4845" data-loc="200:18-200:70" data-file-name="app/dashboard/page.tsx">
                    {recentCustomers.length}
                  </dd>
                </dl>
              </div>
            </div>
          </div>
          
          <div className="bg-white rounded-lg shadow-md p-6" data-unique-id="580e653c-79f5-4400-8d91-3ba77dd9df28" data-loc="208:10-208:61" data-file-name="app/dashboard/page.tsx">
            <div className="flex items-center" data-unique-id="4a773397-3ed4-4a37-9d58-563a6b6ed0eb" data-loc="209:12-209:47" data-file-name="app/dashboard/page.tsx">
              <div className="flex-shrink-0 bg-green-100 rounded-md p-3" data-unique-id="a397e96c-c77e-481f-99fb-0bf3fcecddbf" data-loc="210:14-210:73" data-file-name="app/dashboard/page.tsx">
                <CreditCard className="h-6 w-6 text-green-600" />
              </div>
              <div className="ml-5 w-0 flex-1" data-unique-id="0aec9194-5085-43f9-9882-be9e2315a459" data-loc="213:14-213:47" data-file-name="app/dashboard/page.tsx">
                <dl data-unique-id="73a545e5-dbd2-43f2-a2c9-2f328138db30" data-loc="214:16-214:20" data-file-name="app/dashboard/page.tsx">
                  <dt className="text-sm font-medium text-gray-500 truncate" data-unique-id="66fd24ff-2644-4672-a28c-86ebce577a7c" data-loc="215:18-215:77" data-file-name="app/dashboard/page.tsx">
                    Cards Recommended
                  </dt>
                  <dd className="text-lg font-semibold text-gray-900" data-unique-id="26db96e5-0eb4-43f0-ad13-97f434520cf3" data-loc="218:18-218:70" data-file-name="app/dashboard/page.tsx">
                    {0} {/* Will be implemented with API */}
                  </dd>
                </dl>
              </div>
            </div>
          </div>
          
          <div className="bg-white rounded-lg shadow-md p-6" data-unique-id="2a384d30-ef76-471f-a39f-46bd22ec3852" data-loc="226:10-226:61" data-file-name="app/dashboard/page.tsx">
            <div className="flex items-center" data-unique-id="61fa48f6-d91d-4d08-8802-63ca114232c3" data-loc="227:12-227:47" data-file-name="app/dashboard/page.tsx">
              <div className="flex-shrink-0 bg-yellow-100 rounded-md p-3" data-unique-id="8ce24b52-ff05-4ab3-a2f5-0d27329ad1f2" data-loc="228:14-228:74" data-file-name="app/dashboard/page.tsx">
                <Calendar className="h-6 w-6 text-yellow-600" data-unique-id="c3b222a6-9f9c-4f1c-a525-6df1545e19e5" data-loc="229:16-229:64" data-file-name="app/dashboard/page.tsx" />
              </div>
              <div className="ml-5 w-0 flex-1" data-unique-id="c8513c07-b63d-40f2-88b2-d4adeab3227a" data-loc="231:14-231:47" data-file-name="app/dashboard/page.tsx">
                <dl data-unique-id="e292a090-3d58-409c-a65a-580512919638" data-loc="232:16-232:20" data-file-name="app/dashboard/page.tsx">
                  <dt className="text-sm font-medium text-gray-500 truncate" data-unique-id="36e37fb7-0367-47ab-ac8d-0f42dd2c5700" data-loc="233:18-233:77" data-file-name="app/dashboard/page.tsx">
                    Activities Today
                  </dt>
                  <dd className="text-lg font-semibold text-gray-900" data-unique-id="bbe3504f-2c29-4023-82f6-162602062d72" data-loc="236:18-236:70" data-file-name="app/dashboard/page.tsx">
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