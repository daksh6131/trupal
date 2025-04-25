import { NextResponse } from "next/server";
import { getAgentFromToken } from "@/lib/auth-utils";
import { creditCardOperations } from "@/lib/db-utils";

export async function GET(request: Request) {
  try {
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
    const eligibleCards = await creditCardOperations.getEligibleCards(cibilScore);
    
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
