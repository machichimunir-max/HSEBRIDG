"use server";

import { prisma } from "@/lib/db";
import { getCurrentUser } from "@/lib/session";
import { createSecureToken } from "@/lib/auth";
import { verifyLessonAccess } from "@/lib/progress-server";

const TOKEN_EXPIRY_MINUTES = 30;

// Generate a short-lived secure video access token
// This token ensures:
// 1. Only enrolled students can access videos
// 2. Tokens expire after 30 minutes
// 3. Video URLs are never exposed to the frontend
export async function generateVideoAccessToken(lessonId: string): Promise<
  | { success: true; token: string; expiresAt: Date }
  | { error: string; authorized?: boolean }
> {
  try {
    const user = await getCurrentUser();
    if (!user) {
      return { error: "Please login to watch videos" };
    }

    // Verify the student has access to this lesson
    const access = await verifyLessonAccess(lessonId);
    if (!access.authorized) {
      return {
        error: access.error ?? "You do not have access to this lesson",
        authorized: false,
      };
    }

    // Create a short-lived secure token
    const token = createSecureToken();
    const expiresAt = new Date(Date.now() + TOKEN_EXPIRY_MINUTES * 60 * 1000);

    await prisma.videoAccessToken.create({
      data: {
        userId: user.userId,
        lessonId,
        token,
        expiresAt,
      },
    });

    return { success: true, token, expiresAt };
  } catch (error) {
    console.error("Token generation error:", error);
    return { error: "Failed to generate video token" };
  }
}

// Verify a video token and get the video metadata
// This is called SERVER-SIDE from the lesson player
export async function verifyVideoToken(token: string, lessonId: string) {
  try {
    // Find the token
    const accessToken = await prisma.videoAccessToken.findUnique({
      where: { token },
      include: {
        user: true,
      },
    });

    if (!accessToken) {
      return { error: "Invalid token", authorized: false };
    }

    // Check expiry
    if (accessToken.expiresAt < new Date()) {
      return { error: "Token expired", authorized: false };
    }

    // Verify lesson ID matches
    if (accessToken.lessonId !== lessonId) {
      return { error: "Token mismatch", authorized: false };
    }

    // Get video metadata
    const video = await prisma.videoMetadata.findUnique({
      where: { lessonId },
    });

    if (!video) {
      return { error: "Video not found", authorized: false };
    }

    return {
      authorized: true,
      video: {
        id: video.id,
        lessonId: video.lessonId,
        provider: video.videoProvider,
        providerVideoId: video.providerVideoId,
        duration: video.duration,
        thumbnail: video.thumbnail,
      },
      studentInfo: {
        userId: accessToken.user.id,
        email: accessToken.user.email,
        name: accessToken.user.name,
      },
    };
  } catch (error) {
    console.error("Token verification error:", error);
    return { error: "Failed to verify token", authorized: false };
  }
}

// Clean up expired tokens periodically
export async function cleanupExpiredTokens() {
  try {
    const result = await prisma.videoAccessToken.deleteMany({
      where: {
        expiresAt: {
          lt: new Date(),
        },
      },
    });

    console.log(`Cleaned up ${result.count} expired tokens`);
    return { success: true, deletedCount: result.count };
  } catch (error) {
    console.error("Cleanup error:", error);
    return { error: "Failed to cleanup tokens" };
  }
}
