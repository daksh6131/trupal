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
 * Creates RLS policies for tables
 */
export async function setupRLSPolicies() {
  // Enable RLS on all tables
  const tables = [
    'agents',
    'customers',
    'credit_cards',
    'activity_logs',
    'admin_phones',
    'admins',
    'error_logs',
    'otps'
  ];
  
  for (const table of tables) {
    // Enable RLS
    await supabase.rpc('enable_rls', { table_name: table });
    
    // Create read policy
    await supabase.rpc('create_read_policy', { 
      table_name: table,
      policy_name: `${table}_read_policy`,
      using_expression: 'true' // Allow all authenticated users to read
    });
    
    // Create insert policy
    await supabase.rpc('create_insert_policy', {
      table_name: table,
      policy_name: `${table}_insert_policy`,
      check_expression: 'true' // Allow all authenticated users to insert
    });
    
    // Create update policy
    await supabase.rpc('create_update_policy', {
      table_name: table,
      policy_name: `${table}_update_policy`,
      using_expression: 'true', // Allow all authenticated users to update
      check_expression: 'true'
    });
    
    // Create delete policy
    await supabase.rpc('create_delete_policy', {
      table_name: table,
      policy_name: `${table}_delete_policy`,
      using_expression: 'true' // Allow all authenticated users to delete
    });
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
    
    return true;
  } catch (error) {
    console.error('Error running migrations:', error);
    return false;
  }
}
