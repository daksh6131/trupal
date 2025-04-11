import { NextResponse } from "next/server";
import dbConnect from "@/lib/db-connect";
import CreditCard from "@/lib/models/creditCard";
import { getAgentFromToken, isAdmin } from "@/lib/auth-utils";

export async function GET(request: Request) {
  try {
    await dbConnect();
    
    // Get all credit cards
    const creditCards = await CreditCard.find()
      .sort({ minCibilScore: 1 });
    
    return NextResponse.json({
      success: true,
      creditCards
    });
    
  } catch (error) {
    console.error("Get credit cards error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    await dbConnect();
    
    // Only admin can create credit cards
    if (!await isAdmin(request)) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }
    
    const cardData = await request.json();
    
    // Create new credit card
    const creditCard = await CreditCard.create(cardData);
    
    return NextResponse.json({
      success: true,
      creditCard
    });
    
  } catch (error) {
    console.error("Create credit card error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
