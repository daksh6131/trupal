import { NextResponse } from "next/server";
import dbConnect, { isMongoConnected } from "@/lib/db-connect";
import Customer from "@/lib/models/customer";
import ActivityLog from "@/lib/models/activityLog";
import { getAgentFromToken } from "@/lib/auth-utils";
import { db } from "@/lib/db";

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
    
    let customers;
    
    // Check if MongoDB is connected
    if (isMongoConnected()) {
      // Get all customers for this agent from MongoDB
      customers = await Customer.find({ linkedAgent: agent.phone })
        .sort({ createdAt: -1 });
    } else {
      // Fallback to local storage
      customers = db.customers.getAll()
        .filter(c => c.linkedAgent === agent.phone)
        .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
    }
    
    return NextResponse.json({
      success: true,
      customers
    });
    
  } catch (error) {
    console.error("Get customers error:", error);
    
    // Fallback to local storage if MongoDB fails
    try {
      const agent = await getAgentFromToken(request);
      
      if (!agent) {
        return NextResponse.json(
          { error: "Unauthorized" },
          { status: 401 }
        );
      }
      
      const customers = db.customers.getAll()
        .filter(c => c.linkedAgent === agent.phone)
        .sort((a, b) => new Date(b.createdAt || b.timestamp).getTime() - new Date(a.createdAt || a.timestamp).getTime());
      
      return NextResponse.json({
        success: true,
        customers
      });
    } catch (fallbackError) {
      console.error("Fallback get customers error:", fallbackError);
      return NextResponse.json(
        { error: "Internal server error" },
        { status: 500 }
      );
    }
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
    let customer;
    
    // Check if MongoDB is connected
    if (isMongoConnected()) {
      // Create new customer in MongoDB
      customer = await Customer.create({
        ...customerData,
        linkedAgent: agent.phone,
      });
      
      // Create activity log in MongoDB
      await ActivityLog.create({
        action: "form_submit",
        agentPhone: agent.phone,
        agentName: agent.name,
        customerId: customer._id,
        customerName: customer.name,
      });
    } else {
      // Fallback to local storage
      customer = db.customers.create({
        ...customerData,
        linkedAgent: agent.phone,
      });
      
      // Create activity log in local storage
      db.logs.create({
        action: "form_submit",
        agentPhone: agent.phone,
        agentName: agent.name,
        customerId: customer.id,
        customerName: customer.name,
        _id: "",
        createdAt: "",
        updatedAt: ""
      });
    }
    
    return NextResponse.json({
      success: true,
      customer
    });
    
  } catch (error) {
    console.error("Create customer error:", error);
    
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
      
      // Create new customer in local storage
      const customer = db.customers.create({
        ...customerData,
        linkedAgent: agent.phone,
      });
      
      // Create activity log in local storage
      db.logs.create({
        action: "form_submit",
        agentPhone: agent.phone,
        agentName: agent.name,
        customerId: customer.id,
        customerName: customer.name,
        _id: "",
        createdAt: "",
        updatedAt: ""
      });
      
      return NextResponse.json({
        success: true,
        customer
      });
    } catch (fallbackError) {
      console.error("Fallback create customer error:", fallbackError);
      return NextResponse.json(
        { error: "Internal server error" },
        { status: 500 }
      );
    }
  }
}
