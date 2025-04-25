import { NextResponse } from "next/server";
import { db } from "@/db";
import { customers } from "@/db/schema";
import { sql } from "drizzle-orm/postgres-js";

export async function GET() {
  try {
    console.log("Testing database connection from API route");
    
    // Try to query the customers table
    const result = await db.select({ count: sql`count(*)`.mapWith(Number) }).from(customers);
    
    return NextResponse.json({
      success: true,
      message: "Database connection successful",
      customerCount: result[0]?.count || 0
    });
  } catch (error) {
    console.error("Database test failed:", error);
    return NextResponse.json(
      { 
        error: "Database connection failed", 
        details: error instanceof Error ? error.message : String(error)
      },
      { status: 500 }
    );
  }
}
