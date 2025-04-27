'use client';

import { useState, useEffect } from 'react';
import { Cloud, CloudOff, RefreshCw } from 'lucide-react';
import { supabaseApi } from '@/lib/api-service';
import { toast } from 'react-hot-toast';
export default function SyncStatus() {
  const [isOnline, setIsOnline] = useState<boolean>(true);
  const [pendingCount, setPendingCount] = useState<number>(0);
  const [isSyncing, setIsSyncing] = useState<boolean>(false);
  useEffect(() => {
    // Check online status
    const updateOnlineStatus = () => {
      setIsOnline(navigator.onLine);
    };

    // Check pending operations count
    const updatePendingCount = () => {
      const count = supabaseApi.getPendingOperationsCount();
      setPendingCount(count);
    };

    // Initial check
    updateOnlineStatus();
    updatePendingCount();

    // Set up event listeners
    window.addEventListener('online', updateOnlineStatus);
    window.addEventListener('offline', updateOnlineStatus);

    // Set up interval to check pending operations
    const interval = setInterval(() => {
      updatePendingCount();
    }, 5000);
    return () => {
      window.removeEventListener('online', updateOnlineStatus);
      window.removeEventListener('offline', updateOnlineStatus);
      clearInterval(interval);
    };
  }, []);
  const handleForceSyncClick = async () => {
    if (isSyncing || !isOnline) return;
    setIsSyncing(true);
    try {
      const result = await supabaseApi.forceSyncPendingOperations();
      if (result.success) {
        setPendingCount(result.pendingCount);
        if (result.pendingCount === 0) {
          toast.success('All data synchronized successfully');
        } else {
          toast(`Synchronized some data. ${result.pendingCount} operations remaining.`, {
            icon: '🔄'
          });
        }
      } else {
        toast.error('Failed to synchronize data');
      }
    } catch (error) {
      console.error('Error syncing data:', error);
      toast.error('Failed to synchronize data');
    } finally {
      setIsSyncing(false);
    }
  };

  // Don't show anything if everything is synced and online
  if (isOnline && pendingCount === 0) {
    return null;
  }
  return <div className={`flex items-center gap-2 px-3 py-1.5 rounded-md text-sm ${isOnline ? 'bg-blue-50 text-blue-700' : 'bg-red-50 text-red-700'}`} data-unique-id="111e43dd-592f-4cf6-ba93-b50e312d0695" data-loc="70:9-70:151" data-file-name="components/sync-status.tsx">
      {isOnline ? <Cloud className="h-4 w-4" /> : <CloudOff className="h-4 w-4" />}
      
      <span data-unique-id="2006f377-f730-4153-8999-18eea63448bd" data-loc="73:6-73:12" data-file-name="components/sync-status.tsx">
        {isOnline ? pendingCount > 0 ? `Syncing ${pendingCount} changes...` : 'All changes saved' : 'Offline mode'}
      </span>
      
      {pendingCount > 0 && isOnline && <button onClick={handleForceSyncClick} disabled={isSyncing} className="ml-2 flex items-center gap-1 text-xs font-medium hover:underline" data-unique-id="20887b99-17b1-41f8-b7e2-155c31ddcb48" data-loc="77:39-77:176" data-file-name="components/sync-status.tsx">
          <RefreshCw className={`h-3 w-3 ${isSyncing ? 'animate-spin' : ''}`} />
          {isSyncing ? 'Syncing...' : 'Sync now'}
        </button>}
    </div>;
}