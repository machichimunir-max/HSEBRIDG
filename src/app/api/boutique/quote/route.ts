import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { sendEmail, quoteReceivedEmail } from "@/lib/email";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { fullName, company, phone, email, category, message } = body;

    // Validate required fields
    if (!fullName || !phone || !email || !message) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    // Create quote request
    const quoteRequest = await prisma.quoteRequest.create({
      data: {
        fullName,
        company: company || null,
        phone,
        email,
        categoryName: category || null,
        message,
        status: "NEW",
      },
    });

    // Notify admin (fire-and-forget)
    const adminEmail = process.env.ADMIN_EMAIL || "admin@hsebridge.ma";
    void sendEmail(quoteReceivedEmail(adminEmail, fullName, category, message));

    return NextResponse.json({
      success: true,
      quoteRequestId: quoteRequest.id,
      message: "Quote request submitted successfully",
    });
  } catch (error) {
    console.error("Error creating quote request:", error);
    return NextResponse.json(
      { error: "Failed to submit quote request" },
      { status: 500 }
    );
  }
}
