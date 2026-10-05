import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";

export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await req.json();
    const { status, adminNotes } = body;

    // Validate status
    const validStatuses = ["NEW", "CONTACTED", "QUOTED", "WON", "LOST"];
    if (status && !validStatuses.includes(status)) {
      return NextResponse.json(
        { error: "Invalid status" },
        { status: 400 }
      );
    }

    // Update quote request
    const quoteRequest = await prisma.quoteRequest.update({
      where: { id },
      data: {
        ...(status && { status }),
        ...(adminNotes !== undefined && { adminNotes }),
        updatedAt: new Date(),
      },
    });

    return NextResponse.json({
      success: true,
      quoteRequest,
    });
  } catch (error) {
    console.error("Error updating quote request:", error);
    return NextResponse.json(
      { error: "Failed to update quote request" },
      { status: 500 }
    );
  }
}
