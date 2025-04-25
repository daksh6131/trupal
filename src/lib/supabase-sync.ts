'use client';

import { supabase } from "@/db";
import { toast } from "react-hot-toast";

// Maximum number of retry attempts for failed operations
const MAX_RETRIES = 3;

// Delay between retry attempts (in milliseconds)
const RETRY_DELAY = 1000;

// Generic type for data objects
type DataObject = Record<string, any>;

/**
 * Retry a function with exponential backoff
 */
export async function retryOperation<T>(
  operation: () => Promise<T>,
  maxRetries: number = MAX_RETRIES,
  delay: number = RETRY_DELAY
): Promise<T> {
  let lastError: Error | null = null;
  
  for (let attempt = 0; attempt < maxRetries; attempt++) {
    try {
      return await operation();
    } catch (error) {
      lastError = error instanceof Error ? error : new Error(String(error));
      console.error(`Operation failed (attempt ${attempt + 1}/${maxRetries}):`, error);
      
      // Wait longer between each retry attempt
      await new Promise(resolve => setTimeout(resolve, delay * Math.pow(2, attempt)));
    }
  }
  
  throw lastError || new Error('Operation failed after maximum retry attempts');
}

/**
 * Save data to Supabase with retry mechanism
 */
export async function saveToSupabase<T extends DataObject>(
  tableName: string,
  data: T,
  options: { upsert?: boolean; idField?: string } = {}
): Promise<T> {
  const { upsert = true, idField = 'id' } = options;
  
  return retryOperation(async () => {
    let query;
    
    if (upsert) {
      query = supabase.from(tableName).upsert(data);
    } else {
      query = supabase.from(tableName).insert(data);
    }
    
    const { data: result, error } = await query.select();
    
    if (error) {
      console.error(`Error saving to ${tableName}:`, error);
      throw error;
    }
    
    return result?.[0] as T;
  });
}

/**
 * Update data in Supabase with retry mechanism
 */
export async function updateInSupabase<T extends DataObject>(
  tableName: string,
  id: number | string,
  data: Partial<T>,
  idField: string = 'id'
): Promise<T> {
  return retryOperation(async () => {
    const { data: result, error } = await supabase
      .from(tableName)
      .update(data)
      .eq(idField, id)
      .select();
    
    if (error) {
      console.error(`Error updating ${tableName}:`, error);
      throw error;
    }
    
    return result?.[0] as T;
  });
}

/**
 * Delete data from Supabase with retry mechanism
 */
export async function deleteFromSupabase(
  tableName: string,
  id: number | string,
  idField: string = 'id'
): Promise<void> {
  return retryOperation(async () => {
    const { error } = await supabase
      .from(tableName)
      .delete()
      .eq(idField, id);
    
    if (error) {
      console.error(`Error deleting from ${tableName}:`, error);
      throw error;
    }
  });
}

/**
 * Fetch data from Supabase with retry mechanism
 */
export async function fetchFromSupabase<T extends DataObject>(
  tableName: string,
  options: {
    column?: string;
    value?: any;
    limit?: number;
    orderBy?: { column: string; ascending?: boolean };
  } = {}
): Promise<T[]> {
  const { column, value, limit, orderBy } = options;
  
  return retryOperation(async () => {
    let query = supabase.from(tableName).select('*');
    
    if (column && value !== undefined) {
      query = query.eq(column, value);
    }
    
    if (orderBy) {
      query = query.order(orderBy.column, { ascending: orderBy.ascending ?? true });
    }
    
    if (limit) {
      query = query.limit(limit);
    }
    
    const { data, error } = await query;
    
    if (error) {
      console.error(`Error fetching from ${tableName}:`, error);
      throw error;
    }
    
    return data as T[];
  });
}

/**
 * Subscribe to real-time changes on a table
 */
export function subscribeToTable(
  tableName: string,
  callback: (payload: any) => void,
  options: { event?: 'INSERT' | 'UPDATE' | 'DELETE' | '*'; filter?: string } = {}
) {
  const { event = '*', filter } = options;
  
  let channel = supabase.channel(`table-changes:${tableName}`)
    .on('postgres_changes' as any, { 
      event, 
      schema: 'public', 
      table: tableName,
      ...(filter ? { filter } : {})
    }, callback)
    .subscribe((status) => {
      if (status !== 'SUBSCRIBED') {
        console.error(`Failed to subscribe to ${tableName} changes:`, status);
      }
    });
  
  // Return unsubscribe function
  return () => {
    supabase.removeChannel(channel);
  };
}

/**
 * Batch save multiple items to Supabase with retry mechanism
 */
export async function batchSaveToSupabase<T extends DataObject>(
  tableName: string,
  items: T[],
  options: { upsert?: boolean; chunkSize?: number } = {}
): Promise<T[]> {
  const { upsert = true, chunkSize = 100 } = options;
  
  if (items.length === 0) {
    return [];
  }
  
  // Process in chunks to avoid request size limitations
  const chunks: T[][] = [];
  for (let i = 0; i < items.length; i += chunkSize) {
    chunks.push(items.slice(i, i + chunkSize));
  }
  
  const results: T[] = [];
  
  for (const chunk of chunks) {
    await retryOperation(async () => {
      let query;
      
      if (upsert) {
        query = supabase.from(tableName).upsert(chunk);
      } else {
        query = supabase.from(tableName).insert(chunk);
      }
      
      const { data, error } = await query.select();
      
      if (error) {
        console.error(`Error batch saving to ${tableName}:`, error);
        throw error;
      }
      
      if (data) {
        results.push(...data as T[]);
      }
    });
  }
  
  return results;
}

/**
 * Handle offline data synchronization
 * Stores operations in localStorage when offline and syncs when back online
 */
export class OfflineSyncManager {
  private storageKey: string;
  pendingOperations: Array<{
    table: string;
    operation: 'insert' | 'update' | 'delete';
    data: any;
    id?: number | string;
  }>;
  private isOnline: boolean;
  private syncInterval: NodeJS.Timeout | null = null;
  
  constructor(appName: string = 'cardsales') {
    this.storageKey = `${appName}_pending_operations`;
    this.isOnline = typeof navigator !== 'undefined' ? navigator.onLine : true;
    this.pendingOperations = this.loadPendingOperations();
    
    if (typeof window !== 'undefined') {
      window.addEventListener('online', this.handleOnline);
      window.addEventListener('offline', this.handleOffline);
    }
    
    // Start sync interval if there are pending operations
    if (this.pendingOperations.length > 0 && this.isOnline) {
      this.startSyncInterval();
    }
  }
  
  loadPendingOperations() {
    if (typeof localStorage === 'undefined') {
      return [];
    }
    
    const stored = localStorage.getItem(this.storageKey);
    return stored ? JSON.parse(stored) : [];
  }
  
  savePendingOperations() {
    if (typeof localStorage !== 'undefined') {
      localStorage.setItem(this.storageKey, JSON.stringify(this.pendingOperations));
    }
  }
  
  handleOnline = () => {
    this.isOnline = true;
    if (this.pendingOperations.length > 0) {
      toast.success('Back online. Syncing data...');
      this.startSyncInterval();
    }
  };
  
  handleOffline = () => {
    this.isOnline = false;
    toast.error('You are offline. Changes will be saved when you reconnect.');
    if (this.syncInterval) {
      clearInterval(this.syncInterval);
      this.syncInterval = null;
    }
  };
  
  startSyncInterval() {
    if (this.syncInterval) {
      clearInterval(this.syncInterval);
    }
    
    this.syncInterval = setInterval(() => {
      this.syncPendingOperations();
    }, 5000); // Try to sync every 5 seconds
    
    // Also try to sync immediately
    this.syncPendingOperations();
  }
  
  private async syncPendingOperations() {
    if (!this.isOnline || this.pendingOperations.length === 0) {
      return;
    }
    
    const operationsToSync = [...this.pendingOperations];
    const successfulOperations: number[] = [];
    
    for (let i = 0; i < operationsToSync.length; i++) {
      const op = operationsToSync[i];
      
      try {
        switch (op.operation) {
          case 'insert':
            await saveToSupabase(op.table, op.data);
            break;
          case 'update':
            if (op.id) {
              await updateInSupabase(op.table, op.id, op.data);
            }
            break;
          case 'delete':
            if (op.id) {
              await deleteFromSupabase(op.table, op.id);
            }
            break;
        }
        
        successfulOperations.push(i);
      } catch (error) {
        console.error(`Failed to sync operation:`, op, error);
        // Continue with other operations
      }
    }
    
    // Remove successful operations from the pending list
    if (successfulOperations.length > 0) {
      this.pendingOperations = this.pendingOperations.filter(
        (_, index) => !successfulOperations.includes(index)
      );
      this.savePendingOperations();
      
      if (this.pendingOperations.length === 0) {
        toast.success('All data synchronized successfully');
        if (this.syncInterval) {
          clearInterval(this.syncInterval);
          this.syncInterval = null;
        }
      }
    }
  }
  
  queueOperation(
    table: string,
    operation: 'insert' | 'update' | 'delete',
    data: any,
    id?: number | string
  ) {
    this.pendingOperations.push({ table, operation, data, id });
    this.savePendingOperations();
    
    if (this.isOnline && !this.syncInterval) {
      this.startSyncInterval();
    } else if (!this.isOnline) {
      toast.error('You are offline. Changes will be saved when you reconnect.');
    }
  }
  
  public async performOperation(
    table: string,
    operation: 'insert' | 'update' | 'delete',
    data: any,
    id?: number | string
  ) {
    if (!this.isOnline) {
      this.queueOperation(table, operation, data, id);
      return null;
    }
    
    try {
      let result;
      
      switch (operation) {
        case 'insert':
          result = await saveToSupabase(table, data);
          break;
        case 'update':
          if (id) {
            result = await updateInSupabase(table, id, data);
          }
          break;
        case 'delete':
          if (id) {
            await deleteFromSupabase(table, id);
            result = { id };
          }
          break;
      }
      
      return result;
    } catch (error) {
      console.error(`Operation failed, queueing for later:`, { table, operation, data, id });
      this.queueOperation(table, operation, data, id);
      return null;
    }
  }
  
  cleanup() {
    if (typeof window !== 'undefined') {
      window.removeEventListener('online', this.handleOnline);
      window.removeEventListener('offline', this.handleOffline);
    }
    
    if (this.syncInterval) {
      clearInterval(this.syncInterval);
      this.syncInterval = null;
    }
  }
  
  getPendingOperationsCount() {
    return this.pendingOperations.length;
  }
}

// Create a singleton instance of the offline sync manager
let offlineSyncManagerInstance: OfflineSyncManager | null = null;

export function getOfflineSyncManager() {
  if (typeof window === 'undefined') {
    return null;
  }
  
  if (!offlineSyncManagerInstance) {
    offlineSyncManagerInstance = new OfflineSyncManager();
  }
  
  return offlineSyncManagerInstance;
}
