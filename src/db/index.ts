import { drizzle } from 'drizzle-orm/postgres-js';
import { createClient } from '@supabase/supabase-js';
import postgres from 'postgres';
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

// For Drizzle ORM
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
export const db = drizzle({ client: sql, schema });

// Test the database connection
const testConnection = async () => {
  try {
    console.log("Testing database connection...");
    // Simple query to test connection
    const result = await sql`SELECT NOW()`;
    console.log("Database connection successful:", result[0]);
    return true;
  } catch (error) {
    console.error("Database connection failed:", error);
    return false;
  }
};

// Run the test connection when this module is imported
testConnection().catch(console.error);
