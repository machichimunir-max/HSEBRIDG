import { NextRequest, NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/session";
import { verifyVideoToken } from "@/lib/video-security";

// This endpoint verifies that:
// 1. User is authenticated
// 2. Token is valid and not expired
// 3. User is enrolled in the course
// 4. Returns ONLY the video metadata
// NEVER returns direct URLs or provider IDs
export async function POST(request: NextRequest) {
  try {
    const user = await getCurrentUser();
    if (!user) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    const { token, lessonId } = await request.json();

    if (!token || !lessonId) {
      return NextResponse.json(
        { error: "Missing required parameters" },
        { status: 400 }
      );
    }

    const result = await verifyVideoToken(token, lessonId);

    if (!result.authorized) {
      return NextResponse.json(
        { error: result.error },
        { status: 403 }
      );
    }

    if (!result.video) {
      return NextResponse.json(
        { error: "Video metadata unavailable" },
        { status: 403 }
      );
    }

    // Return ONLY safe metadata, never the provider video ID
    return NextResponse.json({
      lessonId: result.video.lessonId,
      duration: result.video.duration,
      thumbnail: result.video.thumbnail,
      // NOTE: Don't return providerVideoId or provider type
      // The frontend should never know which provider is used
    });
  } catch (error) {
    console.error("Video verification error:", error);
    return NextResponse.json(
      { error: "Failed to verify video" },
      { status: 500 }
    );
  }
}
