import { NextResponse } from "next/server";
import dbConnect from "@/lib/db-connect";
import ActivityLog from "@/lib/models/activityLog";
import { getAgentFromToken, isAdmin } from "@/lib/auth-utils";

export async function GET(request: Request) {
  try {
    await dbConnect();
    
    // Check if admin or agent
    const isAdminUser = await isAdmin(request);
    const agent = isAdminUser ? null : await getAgentFromToken(request);
    
    if (!isAdminUser && !agent) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }
    
    // Get activity logs
    let query = {};
    
    // If agent, only get their logs
    if (agent) {
      query = { agentPhone: agent.phone };
    }
    
    const logs = await ActivityLog.find(query)
      .sort({ createdAt: -1 });
    
    return NextResponse.json({
      success: true,
      logs
    });
    
  } catch (error) {
    console.error("Get activity logs error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

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
    
    const logData = await request.json();
    
    // Create activity log
    const log = await ActivityLog.create({
      ...logData,
      agentPhone: agent.phone,
      agentName: agent.name,
    });
    
    return NextResponse.json({
      success: true,
      log
    });
    
  } catch (error) {
    console.error("Create activity log error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
