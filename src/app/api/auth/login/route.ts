import { NextResponse } from "next/server";
import { sign } from "jsonwebtoken";
import { agentOperations, activityLogOperations } from "@/lib/db-utils";

export async function POST(request: Request) {
  try {
    const { phone, otp } = await request.json();
    
    // Validate input
    if (!phone || !otp) {
      return NextResponse.json(
        { error: "Phone number and OTP are required" },
        { status: 400 }
      );
    }
    
    // Find agent by phone
    const agent = await agentOperations.getByPhone(phone);
    
    if (!agent || agent.status !== "active") {
      return NextResponse.json(
        { error: "Agent not found or inactive" },
        { status: 404 }
      );
    }
    
    // In a real app, we would verify OTP here
    // For demo purposes, we'll accept "123456" as valid OTP
    if (otp !== "123456") {
      return NextResponse.json(
        { error: "Invalid OTP" },
        { status: 401 }
      );
    }
    
    // Update last login
    await agentOperations.updateLastLogin(phone);
    
    // Create activity log
    await activityLogOperations.create({
      action: "login",
      agentPhone: agent.phone,
      agentName: agent.name,
    });
    
    // Generate JWT token
    const token = sign(
      { 
        id: agent.id,
        phone: agent.phone,
        name: agent.name
      },
      process.env.JWT_SECRET || "default_secret",
      { expiresIn: "24h" }
    );
    
    return NextResponse.json({
      success: true,
      agent: {
        name: agent.name,
        phone: agent.phone,
      },
      token
    });
    
  } catch (error) {
    console.error("Login error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
