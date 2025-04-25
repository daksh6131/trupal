import { NextResponse } from "next/server";
import { getAgentFromToken } from "@/lib/auth-utils";
import { customerOperations, activityLogOperations } from "@/lib/db-utils";

export async function GET(request: Request) {
  try {
    const agent = await getAgentFromToken(request);
    
    if (!agent) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }
    
    // Get all customers for this agent
    const customers = await customerOperations.getByAgentPhone(agent.phone);
    
    return NextResponse.json({
      success: true,
      customers
    });
    
  } catch (error) {
    console.error("Get customers error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const agent = await getAgentFromToken(request);
    
    if (!agent) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }
    
    const customerData = await request.json();
    
    // Create new customer
    const customer = await customerOperations.create({
      ...customerData,
      linkedAgent: agent.phone,
      // Ensure these fields are not included in the request
      createdAt: new Date(),
      updatedAt: new Date()
    });
    
    // Create activity log
    await activityLogOperations.create({
      action: "form_submit",
      agentPhone: agent.phone,
      agentName: agent.name,
      customerId: customer.id.toString(),
      customerName: customer.name,
    });
    
    return NextResponse.json({
      success: true,
      customer
    });
    
  } catch (error) {
    console.error("Create customer error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
