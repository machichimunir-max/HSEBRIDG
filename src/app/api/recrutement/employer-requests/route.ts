import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { company, contactName, email, phone, positionNeeded, location, contractType, description } = body;

    if (!company || !contactName || !email || !phone || !positionNeeded) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    const request = await prisma.employerRequest.create({
      data: {
        companyName: company,
        contactName,
        email,
        phone,
        domain: positionNeeded,
        contractType: (["INTERIM", "CDD", "CDI"].includes(contractType) ? contractType : "CDI") as any,
        location: location || null,
        scope: "NATIONAL",
        needs: description || positionNeeded,
        status: "NEW",
      },
    });

    return NextResponse.json({
      success: true,
      requestId: request.id,
      message: "Employer request received successfully",
    });
  } catch (error) {
    console.error("Error creating employer request:", error);
    return NextResponse.json(
      { error: "Failed to submit employer request" },
      { status: 500 }
    );
  }
}
