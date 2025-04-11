import { NextResponse } from "next/server";
import dbConnect from "@/lib/db-connect";
import CreditCard from "@/lib/models/creditCard";
import { getAgentFromToken } from "@/lib/auth-utils";

export async function GET(request: Request) {
  try {
    await dbConnect();
    
    const agent = await getAgentFromToken(request);
    
    if (!agent) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }
    
    const url = new URL(request.url);
    const cibilScore = parseInt(url.searchParams.get("cibilScore") || "0");
    
    if (!cibilScore) {
      return NextResponse.json(
        { error: "CIBIL score is required" },
        { status: 400 }
      );
    }
    
    // Get eligible credit cards
    const eligibleCards = await CreditCard.find({
      status: "active",
      minCibilScore: { $lte: cibilScore }
    }).sort({ minCibilScore: -1 });
    
    return NextResponse.json({
      success: true,
      eligibleCards
    });
    
  } catch (error) {
    console.error("Get eligible cards error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
