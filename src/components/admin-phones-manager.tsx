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
  return <div className="bg-white shadow rounded-lg p-6" data-unique-id="71c899a8-1873-4a71-9148-c8537ba4b089" data-loc="151:9-151:57" data-file-name="components/admin-phones-manager.tsx">
      <div className="flex justify-between items-center mb-6" data-unique-id="c4d5926c-33fd-49a1-9c1e-cc6fb533bd59" data-loc="152:6-152:62" data-file-name="components/admin-phones-manager.tsx">
        <h2 className="text-lg font-medium text-gray-900" data-unique-id="759ed0b5-2e93-4976-910b-8cf529b82ed5" data-loc="153:8-153:58" data-file-name="components/admin-phones-manager.tsx">Admin Phone Numbers</h2>
        <button onClick={fetchPhones} disabled={isLoading} className="inline-flex items-center text-sm text-blue-600 hover:text-blue-800" data-unique-id="7eb344a4-f21f-4c1a-9463-ed1b6e47db2c" data-loc="154:8-154:138" data-file-name="components/admin-phones-manager.tsx">
          <RefreshCw className={`h-4 w-4 mr-1 ${isLoading ? 'animate-spin' : ''}`} />
          Refresh
        </button>
      </div>
      
      {/* Add new phone */}
      <div className="mb-6" data-unique-id="a3b8966f-7db7-48f7-9d33-c427b7424159" data-loc="161:6-161:28" data-file-name="components/admin-phones-manager.tsx">
        <div className="flex space-x-2" data-unique-id="722b10dc-d13c-4517-825f-c610b645799c" data-loc="162:8-162:40" data-file-name="components/admin-phones-manager.tsx">
          <div className="relative flex-grow" data-unique-id="3aea5065-ccce-4a18-bdb9-e39e4a5602f6" data-loc="163:10-163:46" data-file-name="components/admin-phones-manager.tsx">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none" data-unique-id="a462e660-4664-4f52-96ae-3f5f6404a936" data-loc="164:12-164:98" data-file-name="components/admin-phones-manager.tsx">
              <Phone className="h-5 w-5 text-gray-400" />
            </div>
            <input type="tel" maxLength={10} className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:placeholder-gray-400 focus:ring-1 focus:ring-blue-500 focus:border-blue-500 sm:text-sm" placeholder="Enter 10-digit phone number" value={newPhone} onChange={e => setNewPhone(e.target.value)} data-unique-id="04a06aa3-9c1b-45e2-9ad5-5c997769aa1d" data-loc="167:12-167:377" data-file-name="components/admin-phones-manager.tsx" />
          </div>
          <button onClick={addPhone} disabled={isAdding} className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50" data-unique-id="f12b02b6-210b-4b1c-b86e-d60d27e1d7d5" data-loc="169:10-169:304" data-file-name="components/admin-phones-manager.tsx">
            {isAdding ? <span className="flex items-center" data-unique-id="a515fc0b-9e4e-4872-8c38-27e2d95cbc9d" data-loc="170:24-170:60" data-file-name="components/admin-phones-manager.tsx">
                <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" data-unique-id="67e80335-a0e4-437d-9a93-ef6670b0897e" data-loc="171:16-171:143" data-file-name="components/admin-phones-manager.tsx">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Adding...
              </span> : <span className="flex items-center" data-unique-id="3c3a3fc5-dded-4d5e-b238-7bdd93030936" data-loc="176:24-176:60" data-file-name="components/admin-phones-manager.tsx">
                <Plus className="h-4 w-4 mr-1" /> Add
              </span>}
          </button>
        </div>
      </div>
      
      {/* Phone list */}
      <div className="border rounded-md overflow-hidden" data-unique-id="e88401d9-f28d-4659-b092-0ed10f29c79c" data-loc="184:6-184:57" data-file-name="components/admin-phones-manager.tsx">
        {phones.length > 0 ? <ul className="divide-y divide-gray-200" data-unique-id="dd75f8b5-9296-4f9a-af7e-3ac2bf334b7b" data-loc="185:29-185:70" data-file-name="components/admin-phones-manager.tsx">
            {phones.map(phone => <li key={phone.id} className="px-4 py-3 flex items-center justify-between hover:bg-gray-50" data-unique-id="ddc77581-58da-4b9a-a255-3c780b7a1365" data-loc="186:33-186:125" data-file-name="components/admin-phones-manager.tsx">
                <div data-unique-id="d8ad393d-c8f5-4ea0-a73f-baa0cd194d6b" data-loc="187:16-187:21" data-file-name="components/admin-phones-manager.tsx">
                  <p className="text-sm font-medium text-gray-900" data-unique-id="c1170aa2-2ba9-4f3c-bb32-842552c294ff" data-loc="188:18-188:67" data-file-name="components/admin-phones-manager.tsx">+91 {phone.phone}</p>
                  <p className="text-xs text-gray-500" data-unique-id="7e2e3d89-4790-46e3-a980-f71554340ea0" data-loc="189:18-189:55" data-file-name="components/admin-phones-manager.tsx">
                    Added by: {phone.addedBy || "System"}
                  </p>
                </div>
                <button onClick={() => removePhone(phone.phone)} className="text-red-600 hover:text-red-800 p-1 rounded-full hover:bg-red-50" data-unique-id="a420acf1-05ea-4309-a2e9-92441f8d13e2" data-loc="193:16-193:142" data-file-name="components/admin-phones-manager.tsx">
                  <Trash2 className="h-4 w-4" />
                </button>
              </li>)}
          </ul> : <div className="text-center py-6 text-gray-500" data-unique-id="4404dac8-3fcf-49a5-b4c5-58b416056589" data-loc="197:18-197:66" data-file-name="components/admin-phones-manager.tsx">
            {isLoading ? "Loading..." : "No admin phone numbers found"}
          </div>}
      </div>
    </div>;
}