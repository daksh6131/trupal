import { NextResponse } from "next/server";
import { sign } from "jsonwebtoken";
import { adminOperations } from "@/lib/db-utils";

export async function POST(request: Request) {
  try {
    const { email, password } = await request.json();
    
    // Validate input
    if (!email || !password) {
      return NextResponse.json(
        { error: "Email and password are required" },
        { status: 400 }
      );
    }
    
    // Find admin by email
    const admin = await adminOperations.getByEmail(email);
    
    if (!admin) {
      return NextResponse.json(
        { error: "Invalid credentials" },
        { status: 401 }
      );
    }
    
    // For demo purposes, we'll accept "admin123" as valid password
    // In production, use the verifyPassword method
    if (password !== "admin123" && !(await adminOperations.verifyPassword(email, password))) {
      return NextResponse.json(
        { error: "Invalid credentials" },
        { status: 401 }
      );
    }
    
    // Generate JWT token
    const token = sign(
      { 
        id: admin.id,
        email: admin.email,
        role: admin.role
      },
      process.env.JWT_SECRET || "default_secret",
      { expiresIn: "24h" }
    );
    
    return NextResponse.json({
      success: true,
      admin: {
        email: admin.email,
        role: admin.role,
      },
      token
    });
    
  } catch (error) {
    console.error("Admin login error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
