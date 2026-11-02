import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { getCurrentUser } from "@/lib/session";

// GET /api/quiz/[id] - Fetch quiz for student (without correct answers)
export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const user = await getCurrentUser();
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id: quizId } = await params;

    const quiz = await prisma.quiz.findUnique({
      where: { id: quizId },
      include: {
        course: {
          select: {
            id: true,
            title: true,
            slug: true,
          },
        },
        questions: {
          orderBy: { order: "asc" },
          select: {
            id: true,
            question: true,
            options: true,
            order: true,
            // DO NOT include correctAnswer - students shouldn't see it
          },
        },
      },
    });

    if (!quiz) {
      return NextResponse.json({ error: "Quiz not found" }, { status: 404 });
    }

    // Check if student is enrolled
    const enrollment = await prisma.enrollment.findUnique({
      where: {
        userId_courseId: {
          userId: user.userId,
          courseId: quiz.courseId,
        },
      },
    });

    if (!enrollment) {
      return NextResponse.json(
        { error: "You must be enrolled in this course" },
        { status: 403 }
      );
    }

    // Check if student has already passed
    const bestAttempt = await prisma.quizAttempt.findFirst({
      where: {
        userId: user.userId,
        quizId: quiz.id,
        passed: true,
      },
      orderBy: {
        score: "desc",
      },
    });

    // Get attempt history
    const attempts = await prisma.quizAttempt.findMany({
      where: {
        userId: user.userId,
        quizId: quiz.id,
      },
      orderBy: {
        completedAt: "desc",
      },
      select: {
        id: true,
        score: true,
        passed: true,
        completedAt: true,
      },
    });

    return NextResponse.json({
      quiz: {
        id: quiz.id,
        passingScore: quiz.passingScore,
        timeLimit: quiz.timeLimit,
        course: quiz.course,
        questions: quiz.questions,
      },
      alreadyPassed: !!bestAttempt,
      bestScore: bestAttempt?.score || null,
      attempts,
    });
  } catch (error) {
    console.error("Quiz fetch error:", error);
    return NextResponse.json(
      { error: "Failed to fetch quiz" },
      { status: 500 }
    );
  }
}
