"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useI18n } from "@/lib/i18n/I18nContext";
import { CheckCircleIcon, AlertCircleIcon } from "@/components/icons/HseIcons";

interface Question {
  id: string;
  question: string;
  options: string[];
  order: number;
}

interface Quiz {
  id: string;
  passingScore: number;
  timeLimit: number | null;
  questions: Question[];
}

interface Course {
  id: string;
  title: string;
  slug: string;
}

interface Attempt {
  id: string;
  score: number;
  passed: boolean;
  completedAt: string;
}

interface Attestation {
  id: string;
  certificateNumber: string;
  issuedAt: string;
}

export default function QuizClient({
  course,
  quiz,
  allLessonsCompleted,
  alreadyPassed,
  bestScore,
  attempts,
  attestation,
}: {
  course: Course;
  quiz: Quiz;
  allLessonsCompleted: boolean;
  alreadyPassed: boolean;
  bestScore: number | null;
  attempts: Attempt[];
  attestation: Attestation | null;
}) {
  const { t, isRtl } = useI18n();
  const router = useRouter();
  const [started, setStarted] = useState(false);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState<{ [questionId: string]: number }>({});
  const [submitting, setSubmitting] = useState(false);
  const [result, setResult] = useState<any>(null);
  const [timeRemaining, setTimeRemaining] = useState<number | null>(
    quiz.timeLimit ? quiz.timeLimit * 60 : null
  );

  // Timer
  useEffect(() => {
    if (!started || !timeRemaining || result) return;

    const interval = setInterval(() => {
      setTimeRemaining((prev) => {
        if (prev === null || prev <= 1) {
          handleSubmit(); // Auto-submit when time runs out
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [started, timeRemaining, result]);

  const handleStart = () => {
    setStarted(true);
    setAnswers({});
    setResult(null);
    setCurrentQuestionIndex(0);
    if (quiz.timeLimit) {
      setTimeRemaining(quiz.timeLimit * 60);
    }
  };

  const handleAnswerSelect = (questionId: string, optionIndex: number) => {
    setAnswers((prev) => ({ ...prev, [questionId]: optionIndex }));
  };

  const handleSubmit = async () => {
    setSubmitting(true);

    try {
      const response = await fetch(`/api/quiz/${quiz.id}/submit`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ answers }),
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || "Failed to submit quiz");
      }

      const data = await response.json();
      setResult(data);
    } catch (error: unknown) {
      alert(error instanceof Error ? error.message : t.common.error);
    } finally {
      setSubmitting(false);
    }
  };

  const currentQuestion = quiz.questions[currentQuestionIndex];
  const isLastQuestion = currentQuestionIndex === quiz.questions.length - 1;
  const answeredCurrent = answers[currentQuestion?.id] !== undefined;

  // If lessons not completed
  if (!allLessonsCompleted) {
    return (
      <main className="min-h-screen bg-slate-950 px-4 py-8 text-slate-50">
        <div className="mx-auto max-w-3xl">
          <div className="rounded-3xl border border-amber-500/30 bg-amber-500/10 p-8 text-center">
            <AlertCircleIcon className="mx-auto mb-4 h-16 w-16 text-amber-400" />
            <h1 className="mb-3 text-2xl font-bold text-white">
              {t.quiz.quizNotAvailable}
            </h1>
            <p className="mb-6 text-slate-300">
              {t.quiz.mustCompleteAllLessons}
            </p>
            <Link
              href={`/courses/${course.slug}/learn`}
              className="inline-block rounded-lg bg-[#FDCD1A] px-6 py-3 font-medium text-slate-950 hover:bg-[#e5b917] transition-colors"
            >
              {t.quiz.backToCourse}
            </Link>
          </div>
        </div>
      </main>
    );
  }

  // Result screen
  if (result) {
    return (
      <main className="min-h-screen bg-slate-950 px-4 py-8 text-slate-50">
        <div className="mx-auto max-w-3xl">
          <div
            className={`rounded-3xl border p-8 text-center ${
              result.passed
                ? "border-green-500/30 bg-green-500/10"
                : "border-rose-500/30 bg-rose-500/10"
            }`}
            data-testid="quiz-result"
          >
            {result.passed ? (
              <CheckCircleIcon className="mx-auto mb-4 h-20 w-20 text-green-400" />
            ) : (
              <AlertCircleIcon className="mx-auto mb-4 h-20 w-20 text-rose-400" />
            )}
            <h1
              className={`mb-3 text-3xl font-bold ${
                result.passed ? "text-green-300" : "text-rose-300"
              }`}
            >
              {result.passed ? t.quiz.passed : t.quiz.failed}
            </h1>
            <div className="mb-6">
              <p className="text-5xl font-bold text-white" data-testid="quiz-score">
                {result.score}%
              </p>
              <p className="mt-2 text-slate-300">
                {result.correctCount} / {result.totalQuestions} {t.quiz.question}
              </p>
              <p className="mt-1 text-sm text-slate-400">
                {t.quiz.passingScore}: {result.passingScore}%
              </p>
            </div>

            <div className="flex flex-col gap-3 sm:flex-row sm:justify-center">
              {!result.passed && (
                <button
                  onClick={handleStart}
                  className="rounded-lg border border-cyan-500 bg-cyan-500/10 px-6 py-3 font-medium text-cyan-300 hover:bg-cyan-500/20 transition-colors"
                  data-testid="retake-quiz-btn"
                >
                  {t.quiz.retakeQuiz}
                </button>
              )}
              {result.passed && result.attestation && (
                <Link
                  href={`/student/certificates/${result.attestation.id}`}
                  className="rounded-lg bg-[#FDCD1A] px-6 py-3 font-medium text-slate-950 hover:bg-[#e5b917] transition-colors"
                  data-testid="view-certificate-btn"
                >
                  {t.quiz.viewCertificate}
                </Link>
              )}
              <Link
                href={`/courses/${course.slug}/learn`}
                className="rounded-lg border border-slate-700 px-6 py-3 text-slate-200 hover:bg-slate-800 transition-colors"
              >
                {t.quiz.backToCourse}
              </Link>
            </div>
          </div>
        </div>
      </main>
    );
  }

  // Quiz in progress
  if (started) {
    return (
      <main className="min-h-screen bg-slate-950 px-4 py-8 text-slate-50">
        <div className="mx-auto max-w-3xl">
          {/* Header */}
          <div className="mb-6 flex items-center justify-between">
            <div>
              <p className="text-sm uppercase tracking-[0.2em] text-cyan-300">
                {t.quiz.title}
              </p>
              <h1 className="mt-2 text-2xl font-bold">{course.title}</h1>
            </div>
            {timeRemaining !== null && (
              <div className="rounded-lg border border-slate-700 bg-slate-900 px-4 py-2">
                <p className="text-sm text-slate-400">{t.quiz.timeRemaining}</p>
                <p
                  className={`text-lg font-bold ${
                    timeRemaining < 60 ? "text-rose-400" : "text-white"
                  }`}
                  data-testid="time-remaining"
                >
                  {Math.floor(timeRemaining / 60)}:
                  {String(timeRemaining % 60).padStart(2, "0")}
                </p>
              </div>
            )}
          </div>

          {/* Progress */}
          <div className="mb-6 rounded-2xl border border-slate-800 bg-slate-900 p-4">
            <div className="mb-2 flex items-center justify-between text-sm">
              <span className="text-slate-300">
                {t.quiz.question} {currentQuestionIndex + 1} {t.quiz.of}{" "}
                {quiz.questions.length}
              </span>
              <span className="text-cyan-300">
                {Object.keys(answers).length} / {quiz.questions.length}{" "}
                {t.quiz.selectAnswer}
              </span>
            </div>
            <div className="h-2 w-full overflow-hidden rounded-full bg-slate-800">
              <div
                className="h-full bg-[#FDCD1A] transition-all"
                style={{
                  width: `${
                    ((currentQuestionIndex + 1) / quiz.questions.length) * 100
                  }%`,
                }}
              />
            </div>
          </div>

          {/* Question */}
          <div
            className="mb-6 rounded-3xl border border-slate-800 bg-slate-900/50 backdrop-blur-sm p-8"
            data-testid={`question-${currentQuestionIndex}`}
          >
            <h2 className="mb-6 text-xl font-semibold text-white">
              {currentQuestion.question}
            </h2>
            <div className="space-y-3">
              {currentQuestion.options.map((option, index) => (
                <button
                  key={index}
                  onClick={() => handleAnswerSelect(currentQuestion.id, index)}
                  className={`w-full rounded-xl border p-4 text-start transition-all ${
                    answers[currentQuestion.id] === index
                      ? "border-[#FDCD1A] bg-[#FDCD1A]/10 text-white"
                      : "border-slate-700 bg-slate-900 text-slate-300 hover:border-slate-600 hover:bg-slate-800"
                  }`}
                  data-testid={`option-${currentQuestionIndex}-${index}`}
                >
                  <div className="flex items-center gap-3">
                    <div
                      className={`h-5 w-5 rounded-full border-2 flex items-center justify-center ${
                        answers[currentQuestion.id] === index
                          ? "border-[#FDCD1A] bg-[#FDCD1A]"
                          : "border-slate-600"
                      }`}
                    >
                      {answers[currentQuestion.id] === index && (
                        <div className="h-2 w-2 rounded-full bg-slate-950" />
                      )}
                    </div>
                    <span>{option}</span>
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* Navigation */}
          <div className="flex items-center justify-between gap-4">
            <button
              onClick={() => setCurrentQuestionIndex(currentQuestionIndex - 1)}
              disabled={currentQuestionIndex === 0}
              className="rounded-lg border border-slate-700 px-5 py-3 text-slate-300 hover:bg-slate-800 transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
              data-testid="prev-question-btn"
            >
              ← {t.student.previousLesson}
            </button>

            {isLastQuestion ? (
              <button
                onClick={handleSubmit}
                disabled={submitting || Object.keys(answers).length === 0}
                className="rounded-lg bg-[#FDCD1A] px-8 py-3 font-medium text-slate-950 hover:bg-[#e5b917] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                data-testid="submit-quiz-btn"
              >
                {submitting ? t.quiz.submitting : t.quiz.submitQuiz}
              </button>
            ) : (
              <button
                onClick={() =>
                  setCurrentQuestionIndex(currentQuestionIndex + 1)
                }
                disabled={!answeredCurrent}
                className="rounded-lg bg-[#FDCD1A] px-5 py-3 font-medium text-slate-950 hover:bg-[#e5b917] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                data-testid="next-question-btn"
              >
                {t.student.nextLesson} →
              </button>
            )}
          </div>
        </div>
      </main>
    );
  }

  // Start screen
  return (
    <main className="min-h-screen bg-slate-950 px-4 py-8 text-slate-50">
      <div className="mx-auto max-w-3xl">
        <div className="rounded-3xl border border-slate-800 bg-slate-900/50 backdrop-blur-sm p-8">
          <div className="mb-6 text-center">
            <p className="text-sm uppercase tracking-[0.2em] text-cyan-300">
              {t.quiz.title}
            </p>
            <h1 className="mt-2 text-3xl font-bold">{course.title}</h1>
          </div>

          {/* Quiz info */}
          <div className="mb-8 space-y-4 rounded-2xl border border-slate-700 bg-slate-900 p-6">
            <div className="flex items-center justify-between border-b border-slate-700 pb-3">
              <span className="text-slate-400">{t.quiz.question}</span>
              <span className="font-semibold text-white">
                {quiz.questions.length}
              </span>
            </div>
            <div className="flex items-center justify-between border-b border-slate-700 pb-3">
              <span className="text-slate-400">{t.quiz.passingScore}</span>
              <span className="font-semibold text-white">
                {quiz.passingScore}%
              </span>
            </div>
            {quiz.timeLimit && (
              <div className="flex items-center justify-between">
                <span className="text-slate-400">{t.quiz.timeRemaining}</span>
                <span className="font-semibold text-white">
                  {quiz.timeLimit} {t.quiz.minutes}
                </span>
              </div>
            )}
          </div>

          {/* Already passed */}
          {alreadyPassed && bestScore !== null && (
            <div className="mb-6 rounded-2xl border border-green-500/30 bg-green-500/10 p-6">
              <p className="mb-2 font-semibold text-green-300">
                {t.quiz.alreadyPassed}
              </p>
              <p className="text-sm text-slate-300">
                {t.quiz.yourBestScore}: <strong>{bestScore}%</strong>
              </p>
              {attestation && (
                <Link
                  href={`/student/certificates/${attestation.id}`}
                  className="mt-3 inline-block text-sm text-cyan-400 hover:text-cyan-300 transition-colors"
                >
                  {t.quiz.viewCertificate} →
                </Link>
              )}
            </div>
          )}

          {/* Attempt history */}
          {attempts.length > 0 && (
            <div className="mb-6 rounded-2xl border border-slate-700 bg-slate-900 p-6">
              <h3 className="mb-3 font-semibold text-white">
                {t.quiz.lastAttempt}
              </h3>
              <div className="space-y-2 text-sm">
                {attempts.slice(0, 3).map((attempt) => (
                  <div
                    key={attempt.id}
                    className="flex items-center justify-between text-slate-300"
                  >
                    <span>
                      {new Date(attempt.completedAt).toLocaleDateString()}
                    </span>
                    <span
                      className={
                        attempt.passed ? "text-green-400" : "text-rose-400"
                      }
                    >
                      {attempt.score}%{" "}
                      {attempt.passed ? "✓" : "✗"}
                    </span>
                  </div>
                ))}
              </div>
              <p className="mt-2 text-xs text-slate-500">
                {attempts.length} {t.quiz.attemptsCount}
              </p>
            </div>
          )}

          {/* Start button */}
          <div className="flex flex-col gap-3 sm:flex-row sm:justify-center">
            <button
              onClick={handleStart}
              className="rounded-lg bg-[#FDCD1A] px-8 py-4 text-lg font-medium text-slate-950 hover:bg-[#e5b917] transition-colors"
              data-testid="start-quiz-btn"
            >
              {alreadyPassed ? t.quiz.retakeQuiz : t.quiz.startQuiz}
            </button>
            <Link
              href={`/courses/${course.slug}/learn`}
              className="rounded-lg border border-slate-700 px-8 py-4 text-lg text-slate-200 hover:bg-slate-800 transition-colors text-center"
            >
              {t.quiz.backToCourse}
            </Link>
          </div>
        </div>
      </div>
    </main>
  );
}
