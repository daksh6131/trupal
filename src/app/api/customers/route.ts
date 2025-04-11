import { NextResponse } from "next/server";
import dbConnect from "@/lib/db-connect";
import Customer from "@/lib/models/customer";
import ActivityLog from "@/lib/models/activityLog";
import { getAgentFromToken } from "@/lib/auth-utils";

export async function GET(request: Request) {
  try {
    await dbConnect();
    
    const agent = await getAgentFromToken(request);
    
    if (!agent) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }
    
    // Get all customers for this agent
    const customers = await Customer.find({ linkedAgent: agent.phone })
      .sort({ createdAt: -1 });
    
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
    await dbConnect();
    
    const agent = await getAgentFromToken(request);
    
    if (!agent) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }
    
    const customerData = await request.json();
    
    // Create new customer
    const customer = await Customer.create({
      ...customerData,
      linkedAgent: agent.phone,
    });
    
    // Create activity log
    await ActivityLog.create({
      action: "form_submit",
      agentPhone: agent.phone,
      agentName: agent.name,
      customerId: customer._id,
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
