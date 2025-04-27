'use server';

import { supabase, db } from "@/db";
import { errorLogs, NewErrorLog } from "@/db/schema";
import { eq, desc } from "drizzle-orm";

interface ErrorLogOptions {
  message: string;
  stack?: string;
  type?: string;
  url?: string;
  userAgent?: string;
  userId?: string;
  userRole?: string;
  metadata?: Record<string, any>;
  severity?: 'low' | 'medium' | 'high' | 'critical';
}

export async function logError(options: ErrorLogOptions): Promise<void> {
  try {
    const {
      message,
      stack,
      type,
      url,
      userAgent,
      userId,
      userRole,
      metadata,
      severity = 'medium'
    } = options;

    const errorData: NewErrorLog = {
      message,
      stack,
      type,
      url,
      userAgent,
      userId,
      userRole,
      metadata,
      severity,
      status: 'new',
      createdAt: new Date()
    };

    // Log to database
    await db.insert(errorLogs).values(errorData);

    // Also log to console for development
    console.error('[ERROR LOGGED]', message, {
      type,
      url,
      userId,
      severity
    });
  } catch (loggingError) {
    // Fallback to console if database logging fails
    console.error('[ERROR LOGGER FAILED]', loggingError);
    console.error('Original error:', options.message);
  }
}

export async function formatErrorForLogging(error: Error | unknown): Promise<ErrorLogOptions> {
  if (error instanceof Error) {
    return {
      message: error.message,
      stack: error.stack,
      type: error.name,
    };
  } else if (typeof error === 'string') {
    return {
      message: error,
      type: 'String',
    };
  } else {
    return {
      message: 'Unknown error',
      type: 'Unknown',
      metadata: error ? { error } : undefined,
    };
  }
}

export async function getBrowserInfo(): Promise<{
  userAgent: string;
  url: string;
}> {
  const isBrowser = typeof window !== 'undefined';
  
  return {
    userAgent: isBrowser ? navigator.userAgent : 'Server',
    url: isBrowser ? window.location.href : '',
  };
}

export async function getUserContext(): Promise<{
  userId?: string;
  userRole?: string;
}> {
  const isBrowser = typeof window !== 'undefined';
  
  if (!isBrowser) {
    return {};
  }
  
  try {
    // Get user info from localStorage
    const agent = localStorage.getItem('salesAgent');
    const admin = localStorage.getItem('adminUser');
    
    if (admin) {
      const adminData = JSON.parse(admin);
      return {
        userId: adminData.email,
        userRole: 'admin',
      };
    }
    
    if (agent) {
      const agentData = JSON.parse(agent);
      return {
        userId: agentData.phone,
        userRole: 'agent',
      };
    }
  } catch (error) {
    console.error('Error getting user context:', error);
  }
  
  return {};
}

export async function logErrorWithContext(error: Error | unknown): Promise<void> {
  try {
    const errorInfo = await formatErrorForLogging(error);
    const browserInfo = await getBrowserInfo();
    const userContext = await getUserContext();
    
    await logError({
      ...errorInfo,
      ...browserInfo,
      ...userContext,
    });
  } catch (error) {
    console.error('Failed to log error with context:', error);
  }
}

// Error log operations for admin dashboard
export const errorLogOperations = {
  getAll: async () => {
    return await db.select().from(errorLogs).orderBy(errorLogs.createdAt);
  },
  
  getById: async (id: number) => {
    const results = await db.select().from(errorLogs).where(eq(errorLogs.id, id));
    return results.length > 0 ? results[0] : null;
  },
  
  updateStatus: async (id: number, status: 'new' | 'investigating' | 'resolved' | 'ignored', resolvedBy?: string) => {
    const updateData: Partial<NewErrorLog> = { status };
    
    if (status === 'resolved') {
      updateData.resolvedAt = new Date();
      if (resolvedBy) {
        updateData.resolvedBy = resolvedBy;
      }
    }
    
    const results = await db.update(errorLogs)
      .set(updateData)
      .where(eq(errorLogs.id, id))
      .returning();
      
    return results[0];
  },
  
  getBySeverity: async (severity: 'low' | 'medium' | 'high' | 'critical') => {
    return await db.select().from(errorLogs).where(eq(errorLogs.severity, severity));
  },
  
  getByStatus: async (status: 'new' | 'investigating' | 'resolved' | 'ignored') => {
    return await db.select().from(errorLogs).where(eq(errorLogs.status, status));
  },
  
  getRecent: async (limit = 10) => {
    return await db.select().from(errorLogs).orderBy(desc(errorLogs.createdAt)).limit(limit);
  }
};
