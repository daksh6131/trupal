import { NextResponse } from "next/server";
import dbConnect from "@/lib/db-connect";
import Customer from "@/lib/models/customer";
import { getAgentFromToken } from "@/lib/auth-utils";

export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    await dbConnect();
    
    const agent = await getAgentFromToken(request);
    
    if (!agent) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }
    
    const customer = await Customer.findById(params.id);
    
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
    await dbConnect();
    
    const agent = await getAgentFromToken(request);
    
    if (!agent) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }
    
    const customerData = await request.json();
    
    const customer = await Customer.findById(params.id);
    
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
    
    // Update customer
    Object.assign(customer, customerData);
    await customer.save();
    
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
