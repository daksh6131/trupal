import { NextResponse } from "next/server";
import { getAgentFromToken, isAdmin } from "@/lib/auth-utils";
import { activityLogOperations } from "@/lib/db-utils";

export async function GET(request: Request) {
  try {
    // Check if admin or agent
    const isAdminUser = await isAdmin(request);
    const agent = isAdminUser ? null : await getAgentFromToken(request);
    
    if (!isAdminUser && !agent) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }
    
    let logs;
    
    // If agent, only get their logs
    if (agent) {
      logs = await activityLogOperations.getByAgentPhone(agent.phone);
    } else {
      // Admin gets all logs
      logs = await activityLogOperations.getAll();
    }
    
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
    const agent = await getAgentFromToken(request);
    
    if (!agent) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }
    
    const logData = await request.json();
    
    // Create activity log
    const log = await activityLogOperations.create({
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
