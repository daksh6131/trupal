import { NextResponse } from "next/server";
import { getAgentFromToken } from "@/lib/auth-utils";
import { activityLogOperations } from "@/lib/db-utils";

export async function POST(request: Request) {
  try {
    const agent = await getAgentFromToken(request);
    
    if (!agent) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }
    
    // Create activity log
    await activityLogOperations.create({
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
