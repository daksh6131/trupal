import { NextResponse } from "next/server";
import { createOTP } from "@/lib/otp-utils";
import { logErrorWithContext } from "@/lib/error-logger";

export async function POST(request: Request) {
  try {
    const { phone } = await request.json();
    
    // Validate input
    if (!phone || typeof phone !== 'string') {
      return NextResponse.json(
        { error: "Phone number is required" },
        { status: 400 }
      );
    }
    
    // Generate OTP
    const result = await createOTP(phone);
    
    if (!result.success) {
      return NextResponse.json(
        { error: result.message },
        { status: 400 }
      );
    }
    
    // In production, you would send the OTP via SMS here
    // For development/demo, we'll return it in the response
    console.log(`Demo OTP for ${phone}: ${result.otp}`);
    
    return NextResponse.json({
      success: true,
      message: "OTP sent successfully",
      otp: result.otp // For demo purposes
    });
    
  } catch (error) {
    await logErrorWithContext(error);
    console.error("OTP generation error:", error);
    return NextResponse.json(
      { error: "Failed to generate OTP" },
      { status: 500 }
    );
  }
}
