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
          toast.info(`Synchronized some data. ${result.pendingCount} operations remaining.`);
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

  return (
    <div className={`flex items-center gap-2 px-3 py-1.5 rounded-md text-sm ${
      isOnline ? 'bg-blue-50 text-blue-700' : 'bg-red-50 text-red-700'
    }`}>
      {isOnline ? (
        <Cloud className="h-4 w-4" />
      ) : (
        <CloudOff className="h-4 w-4" />
      )}
      
      <span>
        {isOnline 
          ? pendingCount > 0 
            ? `Syncing ${pendingCount} changes...` 
            : 'All changes saved'
          : 'Offline mode'}
      </span>
      
      {pendingCount > 0 && isOnline && (
        <button 
          onClick={handleForceSyncClick}
          disabled={isSyncing}
          className="ml-2 flex items-center gap-1 text-xs font-medium hover:underline"
        >
          <RefreshCw className={`h-3 w-3 ${isSyncing ? 'animate-spin' : ''}`} />
          {isSyncing ? 'Syncing...' : 'Sync now'}
        </button>
      )}
    </div>
  );
}
