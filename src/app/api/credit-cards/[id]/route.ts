import { NextResponse } from "next/server";
import dbConnect from "@/lib/db-connect";
import CreditCard from "@/lib/models/creditCard";
import { isAdmin } from "@/lib/auth-utils";

export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    await dbConnect();
    
    const creditCard = await CreditCard.findById(params.id);
    
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
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
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
    
    const creditCard = await CreditCard.findByIdAndUpdate(
      params.id,
      cardData,
      { new: true }
    );
    
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
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
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
    
    const creditCard = await CreditCard.findByIdAndDelete(params.id);
    
    if (!creditCard) {
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
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
