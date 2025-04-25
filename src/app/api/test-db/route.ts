import { NextResponse } from "next/server";
import { db } from "@/db";
import { customers } from "@/db/schema";

export async function GET() {
  try {
    console.log("Testing database connection from API route");
    
    // Try to query the customers table
    const result = await db.select({ count: db.fn.count() }).from(customers);
    
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
