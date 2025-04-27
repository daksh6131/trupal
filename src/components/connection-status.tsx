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
    return <div className="flex items-center gap-2 px-3 py-1.5 rounded-md text-sm bg-gray-100 text-gray-700" data-unique-id="84687d8e-a530-4709-8fc6-fefe2e9ac09b" data-loc="43:11-43:109" data-file-name="components/connection-status.tsx">
        <Database className="h-4 w-4 animate-pulse" />
        <span data-unique-id="c4f4752f-aa67-4932-aa25-7d38ffd76188" data-loc="45:8-45:14" data-file-name="components/connection-status.tsx">Checking connection...</span>
      </div>;
  }
  if (isConnected) {
    return <div className="flex items-center gap-2 px-3 py-1.5 rounded-md text-sm bg-green-50 text-green-700" data-unique-id="26bbfd92-a242-44ef-9d54-c62638d990cc" data-loc="49:11-49:110" data-file-name="components/connection-status.tsx">
        <Server className="h-4 w-4" />
        <span data-unique-id="9d10f82e-2451-402e-95f5-76e9f5594cbe" data-loc="51:8-51:14" data-file-name="components/connection-status.tsx">Connected to database</span>
      </div>;
  }
  return <div className="flex items-center gap-2 px-3 py-1.5 rounded-md text-sm bg-red-50 text-red-700" data-unique-id="93ad1058-cfa1-48c6-86f3-2c3e8615d0ea" data-loc="54:9-54:104" data-file-name="components/connection-status.tsx">
      <ServerOff className="h-4 w-4" />
      <span data-unique-id="59cfbaec-bb71-46f4-b3d2-b3bc94c4c617" data-loc="56:6-56:12" data-file-name="components/connection-status.tsx">Database disconnected</span>
      <button onClick={checkConnection} disabled={isChecking} className="ml-2 text-xs font-medium hover:underline" data-unique-id="69b637e0-b7ea-455b-96c6-b2f25be21d65" data-loc="57:6-57:115" data-file-name="components/connection-status.tsx">
        {isChecking ? 'Checking...' : 'Retry'}
      </button>
    </div>;
}