import { drizzle } from 'drizzle-orm/postgres-js';
import { createClient } from '@supabase/supabase-js';
import * as schema from "./schema";
import { Database } from '@/types/supabase';

// Create a single supabase client for interacting with your database
export const supabase = createClient<Database>(
  process.env.NEXT_PUBLIC_SUPABASE_URL || '',
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '',
  {
    realtime: {
      params: {
        eventsPerSecond: 10
      }
    },
    auth: {
      persistSession: true,
      autoRefreshToken: true,
    }
  }
);

// For Drizzle ORM - Only initialize on server side
let db: ReturnType<typeof drizzle>;

// Check if we're on the server side
if (typeof window === 'undefined') {
  // Use dynamic import for postgres to avoid client-side bundling
  const initDb = async () => {
    try {
      const postgres = (await import('postgres')).default;
      
      const connectionString = process.env.DATABASE_URL || '';
      console.log("Database connection string available:", !!connectionString);
      
      // Configure postgres client with better error handling
      const sql = postgres(connectionString, { 
        prepare: false,
        debug: true, // Enable query debugging
        onnotice: notice => console.log("Database notice:", notice),
        onparameter: param => console.log("Database parameter:", param)
      });
      
      // Initialize Drizzle with our schema
      return drizzle({ client: sql, schema });
    } catch (error) {
      console.error("Database connection failed:", error);
      throw error;
    }
  };
  
  // Use an IIFE to initialize the database
  (async () => {
    try {
      db = await initDb();
      
      // Test the database connection
      console.log("Testing database connection...");
      const result = await db.execute(sql`SELECT NOW()`);
      console.log("Database connection successful:", result[0]);
    } catch (error) {
      console.error("Failed to initialize database:", error);
    }
  })();
} else {
  // Create a placeholder for client-side that throws helpful errors
  db = new Proxy({} as any, {
    get: function(target, prop) {
      if (typeof prop === 'string' && !['then', 'catch', 'finally'].includes(prop)) {
        throw new Error(
          `Database operations cannot be performed on the client side. ` +
          `Please move this operation to a server component or API route.`
        );
      }
      return undefined;
    }
  });
}

export { db };
