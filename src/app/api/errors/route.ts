import { NextResponse } from "next/server";
import { errorLogOperations } from "@/lib/error-logger";
import { isAdmin } from "@/lib/auth-utils";
import { eq, desc, and } from "drizzle-orm";
import { errorLogs } from "@/db/schema";
import { db } from "@/db";

// Get all errors (admin only)
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
    
    // Get query parameters
    const { searchParams } = new URL(request.url);
    const status = searchParams.get('status');
    const severity = searchParams.get('severity');
    const limit = searchParams.get('limit');
    
    let query = db.select().from(errorLogs);
    
    // Build the query with filters
    let queryBuilder = db.select().from(errorLogs);
    
    // Build filters
    const filters = [];
    
    if (status) {
      filters.push(eq(errorLogs.status, status as "new" | "investigating" | "resolved" | "ignored"));
    }
    
    if (severity) {
      filters.push(eq(errorLogs.severity, severity as "low" | "medium" | "high" | "critical"));
    }
    
    // Apply all filters at once if any exist
    if (filters.length > 0) {
      queryBuilder = queryBuilder.where(filters.length === 1 ? filters[0] : and(...filters));
    }
    
    // Apply limit
    if (limit) {
      queryBuilder = queryBuilder.limit(parseInt(limit));
    }
    
    // Order by most recent first
    queryBuilder = queryBuilder.orderBy(desc(errorLogs.createdAt));
    
    // Execute the query
    const errors = await queryBuilder;
    
    
    return NextResponse.json({
      success: true,
      errors
    });
    
  } catch (error) {
    console.error("Get errors error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

// Log a new error
export async function POST(request: Request) {
  try {
    const errorData = await request.json();
    
    // Add timestamp if not provided
    if (!errorData.createdAt) {
      errorData.createdAt = new Date();
    }
    
    // Insert into database
    const result = await db.insert(errorLogs).values(errorData).returning();
    
    return NextResponse.json({
      success: true,
      error: result[0]
    });
    
  } catch (error) {
    console.error("Log error error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
