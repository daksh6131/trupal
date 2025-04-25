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
    
    // Get customer by ID - RLS will ensure only authorized agents can access this customer
    const customer = await customerOperations.getById(parseInt(params.id));
    
    if (!customer) {
      return NextResponse.json(
        { error: "Customer not found" },
        { status: 404 }
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
    
    // Update customer - RLS will ensure only authorized agents can update this customer
    const customer = await customerOperations.update(parseInt(params.id), customerData);
    
    if (!customer) {
      return NextResponse.json(
        { error: "Customer not found or you don't have permission to update this customer" },
        { status: 404 }
      );
    }
    
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
