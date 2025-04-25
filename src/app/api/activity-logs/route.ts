import { NextResponse } from "next/server";
import dbConnect, { isMongoConnected } from "@/lib/db-connect";
import ActivityLog from "@/lib/models/activityLog";
import { getAgentFromToken, isAdmin } from "@/lib/auth-utils";
import { db } from "@/lib/db";

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
    
    let logs;
    
    // Check if MongoDB is connected
    if (isMongoConnected()) {
      // Get activity logs from MongoDB
      let query = {};
      
      // If agent, only get their logs
      if (agent) {
        query = { agentPhone: agent.phone };
      }
      
      logs = await ActivityLog.find(query)
        .sort({ createdAt: -1 });
    } else {
      // Fallback to local storage
      logs = db.logs.getAll();
      
      // If agent, only get their logs
      if (agent) {
        logs = logs.filter(log => log.agentPhone === agent.phone);
      }
      
      // Sort by timestamp/createdAt
      logs = logs.sort((a, b) => 
        new Date(b.createdAt || b.timestamp).getTime() - 
        new Date(a.createdAt || a.timestamp).getTime()
      );
    }
    
    return NextResponse.json({
      success: true,
      logs
    });
    
  } catch (error) {
    console.error("Get activity logs error:", error);
    
    // Fallback to local storage if MongoDB fails
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
      
      let logs = db.logs.getAll();
      
      // If agent, only get their logs
      if (agent) {
        logs = logs.filter(log => log.agentPhone === agent.phone);
      }
      
      // Sort by timestamp/createdAt
      logs = logs.sort((a, b) => 
        new Date(b.createdAt || b.timestamp).getTime() - 
        new Date(a.createdAt || a.timestamp).getTime()
      );
      
      return NextResponse.json({
        success: true,
        logs
      });
    } catch (fallbackError) {
      console.error("Fallback get activity logs error:", fallbackError);
      return NextResponse.json(
        { error: "Internal server error" },
        { status: 500 }
      );
    }
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
    let log;
    
    // Check if MongoDB is connected
    if (isMongoConnected()) {
      // Create activity log in MongoDB
      log = await ActivityLog.create({
        ...logData,
        agentPhone: agent.phone,
        agentName: agent.name,
      });
    } else {
      // Fallback to local storage
      log = db.logs.create({
        ...logData,
        agentPhone: agent.phone,
        agentName: agent.name,
      });
    }
    
    return NextResponse.json({
      success: true,
      log
    });
    
  } catch (error) {
    console.error("Create activity log error:", error);
    
    // Fallback to local storage if MongoDB fails
    try {
      const agent = await getAgentFromToken(request);
      
      if (!agent) {
        return NextResponse.json(
          { error: "Unauthorized" },
          { status: 401 }
        );
      }
      
      const logData = await request.json();
      
      // Create activity log in local storage
      const log = db.logs.create({
        ...logData,
        agentPhone: agent.phone,
        agentName: agent.name,
      });
      
      return NextResponse.json({
        success: true,
        log
      });
    } catch (fallbackError) {
      console.error("Fallback create activity log error:", fallbackError);
      return NextResponse.json(
        { error: "Internal server error" },
        { status: 500 }
      );
    }
  }
}
