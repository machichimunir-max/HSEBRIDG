import { redirect } from "next/navigation";
import { prisma } from "@/lib/db";
import { getCurrentUser } from "@/lib/session";
import LearningPlayerClient from "./LearningPlayerClient";

export default async function LearnCoursePage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const user = await getCurrentUser();

  if (!user || user.role !== "STUDENT") {
    redirect("/login");
  }

  const course = await prisma.course.findUnique({
    where: { slug },
    include: {
      modules: {
        orderBy: [{ order: "asc" }],
        include: {
          lessons: {
            orderBy: [{ order: "asc" }],
            include: {
              videoMetadata: true,
              progress: {
                where: { userId: user.userId },
                select: { isCompleted: true, completionPercent: true, isStarted: true },
              },
            },
          },
        },
      },
    },
  });

  if (!course || !course.isPublished) {
    return (
      <main className="min-h-screen bg-slate-950 px-6 py-10 text-slate-50">
        <div className="mx-auto max-w-2xl text-center">
          <p className="text-sm uppercase tracking-[0.2em] text-cyan-300">Erreur</p>
          <h1 className="mt-4 text-4xl font-bold">Cette formation n'est pas disponible</h1>
        </div>
      </main>
    );
  }

  const enrollment = await prisma.enrollment.findUnique({
    where: { userId_courseId: { userId: user.userId, courseId: course.id } },
  });

  if (!enrollment || !enrollment.isActive) {
    redirect(`/courses/${course.slug}`);
  }

  // Get last watched lesson or first published lesson
  const allLessons = course.modules.flatMap((module) => module.lessons);
  const lastWatchedLesson = await prisma.lessonProgress.findFirst({
    where: { userId: user.userId, lesson: { module: { courseId: course.id } } },
    orderBy: [{ lastWatchedAt: "desc" }],
    select: { lessonId: true },
  });

  const currentLessonId =
    lastWatchedLesson?.lessonId ??
    allLessons.find((l) => l.status === "PUBLISHED")?.id ??
    allLessons[0]?.id;

  // Build user progress map
  const userProgress: Record<string, { isCompleted: boolean; completionPercent: number }> = {};
  allLessons.forEach((lesson) => {
    const progress = lesson.progress[0];
    userProgress[lesson.id] = {
      isCompleted: progress?.isCompleted ?? false,
      completionPercent: progress?.completionPercent ?? 0,
    };
  });

  // Serialize for client
  const serializedCourse = JSON.parse(JSON.stringify(course));
  const serializedModules = JSON.parse(JSON.stringify(course.modules));

  return (
    <LearningPlayerClient
      course={serializedCourse}
      modules={serializedModules}
      currentLessonId={currentLessonId}
      userProgress={userProgress}
    />
  );
}
