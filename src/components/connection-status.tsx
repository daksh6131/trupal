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
    return <div className="flex items-center gap-2 px-3 py-1.5 rounded-md text-sm bg-gray-100 text-gray-700">
        <Database className="h-4 w-4 animate-pulse" />
        <span>Checking connection...</span>
      </div>;
  }
  if (isConnected) {
    return <div className="flex items-center gap-2 px-3 py-1.5 rounded-md text-sm bg-green-50 text-green-700">
        <Server className="h-4 w-4" />
        <span>Connected to database</span>
      </div>;
  }
  return <div className="flex items-center gap-2 px-3 py-1.5 rounded-md text-sm bg-red-50 text-red-700">
      <ServerOff className="h-4 w-4" />
      <span>Database disconnected</span>
      <button onClick={checkConnection} disabled={isChecking} className="ml-2 text-xs font-medium hover:underline">
        {isChecking ? 'Checking...' : 'Retry'}
      </button>
    </div>;
}