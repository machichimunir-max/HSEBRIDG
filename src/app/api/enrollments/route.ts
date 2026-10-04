import { NextRequest, NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/session";
import { prisma } from "@/lib/db";

export async function POST(request: NextRequest) {
  try {
    const user = await getCurrentUser();
    if (!user) {
      return NextResponse.json({ error: "Please sign in to enroll" }, { status: 401 });
    }

    const { courseId } = await request.json();
    if (!courseId) {
      return NextResponse.json({ error: "Course ID is required" }, { status: 400 });
    }

    const course = await prisma.course.findUnique({
      where: { id: courseId },
    });

    if (!course || !course.isPublished) {
      return NextResponse.json({ error: "This course is not available" }, { status: 404 });
    }

    // Check if already enrolled
    const existingEnrollment = await prisma.enrollment.findUnique({
      where: { userId_courseId: { userId: user.userId, courseId } },
    });

    if (existingEnrollment) {
      return NextResponse.json({ error: "You are already enrolled in this course" }, { status: 400 });
    }

    const enrollment = await prisma.enrollment.create({
      data: {
        userId: user.userId,
        courseId,
        isActive: true,
      },
    });

    return NextResponse.json({ success: true, enrollment }, { status: 201 });
  } catch (error) {
    console.error("Error enrolling in course:", error);
    return NextResponse.json({ error: "Failed to enroll in course" }, { status: 500 });
  }
}
