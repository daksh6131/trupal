import { NextResponse } from "next/server";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import dbConnect from "@/lib/db-connect";
import Admin from "@/lib/models/admin";

export async function POST(request: Request) {
  try {
    await dbConnect();
    
    const { email, password } = await request.json();
    
    // Validate input
    if (!email || !password) {
      return NextResponse.json(
        { error: "Email and password are required" },
        { status: 400 }
      );
    }
    
    // Find admin by email
    const admin = await Admin.findOne({ email });
    
    if (!admin) {
      return NextResponse.json(
        { error: "Invalid credentials" },
        { status: 401 }
      );
    }
    
    // For demo purposes, we'll accept "admin123" as valid password
    // In production, use bcrypt.compare(password, admin.password)
    if (password !== "admin123") {
      return NextResponse.json(
        { error: "Invalid credentials" },
        { status: 401 }
      );
    }
    
    // Generate JWT token
    const token = jwt.sign(
      { 
        id: admin._id,
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
