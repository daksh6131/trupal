import { NextResponse } from "next/server";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import dbConnect from "@/lib/db-connect";
import Agent from "@/lib/models/agent";
import ActivityLog from "@/lib/models/activityLog";

export async function POST(request: Request) {
  try {
    await dbConnect();
    
    const { phone, otp } = await request.json();
    
    // Validate input
    if (!phone || !otp) {
      return NextResponse.json(
        { error: "Phone number and OTP are required" },
        { status: 400 }
      );
    }
    
    // Find agent by phone
    const agent = await Agent.findOne({ phone, status: "active" });
    
    if (!agent) {
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
    agent.lastLogin = new Date();
    await agent.save();
    
    // Create activity log
    await ActivityLog.create({
      action: "login",
      agentPhone: agent.phone,
      agentName: agent.name,
    });
    
    // Generate JWT token
    const token = jwt.sign(
      { 
        id: agent._id,
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
