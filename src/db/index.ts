import { drizzle } from 'drizzle-orm/postgres-js';
import { createClient } from '@supabase/supabase-js';
import postgres from 'postgres';
import * as schema from "./schema";

// Create a single supabase client for interacting with your database
export const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL || '',
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || ''
);

// For Drizzle ORM
const connectionString = process.env.DATABASE_URL || '';
const sql = postgres(connectionString, { prepare: false });
export const db = drizzle({ client: sql, schema });
