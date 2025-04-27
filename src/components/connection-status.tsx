'use client';

import { useState, useEffect } from 'react';
import { supabase } from '@/db';
import { Database, Server, ServerOff } from 'lucide-react';
import { toast } from 'react-hot-toast';
export default function ConnectionStatus() {
  const [isConnected, setIsConnected] = useState<boolean | null>(null);
  const [isChecking, setIsChecking] = useState<boolean>(false);
  const checkConnection = async () => {
    if (isChecking) return;
    setIsChecking(true);
    try {
      const {
        data,
        error
      } = await supabase.from('agents').select('count').limit(1);
      if (error) {
        console.error('Supabase connection error:', error);
        setIsConnected(false);
        toast.error('Database connection failed');
      } else {
        setIsConnected(true);
      }
    } catch (error) {
      console.error('Error checking connection:', error);
      setIsConnected(false);
      toast.error('Database connection failed');
    } finally {
      setIsChecking(false);
    }
  };
  useEffect(() => {
    checkConnection();

    // Check connection every 30 seconds
    const interval = setInterval(() => {
      checkConnection();
    }, 30000);
    return () => clearInterval(interval);
  }, []);
  if (isConnected === null) {
    return <div className="flex items-center gap-2 px-3 py-1.5 rounded-md text-sm bg-gray-100 text-gray-700" data-unique-id="7c18b522-964f-4391-80b6-5be85f701956" data-loc="43:11-43:109" data-file-name="components/connection-status.tsx">
        <Database className="h-4 w-4 animate-pulse" />
        <span data-unique-id="5cf9c9e7-b934-4641-94d2-a8e078b15293" data-loc="45:8-45:14" data-file-name="components/connection-status.tsx">Checking connection...</span>
      </div>;
  }
  if (isConnected) {
    return <div className="flex items-center gap-2 px-3 py-1.5 rounded-md text-sm bg-green-50 text-green-700" data-unique-id="2eabeaa4-c48a-4921-ab08-d41033ad905c" data-loc="49:11-49:110" data-file-name="components/connection-status.tsx">
        <Server className="h-4 w-4" />
        <span data-unique-id="2148e14a-05b3-472c-87b8-95ba2de03a1b" data-loc="51:8-51:14" data-file-name="components/connection-status.tsx">Connected to database</span>
      </div>;
  }
  return <div className="flex items-center gap-2 px-3 py-1.5 rounded-md text-sm bg-red-50 text-red-700" data-unique-id="627de380-d8a9-403a-a985-e4891b94ffef" data-loc="54:9-54:104" data-file-name="components/connection-status.tsx">
      <ServerOff className="h-4 w-4" />
      <span data-unique-id="5a18de58-b95d-4dd2-afb3-957de2407fd2" data-loc="56:6-56:12" data-file-name="components/connection-status.tsx">Database disconnected</span>
      <button onClick={checkConnection} disabled={isChecking} className="ml-2 text-xs font-medium hover:underline" data-unique-id="ebaaa4c0-2d4e-405e-abca-b0c45388362f" data-loc="57:6-57:115" data-file-name="components/connection-status.tsx">
        {isChecking ? 'Checking...' : 'Retry'}
      </button>
    </div>;
}