import { NextResponse } from "next/server";
import { verifyOTP, isAdminPhone } from "@/lib/otp-utils";
import { sign } from "jsonwebtoken";
import { agentOperations, activityLogOperations } from "@/lib/db-utils";
import { logErrorWithContext } from "@/lib/error-logger";

export async function POST(request: Request) {
  try {
    const { phone, code, isAdmin = false } = await request.json();
    
    // Validate input
    if (!phone || !code) {
      return NextResponse.json(
        { error: "Phone number and OTP code are required" },
        { status: 400 }
      );
    }
    
    // Verify OTP
    const result = await verifyOTP(phone, code);
    
    if (!result.success) {
      return NextResponse.json(
        { error: result.message },
        { status: 400 }
      );
    }
    
    // If admin login is requested, check if phone is in whitelist
    if (isAdmin) {
      const isAdminPhoneNumber = await isAdminPhone(phone);
      
      if (!isAdminPhoneNumber) {
        return NextResponse.json(
          { error: "Unauthorized: Phone number not in admin whitelist" },
          { status: 403 }
        );
      }
      
      // Generate admin JWT token
      const token = sign(
        { 
          phone,
          role: "admin"
        },
        process.env.JWT_SECRET || "default_secret",
        { expiresIn: "24h" }
      );
      
      return NextResponse.json({
        success: true,
        message: "Admin authenticated successfully",
        token,
        admin: {
          phone,
          role: "admin"
        }
      });
    } else {
      // Regular agent login
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
    }
    
  } catch (error) {
    await logErrorWithContext(error);
    console.error("OTP verification error:", error);
    return NextResponse.json(
      { error: "Failed to verify OTP" },
      { status: 500 }
    );
  }
}
