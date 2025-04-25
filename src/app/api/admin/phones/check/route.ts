import { NextResponse } from "next/server";
import { checkAdminPhoneStatus } from "@/lib/otp-utils";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const phone = searchParams.get('phone');
    
    if (!phone) {
      return NextResponse.json(
        { error: "Phone number is required" },
        { status: 400 }
      );
    }
    
    const status = await checkAdminPhoneStatus(phone);
    
    return NextResponse.json({
      success: true,
      ...status
    });
    
  } catch (error) {
    console.error("Check admin phone error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
