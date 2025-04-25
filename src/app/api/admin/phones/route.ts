import { NextResponse } from "next/server";
import { isAdmin } from "@/lib/auth-utils";
import { getAdminPhones, addAdminPhone, removeAdminPhone } from "@/lib/otp-utils";
import { logErrorWithContext } from "@/lib/error-logger";

// Get all admin phones
export async function GET(request: Request) {
  try {
    // Check if admin
    const isAdminUser = await isAdmin(request);
    
    if (!isAdminUser) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }
    
    const phones = await getAdminPhones();
    
    return NextResponse.json({
      success: true,
      phones
    });
    
  } catch (error) {
    await logErrorWithContext(error);
    console.error("Get admin phones error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

// Add a new admin phone
export async function POST(request: Request) {
  try {
    // Check if admin
    const isAdminUser = await isAdmin(request);
    
    if (!isAdminUser) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }
    
    const { phone } = await request.json();
    
    if (!phone) {
      return NextResponse.json(
        { error: "Phone number is required" },
        { status: 400 }
      );
    }
    
    // Get admin info from token
    const authHeader = request.headers.get("authorization");
    const token = authHeader?.split(" ")[1];
    let addedBy = "admin";
    
    if (token) {
      try {
        const decoded = JSON.parse(atob(token.split('.')[1]));
        if (decoded.phone) {
          addedBy = decoded.phone;
        }
      } catch (e) {
        console.error("Error decoding token:", e);
      }
    }
    
    const result = await addAdminPhone(phone, addedBy);
    
    if (!result.success) {
      return NextResponse.json(
        { error: result.message },
        { status: 400 }
      );
    }
    
    return NextResponse.json({
      success: true,
      message: result.message
    });
    
  } catch (error) {
    await logErrorWithContext(error);
    console.error("Add admin phone error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
