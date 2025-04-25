import { NextResponse } from "next/server";
import dbConnect, { isMongoConnected } from "@/lib/db-connect";
import ActivityLog from "@/lib/models/activityLog";
import { getAgentFromToken } from "@/lib/auth-utils";
import { db } from "@/lib/db";

export async function POST(request: Request) {
  try {
    await dbConnect();
    
    const agent = await getAgentFromToken(request);
    
    if (!agent) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }
    
    // Check if MongoDB is connected
    if (isMongoConnected()) {
      // Create activity log in MongoDB
      await ActivityLog.create({
        action: "logout",
        agentPhone: agent.phone,
        agentName: agent.name,
      });
    } else {
      // Fallback to local storage
      db.logs.create({
        action: "logout",
        agentPhone: agent.phone,
        agentName: agent.name,
        _id: "",
        createdAt: "",
        updatedAt: ""
      });
    }
    
    return NextResponse.json({
      success: true,
      message: "Logged out successfully"
    });
    
  } catch (error) {
    console.error("Logout error:", error);
    
    // Fallback to local storage if MongoDB fails
    try {
      const agent = await getAgentFromToken(request);
      
      if (!agent) {
        return NextResponse.json(
          { error: "Unauthorized" },
          { status: 401 }
        );
      }
      
      // Create activity log in local storage
      db.logs.create({
        action: "logout",
        agentPhone: agent.phone,
        agentName: agent.name,
        _id: "",
        createdAt: "",
        updatedAt: ""
      });
      
      return NextResponse.json({
        success: true,
        message: "Logged out successfully"
      });
    } catch (fallbackError) {
      console.error("Fallback logout error:", fallbackError);
      return NextResponse.json(
        { error: "Internal server error" },
        { status: 500 }
      );
    }
  }
}
