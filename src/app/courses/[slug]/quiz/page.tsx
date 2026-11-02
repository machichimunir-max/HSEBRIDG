import { redirect } from "next/navigation";
import { prisma } from "@/lib/db";
import { getCurrentUser } from "@/lib/session";
import QuizClient from "./QuizClient";

export default async function QuizPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const user = await getCurrentUser();
  if (!user) {
    redirect("/login");
  }

  const { slug } = await params;

  // Fetch course
  const course = await prisma.course.findUnique({
    where: { slug },
    include: {
      quiz: {
        include: {
          questions: {
            orderBy: { order: "asc" },
          },
        },
      },
      modules: {
        include: {
          lessons: {
            orderBy: { order: "asc" },
          },
        },
        orderBy: { order: "asc" },
      },
    },
  });

  if (!course) {
    redirect("/catalog");
  }

  // Check enrollment
  const enrollment = await prisma.enrollment.findUnique({
    where: {
      userId_courseId: {
        userId: user.userId,
        courseId: course.id,
      },
    },
  });

  if (!enrollment) {
    redirect(`/courses/${slug}`);
  }

  // Check if quiz exists
  if (!course.quiz) {
    redirect(`/courses/${slug}/learn`);
  }

  // Check lesson completion
  const totalLessons = course.modules.reduce(
    (sum, m) => sum + m.lessons.length,
    0
  );
  const completedLessons = await prisma.lessonProgress.count({
    where: {
      userId: user.userId,
      lessonId: {
        in: course.modules.flatMap((m) => m.lessons.map((l) => l.id)),
      },
      isCompleted: true,
    },
  });

  const allLessonsCompleted = completedLessons === totalLessons;

  // Get best attempt
  const bestAttempt = await prisma.quizAttempt.findFirst({
    where: {
      userId: user.userId,
      quizId: course.quiz.id,
      passed: true,
    },
    orderBy: {
      score: "desc",
    },
  });

  // Get all attempts
  const attempts = await prisma.quizAttempt.findMany({
    where: {
      userId: user.userId,
      quizId: course.quiz.id,
    },
    orderBy: {
      completedAt: "desc",
    },
  });

  // Get attestation if passed
  const attestation = bestAttempt
    ? await prisma.attestation.findUnique({
        where: {
          userId_courseId: {
            userId: user.userId,
            courseId: course.id,
          },
        },
      })
    : null;

  return (
    <QuizClient
      course={{
        id: course.id,
        title: course.title,
        slug: course.slug,
      }}
      quiz={{
        id: course.quiz.id,
        passingScore: course.quiz.passingScore,
        timeLimit: course.quiz.timeLimit,
        questions: course.quiz.questions.map((q) => ({
          id: q.id,
          question: q.question,
          options: q.options,
          order: q.order,
        })),
      }}
      allLessonsCompleted={allLessonsCompleted}
      alreadyPassed={!!bestAttempt}
      bestScore={bestAttempt?.score || null}
      attempts={attempts.map((a) => ({
        id: a.id,
        score: a.score,
        passed: a.passed,
        completedAt: a.completedAt.toISOString(),
      }))}
      attestation={
        attestation
          ? {
              id: attestation.id,
              certificateNumber: attestation.certificateNumber,
              issuedAt: attestation.issuedAt.toISOString(),
            }
          : null
      }
    />
  );
}
