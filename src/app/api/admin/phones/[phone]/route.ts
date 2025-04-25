import { NextResponse } from "next/server";
import { isAdmin } from "@/lib/auth-utils";
import { removeAdminPhone } from "@/lib/otp-utils";
import { logErrorWithContext } from "@/lib/error-logger";

// Delete an admin phone
export async function DELETE(
  request: Request,
  { params }: { params: { phone: string } }
) {
  try {
    // Check if admin
    const isAdminUser = await isAdmin(request);
    
    if (!isAdminUser) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }
    
    const phone = params.phone;
    
    const result = await removeAdminPhone(phone);
    
    if (!result.success) {
      return NextResponse.json(
        { error: result.message },
        { status: 404 }
      );
    }
    
    return NextResponse.json({
      success: true,
      message: result.message
    });
    
  } catch (error) {
    await logErrorWithContext(error);
    console.error("Delete admin phone error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
