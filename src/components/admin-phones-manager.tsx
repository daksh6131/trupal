"use client";

import { useState, useEffect } from "react";
import { Phone, Plus, Trash2, RefreshCw } from "lucide-react";
import { toast } from "react-hot-toast";
import { AdminPhone } from "@/db/schema";
import { supabase } from "@/db";
export default function AdminPhonesManager() {
  const [phones, setPhones] = useState<AdminPhone[]>([]);
  const [newPhone, setNewPhone] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isAdding, setIsAdding] = useState(false);

  // Fetch admin phones
  const fetchPhones = async () => {
    setIsLoading(true);
    try {
      // Try to get data directly from Supabase first
      const {
        data: supabasePhones,
        error
      } = await supabase.from('admin_phones').select('*').order('created_at', {
        ascending: false
      });
      if (!error && supabasePhones) {
        setPhones(supabasePhones);
      } else {
        // Fall back to API if Supabase fails
        const response = await fetch("/api/admin/phones", {
          headers: {
            "Authorization": `Bearer ${localStorage.getItem("adminToken")}`
          }
        });
        const data = await response.json();
        if (data.success) {
          setPhones(data.phones);
        } else {
          toast.error(data.error || "Failed to fetch admin phones");
        }
      }
    } catch (error) {
      console.error("Error fetching admin phones:", error);
      toast.error("Failed to fetch admin phones");
    } finally {
      setIsLoading(false);
    }
  };

  // Add a new admin phone
  const addPhone = async () => {
    if (!newPhone || newPhone.length !== 10 || !/^\d+$/.test(newPhone)) {
      toast.error("Please enter a valid 10-digit phone number");
      return;
    }
    setIsAdding(true);
    try {
      // Try to add directly to Supabase first
      const {
        data: adminData
      } = await supabase.auth.getSession();
      const addedBy = adminData?.session?.user?.email || "admin";
      const {
        data: supabaseData,
        error: supabaseError
      } = await supabase.from('admin_phones').insert({
        phone: newPhone,
        added_by: addedBy,
        created_at: new Date().toISOString()
      }).select();
      if (!supabaseError && supabaseData) {
        toast.success("Phone number added successfully");
        setNewPhone("");
        fetchPhones();
      } else {
        // Fall back to API if Supabase fails
        const response = await fetch("/api/admin/phones", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${localStorage.getItem("adminToken")}`
          },
          body: JSON.stringify({
            phone: newPhone
          })
        });
        const data = await response.json();
        if (data.success) {
          toast.success("Phone number added successfully");
          setNewPhone("");
          fetchPhones();
        } else {
          toast.error(data.error || "Failed to add phone number");
        }
      }
    } catch (error) {
      console.error("Error adding phone:", error);
      toast.error("Failed to add phone number");
    } finally {
      setIsAdding(false);
    }
  };

  // Remove an admin phone
  const removePhone = async (phone: string) => {
    try {
      // Try to remove directly from Supabase first
      const {
        error: supabaseError
      } = await supabase.from('admin_phones').delete().eq('phone', phone);
      if (!supabaseError) {
        toast.success("Phone number removed successfully");
        fetchPhones();
      } else {
        // Fall back to API if Supabase fails
        const response = await fetch(`/api/admin/phones/${phone}`, {
          method: "DELETE",
          headers: {
            "Authorization": `Bearer ${localStorage.getItem("adminToken")}`
          }
        });
        const data = await response.json();
        if (data.success) {
          toast.success("Phone number removed successfully");
          fetchPhones();
        } else {
          toast.error(data.error || "Failed to remove phone number");
        }
      }
    } catch (error) {
      console.error("Error removing phone:", error);
      toast.error("Failed to remove phone number");
    }
  };

  // Load phones on component mount and subscribe to real-time updates
  useEffect(() => {
    fetchPhones();

    // Subscribe to real-time updates
    const channel = supabase.channel('admin_phones_changes').on('postgres_changes', {
      event: '*',
      schema: 'public',
      table: 'admin_phones'
    }, () => {
      fetchPhones();
    }).subscribe();
    return () => {
      supabase.removeChannel(channel);
    };
  }, []);
  return <div className="bg-white shadow rounded-lg p-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-lg font-medium text-gray-900">Admin Phone Numbers</h2>
        <button onClick={fetchPhones} disabled={isLoading} className="inline-flex items-center text-sm text-blue-600 hover:text-blue-800">
          <RefreshCw className={`h-4 w-4 mr-1 ${isLoading ? 'animate-spin' : ''}`} />
          Refresh
        </button>
      </div>
      
      {/* Add new phone */}
      <div className="mb-6">
        <div className="flex space-x-2">
          <div className="relative flex-grow">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Phone className="h-5 w-5 text-gray-400" />
            </div>
            <input type="tel" maxLength={10} className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:placeholder-gray-400 focus:ring-1 focus:ring-blue-500 focus:border-blue-500 sm:text-sm" placeholder="Enter 10-digit phone number" value={newPhone} onChange={e => setNewPhone(e.target.value)} />
          </div>
          <button onClick={addPhone} disabled={isAdding} className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50">
            {isAdding ? <span className="flex items-center">
                <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Adding...
              </span> : <span className="flex items-center">
                <Plus className="h-4 w-4 mr-1" /> Add
              </span>}
          </button>
        </div>
      </div>
      
      {/* Phone list */}
      <div className="border rounded-md overflow-hidden">
        {phones.length > 0 ? <ul className="divide-y divide-gray-200">
            {phones.map(phone => <li key={phone.id} className="px-4 py-3 flex items-center justify-between hover:bg-gray-50">
                <div>
                  <p className="text-sm font-medium text-gray-900">+91 {phone.phone}</p>
                  <p className="text-xs text-gray-500">
                    Added by: {phone.addedBy || "System"}
                  </p>
                </div>
                <button onClick={() => removePhone(phone.phone)} className="text-red-600 hover:text-red-800 p-1 rounded-full hover:bg-red-50">
                  <Trash2 className="h-4 w-4" />
                </button>
              </li>)}
          </ul> : <div className="text-center py-6 text-gray-500">
            {isLoading ? "Loading..." : "No admin phone numbers found"}
          </div>}
      </div>
    </div>;
}