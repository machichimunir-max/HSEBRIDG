import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { getCurrentUser } from "@/lib/session";
import {
  generateCertificatePDF,
  getCertificateFilePath,
  updateAttestationPdfUrl,
} from "@/lib/certificate-generator";
import fs from "fs";

export const runtime = "nodejs";

// GET /api/attestation/[id] - Get attestation details
export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const user = await getCurrentUser();
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id: attestationId } = await params;

    const attestation = await prisma.attestation.findUnique({
      where: { id: attestationId },
      include: {
        course: {
          select: {
            id: true,
            title: true,
            slug: true,
          },
        },
      },
    });

    if (!attestation) {
      return NextResponse.json(
        { error: "Attestation not found" },
        { status: 404 }
      );
    }

    // Security: Students can only access their own attestations
    if (user.role !== "ADMIN" && attestation.userId !== user.userId) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    return NextResponse.json({
      id: attestation.id,
      certificateNumber: attestation.certificateNumber,
      issuedAt: attestation.issuedAt.toISOString(),
      pdfUrl: attestation.pdfUrl,
      course: attestation.course,
    });
  } catch (error) {
    console.error("Attestation fetch error:", error);
    return NextResponse.json(
      { error: "Failed to fetch attestation" },
      { status: 500 }
    );
  }
}
