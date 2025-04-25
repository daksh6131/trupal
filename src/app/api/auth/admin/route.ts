import { NextResponse } from "next/server";
import { verifyOTP, isAdminPhone } from "@/lib/otp-utils";
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
    
    // Check if phone is in admin whitelist
    const adminPhoneCheck = await isAdminPhone(phone);
    
    if (!adminPhoneCheck) {
      return NextResponse.json(
        { error: "Unauthorized: Phone number not in admin whitelist" },
        { status: 403 }
      );
    }
    
    // Generate JWT token
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
      admin: {
        phone,
        role: "admin"
      },
      token
    });
    
  } catch (error) {
    await logErrorWithContext(error);
    console.error("Admin login error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
