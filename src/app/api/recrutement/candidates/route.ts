import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { fullName, email, phone, city, domain, experience, linkedin, notes } = body;

    if (!fullName || !email || !phone || !domain) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    // Check if candidate already exists
    const existing = await prisma.candidateProfile.findFirst({
      where: { email },
    });

    let candidate;
    if (existing) {
      candidate = await prisma.candidateProfile.update({
        where: { id: existing.id },
        data: {
          fullName,
          phone,
          domain,
          experience: experience || null,
          availability: city || null,
          cvUrl: linkedin || null,
          certifications: notes ? [notes] : [],
        },
      });
    } else {
      candidate = await prisma.candidateProfile.create({
        data: {
          fullName,
          email,
          phone,
          domain,
          experience: experience || null,
          availability: city || null,
          cvUrl: linkedin || null,
          certifications: notes ? [notes] : [],
        },
      });
    }

    return NextResponse.json({
      success: true,
      candidateId: candidate.id,
      message: "Candidate registered successfully",
    });
  } catch (error) {
    console.error("Error creating candidate:", error);
    return NextResponse.json(
      { error: "Failed to register candidate" },
      { status: 500 }
    );
  }
}
