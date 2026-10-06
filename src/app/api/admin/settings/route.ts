import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { verifySession } from "@/lib/session";

// GET /api/admin/settings - Get site settings (public)
export async function GET() {
  try {
    let settings = await prisma.siteSetting.findFirst();

    // Create default settings if none exist
    if (!settings) {
      settings = await prisma.siteSetting.create({
        data: {
          siteName: "HSE BRIDGE",
        },
      });
    }

    return NextResponse.json(settings);
  } catch (error) {
    console.error("Failed to fetch settings:", error);
    return NextResponse.json(
      { error: "Failed to fetch settings" },
      { status: 500 }
    );
  }
}

// PATCH /api/admin/settings - Update site settings (admin only)
export async function PATCH(request: NextRequest) {
  try {
    const session = await verifySession();
    if (!session || session.role !== "ADMIN") {
      return NextResponse.json(
        { error: "Unauthorized: Admin access required" },
        { status: 401 }
      );
    }

    const body = await request.json();
    const {
      siteName,
      contactEmail,
      contactPhone,
      whatsappNumber,
      address,
      instagramUrl,
      linkedinUrl,
    } = body;

    const existing = await prisma.siteSetting.findFirst();

    let updated;
    if (existing) {
      updated = await prisma.siteSetting.update({
        where: { id: existing.id },
        data: {
          siteName: siteName || "HSE BRIDGE",
          contactEmail: contactEmail || null,
          contactPhone: contactPhone || null,
          whatsappNumber: whatsappNumber || null,
          address: address || null,
          instagramUrl: instagramUrl || null,
          linkedinUrl: linkedinUrl || null,
        },
      });
    } else {
      updated = await prisma.siteSetting.create({
        data: {
          siteName: siteName || "HSE BRIDGE",
          contactEmail: contactEmail || null,
          contactPhone: contactPhone || null,
          whatsappNumber: whatsappNumber || null,
          address: address || null,
          instagramUrl: instagramUrl || null,
          linkedinUrl: linkedinUrl || null,
        },
      });
    }

    return NextResponse.json(updated);
  } catch (error) {
    console.error("Failed to update settings:", error);
    return NextResponse.json(
      { error: "Failed to update settings" },
      { status: 500 }
    );
  }
}