import { NextResponse } from "next/server";
import { verifyOTP } from "@/lib/otp-utils";
import { agentOperations, activityLogOperations } from "@/lib/db-utils";
import { sign } from "jsonwebtoken";
import { logErrorWithContext } from "@/lib/error-logger";

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
    
    // Verify OTP
    const otpResult = await verifyOTP(phone, otp);
    
    if (!otpResult.success) {
      return NextResponse.json(
        { error: otpResult.message },
        { status: 401 }
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
    await logErrorWithContext(error);
    console.error("Login error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
