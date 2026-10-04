import Link from "next/link";
import { notFound } from "next/navigation";
import { prisma } from "@/lib/db";

export default async function StudentDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = await params;
  const studentId = resolvedParams.id;

  const student = await prisma.user.findUnique({
    where: { id: studentId, role: "STUDENT" },
    include: {
      enrollments: {
        where: { isActive: true },
        include: {
          course: {
            include: {
              modules: {
                include: {
                  lessons: true,
                },
              },
            },
          },
        },
      },
      lessonProgress: {
        include: {
          lesson: {
            include: {
              module: {
                include: {
                  course: {
                    select: { id: true, title: true },
                  },
                },
              },
            },
          },
        },
      },
    },
  });

  if (!student) {
    notFound();
  }

  // Calculate overall progress
  const completedLessons = student.lessonProgress.filter((p) => p.isCompleted).length;
  const totalLessons = student.lessonProgress.length;
  const overallProgress = totalLessons > 0 ? Math.round((completedLessons / totalLessons) * 100) : 0;

  return (
    <div className="mx-auto max-w-7xl">
      {/* Header */}
      <div className="mb-6 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Link
            href="/admin/students"
            className="rounded-lg p-2 text-slate-400 transition-colors hover:bg-slate-800 hover:text-white"
          >
            <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
          </Link>
          <div>
            <h1 className="text-3xl font-bold text-white">Student Details</h1>
            <p className="mt-1 text-sm text-slate-400">View student information and progress</p>
          </div>
        </div>
      </div>

      {/* Student Info Card */}
      <div className="mb-8 rounded-3xl border border-slate-800 bg-slate-900/50 backdrop-blur-sm p-6">
        <div className="flex flex-col items-start gap-6 md:flex-row md:items-center">
          <div className="flex h-20 w-20 items-center justify-center rounded-full bg-cyan-500/10 text-3xl font-bold text-cyan-300">
            {student.name?.charAt(0).toUpperCase() || student.email.charAt(0).toUpperCase()}
          </div>
          <div className="flex-1">
            <h2 className="text-2xl font-bold text-white">{student.name || "Unnamed Student"}</h2>
            <p className="mt-1 text-slate-400">{student.email}</p>
            <div className="mt-4 flex flex-wrap gap-4 text-sm">
              <div>
                <span className="text-slate-500">Joined: </span>
                <span className="text-white">{new Date(student.createdAt).toLocaleDateString()}</span>
              </div>
              <div>
                <span className="text-slate-500">Enrollments: </span>
                <span className="text-white">{student.enrollments.length}</span>
              </div>
              <div>
                <span className="text-slate-500">Overall Progress: </span>
                <span className="text-white">{overallProgress}%</span>
              </div>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <div className="h-24 w-24">
              <svg viewBox="0 0 100 100" className="-rotate-90">
                <circle
                  cx="50"
                  cy="50"
                  r="40"
                  fill="none"
                  stroke="#1e293b"
                  strokeWidth="8"
                />
                <circle
                  cx="50"
                  cy="50"
                  r="40"
                  fill="none"
                  stroke="#06b6d4"
                  strokeWidth="8"
                  strokeDasharray={`${(overallProgress / 100) * 251.2} 251.2`}
                  strokeLinecap="round"
                />
              </svg>
              <div className="relative -mt-16 text-center">
                <p className="text-xl font-bold text-white">{overallProgress}%</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Enrollments */}
      <div className="rounded-3xl border border-slate-800 bg-slate-900/50 backdrop-blur-sm p-6">
        <h3 className="mb-4 text-xl font-semibold text-white">Enrolled Courses</h3>

        {student.enrollments.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-slate-700 bg-slate-950/30 p-8 text-center">
            <p className="text-sm text-slate-400">This student is not enrolled in any courses yet</p>
          </div>
        ) : (
          <div className="space-y-4">
            {student.enrollments.map((enrollment) => {
              const courseModules = enrollment.course.modules;
              const totalCourseLessons = courseModules.reduce((acc, m) => acc + m.lessons.length, 0);
              const completedCourseLessons = student.lessonProgress.filter(
                (p) =>
                  p.isCompleted &&
                  courseModules.some((m) => m.lessons.some((l) => l.id === p.lessonId))
              ).length;
              const courseProgress =
                totalCourseLessons > 0 ? Math.round((completedCourseLessons / totalCourseLessons) * 100) : 0;

              return (
                <div
                  key={enrollment.id}
                  className="rounded-2xl border border-slate-800 bg-slate-950/50 p-5"
                >
                  <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
                    <div className="flex-1">
                      <div className="flex items-start gap-3">
                        {enrollment.course.thumbnail ? (
                          <img
                            src={enrollment.course.thumbnail}
                            alt={enrollment.course.title}
                            className="h-16 w-24 rounded-lg object-cover"
                          />
                        ) : (
                          <div className="flex h-16 w-24 items-center justify-center rounded-lg bg-slate-800 text-xs text-slate-400">
                            No image
                          </div>
                        )}
                        <div className="flex-1">
                          <Link
                            href={`/admin/courses/${enrollment.course.id}`}
                            className="text-lg font-semibold text-white hover:text-cyan-300 transition-colors"
                          >
                            {enrollment.course.title}
                          </Link>
                          <div className="mt-2 flex flex-wrap gap-3 text-sm text-slate-400">
                            <span>{courseModules.length} modules</span>
                            <span>•</span>
                            <span>{totalCourseLessons} lessons</span>
                            <span>•</span>
                            <span>Enrolled {new Date(enrollment.enrolledAt).toLocaleDateString()}</span>
                          </div>
                        </div>
                      </div>

                      {/* Progress Details */}
                      <div className="mt-4">
                        <div className="mb-2 flex items-center justify-between text-sm">
                          <span className="text-slate-400">Course Progress</span>
                          <span className="font-medium text-white">
                            {completedCourseLessons} / {totalCourseLessons} lessons completed
                          </span>
                        </div>
                        <div className="h-2 overflow-hidden rounded-full bg-slate-800">
                          <div
                            className="h-full bg-gradient-to-r from-cyan-500 to-cyan-400 transition-all"
                            style={{ width: `${courseProgress}%` }}
                          />
                        </div>

                        {/* Module Breakdown */}
                        <div className="mt-4 space-y-2">
                          {courseModules.map((module) => {
                            const moduleLessonIds = module.lessons.map((l) => l.id);
                            const completedModuleLessons = student.lessonProgress.filter(
                              (p) => p.isCompleted && moduleLessonIds.includes(p.lessonId)
                            ).length;
                            const moduleProgress =
                              module.lessons.length > 0
                                ? Math.round((completedModuleLessons / module.lessons.length) * 100)
                                : 0;

                            return (
                              <div
                                key={module.id}
                                className="flex items-center gap-3 rounded-lg border border-slate-800 bg-slate-900/50 p-3"
                              >
                                <div className="flex-1">
                                  <p className="text-sm font-medium text-white">{module.title}</p>
                                  <p className="text-xs text-slate-500">
                                    {completedModuleLessons} / {module.lessons.length} lessons
                                  </p>
                                </div>
                                <div className="flex items-center gap-2">
                                  <div className="h-1.5 w-20 overflow-hidden rounded-full bg-slate-800">
                                    <div
                                      className="h-full bg-cyan-500"
                                      style={{ width: `${moduleProgress}%` }}
                                    />
                                  </div>
                                  <span className="text-xs text-slate-400">{moduleProgress}%</span>
                                </div>
                              </div>
                            );
                          })}
                        </div>
                      </div>
                    </div>

                    <div className="flex flex-col gap-2">
                      <Link
                        href={`/courses/${enrollment.course.slug}`}
                        className="rounded-lg border border-slate-700 px-4 py-2 text-center text-sm text-slate-200 transition-colors hover:bg-slate-800"
                      >
                        View Course
                      </Link>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
