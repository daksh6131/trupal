import { NextResponse } from "next/server";
import jwt from "jsonwebtoken";
import Agent from "@/lib/models/agent";
import Admin from "@/lib/models/admin";

export async function getAgentFromToken(request: Request) {
  try {
    const authHeader = request.headers.get("authorization");
    
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return null;
    }
    
    const token = authHeader.split(" ")[1];
    
    if (!token) {
      return null;
    }
    
    const decoded = jwt.verify(token, process.env.JWT_SECRET || "default_secret") as any;
    
    if (!decoded || !decoded.phone) {
      return null;
    }
    
    const agent = await Agent.findOne({ phone: decoded.phone });
    
    if (!agent) {
      return null;
    }
    
    return {
      id: agent._id,
      name: agent.name,
      phone: agent.phone,
    };
  } catch (error) {
    console.error("Auth error:", error);
    return null;
  }
}

export async function isAdmin(request: Request) {
  try {
    const authHeader = request.headers.get("authorization");
    
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return false;
    }
    
    const token = authHeader.split(" ")[1];
    
    if (!token) {
      return false;
    }
    
    const decoded = jwt.verify(token, process.env.JWT_SECRET || "default_secret") as any;
    
    if (!decoded || !decoded.role || decoded.role !== "admin") {
      return false;
    }
    
    const admin = await Admin.findOne({ email: decoded.email });
    
    if (!admin) {
      return false;
    }
    
    return true;
  } catch (error) {
    console.error("Admin auth error:", error);
    return false;
  }
}
