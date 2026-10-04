"use client";

import Link from "next/link";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { LocalVideoPlayer } from "@/components/LocalVideoPlayer";

export default function LearningPlayerClient({
  course,
  modules,
  currentLessonId,
  userProgress,
}: any) {
  const router = useRouter();
  const [selectedLessonId, setSelectedLessonId] = useState(currentLessonId);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // Find current lesson
  const currentLesson = modules
    .flatMap((m: any) => m.lessons)
    .find((l: any) => l.id === selectedLessonId);

  const allLessons = modules.flatMap((m: any) => m.lessons);
  const currentIndex = allLessons.findIndex((l: any) => l.id === selectedLessonId);
  const nextLesson = currentIndex < allLessons.length - 1 ? allLessons[currentIndex + 1] : null;
  const prevLesson = currentIndex > 0 ? allLessons[currentIndex - 1] : null;

  // Calculate progress
  const completedCount = allLessons.filter((l: any) => userProgress[l.id]?.isCompleted).length;
  const progressPercent = Math.round((completedCount / allLessons.length) * 100);

  const handleMarkComplete = async () => {
    if (!currentLesson) return;
    setLoading(true);
    setError("");

    try {
      const response = await fetch("/api/progress", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          lessonId: currentLesson.id,
          completionPercent: 100,
        }),
      });

      if (!response.ok) {
        const data = await response.json();
        setError(data.error || "Impossible de marquer la leçon comme terminée");
        return;
      }

      router.refresh();
    } catch (err) {
      setError("Erreur lors de la sauvegarde de la progression");
    } finally {
      setLoading(false);
    }
  };

  const handleNavigateTo = (lessonId: string) => {
    setSelectedLessonId(lessonId);
    setError("");
  };

  const handleNext = () => {
    if (nextLesson) {
      handleNavigateTo(nextLesson.id);
    }
  };

  const handlePrev = () => {
    if (prevLesson) {
      handleNavigateTo(prevLesson.id);
    }
  };

  const isCurrentLessonComplete = userProgress[selectedLessonId]?.isCompleted;

  return (
    <main className="min-h-screen bg-slate-950 px-4 py-8 text-slate-50 md:px-6">
      <div className="mx-auto max-w-7xl">
        <div className="mb-6 flex items-center justify-between">
          <div>
            <p className="text-sm uppercase tracking-[0.2em] text-cyan-300">Apprentissage</p>
            <h1 className="mt-2 text-3xl font-bold">{course.title}</h1>
          </div>
          <Link href="/student/dashboard" className="rounded-full border border-slate-700 px-4 py-2 text-sm text-slate-200">
            Tableau de bord
          </Link>
        </div>

        {/* Progress bar */}
        <div className="mb-6 rounded-2xl border border-slate-800 bg-slate-900 p-4">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm text-slate-300">{completedCount} / {allLessons.length} leçons terminées</span>
            <span className="text-sm font-semibold text-cyan-300">{progressPercent}%</span>
          </div>
          <div className="h-2 rounded-full bg-slate-800">
            <div className="h-2 rounded-full bg-cyan-500" style={{ width: `${progressPercent}%` }} />
          </div>
        </div>

        <div className="grid gap-6 xl:grid-cols-[0.85fr_1.15fr]">
          {/* Sidebar - Curriculum */}
          <aside className="rounded-3xl border border-slate-800 bg-slate-900 p-5 h-fit">
            <h2 className="mb-4 text-xl font-semibold">Programme</h2>
            <div className="space-y-4 max-h-[600px] overflow-y-auto">
              {modules.map((module: any) => (
                <div key={module.id} className="rounded-2xl border border-slate-800 bg-slate-950/60 p-3">
                  <h3 className="text-lg font-semibold text-white">{module.title}</h3>
                  <div className="mt-3 space-y-2">
                    {module.lessons.map((lesson: any) => {
                      const progress = userProgress[lesson.id];
                      const isComplete = progress?.isCompleted;
                      const isSelected = lesson.id === selectedLessonId;

                      return (
                        <button
                          key={lesson.id}
                          onClick={() => handleNavigateTo(lesson.id)}
                          className={`w-full text-left flex items-center justify-between rounded-xl border px-3 py-2 transition ${
                            isSelected
                              ? "border-cyan-500/50 bg-cyan-500/10"
                              : isComplete
                              ? "border-emerald-500/30 bg-emerald-500/5"
                              : "border-slate-800 bg-slate-900 hover:border-slate-700"
                          }`}
                        >
                          <span className="text-sm text-slate-200 truncate">{lesson.title}</span>
                          <span className="text-xs ml-2 flex-shrink-0">
                            {isComplete ? "✓" : lesson.isPreview ? "▶" : "○"}
                          </span>
                        </button>
                      );
                    })}
                  </div>
                </div>
              ))}
            </div>
          </aside>

          {/* Main content */}
          <section className="space-y-6">
            {currentLesson ? (
              <>
                <LocalVideoPlayer
                  src={currentLesson.videoMetadata?.providerVideoId || `/videos/sample-lesson.mp4`}
                  title={currentLesson.title}
                  description={currentLesson.description}
                  thumbnail={currentLesson.videoMetadata?.thumbnail || course.thumbnail}
                  poster={currentLesson.videoMetadata?.thumbnail || course.thumbnail}
                  onMarkComplete={handleMarkComplete}
                />

                {/* Lesson info */}
                <div className="rounded-3xl border border-slate-800 bg-slate-900 p-5">
                  <h2 className="text-2xl font-semibold">{currentLesson.title}</h2>
                  <p className="mt-3 text-slate-300">{currentLesson.description || "Aucune description disponible."}</p>
                  <div className="mt-4 flex flex-wrap gap-3 text-sm text-slate-300">
                    <span className="rounded-full border border-slate-700 px-3 py-1.5">
                      {Math.round((currentLesson.durationSeconds ?? 180) / 60)} min
                    </span>
                    <span className="rounded-full border border-slate-700 px-3 py-1.5">
                      {currentLesson.isPreview ? "Aperçu" : "Protégée"}
                    </span>
                    {isCurrentLessonComplete && (
                      <span className="rounded-full border border-emerald-500/30 bg-emerald-500/10 px-3 py-1.5 text-emerald-300">
                        ✓ Terminée
                      </span>
                    )}
                  </div>
                </div>

                {/* Controls */}
                <div className="rounded-3xl border border-slate-800 bg-slate-900 p-5">
                  <div className="flex flex-wrap gap-3">
                    <button
                      onClick={handleMarkComplete}
                      disabled={loading || isCurrentLessonComplete}
                      className="rounded-full bg-cyan-500 px-6 py-2.5 font-medium text-slate-950 disabled:opacity-50"
                    >
                      {loading ? "Enregistrement..." : isCurrentLessonComplete ? "✓ Terminée" : "Marquer comme terminée"}
                    </button>

                    <button
                      onClick={handlePrev}
                      disabled={!prevLesson}
                      className="rounded-full border border-slate-700 px-6 py-2.5 font-medium text-slate-200 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      ← Précédente
                    </button>

                    <button
                      onClick={handleNext}
                      disabled={!nextLesson}
                      className="rounded-full border border-slate-700 px-6 py-2.5 font-medium text-slate-200 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      Suivante →
                    </button>
                  </div>

                  {error && <p className="mt-3 text-sm text-rose-300">{error}</p>}
                </div>
              </>
            ) : (
              <div className="rounded-3xl border border-slate-800 bg-slate-900 p-8 text-center text-slate-300">
                Aucune leçon publiée disponible.
              </div>
            )}
          </section>
        </div>
      </div>
    </main>
  );
}
