import { NextRequest, NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/session";
import { generateVideoAccessToken } from "@/lib/video-security";

// Generate a short-lived token for video playback
// This endpoint enforces:
// 1. Student must be logged in
// 2. Student must be enrolled in the course
// 3. Token expires in 30 minutes
// 4. Token can only be used for the specific lesson
export async function POST(request: NextRequest) {
  try {
    const user = await getCurrentUser();
    if (!user) {
      return NextResponse.json(
        { error: "Please login to watch videos" },
        { status: 401 }
      );
    }

    const { lessonId } = await request.json();

    if (!lessonId) {
      return NextResponse.json(
        { error: "Missing lessonId" },
        { status: 400 }
      );
    }

    const result = await generateVideoAccessToken(lessonId);

    if ("error" in result) {
      return NextResponse.json(
        { error: result.error },
        { status: 403 }
      );
    }

    if (!("success" in result)) {
      return NextResponse.json(
        { error: "Unable to generate video token" },
        { status: 403 }
      );
    }

    return NextResponse.json({
      token: result.token,
      expiresAt: result.expiresAt,
      expiresIn: Math.round((result.expiresAt.getTime() - Date.now()) / 1000),
    });
  } catch (error) {
    console.error("Token generation error:", error);
    return NextResponse.json(
      { error: "Failed to generate video token" },
      { status: 500 }
    );
  }
}
