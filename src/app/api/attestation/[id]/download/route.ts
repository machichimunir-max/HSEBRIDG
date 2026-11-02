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

// GET /api/attestation/[id]/download - Generate and download PDF certificate
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
    });

    if (!attestation) {
      return NextResponse.json(
        { error: "Attestation not found" },
        { status: 404 }
      );
    }

    // Security: Students can only download their own certificates
    if (user.role !== "ADMIN" && attestation.userId !== user.userId) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    // Check if PDF already exists
    let filePath = getCertificateFilePath(attestation.certificateNumber);

    if (!filePath) {
      // Generate PDF on-demand
      filePath = await generateCertificatePDF(attestationId);

      // Update attestation with PDF URL
      await updateAttestationPdfUrl(
        attestationId,
        `${attestation.certificateNumber}.pdf`
      );
    }

    // Read file and send as response
    const fileBuffer = fs.readFileSync(filePath);

    return new NextResponse(fileBuffer, {
      status: 200,
      headers: {
        "Content-Type": "application/pdf",
        "Content-Disposition": `attachment; filename="${attestation.certificateNumber}.pdf"`,
      },
    });
  } catch (error) {
    console.error("Certificate download error:", error);
    return NextResponse.json(
      { error: "Failed to generate certificate" },
      { status: 500 }
    );
  }
}
