'use server';

import { supabase } from "@/db";

/**
 * Ensures that all required tables exist in Supabase
 */
export async function ensureTablesExist() {
  const requiredTables = [
    'agents',
    'customers',
    'credit_cards',
    'activity_logs',
    'admin_phones',
    'admins',
    'error_logs',
    'otps'
  ];
  
  // Check which tables exist
  const { data: existingTables, error } = await supabase
    .from('pg_tables')
    .select('tablename')
    .eq('schemaname', 'public');
  
  if (error) {
    console.error('Error checking tables:', error);
    return false;
  }
  
  const existingTableNames = existingTables.map(t => t.tablename);
  const missingTables = requiredTables.filter(t => !existingTableNames.includes(t));
  
  if (missingTables.length > 0) {
    console.error('Missing required tables:', missingTables);
    return false;
  }
  
  return true;
}

/**
 * Creates basic RLS policies for tables
 */
export async function setupRLSPolicies() {
  // Enable RLS on all tables
  const tables = [
    'credit_cards',
    'activity_logs',
    'admin_phones',
    'admins',
    'error_logs',
    'otps'
  ];
  
  // Note: agents and customers tables have specific policies set in setupRowLevelSecurity()
  
  for (const table of tables) {
    try {
      // Enable RLS
      await supabase.rpc('enable_rls', { table_name: table });
      
      // Create read policy
      await supabase.rpc('create_read_policy', { 
        table_name: table,
        policy_name: `${table}_read_policy`,
        using_expression: 'auth.role() = \'authenticated\'' // Allow authenticated users to read
      });
      
      // Create insert policy
      await supabase.rpc('create_insert_policy', {
        table_name: table,
        policy_name: `${table}_insert_policy`,
        check_expression: 'auth.role() = \'authenticated\'' // Allow authenticated users to insert
      });
      
      // Create update policy
      await supabase.rpc('create_update_policy', {
        table_name: table,
        policy_name: `${table}_update_policy`,
        using_expression: 'auth.role() = \'authenticated\'', 
        check_expression: 'auth.role() = \'authenticated\''
      });
      
      // Create delete policy
      await supabase.rpc('create_delete_policy', {
        table_name: table,
        policy_name: `${table}_delete_policy`,
        using_expression: 'auth.role() = \'authenticated\''
      });
    } catch (error) {
      console.error(`Error setting up RLS policies for ${table}:`, error);
    }
  }
}

/**
 * Sets up real-time replication for tables
 */
export async function enableRealtimeForTables() {
  const tables = [
    'agents',
    'customers',
    'credit_cards',
    'activity_logs',
    'admin_phones',
    'error_logs'
  ];
  
  for (const table of tables) {
    await supabase.rpc('enable_realtime', { table_name: table });
  }
}

/**
 * Sets up Row Level Security policies for specific tables
 */
export async function setupRowLevelSecurity() {
  try {
    console.log("Setting up Row Level Security policies...");
    
    // Enable RLS on customers table
    const { error: customersRlsError } = await supabase.rpc('alter_table_enable_rls', {
      table_name: 'customers'
    });
    
    if (customersRlsError) {
      console.error("Error enabling RLS on customers table:", customersRlsError);
      return false;
    }
    
    // Create policy for customers table - agents can only see their own customers
    const { error: customersPolicyError } = await supabase.rpc('create_policy', {
      table_name: 'customers',
      name: 'agents_see_own_customers',
      definition: `auth.uid()::text IN (
        SELECT id::text FROM agents WHERE phone = linked_agent
      ) OR auth.jwt() ? 'role' AND auth.jwt()->>'role' = 'admin'`
    });
    
    if (customersPolicyError) {
      console.error("Error creating customers policy:", customersPolicyError);
      return false;
    }
    
    // Create policy for customers table - agents can only update their own customers
    const { error: customersUpdatePolicyError } = await supabase.rpc('create_policy', {
      table_name: 'customers',
      name: 'agents_update_own_customers',
      operation: 'UPDATE',
      definition: `auth.uid()::text IN (
        SELECT id::text FROM agents WHERE phone = linked_agent
      ) OR auth.jwt() ? 'role' AND auth.jwt()->>'role' = 'admin'`
    });
    
    if (customersUpdatePolicyError) {
      console.error("Error creating customers update policy:", customersUpdatePolicyError);
      return false;
    }
    
    // Enable RLS on agents table
    const { error: agentsRlsError } = await supabase.rpc('alter_table_enable_rls', {
      table_name: 'agents'
    });
    
    if (agentsRlsError) {
      console.error("Error enabling RLS on agents table:", agentsRlsError);
      return false;
    }
    
    // Create policy for agents table - agents can only see/update their own data
    const { error: agentsPolicyError } = await supabase.rpc('create_policy', {
      table_name: 'agents',
      name: 'agents_see_own_data',
      definition: `auth.uid()::text = id::text OR auth.jwt() ? 'role' AND auth.jwt()->>'role' = 'admin'`
    });
    
    if (agentsPolicyError) {
      console.error("Error creating agents policy:", agentsPolicyError);
      return false;
    }
    
    console.log("Row Level Security policies set up successfully");
    return true;
  } catch (error) {
    console.error("Error setting up Row Level Security:", error);
    return false;
  }
}

/**
 * Run all migration steps
 */
export async function runMigrations() {
  try {
    const tablesExist = await ensureTablesExist();
    if (!tablesExist) {
      console.error('Required tables are missing. Please run database migrations first.');
      return false;
    }
    
    await setupRLSPolicies();
    await enableRealtimeForTables();
    
    // Import and run the RLS policy setup
    const { applyAllRlsPolicies } = await import("./supabase-rls");
    await applyAllRlsPolicies();
    
    return true;
  } catch (error) {
    console.error('Error running migrations:', error);
    return false;
  }
}
