import Link from "next/link";
import { redirect } from "next/navigation";
import { getCurrentUser } from "@/lib/session";
import { prisma } from "@/lib/db";
import { formatDate } from "@/lib/date-utils";
import { ClientDashboard } from "./ClientDashboard";

export default async function StudentDashboardPage() {
  const user = await getCurrentUser();
  if (!user || user.role !== "STUDENT") {
    redirect("/login");
  }

  const enrollments = await prisma.enrollment.findMany({
    where: { userId: user.userId, isActive: true },
    include: {
      course: {
        include: {
          modules: {
            include: {
              lessons: {
                include: {
                  progress: {
                    where: { userId: user.userId },
                    select: { isCompleted: true, userId: true },
                  },
                },
              },
            },
          },
        },
      },
    },
    orderBy: [{ enrolledAt: "desc" }],
  });

  const completedLessons = await prisma.lessonProgress.count({
    where: { userId: user.userId, isCompleted: true },
  });

  const recentLesson = await prisma.lessonProgress.findFirst({
    where: { userId: user.userId },
    orderBy: [{ lastWatchedAt: "desc" }],
    include: { lesson: { include: { module: { include: { course: true } } } } },
  });

  const lessonProgress = await prisma.lessonProgress.findMany({
    where: {
      userId: user.userId,
      lesson: {
        module: {
          courseId: { in: enrollments.map((enrollment) => enrollment.courseId) },
        },
      },
    },
    select: { lessonId: true, isCompleted: true },
  });

  const progressByLessonId = new Map(lessonProgress.map((entry) => [entry.lessonId, entry]));

  const dashboardCourses = enrollments.map((enrollment) => {
    const lessons = enrollment.course.modules.flatMap((module) => module.lessons);
    const total = lessons.length;
    const finished = lessons.filter((lesson) => progressByLessonId.get(lesson.id)?.isCompleted).length;
    const percent = total > 0 ? Math.round((finished / total) * 100) : 0;
    return { ...enrollment.course, progressPercent: percent };
  });

  const overallProgress = dashboardCourses.length > 0
    ? Math.round(dashboardCourses.reduce((sum, course) => sum + course.progressPercent, 0) / dashboardCourses.length)
    : 0;

  return (
    <ClientDashboard
      user={{ email: user.email }}
      dashboardCourses={dashboardCourses}
      completedLessons={completedLessons}
      overallProgress={overallProgress}
      recentLesson={recentLesson ? {
        lesson: {
          title: recentLesson.lesson.title,
          module: {
            course: {
              title: recentLesson.lesson.module.course.title,
              slug: recentLesson.lesson.module.course.slug,
            }
          }
        },
        lastWatchedAt: recentLesson.lastWatchedAt?.toISOString() || new Date().toISOString(),
      } : null}
    />
  );
}
