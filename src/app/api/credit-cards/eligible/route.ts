import { NextResponse } from "next/server";
import dbConnect, { isMongoConnected } from "@/lib/db-connect";
import CreditCard from "@/lib/models/creditCard";
import { getAgentFromToken } from "@/lib/auth-utils";
import { db } from "@/lib/db";

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
    
    let eligibleCards;
    
    // Check if MongoDB is connected
    if (isMongoConnected()) {
      // Get eligible credit cards from MongoDB
      eligibleCards = await CreditCard.find({
        status: "active",
        minCibilScore: { $lte: cibilScore }
      }).sort({ minCibilScore: -1 });
    } else {
      // Fallback to local storage
      eligibleCards = db.creditCards.getEligibleCards(cibilScore);
    }
    
    return NextResponse.json({
      success: true,
      eligibleCards
    });
    
  } catch (error) {
    console.error("Get eligible cards error:", error);
    
    // Fallback to local storage if MongoDB fails
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
      
      const eligibleCards = db.creditCards.getEligibleCards(cibilScore);
      
      return NextResponse.json({
        success: true,
        eligibleCards
      });
    } catch (fallbackError) {
      console.error("Fallback get eligible cards error:", fallbackError);
      return NextResponse.json(
        { error: "Internal server error" },
        { status: 500 }
      );
    }
  }
}
