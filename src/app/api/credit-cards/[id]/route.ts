import { NextResponse } from "next/server";
import { isAdmin } from "@/lib/auth-utils";
import { creditCardOperations } from "@/lib/db-utils";

export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    // Get credit card by ID
    const creditCard = await creditCardOperations.getById(parseInt(params.id));
    
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
    // Only admin can update credit cards
    if (!await isAdmin(request)) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }
    
    const cardData = await request.json();
    
    // Update credit card
    const creditCard = await creditCardOperations.update(parseInt(params.id), cardData);
    
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
    // Only admin can delete credit cards
    if (!await isAdmin(request)) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }
    
    // Delete credit card
    const success = await creditCardOperations.delete(parseInt(params.id));
    
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
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
