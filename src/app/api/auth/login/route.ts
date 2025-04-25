import { NextResponse } from "next/server";
import bcrypt from "bcrypt";
import { sign } from "jsonwebtoken";
import dbConnect, { isMongoConnected } from "@/lib/db-connect";
import Agent from "@/lib/models/agent";
import ActivityLog from "@/lib/models/activityLog";
import { db } from "@/lib/db";

export async function POST(request: Request) {
  try {
    // Try to connect to MongoDB
    await dbConnect();
    
    const { phone, otp } = await request.json();
    
    // Validate input
    if (!phone || !otp) {
      return NextResponse.json(
        { error: "Phone number and OTP are required" },
        { status: 400 }
      );
    }
    
    let agent;
    let token;
    
    // Check if MongoDB is connected
    if (isMongoConnected()) {
      // Find agent by phone in MongoDB
      agent = await Agent.findOne({ phone, status: "active" });
      
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
      token = sign(
        { 
          id: agent._id,
          phone: agent.phone,
          name: agent.name
        },
        process.env.JWT_SECRET || "default_secret",
        { expiresIn: "24h" }
      );
    } else {
      // Fallback to local storage
      const localAgent = db.agents.getByPhone(phone);
      
      if (!localAgent || localAgent.status !== "active") {
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
      db.agents.updateLastLogin(phone);
      
      // Create activity log
      db.logs.create({
        action: "login",
        agentPhone: localAgent.phone,
        agentName: localAgent.name,
        _id: "",
        createdAt: "",
        updatedAt: ""
      });
      
      // Generate JWT token
      token = sign(
        { 
          id: localAgent.id,
          phone: localAgent.phone,
          name: localAgent.name
        },
        process.env.JWT_SECRET || "default_secret",
        { expiresIn: "24h" }
      );
      
      agent = {
        name: localAgent.name,
        phone: localAgent.phone,
      };
    }
    
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
    
    // Fallback to local storage if MongoDB fails
    try {
      const { phone, otp } = await request.json();
      
      // Validate input
      if (!phone || !otp) {
        return NextResponse.json(
          { error: "Phone number and OTP are required" },
          { status: 400 }
        );
      }
      
      const localAgent = db.agents.getByPhone(phone);
      
      if (!localAgent || localAgent.status !== "active") {
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
      db.agents.updateLastLogin(phone);
      
      // Create activity log
      db.logs.create({
        action: "login",
        agentPhone: localAgent.phone,
        agentName: localAgent.name,
        _id: "",
        createdAt: "",
        updatedAt: ""
      });
      
      // Generate JWT token
      const token = sign(
        { 
          id: localAgent.id,
          phone: localAgent.phone,
          name: localAgent.name
        },
        process.env.JWT_SECRET || "default_secret",
        { expiresIn: "24h" }
      );
      
      return NextResponse.json({
        success: true,
        agent: {
          name: localAgent.name,
          phone: localAgent.phone,
        },
        token
      });
    } catch (fallbackError) {
      console.error("Fallback login error:", fallbackError);
      return NextResponse.json(
        { error: "Internal server error" },
        { status: 500 }
      );
    }
  }
}
