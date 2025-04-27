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
    return <div className="flex items-center gap-2 px-3 py-1.5 rounded-md text-sm bg-gray-100 text-gray-700" data-unique-id="0e01dab9-5d4d-4e8d-8563-154eefcfaefb" data-loc="43:11-43:109" data-file-name="components/connection-status.tsx">
        <Database className="h-4 w-4 animate-pulse" />
        <span data-unique-id="9cd78655-a42d-46d9-b59d-a529811589f4" data-loc="45:8-45:14" data-file-name="components/connection-status.tsx">Checking connection...</span>
      </div>;
  }
  if (isConnected) {
    return <div className="flex items-center gap-2 px-3 py-1.5 rounded-md text-sm bg-green-50 text-green-700" data-unique-id="964801b2-1e06-407b-a563-980f39bf582b" data-loc="49:11-49:110" data-file-name="components/connection-status.tsx">
        <Server className="h-4 w-4" />
        <span data-unique-id="cb2e4ae5-62bf-4922-b653-74600ffe9837" data-loc="51:8-51:14" data-file-name="components/connection-status.tsx">Connected to database</span>
      </div>;
  }
  return <div className="flex items-center gap-2 px-3 py-1.5 rounded-md text-sm bg-red-50 text-red-700" data-unique-id="cb76cd82-89ef-45a8-9fd5-2f74c6dde645" data-loc="54:9-54:104" data-file-name="components/connection-status.tsx">
      <ServerOff className="h-4 w-4" />
      <span data-unique-id="83435f41-85c3-4616-852c-37b34ba7a75e" data-loc="56:6-56:12" data-file-name="components/connection-status.tsx">Database disconnected</span>
      <button onClick={checkConnection} disabled={isChecking} className="ml-2 text-xs font-medium hover:underline" data-unique-id="c48b5dfb-af5e-461b-a153-4db217c94bab" data-loc="57:6-57:115" data-file-name="components/connection-status.tsx">
        {isChecking ? 'Checking...' : 'Retry'}
      </button>
    </div>;
}