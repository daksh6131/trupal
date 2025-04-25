import { NextResponse } from "next/server";
import dbConnect, { isMongoConnected } from "@/lib/db-connect";
import CreditCard from "@/lib/models/creditCard";
import { getAgentFromToken, isAdmin } from "@/lib/auth-utils";
import { db } from "@/lib/db";

export async function GET(request: Request) {
  try {
    await dbConnect();
    
    let creditCards;
    
    // Check if MongoDB is connected
    if (isMongoConnected()) {
      // Get all credit cards from MongoDB
      creditCards = await CreditCard.find()
        .sort({ minCibilScore: 1 });
    } else {
      // Fallback to local storage
      creditCards = db.creditCards.getAll()
        .sort((a, b) => a.minCibilScore - b.minCibilScore);
    }
    
    return NextResponse.json({
      success: true,
      creditCards
    });
    
  } catch (error) {
    console.error("Get credit cards error:", error);
    
    // Fallback to local storage if MongoDB fails
    try {
      const creditCards = db.creditCards.getAll()
        .sort((a, b) => a.minCibilScore - b.minCibilScore);
      
      return NextResponse.json({
        success: true,
        creditCards
      });
    } catch (fallbackError) {
      console.error("Fallback get credit cards error:", fallbackError);
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
    
    // Only admin can create credit cards
    if (!await isAdmin(request)) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }
    
    const cardData = await request.json();
    let creditCard;
    
    // Check if MongoDB is connected
    if (isMongoConnected()) {
      // Create new credit card in MongoDB
      creditCard = await CreditCard.create(cardData);
    } else {
      // Fallback to local storage
      creditCard = db.creditCards.create(cardData);
    }
    
    return NextResponse.json({
      success: true,
      creditCard
    });
    
  } catch (error) {
    console.error("Create credit card error:", error);
    
    // Fallback to local storage if MongoDB fails
    try {
      // Only admin can create credit cards
      if (!await isAdmin(request)) {
        return NextResponse.json(
          { error: "Unauthorized" },
          { status: 401 }
        );
      }
      
      const cardData = await request.json();
      
      // Create new credit card in local storage
      const creditCard = db.creditCards.create(cardData);
      
      return NextResponse.json({
        success: true,
        creditCard
      });
    } catch (fallbackError) {
      console.error("Fallback create credit card error:", fallbackError);
      return NextResponse.json(
        { error: "Internal server error" },
        { status: 500 }
      );
    }
  }
}
