import { NextResponse } from "next/server";
import { seedDatabase } from "@/lib/db-utils";
import { runMigrations } from "@/lib/supabase-migration";

export async function GET() {
  try {
    // Seed the database
    await seedDatabase();
    
    // Run Supabase migrations
    await runMigrations();
    
    return NextResponse.json({
      success: true,
      message: "Database seeded successfully"
    });
  } catch (error) {
    console.error("Error seeding database:", error);
    return NextResponse.json(
      { error: "Failed to seed database" },
      { status: 500 }
    );
  }
}
