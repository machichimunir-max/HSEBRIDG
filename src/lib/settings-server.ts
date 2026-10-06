"use server";

import { prisma } from "@/lib/db";
import { revalidatePath } from "next/cache";
import { verifySession } from "@/lib/session";

export interface SiteSettingInput {
  siteName?: string;
  contactEmail?: string;
  contactPhone?: string;
  whatsappNumber?: string;
  address?: string;
  instagramUrl?: string;
  linkedinUrl?: string;
}

/**
 * Get site settings (public, no auth required)
 */
export async function getSiteSettings() {
  let settings = await prisma.siteSetting.findFirst();

  // Create default settings if none exist
  if (!settings) {
    settings = await prisma.siteSetting.create({
      data: {
        siteName: "HSE BRIDGE",
      },
    });
  }

  return settings;
}

/**
 * Update site settings (admin only)
 */
export async function updateSiteSettings(data: SiteSettingInput) {
  const session = await verifySession();
  if (!session || session.role !== "ADMIN") {
    throw new Error("Unauthorized: Admin access required");
  }

  const existing = await prisma.siteSetting.findFirst();

  let updated;
  if (existing) {
    updated = await prisma.siteSetting.update({
      where: { id: existing.id },
      data,
    });
  } else {
    updated = await prisma.siteSetting.create({
      data: {
        siteName: data.siteName || "HSE BRIDGE",
        ...data,
      },
    });
  }

  // Revalidate all pages that use settings
  revalidatePath("/", "layout");
  revalidatePath("/contact");
  revalidatePath("/admin/settings");

  return { success: true, settings: updated };
}