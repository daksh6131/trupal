import { NextResponse } from "next/server";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import dbConnect, { isMongoConnected } from "@/lib/db-connect";
import Admin from "@/lib/models/admin";

// Admin credentials for demo purposes
const DEMO_ADMIN = {
  email: "admin@example.com",
  role: "admin"
};

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
    
    let admin;
    
    // Check if MongoDB is connected
    if (isMongoConnected()) {
      // Find admin by email in MongoDB
      admin = await Admin.findOne({ email });
      
      if (!admin) {
        return NextResponse.json(
          { error: "Invalid credentials" },
          { status: 401 }
        );
      }
    } else {
      // For demo purposes, accept hardcoded admin credentials
      if (email !== DEMO_ADMIN.email || password !== "admin123") {
        return NextResponse.json(
          { error: "Invalid credentials" },
          { status: 401 }
        );
      }
      
      admin = DEMO_ADMIN;
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
        id: admin._id || "admin_id",
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
    
    // Fallback for demo purposes
    try {
      const { email, password } = await request.json();
      
      // Validate input
      if (!email || !password) {
        return NextResponse.json(
          { error: "Email and password are required" },
          { status: 400 }
        );
      }
      
      // For demo purposes, accept hardcoded admin credentials
      if (email !== DEMO_ADMIN.email || password !== "admin123") {
        return NextResponse.json(
          { error: "Invalid credentials" },
          { status: 401 }
        );
      }
      
      // Generate JWT token
      const token = jwt.sign(
        { 
          id: "admin_id",
          email: DEMO_ADMIN.email,
          role: DEMO_ADMIN.role
        },
        process.env.JWT_SECRET || "default_secret",
        { expiresIn: "24h" }
      );
      
      return NextResponse.json({
        success: true,
        admin: {
          email: DEMO_ADMIN.email,
          role: DEMO_ADMIN.role,
        },
        token
      });
    } catch (fallbackError) {
      console.error("Fallback admin login error:", fallbackError);
      return NextResponse.json(
        { error: "Internal server error" },
        { status: 500 }
      );
    }
  }
}
