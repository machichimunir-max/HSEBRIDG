"use server";

import { prisma } from "@/lib/db";
import { getCurrentUser } from "@/lib/session";

// STUDENT: Enroll in a course
export async function enrollInCourse(courseId: string) {
  try {
    const user = await getCurrentUser();
    if (!user) {
      return { error: "Please login to enroll" };
    }

    // Verify course exists and is published
    const course = await prisma.course.findUnique({
      where: { id: courseId },
      select: { isPublished: true },
    });

    if (!course || !course.isPublished) {
      return { error: "Course not found or not available" };
    }

    // Check if already enrolled
    const existing = await prisma.enrollment.findUnique({
      where: {
        userId_courseId: {
          userId: user.userId,
          courseId,
        },
      },
    });

    if (existing) {
      return { error: "You are already enrolled in this course" };
    }

    // Create enrollment
    const enrollment = await prisma.enrollment.create({
      data: {
        userId: user.userId,
        courseId,
        isActive: true,
      },
    });

    return { success: true, enrollmentId: enrollment.id };
  } catch (error) {
    console.error("Enrollment error:", error);
    return { error: "Failed to enroll in course" };
  }
}

// STUDENT: Get my enrollments
export async function getMyEnrollments() {
  try {
    const user = await getCurrentUser();
    if (!user) {
      return [];
    }

    const enrollments = await prisma.enrollment.findMany({
      where: {
        userId: user.userId,
        isActive: true,
      },
      include: {
        course: {
          select: {
            id: true,
            title: true,
            slug: true,
            thumbnail: true,
            shortDescription: true,
          },
        },
      },
    });

    return enrollments;
  } catch (error) {
    console.error("Get enrollments error:", error);
    return [];
  }
}

// ADMIN: Get all enrollments
export async function getAllEnrollments() {
  try {
    const user = await getCurrentUser();
    if (!user || user.role !== "ADMIN") {
      return { error: "Unauthorized" };
    }

    const enrollments = await prisma.enrollment.findMany({
      include: {
        user: {
          select: {
            id: true,
            email: true,
            name: true,
          },
        },
        course: {
          select: {
            id: true,
            title: true,
          },
        },
      },
    });

    return enrollments;
  } catch (error) {
    console.error("Get enrollments error:", error);
    return { error: "Failed to fetch enrollments" };
  }
}
