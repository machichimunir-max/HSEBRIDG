"use client";

import Link from "next/link";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { useI18n } from "@/lib/i18n/I18nContext";

export default function CourseDetailClient({ course, isEnrolled, currentUser }: any) {
  const { t } = useI18n();
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const totalLessons = course.modules?.reduce((sum: number, module: any) => sum + module.lessons.length, 0) || 0;

  const handleEnroll = async () => {
    setLoading(true);
    setError("");
    try {
      const response = await fetch("/api/enrollments", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ courseId: course.id }),
      });

      if (!response.ok) {
        const data = await response.json();
        setError(data.error || t.student.enrolling);
        return;
      }

      router.refresh();
    } catch (err) {
      setError(t.student.enrolling);
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen bg-slate-950 px-4 py-10 text-slate-50 md:px-6">
      <div className="mx-auto max-w-6xl">
        <div className="overflow-hidden rounded-3xl border border-slate-800 bg-slate-900">
          <div className="grid gap-0 lg:grid-cols-[1.2fr_0.8fr]">
            <div className="p-8">
              <p className="text-sm uppercase tracking-[0.2em] text-cyan-300">{t.student.courseDetail}</p>
              <h1 className="mt-4 text-4xl font-bold">{course.title}</h1>
              <p className="mt-4 max-w-xl text-slate-300">{course.description || course.shortDescription}</p>

              <div className="mt-6 flex flex-wrap gap-4 text-sm text-slate-300">
                {course.category && (
                  <span className="rounded-full border border-cyan-500/30 bg-cyan-500/10 px-3 py-1.5 text-cyan-300">
                    {course.category}
                  </span>
                )}
                {course.level && <span className="rounded-full border border-slate-700 px-3 py-1.5">{course.level}</span>}
                <span className="rounded-full border border-slate-700 px-3 py-1.5">{course.modules?.length || 0} {t.student.modules}</span>
                <span className="rounded-full border border-slate-700 px-3 py-1.5">{totalLessons} {t.student.lessons}</span>
                {course.duration && <span className="rounded-full border border-slate-700 px-3 py-1.5">{course.duration} min</span>}
              </div>

              <div className="mt-8">
                {currentUser && currentUser.role === "STUDENT" && !isEnrolled ? (
                  <div>
                    <button
                      onClick={handleEnroll}
                      disabled={loading}
                      className="rounded-full bg-cyan-500 px-6 py-3 font-medium text-slate-950 disabled:opacity-50"
                    >
                      {loading ? t.student.enrolling : t.student.enrollButton}
                    </button>
                    {error && <p className="mt-3 text-sm text-rose-300">{error}</p>}
                  </div>
                ) : null}

                {currentUser && currentUser.role === "STUDENT" && isEnrolled ? (
                  <Link
                    href={`/courses/${course.slug}/learn`}
                    className="inline-block rounded-full bg-emerald-500 px-6 py-3 font-medium text-slate-950"
                  >
                    {t.student.continueFormation}
                  </Link>
                ) : null}

                {!currentUser ? (
                  <Link
                    href="/login"
                    className="inline-block rounded-full border border-slate-700 px-6 py-3 font-medium text-slate-100"
                  >
                    {t.student.loginToEnroll}
                  </Link>
                ) : null}
              </div>
            </div>

            <div className="p-8">
              {course.thumbnail ? (
                <img src={course.thumbnail} alt={course.title} className="h-full min-h-[220px] w-full rounded-3xl object-cover" />
              ) : (
                <div className="flex h-full min-h-[220px] items-center justify-center rounded-3xl bg-slate-800 text-slate-400">
                  {t.catalog.title}
                </div>
              )}
            </div>
          </div>
        </div>

        <section className="mt-8 rounded-3xl border border-slate-800 bg-slate-900 p-6">
          <h2 className="mb-5 text-2xl font-semibold">{t.student.programTitle}</h2>
          <div className="space-y-5">
            {course.modules?.map((module: any) => (
              <div key={module.id} className="rounded-2xl border border-slate-800 bg-slate-950/50 p-4">
                <h3 className="text-xl font-semibold text-white">{module.title}</h3>
                {module.description ? <p className="mt-2 text-sm text-slate-400">{module.description}</p> : null}
                <div className="mt-4 space-y-2">
                  {module.lessons?.map((lesson: any) => (
                    <div key={lesson.id} className="flex items-center justify-between gap-3 rounded-xl border border-slate-800 bg-slate-900 px-3 py-2">
                      <span className="text-slate-200">{lesson.title}</span>
                      <span className="text-xs uppercase tracking-[0.2em] text-slate-400">
                        {lesson.isPreview ? t.student.preview : t.student.locked}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </section>
      </div>
    </main>
  );
}