"use client";

import Link from "next/link";
import { useI18n } from "@/lib/i18n/I18nContext";
import { LanguageSwitcher } from "@/components/brand/LanguageSwitcher";

interface ClientDashboardProps {
  user: { email: string };
  dashboardCourses: any[];
  completedLessons: number;
  overallProgress: number;
  recentLesson: any;
}

export function ClientDashboard({
  user,
  dashboardCourses,
  completedLessons,
  overallProgress,
  recentLesson,
}: ClientDashboardProps) {
  const { t } = useI18n();

  return (
    <main className="min-h-screen bg-slate-950 px-4 py-10 text-slate-50 md:px-6">
      <div className="mx-auto max-w-6xl">
        <header className="mb-8 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div>
            <p className="text-sm uppercase tracking-[0.2em] text-[#FDCD1A] font-bold">{t.navigation.student}</p>
            <h1 className="mt-2 text-3xl font-bold">{t.student.dashboardTitle}</h1>
          </div>
          <div className="flex items-center gap-3">
            <div className="rounded-full border border-slate-700 bg-slate-900 px-4 py-2 text-sm text-slate-200">
              {t.student.welcome}, {user.email}
            </div>
            <LanguageSwitcher />
          </div>
        </header>

        <section className="grid gap-4 md:grid-cols-3">
          <StatCard label={t.student.activeCourses} value={String(dashboardCourses.length)} />
          <StatCard label={t.student.completedLessons} value={String(completedLessons)} />
          <StatCard label={t.student.overallProgress} value={`${overallProgress}%`} />
        </section>

        <section className="mt-8 grid gap-6 lg:grid-cols-[1.4fr_0.8fr]">
          <div className="rounded-3xl border border-slate-800 bg-slate-900 p-5">
            <h2 className="mb-5 text-xl font-semibold">{t.student.myCoursesTitle}</h2>
            <div className="space-y-4">
              {dashboardCourses.length === 0 ? (
                <div className="rounded-2xl border border-dashed border-slate-700 p-5 text-sm text-slate-400">
                  {t.student.noCoursesYet}
                </div>
              ) : (
                dashboardCourses.map((course) => (
                  <article key={course.id} className="rounded-2xl border border-slate-800 bg-slate-950/50 p-4">
                    <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                      <div className="flex items-center gap-4">
                        {course.thumbnail ? (
                          <img src={course.thumbnail} alt={course.title} className="h-16 w-20 rounded-xl object-cover" />
                        ) : (
                          <div className="flex h-16 w-20 items-center justify-center rounded-xl bg-slate-800 text-xs text-slate-400">
                            {t.catalog.title}
                          </div>
                        )}
                        <div>
                          <h3 className="text-lg font-semibold text-white">{course.title}</h3>
                          <p className="mt-1 text-sm text-slate-400">{course.modules.length} {t.student.modules}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-3">
                        <span className="rounded-full bg-emerald-500/10 px-2 py-1 text-xs font-medium text-emerald-300">
                          {course.progressPercent}%
                        </span>
                        <Link
                          href={`/courses/${course.slug}`}
                          className="rounded-full bg-[#FDCD1A] px-4 py-2 text-sm font-bold text-[#0A0A0A] hover:bg-[#e5b917] transition-colors"
                        >
                          {t.student.continueButton}
                        </Link>
                      </div>
                    </div>
                    <div className="mt-4 h-2.5 rounded-full bg-slate-800">
                      <div className="h-2.5 rounded-full bg-[#FDCD1A]" style={{ width: `${course.progressPercent}%` }} />
                    </div>
                  </article>
                ))
              )}
            </div>
          </div>

          <aside className="rounded-3xl border border-slate-800 bg-slate-900 p-5">
            <h2 className="mb-4 text-xl font-semibold">{t.student.recentlyWatched}</h2>
            {recentLesson ? (
              <div className="rounded-2xl border border-slate-800 bg-slate-950/60 p-4">
                <p className="text-sm text-slate-400">{recentLesson.lesson.module.course.title}</p>
                <h3 className="mt-2 text-lg font-semibold text-white">{recentLesson.lesson.title}</h3>
                <p className="mt-2 text-sm text-slate-400">
                  {t.student.lastWatched}: {new Date(recentLesson.lastWatchedAt).toLocaleDateString()}
                </p>
                <Link
                  href={`/courses/${recentLesson.lesson.module.course.slug}`}
                  className="mt-4 inline-block rounded-full border border-slate-700 px-3 py-2 text-sm text-slate-200"
                >
                  {t.student.resumeButton}
                </Link>
              </div>
            ) : (
              <div className="rounded-2xl border border-dashed border-slate-700 p-4 text-sm text-slate-400">
                {t.student.noLessonsWatched}
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
