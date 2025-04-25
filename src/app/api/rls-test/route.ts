import { NextResponse } from "next/server";
import { supabase } from "@/db";
import { getAgentFromToken, isAdmin } from "@/lib/auth-utils";

/**
 * API endpoint to test RLS policies
 */
export async function GET(request: Request) {
  try {
    // Check if user is authenticated
    const agent = await getAgentFromToken(request);
    const adminUser = await isAdmin(request);
    
    if (!agent && !adminUser) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }
    
    // Get the current user's role
    const role = adminUser ? "admin" : "agent";
    
    // Test querying the customers table
    const { data: customers, error: customersError } = await supabase
      .from('customers')
      .select('*')
      .limit(10);
    
    // Test querying the agents table
    const { data: agents, error: agentsError } = await supabase
      .from('agents')
      .select('*')
      .limit(10);
    
    return NextResponse.json({
      success: true,
      role,
      tests: {
        customers: {
          success: !customersError,
          error: customersError?.message,
          count: customers?.length || 0,
          data: customers
        },
        agents: {
          success: !agentsError,
          error: agentsError?.message,
          count: agents?.length || 0,
          data: agents
        }
      }
    });
    
  } catch (error) {
    console.error("RLS test error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
