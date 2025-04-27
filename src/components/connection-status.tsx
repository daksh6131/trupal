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
    return <div className="flex items-center gap-2 px-3 py-1.5 rounded-md text-sm bg-gray-100 text-gray-700" data-unique-id="1e6f9a93-2b7d-455d-9266-89ad772dd0fb" data-loc="43:11-43:109" data-file-name="components/connection-status.tsx">
        <Database className="h-4 w-4 animate-pulse" />
        <span data-unique-id="f9f18ade-4001-498e-8783-af1b7b31f3a8" data-loc="45:8-45:14" data-file-name="components/connection-status.tsx">Checking connection...</span>
      </div>;
  }
  if (isConnected) {
    return <div className="flex items-center gap-2 px-3 py-1.5 rounded-md text-sm bg-green-50 text-green-700" data-unique-id="3bac5c81-14e9-4576-a5f2-53b8ef991873" data-loc="49:11-49:110" data-file-name="components/connection-status.tsx">
        <Server className="h-4 w-4" />
        <span data-unique-id="b3656c97-95ca-4533-852f-205c0f2e7b40" data-loc="51:8-51:14" data-file-name="components/connection-status.tsx">Connected to database</span>
      </div>;
  }
  return <div className="flex items-center gap-2 px-3 py-1.5 rounded-md text-sm bg-red-50 text-red-700" data-unique-id="2e610ac4-f655-4f14-9cd0-03ae7881d091" data-loc="54:9-54:104" data-file-name="components/connection-status.tsx">
      <ServerOff className="h-4 w-4" />
      <span data-unique-id="77035dfe-a83d-4c6d-a1ec-52405c9a6f06" data-loc="56:6-56:12" data-file-name="components/connection-status.tsx">Database disconnected</span>
      <button onClick={checkConnection} disabled={isChecking} className="ml-2 text-xs font-medium hover:underline" data-unique-id="d951175b-7ce0-4ee8-a27f-672879fae91d" data-loc="57:6-57:115" data-file-name="components/connection-status.tsx">
        {isChecking ? 'Checking...' : 'Retry'}
      </button>
    </div>;
}