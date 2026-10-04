"use client";

import { useState } from "react";
import { useI18n } from "@/lib/i18n/I18nContext";

interface ManualEnrollDialogProps {
  courses: { id: string; title: string }[];
  onClose: () => void;
  onSuccess: () => void;
}

export function ManualEnrollDialog({ courses, onClose, onSuccess }: ManualEnrollDialogProps) {
  const { t } = useI18n();
  const [courseId, setCourseId] = useState("");
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!courseId || !email) {
      setError(t.common.error);
      return;
    }

    setLoading(true);
    setError("");

    try {
      const response = await fetch("/api/enrollments/manual", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ courseId, email }),
      });

      const data = await response.json();

      if (!response.ok) {
        setError(data.error || t.common.error);
        return;
      }

      onSuccess();
      onClose();
    } catch (err) {
      setError(t.common.error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 px-4">
      <div className="w-full max-w-md rounded-2xl border border-slate-700 bg-slate-900 p-6">
        <h2 className="text-2xl font-bold text-white">{t.admin.manualEnrollment}</h2>
        <p className="mt-2 text-sm text-slate-400">{t.admin.manualEnrollment}</p>

        <form onSubmit={handleSubmit} className="mt-6 space-y-4">
          <div>
            <label className="block text-sm font-medium text-slate-300 mb-2">
              {t.admin.enrollmentStudentEmail}
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="student@example.com"
              className="w-full rounded-lg border border-slate-700 bg-slate-950 px-4 py-2.5 text-white placeholder-slate-500 focus:border-cyan-500 focus:outline-none focus:ring-1 focus:ring-cyan-500"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-300 mb-2">
              {t.admin.enrollmentCourse}
            </label>
            <select
              value={courseId}
              onChange={(e) => setCourseId(e.target.value)}
              className="w-full rounded-lg border border-slate-700 bg-slate-950 px-4 py-2.5 text-white focus:border-cyan-500 focus:outline-none focus:ring-1 focus:ring-cyan-500"
              required
            >
              <option value="">{t.admin.selectCourse}</option>
              {courses.map((course) => (
                <option key={course.id} value={course.id}>
                  {course.title}
                </option>
              ))}
            </select>
          </div>

          {error && (
            <div className="rounded-lg bg-rose-500/10 border border-rose-500/30 px-4 py-3 text-sm text-rose-300">
              {error}
            </div>
          )}

          <div className="flex gap-3 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 rounded-lg border border-slate-700 px-4 py-2.5 text-sm font-medium text-slate-300 transition-colors hover:bg-slate-800"
            >
              {t.common.cancel}
            </button>
            <button
              type="submit"
              disabled={loading}
              className="flex-1 rounded-lg bg-cyan-500 px-4 py-2.5 text-sm font-medium text-slate-950 transition-colors hover:bg-cyan-600 disabled:opacity-50"
            >
              {loading ? t.common.loading : t.admin.enrollStudent}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
