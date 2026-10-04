import Link from "next/link";
import { redirect } from "next/navigation";
import { getCurrentUser } from "@/lib/session";
import { prisma } from "@/lib/db";

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

  const completedLessons = progressByLessonId.size;

  const recentLesson = await prisma.lessonProgress.findFirst({
    where: { userId: user.userId },
    orderBy: [{ lastWatchedAt: "desc" }],
    include: { lesson: { include: { module: { include: { course: true } } } } },
  });

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
    <main className="min-h-screen bg-slate-950 px-4 py-10 text-slate-50 md:px-6">
      <div className="mx-auto max-w-6xl">
        <header className="mb-8 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div>
            <p className="text-sm uppercase tracking-[0.2em] text-cyan-300">Student</p>
            <h1 className="mt-2 text-3xl font-bold">Dashboard</h1>
          </div>
          <div className="rounded-full border border-slate-700 bg-slate-900 px-4 py-2 text-sm text-slate-200">
            Welcome, {user.email}
          </div>
        </header>

        <section className="grid gap-4 md:grid-cols-3">
          <StatCard label="Active courses" value={String(dashboardCourses.length)} />
          <StatCard label="Completed lessons" value={String(completedLessons)} />
          <StatCard label="Overall progress" value={`${overallProgress}%`} />
        </section>

        <section className="mt-8 grid gap-6 lg:grid-cols-[1.4fr_0.8fr]">
          <div className="rounded-3xl border border-slate-800 bg-slate-900 p-5">
            <h2 className="mb-5 text-xl font-semibold">My courses</h2>
            <div className="space-y-4">
              {dashboardCourses.length === 0 ? (
                <div className="rounded-2xl border border-dashed border-slate-700 p-5 text-sm text-slate-400">
                  You are not enrolled in any courses yet.
                </div>
              ) : (
                dashboardCourses.map((course) => (
                  <article key={course.id} className="rounded-2xl border border-slate-800 bg-slate-950/50 p-4">
                    <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                      <div className="flex items-center gap-4">
                        {course.thumbnail ? (
                          <img src={course.thumbnail} alt={course.title} className="h-16 w-20 rounded-xl object-cover" />
                        ) : (
                          <div className="flex h-16 w-20 items-center justify-center rounded-xl bg-slate-800 text-xs text-slate-400">Course</div>
                        )}
                        <div>
                          <h3 className="text-lg font-semibold text-white">{course.title}</h3>
                          <p className="mt-1 text-sm text-slate-400">{course.modules.length} modules</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-3">
                        <span className="rounded-full bg-emerald-500/10 px-2 py-1 text-xs font-medium text-emerald-300">
                          {course.progressPercent}%
                        </span>
                        <Link href={`/courses/${course.slug}`} className="rounded-full bg-cyan-500 px-4 py-2 text-sm font-medium text-slate-950">
                          Continue
                        </Link>
                      </div>
                    </div>
                    <div className="mt-4 h-2.5 rounded-full bg-slate-800">
                      <div className="h-2.5 rounded-full bg-cyan-400" style={{ width: `${course.progressPercent}%` }} />
                    </div>
                  </article>
                ))
              )}
            </div>
          </div>

          <aside className="rounded-3xl border border-slate-800 bg-slate-900 p-5">
            <h2 className="mb-4 text-xl font-semibold">Recently watched</h2>
            {recentLesson ? (
              <div className="rounded-2xl border border-slate-800 bg-slate-950/60 p-4">
                <p className="text-sm text-slate-400">{recentLesson.lesson.module.course.title}</p>
                <h3 className="mt-2 text-lg font-semibold text-white">{recentLesson.lesson.title}</h3>
                <p className="mt-2 text-sm text-slate-400">Last watched: {new Date(recentLesson.lastWatchedAt ?? Date.now()).toLocaleDateString()}</p>
                <Link href={`/courses/${recentLesson.lesson.module.course.slug}`} className="mt-4 inline-block rounded-full border border-slate-700 px-3 py-2 text-sm text-slate-200">
                  Resume
                </Link>
              </div>
            ) : (
              <div className="rounded-2xl border border-dashed border-slate-700 p-4 text-sm text-slate-400">
                No lessons watched yet.
              </div>
            )}
          </aside>
        </section>
      </div>
    </main>
  );
}

function StatCard({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-2xl border border-slate-800 bg-slate-900 p-5">
      <p className="text-sm text-slate-400">{label}</p>
      <p className="mt-3 text-3xl font-bold text-white">{value}</p>
    </div>
  );
}
