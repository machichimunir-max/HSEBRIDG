import { NextRequest, NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/session";
import { prisma } from "@/lib/db";

export async function POST(request: NextRequest) {
  try {
    const user = await getCurrentUser();
    if (!user) {
      return NextResponse.json({ error: "Please sign in" }, { status: 401 });
    }

    const { lessonId, completionPercent } = await request.json();

    if (!lessonId) {
      return NextResponse.json({ error: "Lesson ID is required" }, { status: 400 });
    }

    // Verify lesson exists and user has access
    const lesson = await prisma.lesson.findUnique({
      where: { id: lessonId },
      include: { module: { include: { course: true } } },
    });

    if (!lesson) {
      return NextResponse.json({ error: "Lesson not found" }, { status: 404 });
    }

    // Check enrollment
    const enrollment = await prisma.enrollment.findUnique({
      where: {
        userId_courseId: {
          userId: user.userId,
          courseId: lesson.module.courseId,
        },
      },
    });

    if (!enrollment || !enrollment.isActive) {
      return NextResponse.json({ error: "You are not enrolled in this course" }, { status: 403 });
    }

    // Update or create progress
    const progress = await prisma.lessonProgress.upsert({
      where: {
        userId_lessonId: {
          userId: user.userId,
          lessonId,
        },
      },
      create: {
        userId: user.userId,
        lessonId,
        isStarted: true,
        isCompleted: completionPercent === 100,
        completionPercent: completionPercent ?? 0,
        lastWatchedAt: new Date(),
        watchTimeSeconds: 0,
      },
      update: {
        isStarted: true,
        isCompleted: completionPercent === 100,
        completionPercent: completionPercent ?? 0,
        lastWatchedAt: new Date(),
      },
    });

    return NextResponse.json({ success: true, progress });
  } catch (error) {
    console.error("Error updating progress:", error);
    return NextResponse.json({ error: "Failed to update progress" }, { status: 500 });
  }
}
