'use client';

import { useState, useEffect } from 'react';
import { Shield, ShieldAlert, ShieldCheck } from 'lucide-react';
import { toast } from 'react-hot-toast';
export default function RlsStatus() {
  const [rlsStatus, setRlsStatus] = useState<'checking' | 'enabled' | 'disabled' | 'error'>('checking');
  useEffect(() => {
    const checkRlsStatus = async () => {
      try {
        // Call the RLS test endpoint
        const response = await fetch('/api/rls-test');
        if (!response.ok) {
          setRlsStatus('error');
          return;
        }
        const data = await response.json();

        // Check if RLS is working by examining the response
        if (data.success) {
          // If we can access the endpoint and get filtered results, RLS is working
          setRlsStatus('enabled');
        } else {
          setRlsStatus('disabled');
        }
      } catch (error) {
        console.error('Error checking RLS status:', error);
        setRlsStatus('error');
      }
    };
    checkRlsStatus();
  }, []);

  // Don't show anything if we're still checking
  if (rlsStatus === 'checking') {
    return null;
  }

  // Only show if there's an issue
  if (rlsStatus === 'enabled') {
    return null;
  }
  return <div className={`flex items-center gap-2 px-3 py-1.5 rounded-md text-sm ${rlsStatus === 'disabled' ? 'bg-red-50 text-red-700' : 'bg-yellow-50 text-yellow-700'}`} data-unique-id="bf61017b-9321-4b1d-b4c8-44fe0c36b6dc" data-loc="43:9-43:171" data-file-name="components/rls-status.tsx">
      {rlsStatus === 'disabled' ? <ShieldAlert className="h-4 w-4" /> : <ShieldAlert className="h-4 w-4" />}
      
      <span data-unique-id="a82ed701-fb13-4565-afe3-d5d34b63a328" data-loc="46:6-46:12" data-file-name="components/rls-status.tsx">
        {rlsStatus === 'disabled' ? 'Row Level Security is disabled' : 'Unable to verify Row Level Security'}
      </span>
    </div>;
}