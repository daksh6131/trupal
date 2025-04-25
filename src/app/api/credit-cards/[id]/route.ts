import { NextResponse } from "next/server";
import dbConnect, { isMongoConnected } from "@/lib/db-connect";
import CreditCard from "@/lib/models/creditCard";
import { isAdmin } from "@/lib/auth-utils";
import { db } from "@/lib/db";

export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    await dbConnect();
    
    let creditCard;
    
    // Check if MongoDB is connected
    if (isMongoConnected()) {
      // Get credit card from MongoDB
      creditCard = await CreditCard.findById(params.id);
    } else {
      // Fallback to local storage
      creditCard = db.creditCards.getById(params.id);
    }
    
    if (!creditCard) {
      return NextResponse.json(
        { error: "Credit card not found" },
        { status: 404 }
      );
    }
    
    return NextResponse.json({
      success: true,
      creditCard
    });
    
  } catch (error) {
    console.error("Get credit card error:", error);
    
    // Fallback to local storage if MongoDB fails
    try {
      const creditCard = db.creditCards.getById(params.id);
      
      if (!creditCard) {
        return NextResponse.json(
          { error: "Credit card not found" },
          { status: 404 }
        );
      }
      
      return NextResponse.json({
        success: true,
        creditCard
      });
    } catch (fallbackError) {
      console.error("Fallback get credit card error:", fallbackError);
      return NextResponse.json(
        { error: "Internal server error" },
        { status: 500 }
      );
    }
  }
}

export async function PUT(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    await dbConnect();
    
    // Only admin can update credit cards
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
      // Update credit card in MongoDB
      creditCard = await CreditCard.findByIdAndUpdate(
        params.id,
        cardData,
        { new: true }
      );
    } else {
      // Fallback to local storage
      creditCard = db.creditCards.update(params.id, cardData);
    }
    
    if (!creditCard) {
      return NextResponse.json(
        { error: "Credit card not found" },
        { status: 404 }
      );
    }
    
    return NextResponse.json({
      success: true,
      creditCard
    });
    
  } catch (error) {
    console.error("Update credit card error:", error);
    
    // Fallback to local storage if MongoDB fails
    try {
      // Only admin can update credit cards
      if (!await isAdmin(request)) {
        return NextResponse.json(
          { error: "Unauthorized" },
          { status: 401 }
        );
      }
      
      const cardData = await request.json();
      
      const creditCard = db.creditCards.update(params.id, cardData);
      
      if (!creditCard) {
        return NextResponse.json(
          { error: "Credit card not found" },
          { status: 404 }
        );
      }
      
      return NextResponse.json({
        success: true,
        creditCard
      });
    } catch (fallbackError) {
      console.error("Fallback update credit card error:", fallbackError);
      return NextResponse.json(
        { error: "Internal server error" },
        { status: 500 }
      );
    }
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    await dbConnect();
    
    // Only admin can delete credit cards
    if (!await isAdmin(request)) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }
    
    let success = false;
    
    // Check if MongoDB is connected
    if (isMongoConnected()) {
      // Delete credit card from MongoDB
      const creditCard = await CreditCard.findByIdAndDelete(params.id);
      success = !!creditCard;
    } else {
      // Fallback to local storage
      success = db.creditCards.delete(params.id);
    }
    
    if (!success) {
      return NextResponse.json(
        { error: "Credit card not found" },
        { status: 404 }
      );
    }
    
    return NextResponse.json({
      success: true,
      message: "Credit card deleted successfully"
    });
    
  } catch (error) {
    console.error("Delete credit card error:", error);
    
    // Fallback to local storage if MongoDB fails
    try {
      // Only admin can delete credit cards
      if (!await isAdmin(request)) {
        return NextResponse.json(
          { error: "Unauthorized" },
          { status: 401 }
        );
      }
      
      const success = db.creditCards.delete(params.id);
      
      if (!success) {
        return NextResponse.json(
          { error: "Credit card not found" },
          { status: 404 }
        );
      }
      
      return NextResponse.json({
        success: true,
        message: "Credit card deleted successfully"
      });
    } catch (fallbackError) {
      console.error("Fallback delete credit card error:", fallbackError);
      return NextResponse.json(
        { error: "Internal server error" },
        { status: 500 }
      );
    }
  }
}
