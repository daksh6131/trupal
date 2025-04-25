import { supabase } from "@/db";

/**
 * Helper function to execute SQL directly on Supabase
 * This is useful for complex RLS policy setup that's not covered by the RPC methods
 */
export async function executeSql(sql: string): Promise<boolean> {
  try {
    const { error } = await supabase.rpc('execute_sql', { sql_query: sql });
    
    if (error) {
      console.error("Error executing SQL:", error);
      return false;
    }
    
    return true;
  } catch (error) {
    console.error("Error executing SQL:", error);
    return false;
  }
}

/**
 * Sets up custom SQL functions to help with RLS policies
 */
export async function setupRlsHelperFunctions(): Promise<boolean> {
  try {
    // Create a function to check if the current user is an admin
    const createIsAdminFunction = `
      CREATE OR REPLACE FUNCTION is_admin()
      RETURNS BOOLEAN AS $$
      BEGIN
        RETURN (
          auth.jwt() ? 'role' AND 
          auth.jwt()->>'role' = 'admin'
        );
      END;
      $$ LANGUAGE plpgsql SECURITY DEFINER;
    `;
    
    // Create a function to check if the current user is the agent linked to a customer
    const createIsCustomerAgentFunction = `
      CREATE OR REPLACE FUNCTION is_customer_agent(customer_record customers)
      RETURNS BOOLEAN AS $$
      BEGIN
        RETURN (
          EXISTS (
            SELECT 1 FROM agents 
            WHERE phone = customer_record.linked_agent 
            AND auth.uid()::text = id::text
          )
        );
      END;
      $$ LANGUAGE plpgsql SECURITY DEFINER;
    `;
    
    // Create a function to check if the current user is the agent record being accessed
    const createIsOwnAgentRecordFunction = `
      CREATE OR REPLACE FUNCTION is_own_agent_record(agent_record agents)
      RETURNS BOOLEAN AS $$
      BEGIN
        RETURN (
          auth.uid()::text = agent_record.id::text
        );
      END;
      $$ LANGUAGE plpgsql SECURITY DEFINER;
    `;
    
    // Execute the SQL to create these functions
    await executeSql(createIsAdminFunction);
    await executeSql(createIsCustomerAgentFunction);
    await executeSql(createIsOwnAgentRecordFunction);
    
    return true;
  } catch (error) {
    console.error("Error setting up RLS helper functions:", error);
    return false;
  }
}

/**
 * Creates SQL RLS policies for the customers table
 */
export async function createCustomersRlsPolicies(): Promise<boolean> {
  try {
    // Enable RLS on the customers table
    await executeSql("ALTER TABLE customers ENABLE ROW LEVEL SECURITY;");
    
    // Policy for SELECT - agents can only see their own customers, admins can see all
    const selectPolicy = `
      CREATE POLICY customers_select_policy ON customers
      FOR SELECT USING (
        is_customer_agent(customers.*) OR is_admin()
      );
    `;
    
    // Policy for INSERT - agents can only insert customers linked to themselves, admins can insert any
    const insertPolicy = `
      CREATE POLICY customers_insert_policy ON customers
      FOR INSERT WITH CHECK (
        (auth.uid()::text IN (SELECT id::text FROM agents WHERE phone = linked_agent)) OR is_admin()
      );
    `;
    
    // Policy for UPDATE - agents can only update their own customers, admins can update any
    const updatePolicy = `
      CREATE POLICY customers_update_policy ON customers
      FOR UPDATE USING (
        is_customer_agent(customers.*) OR is_admin()
      );
    `;
    
    // Policy for DELETE - only admins can delete customers
    const deletePolicy = `
      CREATE POLICY customers_delete_policy ON customers
      FOR DELETE USING (
        is_admin()
      );
    `;
    
    // Execute the SQL to create these policies
    await executeSql(selectPolicy);
    await executeSql(insertPolicy);
    await executeSql(updatePolicy);
    await executeSql(deletePolicy);
    
    return true;
  } catch (error) {
    console.error("Error creating customers RLS policies:", error);
    return false;
  }
}

/**
 * Creates SQL RLS policies for the agents table
 */
export async function createAgentsRlsPolicies(): Promise<boolean> {
  try {
    // Enable RLS on the agents table
    await executeSql("ALTER TABLE agents ENABLE ROW LEVEL SECURITY;");
    
    // Policy for SELECT - agents can see their own record, admins can see all
    const selectPolicy = `
      CREATE POLICY agents_select_policy ON agents
      FOR SELECT USING (
        is_own_agent_record(agents.*) OR is_admin()
      );
    `;
    
    // Policy for UPDATE - agents can update their own record, admins can update any
    const updatePolicy = `
      CREATE POLICY agents_update_policy ON agents
      FOR UPDATE USING (
        is_own_agent_record(agents.*) OR is_admin()
      );
    `;
    
    // Policy for INSERT/DELETE - only admins can insert/delete agents
    const insertPolicy = `
      CREATE POLICY agents_insert_policy ON agents
      FOR INSERT WITH CHECK (
        is_admin()
      );
    `;
    
    const deletePolicy = `
      CREATE POLICY agents_delete_policy ON agents
      FOR DELETE USING (
        is_admin()
      );
    `;
    
    // Execute the SQL to create these policies
    await executeSql(selectPolicy);
    await executeSql(updatePolicy);
    await executeSql(insertPolicy);
    await executeSql(deletePolicy);
    
    return true;
  } catch (error) {
    console.error("Error creating agents RLS policies:", error);
    return false;
  }
}

/**
 * Apply all RLS policies
 */
export async function applyAllRlsPolicies(): Promise<boolean> {
  try {
    // Setup helper functions first
    const helperFunctionsSetup = await setupRlsHelperFunctions();
    if (!helperFunctionsSetup) {
      return false;
    }
    
    // Apply table-specific policies
    const customersRlsSetup = await createCustomersRlsPolicies();
    const agentsRlsSetup = await createAgentsRlsPolicies();
    
    return customersRlsSetup && agentsRlsSetup;
  } catch (error) {
    console.error("Error applying RLS policies:", error);
    return false;
  }
}
