import { NextResponse } from "next/server";
import dbConnect from "@/lib/db-connect";
import ActivityLog from "@/lib/models/activityLog";
import { getAgentFromToken } from "@/lib/auth-utils";

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
    
    // Create activity log
    await ActivityLog.create({
      action: "logout",
      agentPhone: agent.phone,
      agentName: agent.name,
    });
    
    return NextResponse.json({
      success: true,
      message: "Logged out successfully"
    });
    
  } catch (error) {
    console.error("Logout error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
