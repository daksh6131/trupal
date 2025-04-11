"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { 
  Users, CreditCard, Activity, LogOut,
  Edit, Trash2, Plus, Filter, Search,
  ArrowUp, ArrowDown, CheckCircle, XCircle
} from "lucide-react";
import { db } from "@/lib/db";
import { CreditCard as CreditCardType } from "@/types";
import { cn } from "@/lib/utils";
import toast from "react-hot-toast";

export default function AdminPage() {
  const router = useRouter();
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [activeTab, setActiveTab] = useState<"cards" | "customers" | "logs">("cards");
  const [creditCards, setCreditCards] = useState<CreditCardType[]>([]);
  const [editingCard, setEditingCard] = useState<CreditCardType | null>(null);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [sortBy, setSortBy] = useState<"name" | "minCibilScore">("name");
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("asc");
  const [filter, setFilter] = useState("");
  
  const adminCredentials = {
    email: "admin@example.com",
    password: "admin123"
  };
  
  useEffect(() => {
    // Check if admin is logged in
    const admin = localStorage.getItem("adminUser");
    if (admin) {
      setIsLoggedIn(true);
      loadCreditCards();
    }
  }, []);
  
  const loadCreditCards = () => {
    const cards = db.creditCards.getAll();
    setCreditCards(sortCards(cards, sortBy, sortOrder));
  };
  
  const sortCards = (cards: CreditCardType[], by: string, order: "asc" | "desc") => {
    return [...cards].sort((a: any, b: any) => {
      if (a[by] < b[by]) return order === "asc" ? -1 : 1;
      if (a[by] > b[by]) return order === "asc" ? 1 : -1;
      return 0;
    });
  };
  
  const handleSort = (by: "name" | "minCibilScore") => {
    const newOrder = sortBy === by && sortOrder === "asc" ? "desc" : "asc";
    setSortBy(by);
    setSortOrder(newOrder);
    setCreditCards(sortCards(creditCards, by, newOrder));
  };
  
  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    const email = (e.currentTarget as HTMLFormElement).email.value;
    const password = (e.currentTarget as HTMLFormElement).password.value;
    
    if (email === adminCredentials.email && password === adminCredentials.password) {
      localStorage.setItem("adminUser", JSON.stringify({ email, role: "admin" }));
      setIsLoggedIn(true);
      loadCreditCards();
      toast.success("Logged in successfully");
    } else {
      toast.error("Invalid credentials");
    }
  };
  
  const handleLogout = () => {
    localStorage.removeItem("adminUser");
    setIsLoggedIn(false);
    toast.success("Logged out successfully");
  };
  
  const handleDeleteCard = (id: string) => {
    if (window.confirm("Are you sure you want to delete this card?")) {
      db.creditCards.delete(id);
      loadCreditCards();
      toast.success("Card deleted successfully");
    }
  };
  
  const handleEditCard = (card: CreditCardType) => {
    setEditingCard(card);
    setIsFormOpen(true);
  };
  
  const handleAddNewCard = () => {
    setEditingCard(null);
    setIsFormOpen(true);
  };
  
  const handleSubmitCard = (e: React.FormEvent) => {
    e.preventDefault();
    const form = e.target as HTMLFormElement;
    
    const cardData = {
      name: form.name.value,
      minCibilScore: parseInt(form.minCibilScore.value),
      annualFee: parseInt(form.annualFee.value),
      utmLink: form.utmLink.value,
      benefits: form.benefits.value.split('\n').filter(Boolean),
      tags: form.tags.value.split(',').map((tag: string) => tag.trim()).filter(Boolean),
      status: form.status.value as "active" | "inactive",
      imageUrl: form.imageUrl.value || "https://images.unsplash.com/photo-1523281353252-5e14672131b0?q=80&w=500&auto=format&fit=crop"
    };
    
    if (editingCard) {
      db.creditCards.update(editingCard.id, cardData);
      toast.success("Card updated successfully");
    } else {
      db.creditCards.create(cardData);
      toast.success("New card added successfully");
    }
    
    setIsFormOpen(false);
    loadCreditCards();
  };
  
  const filteredCards = creditCards.filter(card => 
    card.name.toLowerCase().includes(filter.toLowerCase()) ||
    card.tags.some(tag => tag.toLowerCase().includes(filter.toLowerCase()))
  );
  
  if (!isLoggedIn) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-md w-full space-y-8">
          <div>
            <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
              Admin Login
            </h2>
            <p className="mt-2 text-center text-sm text-gray-600">
              Access the admin dashboard
            </p>
          </div>
          <form className="mt-8 space-y-6" onSubmit={handleLogin}>
            <div className="rounded-md shadow-sm -space-y-px">
              <div>
                <label htmlFor="email" className="sr-only">Email address</label>
                <input
                  id="email"
                  name="email"
                  type="email"
                  autoComplete="email"
                  required
                  className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-t-md focus:outline-none focus:ring-blue-500 focus:border-blue-500 focus:z-10 sm:text-sm"
                  placeholder="Email address"
                  defaultValue="admin@example.com"
                />
              </div>
              <div>
                <label htmlFor="password" className="sr-only">Password</label>
                <input
                  id="password"
                  name="password"
                  type="password"
                  autoComplete="current-password"
                  required
                  className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-b-md focus:outline-none focus:ring-blue-500 focus:border-blue-500 focus:z-10 sm:text-sm"
                  placeholder="Password"
                  defaultValue="admin123"
                />
              </div>
            </div>
            
            <p className="text-xs text-gray-500">
              For demo use:<br />
              Email: admin@example.com<br />
              Password: admin123
            </p>

            <div>
              <button
                type="submit"
                className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              >
                Sign in
              </button>
            </div>
          </form>
          
          <div className="text-center mt-4">
            <a href="/" className="font-medium text-blue-600 hover:text-blue-500">
              Back to sales agent login
            </a>
          </div>
        </div>
      </div>
    );
  }
  
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 py-4 sm:px-6 flex justify-between items-center">
          <h1 className="text-2xl font-bold text-gray-900">CardSales Pro - Admin</h1>
          <button 
            onClick={handleLogout}
            className="flex items-center text-sm font-medium text-red-600 hover:text-red-800"
          >
            <LogOut className="h-4 w-4 mr-1" /> Logout
          </button>
        </div>
      </header>
      
      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 py-8 sm:px-6">
        {/* Tabs */}
        <div className="flex border-b border-gray-200 mb-6">
          <button
            className={cn(
              "py-4 px-6 text-sm font-medium",
              activeTab === "cards"
                ? "border-b-2 border-blue-500 text-blue-600"
                : "text-gray-500 hover:text-gray-700 hover:border-gray-300"
            )}
            onClick={() => setActiveTab("cards")}
          >
            <div className="flex items-center">
              <CreditCard className="h-5 w-5 mr-2" /> Credit Cards
            </div>
          </button>
          <button
            className={cn(
              "py-4 px-6 text-sm font-medium",
              activeTab === "customers"
                ? "border-b-2 border-blue-500 text-blue-600"
                : "text-gray-500 hover:text-gray-700 hover:border-gray-300"
            )}
            onClick={() => setActiveTab("customers")}
          >
            <div className="flex items-center">
              <Users className="h-5 w-5 mr-2" /> Customers
            </div>
          </button>
          <button
            className={cn(
              "py-4 px-6 text-sm font-medium",
              activeTab === "logs"
                ? "border-b-2 border-blue-500 text-blue-600"
                : "text-gray-500 hover:text-gray-700 hover:border-gray-300"
            )}
            onClick={() => setActiveTab("logs")}
          >
            <div className="flex items-center">
              <Activity className="h-5 w-5 mr-2" /> Activity Logs
            </div>
          </button>
        </div>
        
        {/* Credit Cards Tab */}
        {activeTab === "cards" && (
          <div>
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-semibold text-gray-900">Credit Cards</h2>
              <button
                onClick={handleAddNewCard}
                className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              >
                <Plus className="h-4 w-4 mr-2" /> Add New Card
              </button>
            </div>
            
            {/* Filter and Search */}
            <div className="mb-6 flex">
              <div className="relative flex-grow">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Search className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  type="text"
                  className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:placeholder-gray-400 focus:ring-1 focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                  placeholder="Search cards by name or tag"
                  value={filter}
                  onChange={(e) => setFilter(e.target.value)}
                />
              </div>
            </div>
            
            {/* Cards List */}
            <div className="bg-white shadow overflow-hidden sm:rounded-md">
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
                        {sortBy === "name" && (
                          sortOrder === "asc" ? <ArrowUp className="w-4 h-4 ml-1" /> : <ArrowDown className="w-4 h-4 ml-1" />
                        )}
                      </div>
                    </th>
                    <th
                      scope="col"
                      className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                      onClick={() => handleSort("minCibilScore")}
                    >
                      <div className="flex items-center">
                        Min CIBIL Score
                        {sortBy === "minCibilScore" && (
                          sortOrder === "asc" ? <ArrowUp className="w-4 h-4 ml-1" /> : <ArrowDown className="w-4 h-4 ml-1" />
                        )}
                      </div>
                    </th>
                    <th
                      scope="col"
                      className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                    >
                      Annual Fee
                    </th>
                    <th
                      scope="col"
                      className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                    >
                      Tags
                    </th>
                    <th
                      scope="col"
                      className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                    >
                      Status
                    </th>
                    <th
                      scope="col"
                      className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                    >
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {filteredCards.map((card) => (
                    <tr key={card.id}>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-medium text-gray-900">{card.name}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-500">{card.minCibilScore}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-500">₹{card.annualFee}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex flex-wrap gap-1">
                          {card.tags.map((tag, idx) => (
                            <span 
                              key={idx} 
                              className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-blue-100 text-blue-800"
                            >
                              {tag}
                            </span>
                          ))}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                          card.status === "active" ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"
                        }`}>
                          {card.status === "active" ? (
                            <CheckCircle className="w-3 h-3 mr-1" />
                          ) : (
                            <XCircle className="w-3 h-3 mr-1" />
                          )}
                          {card.status}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        <button
                          onClick={() => handleEditCard(card)}
                          className="text-blue-600 hover:text-blue-900 mr-4"
                        >
                          <Edit className="h-4 w-4" />
                        </button>
                        <button
                          onClick={() => handleDeleteCard(card.id)}
                          className="text-red-600 hover:text-red-900"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
              
              {filteredCards.length === 0 && (
                <div className="text-center py-8">
                  <p className="text-gray-500">No credit cards found</p>
                </div>
              )}
            </div>
            
            {/* Card Form Modal */}
            {isFormOpen && (
              <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                <div className="bg-white rounded-lg p-8 max-w-2xl w-full max-h-screen overflow-y-auto">
                  <h3 className="text-lg font-medium text-gray-900 mb-6">
                    {editingCard ? "Edit Credit Card" : "Add New Credit Card"}
                  </h3>
                  
                  <form onSubmit={handleSubmitCard}>
                    <div className="space-y-6">
                      <div>
                        <label htmlFor="name" className="block text-sm font-medium text-gray-700">
                          Card Name
                        </label>
                        <input
                          type="text"
                          id="name"
                          name="name"
                          className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                          defaultValue={editingCard?.name ?? ""}
                          required
                        />
                      </div>
                      
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <label htmlFor="minCibilScore" className="block text-sm font-medium text-gray-700">
                            Min CIBIL Score
                          </label>
                          <input
                            type="number"
                            id="minCibilScore"
                            name="minCibilScore"
                            min="300"
                            max="900"
                            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                            defaultValue={editingCard?.minCibilScore ?? "700"}
                            required
                          />
                        </div>
                        
                        <div>
                          <label htmlFor="annualFee" className="block text-sm font-medium text-gray-700">
                            Annual Fee (₹)
                          </label>
                          <input
                            type="number"
                            id="annualFee"
                            name="annualFee"
                            min="0"
                            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                            defaultValue={editingCard?.annualFee ?? "0"}
                            required
                          />
                        </div>
                      </div>
                      
                      <div>
                        <label htmlFor="utmLink" className="block text-sm font-medium text-gray-700">
                          UTM Link
                        </label>
                        <input
                          type="url"
                          id="utmLink"
                          name="utmLink"
                          className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                          defaultValue={editingCard?.utmLink ?? "https://example.com/card?utm=agent"}
                          required
                        />
                      </div>
                      
                      <div>
                        <label htmlFor="benefits" className="block text-sm font-medium text-gray-700">
                          Benefits (one per line)
                        </label>
                        <textarea
                          id="benefits"
                          name="benefits"
                          rows={4}
                          className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                          defaultValue={editingCard?.benefits.join('\n') ?? ""}
                          required
                        ></textarea>
                      </div>
                      
                      <div>
                        <label htmlFor="tags" className="block text-sm font-medium text-gray-700">
                          Tags (comma separated)
                        </label>
                        <input
                          type="text"
                          id="tags"
                          name="tags"
                          className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                          defaultValue={editingCard?.tags.join(', ') ?? ""}
                          required
                        />
                      </div>
                      
                      <div>
                        <label htmlFor="imageUrl" className="block text-sm font-medium text-gray-700">
                          Card Image URL
                        </label>
                        <input
                          type="url"
                          id="imageUrl"
                          name="imageUrl"
                          className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                          defaultValue={editingCard?.imageUrl ?? "https://images.unsplash.com/photo-1523281353252-5e14672131b0?q=80&w=500&auto=format&fit=crop"}
                        />
                        <p className="mt-1 text-sm text-gray-500">Leave empty for default image</p>
                      </div>
                      
                      <div>
                        <label htmlFor="status" className="block text-sm font-medium text-gray-700">
                          Status
                        </label>
                        <select
                          id="status"
                          name="status"
                          className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                          defaultValue={editingCard?.status ?? "active"}
                        >
                          <option value="active">Active</option>
                          <option value="inactive">Inactive</option>
                        </select>
                      </div>
                      
                      <div className="flex justify-end space-x-3">
                        <button
                          type="button"
                          onClick={() => setIsFormOpen(false)}
                          className="py-2 px-4 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                        >
                          Cancel
                        </button>
                        <button
                          type="submit"
                          className="py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                        >
                          {editingCard ? "Update Card" : "Add Card"}
                        </button>
                      </div>
                    </div>
                  </form>
                </div>
              </div>
            )}
          </div>
        )}
        
        {/* Customers Tab */}
        {activeTab === "customers" && (
          <div>
            <div className="mb-6">
              <h2 className="text-xl font-semibold text-gray-900">Registered Customers</h2>
              <p className="text-gray-500 mt-1">View all customer information</p>
            </div>
            
            <div className="bg-white shadow overflow-hidden sm:rounded-md">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Customer
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Contact
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      CIBIL
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Registered By
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Date
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {db.customers.getAll().map((customer) => (
                    <tr key={customer.id}>
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
                          {customer.cibilScore ?? 'N/A'}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">
                          {db.agents.getByPhone(customer.linkedAgent)?.name ?? customer.linkedAgent}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {new Date(customer.timestamp).toLocaleDateString()}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
              
              {db.customers.getAll().length === 0 && (
                <div className="text-center py-8">
                  <p className="text-gray-500">No customers registered yet</p>
                </div>
              )}
            </div>
          </div>
        )}
        
        {/* Activity Logs Tab */}
        {activeTab === "logs" && (
          <div>
            <div className="mb-6">
              <h2 className="text-xl font-semibold text-gray-900">Activity Logs</h2>
              <p className="text-gray-500 mt-1">Track all system activities</p>
            </div>
            
            <div className="bg-white shadow overflow-hidden sm:rounded-md">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Timestamp
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Action
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Agent
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Customer
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Details
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {[...db.logs.getAll()]
                    .sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime())
                    .map((log) => (
                    <tr key={log.id}>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {new Date(log.timestamp).toLocaleString()}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                          log.action === "login" || log.action === "logout" ? 'bg-blue-100 text-blue-800' :
                          log.action === "form_submit" ? 'bg-green-100 text-green-800' :
                          log.action === "card_shared" ? 'bg-purple-100 text-purple-800' :
                          'bg-gray-100 text-gray-800'
                        }`}>
                          {log.action === "login" && "Login"}
                          {log.action === "logout" && "Logout"}
                          {log.action === "form_submit" && "Customer Added"}
                          {log.action === "card_shared" && "Cards Shared"}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">{log.agentName}</div>
                        <div className="text-sm text-gray-500">{log.agentPhone}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">
                          {log.customerName ?? "N/A"}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        {log.action === "card_shared" && (
                          <div className="text-sm text-gray-900">
                            Shared {log.sharedCards?.length ?? 0} cards
                          </div>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
              
              {db.logs.getAll().length === 0 && (
                <div className="text-center py-8">
                  <p className="text-gray-500">No activity logs yet</p>
                </div>
              )}
            </div>
            
            {/* Export Button */}
            <div className="mt-6 flex justify-end">
              <button
                onClick={() => {
                  // In a real app, this would generate a CSV export
                  toast.success("Data exported successfully (simulated)");
                }}
                className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
              >
                Export to CSV
              </button>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
