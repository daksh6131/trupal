import { NextResponse } from "next/server";
import dbConnect, { isMongoConnected } from "@/lib/db-connect";
import Customer from "@/lib/models/customer";
import { getAgentFromToken } from "@/lib/auth-utils";
import { db } from "@/lib/db";

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
    
    let customer;
    
    // Check if MongoDB is connected
    if (isMongoConnected()) {
      // Get customer from MongoDB
      customer = await Customer.findById(params.id);
      
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
    } else {
      // Fallback to local storage
      customer = db.customers.getById(params.id);
      
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
    }
    
    return NextResponse.json({
      success: true,
      customer
    });
    
  } catch (error) {
    console.error("Get customer error:", error);
    
    // Fallback to local storage if MongoDB fails
    try {
      const agent = await getAgentFromToken(request);
      
      if (!agent) {
        return NextResponse.json(
          { error: "Unauthorized" },
          { status: 401 }
        );
      }
      
      const customer = db.customers.getById(params.id);
      
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
    } catch (fallbackError) {
      console.error("Fallback get customer error:", fallbackError);
      return NextResponse.json(
        { error: "Internal server error" },
        { status: 500 }
      );
    }
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
    let customer;
    
    // Check if MongoDB is connected
    if (isMongoConnected()) {
      // Get and update customer in MongoDB
      customer = await Customer.findById(params.id);
      
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
    } else {
      // Fallback to local storage
      customer = db.customers.getById(params.id);
      
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
      customer = db.customers.update(params.id, customerData);
      
      if (!customer) {
        return NextResponse.json(
          { error: "Failed to update customer" },
          { status: 500 }
        );
      }
    }
    
    return NextResponse.json({
      success: true,
      customer
    });
    
  } catch (error) {
    console.error("Update customer error:", error);
    
    // Fallback to local storage if MongoDB fails
    try {
      const agent = await getAgentFromToken(request);
      
      if (!agent) {
        return NextResponse.json(
          { error: "Unauthorized" },
          { status: 401 }
        );
      }
      
      const customerData = await request.json();
      
      const customer = db.customers.getById(params.id);
      
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
      const updatedCustomer = db.customers.update(params.id, customerData);
      
      if (!updatedCustomer) {
        return NextResponse.json(
          { error: "Failed to update customer" },
          { status: 500 }
        );
      }
      
      return NextResponse.json({
        success: true,
        customer: updatedCustomer
      });
    } catch (fallbackError) {
      console.error("Fallback update customer error:", fallbackError);
      return NextResponse.json(
        { error: "Internal server error" },
        { status: 500 }
      );
    }
  }
}
