"use server";

import { prisma } from "@/lib/db";
import { getCurrentUser } from "@/lib/session";
import { lessonSchema } from "@/lib/course-schemas";

// Check if student is enrolled in the course and lesson exists
export async function verifyLessonAccess(lessonId: string) {
  try {
    const user = await getCurrentUser();
    if (!user) {
      return { error: "Please login to access lessons", authorized: false };
    }

    // Get lesson with module and course info
    const lesson = await prisma.lesson.findUnique({
      where: { id: lessonId },
      include: {
        module: {
          include: {
            course: true,
          },
        },
      },
    });

    if (!lesson || lesson.module.course.isPublished === false) {
      return { error: "Lesson not found", authorized: false };
    }

    // Check if user is enrolled in the course
    const enrollment = await prisma.enrollment.findUnique({
      where: {
        userId_courseId: {
          userId: user.userId,
          courseId: lesson.module.courseId,
        },
      },
    });

    if (!enrollment || !enrollment.isActive) {
      return { error: "You are not enrolled in this course", authorized: false };
    }

    return { authorized: true, lesson };
  } catch (error) {
    console.error("Lesson access error:", error);
    return { error: "Failed to verify access", authorized: false };
  }
}

// Update lesson progress (student)
export async function updateLessonProgress(lessonId: string, completionPercent: number) {
  try {
    const user = await getCurrentUser();
    if (!user) {
      return { error: "Please login" };
    }

    // Verify access first
    const access = await verifyLessonAccess(lessonId);
    if (!access.authorized) {
      return access;
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
        completionPercent,
        lastWatchedAt: new Date(),
      },
      update: {
        isStarted: true,
        isCompleted: completionPercent === 100,
        completionPercent,
        lastWatchedAt: new Date(),
        watchTimeSeconds: {
          increment: 1,
        },
      },
    });

    return { success: true, progress };
  } catch (error) {
    console.error("Progress update error:", error);
    return { error: "Failed to update progress" };
  }
}

// Get student's progress in a course
export async function getCourseProgress(courseId: string) {
  try {
    const user = await getCurrentUser();
    if (!user) {
      return [];
    }

    // Verify enrollment
    const enrollment = await prisma.enrollment.findUnique({
      where: {
        userId_courseId: {
          userId: user.userId,
          courseId,
        },
      },
    });

    if (!enrollment) {
      return [];
    }

    // Get all lessons in the course
    const lessons = await prisma.lesson.findMany({
      where: {
        module: {
          courseId,
        },
      },
      include: {
        progress: {
          where: {
            userId: user.userId,
          },
          select: {
            isCompleted: true,
            completionPercent: true,
            lastWatchedAt: true,
          },
        },
      },
    });

    return lessons;
  } catch (error) {
    console.error("Course progress error:", error);
    return [];
  }
}
