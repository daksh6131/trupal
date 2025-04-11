"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { 
  ArrowLeft, Phone, Mail, Calendar, CreditCard, 
  Search, Filter, SortAsc, SortDesc, UserPlus
} from "lucide-react";
import { Customer } from "@/types";
import { cn } from "@/lib/utils";
import { format } from "date-fns";
import { customersApi } from "@/lib/api-service";

export default function CustomersPage() {
  const router = useRouter();
  const [agent, setAgent] = useState<{ name: string; phone: string } | null>(null);
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
        const { customers: agentCustomers } = await customersApi.getAll();
        setCustomers(sortCustomers(agentCustomers, sortField, sortDirection));
      } catch (error) {
        console.error("Error fetching customers:", error);
      }
    };
    
    fetchCustomers();
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
  
  const filteredCustomers = customers.filter(customer => 
    customer.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    customer.phone.includes(searchTerm) ||
    customer.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (customer.pan && customer.pan.toLowerCase().includes(searchTerm.toLowerCase()))
  );
  
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
        <div className="max-w-7xl mx-auto px-4 py-4 sm:px-6">
          <div className="flex items-center">
            <button 
              onClick={() => router.push("/dashboard")}
              className="mr-4 p-1 rounded-full hover:bg-gray-100"
            >
              <ArrowLeft className="h-5 w-5 text-gray-600" />
            </button>
            <h1 className="text-xl font-bold text-gray-900">My Customers</h1>
          </div>
        </div>
      </header>
      
      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 py-8 sm:px-6">
        {/* Search and Filter */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 space-y-4 md:space-y-0">
          <div className="w-full md:w-auto">
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Search className="h-5 w-5 text-gray-400" />
              </div>
              <input
                type="text"
                className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:placeholder-gray-400 focus:ring-1 focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                placeholder="Search by name, phone, email, or PAN"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </div>
          
          <div className="flex space-x-3">
            <button
              onClick={() => router.push("/dashboard/customer-form")}
              className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              <UserPlus className="h-4 w-4 mr-2" /> Add New Customer
            </button>
          </div>
        </div>
        
        {/* Customer List */}
        <div className="bg-white shadow overflow-hidden sm:rounded-md">
          {filteredCustomers.length > 0 ? (
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th 
                    scope="col" 
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                    onClick={() => handleSort("name")}
                  >
                    <div className="flex items-center">
                      Name
                      {sortField === "name" && (
                        sortDirection === "asc" 
                          ? <SortAsc className="w-4 h-4 ml-1" />
                          : <SortDesc className="w-4 h-4 ml-1" />
                      )}
                    </div>
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Contact
                  </th>
                  <th 
                    scope="col" 
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                    onClick={() => handleSort("cibilScore")}
                  >
                    <div className="flex items-center">
                      CIBIL Score
                      {sortField === "cibilScore" && (
                        sortDirection === "asc" 
                          ? <SortAsc className="w-4 h-4 ml-1" />
                          : <SortDesc className="w-4 h-4 ml-1" />
                      )}
                    </div>
                  </th>
                  <th 
                    scope="col" 
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                    onClick={() => handleSort("timestamp")}
                  >
                    <div className="flex items-center">
                      Registered On
                      {sortField === "timestamp" && (
                        sortDirection === "asc" 
                          ? <SortAsc className="w-4 h-4 ml-1" />
                          : <SortDesc className="w-4 h-4 ml-1" />
                      )}
                    </div>
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredCustomers.map((customer) => (
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
                        (customer.cibilScore ?? 0) > 0 ? 'bg-red-100 text-red-800' :
                        'bg-gray-100 text-gray-800'
                      }`}>
                        {customer.cibilScore ?? 'Not Available'}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      <div className="flex items-center">
                        <Calendar className="h-4 w-4 mr-1" />
                        {format(new Date(customer.timestamp), 'dd MMM yyyy')}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm">
                      <button 
                        onClick={() => router.push(`/dashboard/eligibility/${customer.id}`)}
                        className="text-blue-600 hover:text-blue-900"
                      >
                        View Eligibility
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          ) : (
            <div className="text-center py-12">
              <div className="flex justify-center mb-4">
                <CreditCard className="h-12 w-12 text-gray-300" />
              </div>
              <h3 className="text-lg font-medium text-gray-900 mb-1">No customers found</h3>
              {searchTerm ? (
                <p className="text-gray-500 mb-4">No results match your search criteria</p>
              ) : (
                <p className="text-gray-500 mb-4">Start by registering your first customer</p>
              )}
              <button
                onClick={() => router.push("/dashboard/customer-form")}
                className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700"
              >
                <UserPlus className="h-4 w-4 mr-2" /> Add Customer
              </button>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
