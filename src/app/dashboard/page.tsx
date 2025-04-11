"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { 
  UserPlus, ClipboardList, LogOut, ChevronRight, 
  Phone, Mail, Calendar, CreditCard, DollarSign
} from "lucide-react";
import { Customer } from "@/types";
import { format } from "date-fns";
import { authApi, customersApi } from "@/lib/api-service";

export default function DashboardPage() {
  const router = useRouter();
  const [agent, setAgent] = useState<{ name: string; phone: string } | null>(null);
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
        const { customers } = await customersApi.getAll();
        setRecentCustomers(
          customers
            .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
            .slice(0, 5)
        );
      } catch (error) {
        console.error("Error fetching customers:", error);
      }
    };
    
    fetchCustomers();
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
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-600"></div>
      </div>
    );
  }
  
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 py-4 sm:px-6 flex justify-between items-center">
          <h1 className="text-2xl font-bold text-gray-900">CardSales Pro</h1>
          <div className="flex items-center">
            <span className="text-sm font-medium text-gray-600 mr-4">
              Welcome, {agent.name}
            </span>
            <button 
              onClick={handleLogout}
              className="flex items-center text-sm font-medium text-red-600 hover:text-red-800"
            >
              <LogOut className="h-4 w-4 mr-1" /> Logout
            </button>
          </div>
        </div>
      </header>
      
      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 py-8 sm:px-6">
        {/* Action Cards */}
        <div className="grid grid-cols-2 gap-6 mb-8">
          <button 
            onClick={() => router.push("/dashboard/customer-form")}
            className="flex flex-col items-center justify-center p-6 bg-white rounded-lg shadow-md border border-gray-100 hover:border-blue-500 transition-colors"
          >
            <div className="h-16 w-16 rounded-full bg-blue-50 flex items-center justify-center mb-4">
              <UserPlus className="h-8 w-8 text-blue-600" />
            </div>
            <h2 className="text-lg font-medium text-gray-900">New Customer</h2>
            <p className="text-sm text-gray-500 mt-1 text-center">
              Register a new customer and check card eligibility
            </p>
          </button>
          
          <button 
            onClick={() => router.push("/dashboard/customers")}
            className="flex flex-col items-center justify-center p-6 bg-white rounded-lg shadow-md border border-gray-100 hover:border-blue-500 transition-colors"
          >
            <div className="h-16 w-16 rounded-full bg-green-50 flex items-center justify-center mb-4">
              <ClipboardList className="h-8 w-8 text-green-600" />
            </div>
            <h2 className="text-lg font-medium text-gray-900">My Customers</h2>
            <p className="text-sm text-gray-500 mt-1 text-center">
              View and manage your registered customers
            </p>
          </button>
        </div>
        
        {/* Recent Customers */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-lg font-medium text-gray-900">Recent Customers</h2>
            <button 
              onClick={() => router.push("/dashboard/customers")}
              className="text-sm text-blue-600 hover:text-blue-800 flex items-center"
            >
              View all <ChevronRight className="h-4 w-4 ml-1" />
            </button>
          </div>
          
          {recentCustomers.length > 0 ? (
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Name
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Contact
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      CIBIL
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Date
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Action
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {recentCustomers.map((customer) => (
                    <tr key={customer.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-medium text-gray-900">{customer.name}</div>
                        <div className="text-sm text-gray-500">{customer.pan}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center text-sm text-gray-500">
                          <Phone className="h-4 w-4 mr-1" /> {customer.phone}
                        </div>
                        <div className="flex items-center text-sm text-gray-500">
                          <Mail className="h-4 w-4 mr-1" /> {customer.email}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                          (customer.cibilScore ?? 0) >= 750 ? 'bg-green-100 text-green-800' :
                          (customer.cibilScore ?? 0) >= 700 ? 'bg-blue-100 text-blue-800' :
                          (customer.cibilScore ?? 0) >= 650 ? 'bg-yellow-100 text-yellow-800' :
                          'bg-red-100 text-red-800'
                        }`}>
                          {customer.cibilScore ?? 'N/A'}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {format(new Date(customer.timestamp), 'dd MMM yyyy')}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm">
                        <button 
                          onClick={() => router.push(`/dashboard/eligibility/${customer.id}`)}
                          className="text-blue-600 hover:text-blue-900"
                        >
                          View Cards
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="text-center py-8">
              <div className="flex justify-center mb-4">
                <CreditCard className="h-12 w-12 text-gray-300" />
              </div>
              <h3 className="text-lg font-medium text-gray-900 mb-1">No customers yet</h3>
              <p className="text-gray-500 mb-4">Start by registering your first customer</p>
              <button
                onClick={() => router.push("/dashboard/customer-form")}
                className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700"
              >
                <UserPlus className="h-4 w-4 mr-2" /> Add Customer
              </button>
            </div>
          )}
        </div>
        
        {/* Agent Stats */}
        <div className="grid grid-cols-3 gap-6 mt-8">
          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="flex items-center">
              <div className="flex-shrink-0 bg-blue-100 rounded-md p-3">
                <UserPlus className="h-6 w-6 text-blue-600" />
              </div>
              <div className="ml-5 w-0 flex-1">
                <dl>
                  <dt className="text-sm font-medium text-gray-500 truncate">
                    Total Customers
                  </dt>
                  <dd className="text-lg font-semibold text-gray-900">
                    {db.customers.getAll().filter(c => c.linkedAgent === agent.phone).length}
                  </dd>
                </dl>
              </div>
            </div>
          </div>
          
          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="flex items-center">
              <div className="flex-shrink-0 bg-green-100 rounded-md p-3">
                <CreditCard className="h-6 w-6 text-green-600" />
              </div>
              <div className="ml-5 w-0 flex-1">
                <dl>
                  <dt className="text-sm font-medium text-gray-500 truncate">
                    Cards Recommended
                  </dt>
                  <dd className="text-lg font-semibold text-gray-900">
                    {db.logs.getAll().filter(
                      log => log.action === "card_shared" && log.agentPhone === agent.phone
                    ).length}
                  </dd>
                </dl>
              </div>
            </div>
          </div>
          
          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="flex items-center">
              <div className="flex-shrink-0 bg-yellow-100 rounded-md p-3">
                <Calendar className="h-6 w-6 text-yellow-600" />
              </div>
              <div className="ml-5 w-0 flex-1">
                <dl>
                  <dt className="text-sm font-medium text-gray-500 truncate">
                    Activities Today
                  </dt>
                  <dd className="text-lg font-semibold text-gray-900">
                    {db.logs.getAll().filter(
                      log => {
                        const today = new Date();
                        const logDate = new Date(log.timestamp);
                        return log.agentPhone === agent.phone && 
                          logDate.getDate() === today.getDate() &&
                          logDate.getMonth() === today.getMonth() &&
                          logDate.getFullYear() === today.getFullYear();
                      }
                    ).length}
                  </dd>
                </dl>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
