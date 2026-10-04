import { NextRequest, NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/session";
import { prisma } from "@/lib/db";

export async function POST(request: NextRequest) {
  try {
    const user = await getCurrentUser();
    if (!user || user.role !== "ADMIN") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { courseId, email } = await request.json();

    if (!courseId || !email) {
      return NextResponse.json({ error: "Course ID and email are required" }, { status: 400 });
    }

    // Find the student by email
    const student = await prisma.user.findUnique({
      where: { email },
    });

    if (!student) {
      return NextResponse.json({ error: "Student not found with this email" }, { status: 404 });
    }

    if (student.role !== "STUDENT") {
      return NextResponse.json({ error: "User is not a student" }, { status: 400 });
    }

    // Check if course exists
    const course = await prisma.course.findUnique({
      where: { id: courseId },
    });

    if (!course) {
      return NextResponse.json({ error: "Course not found" }, { status: 404 });
    }

    // Check if already enrolled
    const existingEnrollment = await prisma.enrollment.findUnique({
      where: {
        userId_courseId: {
          userId: student.id,
          courseId,
        },
      },
    });

    if (existingEnrollment) {
      if (existingEnrollment.isActive) {
        return NextResponse.json({ error: "Student is already enrolled in this course" }, { status: 400 });
      } else {
        // Reactivate enrollment
        const updated = await prisma.enrollment.update({
          where: { id: existingEnrollment.id },
          data: { isActive: true, enrolledAt: new Date() },
        });
        return NextResponse.json({ success: true, enrollment: updated });
      }
    }

    // Create new enrollment
    const enrollment = await prisma.enrollment.create({
      data: {
        userId: student.id,
        courseId,
        isActive: true,
      },
    });

    return NextResponse.json({ success: true, enrollment });
  } catch (error) {
    console.error("Error creating manual enrollment:", error);
    return NextResponse.json({ error: "Failed to enroll student" }, { status: 500 });
  }
}
