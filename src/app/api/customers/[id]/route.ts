import { NextResponse } from "next/server";
import { getAgentFromToken } from "@/lib/auth-utils";
import { customerOperations } from "@/lib/db-utils";

export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const agent = await getAgentFromToken(request);
    
    if (!agent) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }
    
    // Get customer by ID
    const customer = await customerOperations.getById(parseInt(params.id));
    
    if (!customer) {
      return NextResponse.json(
        { error: "Customer not found" },
        { status: 404 }
      );
    }
    
    // Check if customer belongs to this agent
    if (customer.linkedAgent !== agent.phone) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 403 }
      );
    }
    
    return NextResponse.json({
      success: true,
      customer
    });
    
  } catch (error) {
    console.error("Get customer error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

export async function PUT(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const agent = await getAgentFromToken(request);
    
    if (!agent) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }
    
    const customerData = await request.json();
    
    // Get customer by ID
    const existingCustomer = await customerOperations.getById(parseInt(params.id));
    
    if (!existingCustomer) {
      return NextResponse.json(
        { error: "Customer not found" },
        { status: 404 }
      );
    }
    
    // Check if customer belongs to this agent
    if (existingCustomer.linkedAgent !== agent.phone) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 403 }
      );
    }
    
    // Update customer
    const customer = await customerOperations.update(parseInt(params.id), customerData);
    
    return NextResponse.json({
      success: true,
      customer
    });
    
  } catch (error) {
    console.error("Update customer error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
