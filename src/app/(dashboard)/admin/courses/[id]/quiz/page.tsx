"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useI18n } from "@/lib/i18n/I18nContext";
import { TrashIcon, PlusIcon } from "@/components/icons/HseIcons";

interface QuizQuestion {
  id?: string;
  question: string;
  options: string[];
  correctAnswer: number;
  order: number;
}

interface Quiz {
  id: string;
  courseId: string;
  passingScore: number;
  timeLimit: number | null;
  questions: QuizQuestion[];
}

export default function CourseQuizPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { t, isRtl } = useI18n();
  const router = useRouter();
  const [courseId, setCourseId] = useState<string>("");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [quiz, setQuiz] = useState<Quiz | null>(null);

  const [passingScore, setPassingScore] = useState(70);
  const [timeLimit, setTimeLimit] = useState<number | null>(null);
  const [questions, setQuestions] = useState<QuizQuestion[]>([
    { question: "", options: ["", ""], correctAnswer: 0, order: 1 },
  ]);

  useEffect(() => {
    async function loadQuiz() {
      const resolvedParams = await params;
      const id = resolvedParams.id;
      setCourseId(id);

      try {
        const response = await fetch(`/api/admin/quiz?courseId=${id}`);
        if (response.ok) {
          const data = await response.json();
          if (data) {
            setQuiz(data);
            setPassingScore(data.passingScore);
            setTimeLimit(data.timeLimit);
            setQuestions(
              data.questions.map((q: QuizQuestion) => ({
                id: q.id,
                question: q.question,
                options: q.options,
                correctAnswer: q.correctAnswer,
                order: q.order,
              }))
            );
          }
        }
      } catch (err) {
        console.error("Failed to load quiz:", err);
      } finally {
        setLoading(false);
      }
    }
    loadQuiz();
  }, [params]);

  const addQuestion = () => {
    setQuestions([
      ...questions,
      {
        question: "",
        options: ["", ""],
        correctAnswer: 0,
        order: questions.length + 1,
      },
    ]);
  };

  const removeQuestion = (index: number) => {
    const updated = questions.filter((_, i) => i !== index);
    setQuestions(updated.map((q, i) => ({ ...q, order: i + 1 })));
  };

  const updateQuestion = (index: number, field: keyof QuizQuestion, value: QuizQuestion[keyof QuizQuestion]) => {
    const updated = [...questions];
    (updated[index] as any)[field] = value;
    setQuestions(updated);
  };

  const addOption = (questionIndex: number) => {
    const updated = [...questions];
    updated[questionIndex].options.push("");
    setQuestions(updated);
  };

  const removeOption = (questionIndex: number, optionIndex: number) => {
    const updated = [...questions];
    if (updated[questionIndex].options.length > 2) {
      updated[questionIndex].options.splice(optionIndex, 1);
      // Adjust correctAnswer if it was pointing to removed option or beyond
      if (updated[questionIndex].correctAnswer >= optionIndex) {
        updated[questionIndex].correctAnswer = Math.max(
          0,
          updated[questionIndex].correctAnswer - 1
        );
      }
      setQuestions(updated);
    }
  };

  const updateOption = (
    questionIndex: number,
    optionIndex: number,
    value: string
  ) => {
    const updated = [...questions];
    updated[questionIndex].options[optionIndex] = value;
    setQuestions(updated);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    // Validation
    if (passingScore < 1 || passingScore > 100) {
      setError(t.admin.quizMinPassingScore);
      return;
    }

    if (questions.length === 0) {
      setError(t.admin.quizQuestionsRequired);
      return;
    }

    for (const q of questions) {
      if (!q.question.trim()) {
        setError(t.admin.quizQuestionsRequired);
        return;
      }
      const filledOptions = q.options.filter((o) => o.trim());
      if (filledOptions.length < 2) {
        setError(t.admin.quizOptionsRequired);
        return;
      }
    }

    setSaving(true);

    try {
      const response = await fetch("/api/admin/quiz", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          courseId,
          passingScore,
          timeLimit: timeLimit || null,
          questions: questions.map((q) => ({
            question: q.question,
            options: q.options.filter((o) => o.trim()),
            correctAnswer: q.correctAnswer,
          })),
        }),
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || "Failed to save quiz");
      }

      setSuccess(t.admin.quizSaveQuiz + " ✓");
      setTimeout(() => {
        router.push(`/admin/courses/${courseId}`);
      }, 1500);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : t.common.error);
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    if (!quiz) return;
    if (!confirm(t.admin.confirmDeleteMessage)) return;

    try {
      const response = await fetch(`/api/admin/quiz?courseId=${courseId}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        throw new Error("Failed to delete quiz");
      }

      setSuccess(t.admin.quizDeleteQuiz + " ✓");
      setTimeout(() => {
        router.push(`/admin/courses/${courseId}`);
      }, 1500);
    } catch (err) {
      setError(t.common.error);
    }
  };

  if (loading) {
    return (
      <div className="mx-auto max-w-4xl p-6 text-center">
        <p className="text-slate-300">{t.common.loading}...</p>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-4xl">
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-white">
            {t.admin.quizManagement}
          </h1>
          <p className="mt-1 text-sm text-slate-400">
            {t.admin.quizDescription}
          </p>
        </div>
        <div className="flex gap-3">
          {quiz && (
            <button
              type="button"
              onClick={handleDelete}
              className="rounded-lg border border-rose-500/50 px-4 py-2 text-rose-400 hover:bg-rose-500/10 transition-colors"
            >
              {t.admin.quizDeleteQuiz}
            </button>
          )}
          <Link
            href={`/admin/courses/${courseId}`}
            className="rounded-lg border border-slate-700 px-4 py-2 text-slate-200 hover:bg-slate-800 transition-colors"
          >
            {t.admin.back}
          </Link>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Quiz settings */}
        <div className="rounded-3xl border border-slate-800 bg-slate-900/50 backdrop-blur-sm p-6 space-y-5">
          <h2 className="text-xl font-semibold text-white">
            {t.admin.quizTitle}
          </h2>

          <div className="grid gap-5 md:grid-cols-2">
            <div>
              <label className="mb-2 block text-sm text-slate-300">
                {t.admin.quizPassingScore}
              </label>
              <input
                type="number"
                min="1"
                max="100"
                value={passingScore}
                onChange={(e) => setPassingScore(Number(e.target.value))}
                required
                className="w-full rounded-xl border border-slate-700 bg-slate-950 p-3 text-white"
                data-testid="quiz-passing-score"
              />
            </div>

            <div>
              <label className="mb-2 block text-sm text-slate-300">
                {t.admin.quizTimeLimit}
              </label>
              <div className="flex gap-2">
                <input
                  type="number"
                  min="0"
                  value={timeLimit || ""}
                  onChange={(e) =>
                    setTimeLimit(e.target.value ? Number(e.target.value) : null)
                  }
                  placeholder={t.admin.quizNoTimeLimit}
                  className="w-full rounded-xl border border-slate-700 bg-slate-950 p-3 text-white"
                  data-testid="quiz-time-limit"
                />
                <span className="flex items-center text-sm text-slate-400">
                  {t.admin.quizTimeLimitMinutes}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Questions */}
        <div className="rounded-3xl border border-slate-800 bg-slate-900/50 backdrop-blur-sm p-6 space-y-5">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-semibold text-white">
              {t.admin.quizQuestions}
            </h2>
            <button
              type="button"
              onClick={addQuestion}
              className="flex items-center gap-2 rounded-lg bg-[#FDCD1A] px-4 py-2 text-sm font-medium text-slate-950 hover:bg-[#e5b917] transition-colors"
              data-testid="add-question-btn"
            >
              <PlusIcon className="h-4 w-4" />
              {t.admin.quizAddQuestion}
            </button>
          </div>

          <div className="space-y-6">
            {questions.map((q, qIndex) => (
              <div
                key={qIndex}
                className="rounded-2xl border border-slate-700 bg-slate-900 p-5 space-y-4"
                data-testid={`question-${qIndex}`}
              >
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1">
                    <label className="mb-2 block text-sm font-medium text-slate-300">
                      {t.admin.quizQuestionOrder} {qIndex + 1}
                    </label>
                    <textarea
                      value={q.question}
                      onChange={(e) =>
                        updateQuestion(qIndex, "question", e.target.value)
                      }
                      rows={2}
                      required
                      placeholder={t.admin.quizQuestionText}
                      className="w-full rounded-xl border border-slate-700 bg-slate-950 p-3 text-white"
                      data-testid={`question-text-${qIndex}`}
                    />
                  </div>
                  {questions.length > 1 && (
                    <button
                      type="button"
                      onClick={() => removeQuestion(qIndex)}
                      className="rounded-lg border border-rose-500/50 p-2 text-rose-400 hover:bg-rose-500/10 transition-colors"
                      data-testid={`remove-question-${qIndex}`}
                    >
                      <TrashIcon className="h-5 w-5" />
                    </button>
                  )}
                </div>

                <div>
                  <label className="mb-2 block text-sm font-medium text-slate-300">
                    {t.admin.quizOptions}
                  </label>
                  <div className="space-y-2">
                    {q.options.map((opt, oIndex) => (
                      <div
                        key={oIndex}
                        className="flex items-center gap-3"
                        data-testid={`option-${qIndex}-${oIndex}`}
                      >
                        <input
                          type="radio"
                          name={`correct-${qIndex}`}
                          checked={q.correctAnswer === oIndex}
                          onChange={() =>
                            updateQuestion(qIndex, "correctAnswer", oIndex)
                          }
                          className="h-4 w-4"
                          data-testid={`correct-answer-${qIndex}-${oIndex}`}
                        />
                        <input
                          type="text"
                          value={opt}
                          onChange={(e) =>
                            updateOption(qIndex, oIndex, e.target.value)
                          }
                          placeholder={`${t.admin.quizOption} ${oIndex + 1}`}
                          className="flex-1 rounded-lg border border-slate-700 bg-slate-950 p-2 text-sm text-white"
                          data-testid={`option-text-${qIndex}-${oIndex}`}
                        />
                        {q.options.length > 2 && (
                          <button
                            type="button"
                            onClick={() => removeOption(qIndex, oIndex)}
                            className="rounded-lg border border-slate-700 p-2 text-slate-400 hover:text-rose-400 hover:border-rose-500/50 transition-colors"
                            data-testid={`remove-option-${qIndex}-${oIndex}`}
                          >
                            <TrashIcon className="h-4 w-4" />
                          </button>
                        )}
                      </div>
                    ))}
                  </div>

                  <button
                    type="button"
                    onClick={() => addOption(qIndex)}
                    className="mt-3 text-sm text-cyan-400 hover:text-cyan-300 transition-colors"
                    data-testid={`add-option-${qIndex}`}
                  >
                    + {t.admin.quizAddOption}
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Messages */}
        {error && (
          <div
            className="rounded-xl border border-rose-500/30 bg-rose-500/10 p-4 text-rose-300"
            data-testid="error-message"
          >
            {error}
          </div>
        )}

        {success && (
          <div
            className="rounded-xl border border-green-500/30 bg-green-500/10 p-4 text-green-300"
            data-testid="success-message"
          >
            {success}
          </div>
        )}

        {/* Submit */}
        <div className="flex justify-end gap-3">
          <Link
            href={`/admin/courses/${courseId}`}
            className="rounded-lg border border-slate-700 px-5 py-2.5 text-slate-200 hover:bg-slate-800 transition-colors"
          >
            {t.common.cancel}
          </Link>
          <button
            type="submit"
            disabled={saving}
            className="rounded-lg bg-[#FDCD1A] px-6 py-2.5 font-medium text-slate-950 hover:bg-[#e5b917] transition-colors disabled:opacity-50"
            data-testid="save-quiz-btn"
          >
            {saving ? t.admin.saving : t.admin.quizSaveQuiz}
          </button>
        </div>
      </form>
    </div>
  );
}
