import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { getCurrentUser } from "@/lib/session";

// POST /api/quiz/[id]/submit - Submit quiz answers and calculate score
export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const user = await getCurrentUser();
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id: quizId } = await params;
    const body = await req.json();
    const { answers } = body; // answers is an object: { questionId: selectedOptionIndex }

    if (!answers || typeof answers !== "object") {
      return NextResponse.json(
        { error: "Invalid answers format" },
        { status: 400 }
      );
    }

    // Fetch quiz with correct answers
    const quiz = await prisma.quiz.findUnique({
      where: { id: quizId },
      include: {
        course: true,
        questions: {
          orderBy: { order: "asc" },
        },
      },
    });

    if (!quiz) {
      return NextResponse.json({ error: "Quiz not found" }, { status: 404 });
    }

    // Verify enrollment
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

    // Calculate score
    let correctCount = 0;
    const results = quiz.questions.map((q) => {
      const userAnswer = answers[q.id];
      const isCorrect =
        typeof userAnswer === "number" && userAnswer === q.correctAnswer;
      if (isCorrect) correctCount++;

      return {
        questionId: q.id,
        question: q.question,
        userAnswer,
        correctAnswer: q.correctAnswer,
        isCorrect,
      };
    });

    const score = Math.round((correctCount / quiz.questions.length) * 100);
    const passed = score >= quiz.passingScore;

    // Save attempt
    const attempt = await prisma.quizAttempt.create({
      data: {
        userId: user.userId,
        quizId: quiz.id,
        score,
        passed,
        answers: answers,
      },
    });

    // If passed for the first time, generate attestation
    let attestation = null;
    if (passed) {
      // Check if attestation already exists
      attestation = await prisma.attestation.findUnique({
        where: {
          userId_courseId: {
            userId: user.userId,
            courseId: quiz.courseId,
          },
        },
      });

      if (!attestation) {
        // Generate unique certificate number
        const certificateNumber = `HSE-${Date.now()}-${user.userId.slice(-6).toUpperCase()}`;

        attestation = await prisma.attestation.create({
          data: {
            userId: user.userId,
            courseId: quiz.courseId,
            certificateNumber,
            issuedAt: new Date(),
            pdfUrl: null, // PDF will be generated on-demand
          },
        });
      }
    }

    return NextResponse.json({
      attemptId: attempt.id,
      score,
      passed,
      passingScore: quiz.passingScore,
      correctCount,
      totalQuestions: quiz.questions.length,
      results,
      attestation: attestation
        ? {
            id: attestation.id,
            certificateNumber: attestation.certificateNumber,
          }
        : null,
    });
  } catch (error) {
    console.error("Quiz submit error:", error);
    return NextResponse.json(
      { error: "Failed to submit quiz" },
      { status: 500 }
    );
  }
}
