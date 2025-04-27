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
  return <div className="bg-white shadow rounded-lg p-6" data-unique-id="15c12558-ca58-427b-94df-dc3590b8a5e6" data-loc="151:9-151:57" data-file-name="components/admin-phones-manager.tsx">
      <div className="flex justify-between items-center mb-6" data-unique-id="c2fa773f-502a-4c62-9d9e-452cc53ce047" data-loc="152:6-152:62" data-file-name="components/admin-phones-manager.tsx">
        <h2 className="text-lg font-medium text-gray-900" data-unique-id="668dde30-735b-48d7-9a6f-aae1631bddac" data-loc="153:8-153:58" data-file-name="components/admin-phones-manager.tsx">Admin Phone Numbers</h2>
        <button onClick={fetchPhones} disabled={isLoading} className="inline-flex items-center text-sm text-blue-600 hover:text-blue-800" data-unique-id="2364e0e1-f913-4cbf-a031-4d4782753030" data-loc="154:8-154:138" data-file-name="components/admin-phones-manager.tsx">
          <RefreshCw className={`h-4 w-4 mr-1 ${isLoading ? 'animate-spin' : ''}`} />
          Refresh
        </button>
      </div>
      
      {/* Add new phone */}
      <div className="mb-6" data-unique-id="9b7bdadd-fcc8-4f79-9c39-4138f5d5018b" data-loc="161:6-161:28" data-file-name="components/admin-phones-manager.tsx">
        <div className="flex space-x-2" data-unique-id="a951d7e2-6e20-4e3d-a108-4fa8bdd835fc" data-loc="162:8-162:40" data-file-name="components/admin-phones-manager.tsx">
          <div className="relative flex-grow" data-unique-id="2b35840d-e26d-4b29-be79-d7bade290b16" data-loc="163:10-163:46" data-file-name="components/admin-phones-manager.tsx">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none" data-unique-id="48f02c3a-6a92-4901-b505-3a0ad84f43f1" data-loc="164:12-164:98" data-file-name="components/admin-phones-manager.tsx">
              <Phone className="h-5 w-5 text-gray-400" />
            </div>
            <input type="tel" maxLength={10} className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:placeholder-gray-400 focus:ring-1 focus:ring-blue-500 focus:border-blue-500 sm:text-sm" placeholder="Enter 10-digit phone number" value={newPhone} onChange={e => setNewPhone(e.target.value)} data-unique-id="643ccc66-384d-464c-b9ed-94e62137e8a4" data-loc="167:12-167:377" data-file-name="components/admin-phones-manager.tsx" />
          </div>
          <button onClick={addPhone} disabled={isAdding} className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50" data-unique-id="5be59d2c-0ad7-4310-bc7b-f3b991e855cb" data-loc="169:10-169:304" data-file-name="components/admin-phones-manager.tsx">
            {isAdding ? <span className="flex items-center" data-unique-id="d660c37a-508d-4a0e-bd00-e5eaf38fd9a8" data-loc="170:24-170:60" data-file-name="components/admin-phones-manager.tsx">
                <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" data-unique-id="8d272945-7d16-4fdb-86d0-c1c6abacf540" data-loc="171:16-171:143" data-file-name="components/admin-phones-manager.tsx">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Adding...
              </span> : <span className="flex items-center" data-unique-id="9baef802-25f6-4ceb-aba8-3a2fe3c39f0f" data-loc="176:24-176:60" data-file-name="components/admin-phones-manager.tsx">
                <Plus className="h-4 w-4 mr-1" /> Add
              </span>}
          </button>
        </div>
      </div>
      
      {/* Phone list */}
      <div className="border rounded-md overflow-hidden" data-unique-id="3dad1b73-25cd-4d88-adb8-cbd73440f74f" data-loc="184:6-184:57" data-file-name="components/admin-phones-manager.tsx">
        {phones.length > 0 ? <ul className="divide-y divide-gray-200" data-unique-id="6781e793-1c74-488d-ad4a-4948c7ba8a53" data-loc="185:29-185:70" data-file-name="components/admin-phones-manager.tsx">
            {phones.map(phone => <li key={phone.id} className="px-4 py-3 flex items-center justify-between hover:bg-gray-50" data-unique-id="e8acd9f0-3159-4d92-a2a5-6327bb4c51b5" data-loc="186:33-186:125" data-file-name="components/admin-phones-manager.tsx">
                <div data-unique-id="7ca0d816-6808-498c-97c7-fce19bba3148" data-loc="187:16-187:21" data-file-name="components/admin-phones-manager.tsx">
                  <p className="text-sm font-medium text-gray-900" data-unique-id="c5d28262-1428-42db-a0f5-1edee59c62de" data-loc="188:18-188:67" data-file-name="components/admin-phones-manager.tsx">+91 {phone.phone}</p>
                  <p className="text-xs text-gray-500" data-unique-id="b3af8c79-2062-4062-b101-82f992d07f2e" data-loc="189:18-189:55" data-file-name="components/admin-phones-manager.tsx">
                    Added by: {phone.addedBy || "System"}
                  </p>
                </div>
                <button onClick={() => removePhone(phone.phone)} className="text-red-600 hover:text-red-800 p-1 rounded-full hover:bg-red-50" data-unique-id="bbdd13b7-df67-4e61-bc97-a64b8ad792e0" data-loc="193:16-193:142" data-file-name="components/admin-phones-manager.tsx">
                  <Trash2 className="h-4 w-4" />
                </button>
              </li>)}
          </ul> : <div className="text-center py-6 text-gray-500" data-unique-id="e1e5d2b9-363a-48d7-94fe-1c30ea3d8b12" data-loc="197:18-197:66" data-file-name="components/admin-phones-manager.tsx">
            {isLoading ? "Loading..." : "No admin phone numbers found"}
          </div>}
      </div>
    </div>;
}