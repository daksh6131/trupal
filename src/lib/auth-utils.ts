import { NextResponse } from "next/server";
import { verify } from "jsonwebtoken";
import Agent from "@/lib/models/agent";
import Admin from "@/lib/models/admin";
import { isMongoConnected } from "@/lib/db-connect";
import { db } from "@/lib/db";

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
    
    const decoded = verify(token, process.env.JWT_SECRET || "default_secret") as any;
    
    if (!decoded || !decoded.phone) {
      return null;
    }
    
    // Check if MongoDB is connected
    if (isMongoConnected()) {
      const agent = await Agent.findOne({ phone: decoded.phone });
      
      if (!agent) {
        return null;
      }
      
      return {
        id: agent._id,
        name: agent.name,
        phone: agent.phone,
      };
    } else {
      // Fallback to local storage
      const localAgent = db.agents.getByPhone(decoded.phone);
      
      if (!localAgent) {
        return null;
      }
      
      return {
        id: localAgent.id,
        name: localAgent.name,
        phone: localAgent.phone,
      };
    }
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
    
    const decoded = verify(token, process.env.JWT_SECRET || "default_secret") as any;
    
    if (!decoded || !decoded.role || decoded.role !== "admin") {
      return false;
    }
    
    // Check if MongoDB is connected
    if (isMongoConnected()) {
      const admin = await Admin.findOne({ email: decoded.email });
      
      if (!admin) {
        return false;
      }
      
      return true;
    } else {
      // For demo purposes, allow admin access with the token
      // In a real app, you might want to check against local storage
      return true;
    }
  } catch (error) {
    console.error("Admin auth error:", error);
    return false;
  }
}
