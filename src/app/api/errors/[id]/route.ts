import { NextResponse } from "next/server";
import { isAdmin } from "@/lib/auth-utils";
import { errorLogs } from "@/db/schema";
import { eq } from "drizzle-orm";
import { db } from "@/db";

// Get a specific error by ID
export async function GET(
  request: Request,
  { params }: { params: { id: string } }
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
    
    const id = parseInt(params.id);
    
    if (isNaN(id)) {
      return NextResponse.json(
        { error: "Invalid ID" },
        { status: 400 }
      );
    }
    
    const result = await db.select().from(errorLogs).where(eq(errorLogs.id, id));
    
    if (!result.length) {
      return NextResponse.json(
        { error: "Error log not found" },
        { status: 404 }
      );
    }
    
    return NextResponse.json({
      success: true,
      error: result[0]
    });
    
  } catch (error) {
    console.error("Get error log error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

// Update error status
export async function PATCH(
  request: Request,
  { params }: { params: { id: string } }
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
    
    const id = parseInt(params.id);
    
    if (isNaN(id)) {
      return NextResponse.json(
        { error: "Invalid ID" },
        { status: 400 }
      );
    }
    
    const { status, resolvedBy } = await request.json();
    
    if (!status) {
      return NextResponse.json(
        { error: "Status is required" },
        { status: 400 }
      );
    }
    
    const updateData: any = { status };
    
    // If resolving, add resolved timestamp and user
    if (status === 'resolved') {
      updateData.resolvedAt = new Date();
      if (resolvedBy) {
        updateData.resolvedBy = resolvedBy;
      }
    }
    
    const result = await db.update(errorLogs)
      .set(updateData)
      .where(eq(errorLogs.id, id))
      .returning();
    
    if (!result.length) {
      return NextResponse.json(
        { error: "Error log not found" },
        { status: 404 }
      );
    }
    
    return NextResponse.json({
      success: true,
      error: result[0]
    });
    
  } catch (error) {
    console.error("Update error log error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

// Delete an error log
export async function DELETE(
  request: Request,
  { params }: { params: { id: string } }
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
    
    const id = parseInt(params.id);
    
    if (isNaN(id)) {
      return NextResponse.json(
        { error: "Invalid ID" },
        { status: 400 }
      );
    }
    
    const result = await db.delete(errorLogs)
      .where(eq(errorLogs.id, id))
      .returning();
    
    if (!result.length) {
      return NextResponse.json(
        { error: "Error log not found" },
        { status: 404 }
      );
    }
    
    return NextResponse.json({
      success: true,
      message: "Error log deleted successfully"
    });
    
  } catch (error) {
    console.error("Delete error log error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
