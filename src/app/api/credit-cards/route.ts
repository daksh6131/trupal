import { NextResponse } from "next/server";
import { isAdmin } from "@/lib/auth-utils";
import { creditCardOperations } from "@/lib/db-utils";

export async function GET(request: Request) {
  try {
    // Get all credit cards
    const creditCards = await creditCardOperations.getAll();
    
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
    // Only admin can create credit cards
    if (!await isAdmin(request)) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }
    
    const cardData = await request.json();
    
    // Create new credit card
    const creditCard = await creditCardOperations.create(cardData);
    
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
