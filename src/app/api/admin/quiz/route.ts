import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { getCurrentUser } from "@/lib/session";
import { requireRole } from "@/lib/authorization";

interface QuestionInput {
  question: string;
  options: string[];
  correctAnswer: number;
}

// GET /api/admin/quiz?courseId=xxx - Fetch quiz for a course
export async function GET(req: NextRequest) {
  try {
    const user = await getCurrentUser();
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const hasAccess = await requireRole("ADMIN", user);
    if (!hasAccess) {
      return NextResponse.json({ error: "Admin access required" }, { status: 403 });
    }

    const { searchParams } = new URL(req.url);
    const courseId = searchParams.get("courseId");

    if (!courseId) {
      return NextResponse.json({ error: "courseId required" }, { status: 400 });
    }

    const quiz = await prisma.quiz.findUnique({
      where: { courseId },
      include: {
        questions: {
          orderBy: { order: "asc" },
        },
      },
    });

    return NextResponse.json(quiz);
  } catch (error) {
    console.error("Quiz fetch error:", error);
    return NextResponse.json(
      { error: "Failed to fetch quiz" },
      { status: 500 }
    );
  }
}

// POST /api/admin/quiz - Create or update quiz
export async function POST(req: NextRequest) {
  try {
    const user = await getCurrentUser();
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const hasAccess = await requireRole("ADMIN", user);
    if (!hasAccess) {
      return NextResponse.json({ error: "Admin access required" }, { status: 403 });
    }

    const body = await req.json();
    const { courseId, passingScore, timeLimit, questions } = body;

    // Validation
    if (!courseId) {
      return NextResponse.json({ error: "courseId required" }, { status: 400 });
    }

    if (
      typeof passingScore !== "number" ||
      passingScore < 1 ||
      passingScore > 100
    ) {
      return NextResponse.json(
        { error: "passingScore must be between 1 and 100" },
        { status: 400 }
      );
    }

    if (!Array.isArray(questions) || questions.length === 0) {
      return NextResponse.json(
        { error: "At least one question is required" },
        { status: 400 }
      );
    }

    // Validate each question
    for (const q of questions) {
      if (!q.question || typeof q.question !== "string") {
        return NextResponse.json(
          { error: "Each question must have text" },
          { status: 400 }
        );
      }
      if (!Array.isArray(q.options) || q.options.length < 2) {
        return NextResponse.json(
          { error: "Each question must have at least 2 options" },
          { status: 400 }
        );
      }
      if (
        typeof q.correctAnswer !== "number" ||
        q.correctAnswer < 0 ||
        q.correctAnswer >= q.options.length
      ) {
        return NextResponse.json(
          { error: "Invalid correctAnswer index" },
          { status: 400 }
        );
      }
    }

    // Check if quiz exists
    const existingQuiz = await prisma.quiz.findUnique({
      where: { courseId },
      include: { questions: true },
    });

    if (existingQuiz) {
      // Update existing quiz
      // Delete old questions and create new ones
      await prisma.quizQuestion.deleteMany({
        where: { quizId: existingQuiz.id },
      });

      await prisma.quiz.update({
        where: { id: existingQuiz.id },
        data: {
          passingScore,
          timeLimit: timeLimit || null,
          questions: {
            create: questions.map((q: QuestionInput, index: number) => ({
              question: q.question,
              options: q.options,
              correctAnswer: q.correctAnswer,
              order: index + 1,
            })),
          },
        },
      });

      const updatedQuiz = await prisma.quiz.findUnique({
        where: { id: existingQuiz.id },
        include: { questions: { orderBy: { order: "asc" } } },
      });

      return NextResponse.json(updatedQuiz);
    } else {
      // Create new quiz
      const newQuiz = await prisma.quiz.create({
        data: {
          courseId,
          passingScore,
          timeLimit: timeLimit || null,
          questions: {
            create: questions.map((q: QuestionInput, index: number) => ({
              question: q.question,
              options: q.options,
              correctAnswer: q.correctAnswer,
              order: index + 1,
            })),
          },
        },
        include: {
          questions: { orderBy: { order: "asc" } },
        },
      });

      return NextResponse.json(newQuiz, { status: 201 });
    }
  } catch (error) {
    console.error("Quiz save error:", error);
    return NextResponse.json(
      { error: "Failed to save quiz" },
      { status: 500 }
    );
  }
}

// DELETE /api/admin/quiz?courseId=xxx - Delete quiz
export async function DELETE(req: NextRequest) {
  try {
    const user = await getCurrentUser();
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const hasAccess = await requireRole("ADMIN", user);
    if (!hasAccess) {
      return NextResponse.json({ error: "Admin access required" }, { status: 403 });
    }

    const { searchParams } = new URL(req.url);
    const courseId = searchParams.get("courseId");

    if (!courseId) {
      return NextResponse.json({ error: "courseId required" }, { status: 400 });
    }

    const quiz = await prisma.quiz.findUnique({
      where: { courseId },
    });

    if (!quiz) {
      return NextResponse.json({ error: "Quiz not found" }, { status: 404 });
    }

    // Cascade delete (questions and attempts will be deleted via onDelete: Cascade)
    await prisma.quiz.delete({
      where: { id: quiz.id },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Quiz delete error:", error);
    return NextResponse.json(
      { error: "Failed to delete quiz" },
      { status: 500 }
    );
  }
}
