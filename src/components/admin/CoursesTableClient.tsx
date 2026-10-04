"use client";

import Link from "next/link";
import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { deleteCourseAction } from "@/app/(dashboard)/admin/courses/actions";
import { useI18n } from "@/lib/i18n/I18nContext";

type Course = {
  id: string;
  title: string;
  slug: string;
  thumbnail: string | null;
  category: string | null;
  level: string | null;
  isPublished: boolean;
  modules: { id: string }[];
  enrollments: { id: string }[];
  createdAt: string;
};

interface CoursesTableClientProps {
  courses: Course[];
}

export function CoursesTableClient({ courses }: CoursesTableClientProps) {
  const router = useRouter();
  const { t, isRtl } = useI18n();
  const [isPending, startTransition] = useTransition();
  const [view, setView] = useState<"table" | "grid">("table");
  const [filter, setFilter] = useState<"all" | "published" | "draft">("all");
  const [search, setSearch] = useState("");
  const [sortBy, setSortBy] = useState<"title" | "date">("date");
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("desc");
  const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null);
  const [deleting, setDeleting] = useState(false);

  // Filter courses
  const filteredCourses = courses.filter((course) => {
    // Filter by status
    if (filter === "published" && !course.isPublished) return false;
    if (filter === "draft" && course.isPublished) return false;

    // Search by title
    if (search && !course.title.toLowerCase().includes(search.toLowerCase())) {
      return false;
    }

    return true;
  });

  // Sort courses
  const sortedCourses = [...filteredCourses].sort((a, b) => {
    if (sortBy === "title") {
      const comparison = a.title.localeCompare(b.title);
      return sortOrder === "asc" ? comparison : -comparison;
    } else {
      const comparison = new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
      return sortOrder === "asc" ? -comparison : comparison;
    }
  });

  const handleDelete = async (id: string) => {
    setDeleting(true);
    try {
      const result = await deleteCourseAction(id);
      if (result.success) {
        setDeleteConfirm(null);
        startTransition(() => {
          router.refresh();
        });
      } else {
        alert(result.error || t.common.error);
      }
    } catch (error) {
      alert(t.common.error);
    } finally {
      setDeleting(false);
    }
  };

  const toggleSort = (field: "title" | "date") => {
    if (sortBy === field) {
      setSortOrder(sortOrder === "asc" ? "desc" : "asc");
    } else {
      setSortBy(field);
      setSortOrder("asc");
    }
  };

  return (
    <div dir={isRtl ? "rtl" : "ltr"}>
      {/* Filters and controls */}
      <div className="mb-6 space-y-4">
        {/* Tabs and view toggle */}
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          {/* Status tabs */}
          <div className="flex gap-2">
            <button
              onClick={() => setFilter("all")}
              className={`rounded-lg px-4 py-2 text-sm font-medium transition-colors ${
                filter === "all"
                  ? "bg-cyan-500 text-slate-950"
                  : "border border-slate-700 text-slate-300 hover:bg-slate-800"
              }`}
            >
              {t.admin.allCourses} ({courses.length})
            </button>
            <button
              onClick={() => setFilter("published")}
              className={`rounded-lg px-4 py-2 text-sm font-medium transition-colors ${
                filter === "published"
                  ? "bg-cyan-500 text-slate-950"
                  : "border border-slate-700 text-slate-300 hover:bg-slate-800"
              }`}
            >
              {t.admin.publishedStatus} ({courses.filter((c) => c.isPublished).length})
            </button>
            <button
              onClick={() => setFilter("draft")}
              className={`rounded-lg px-4 py-2 text-sm font-medium transition-colors ${
                filter === "draft"
                  ? "bg-cyan-500 text-slate-950"
                  : "border border-slate-700 text-slate-300 hover:bg-slate-800"
              }`}
            >
              {t.admin.draftStatus} ({courses.filter((c) => !c.isPublished).length})
            </button>
          </div>

          {/* View toggle */}
          <div className="flex gap-2">
            <button
              onClick={() => setView("table")}
              className={`rounded-lg p-2 transition-colors ${
                view === "table" ? "bg-slate-800 text-cyan-300" : "text-slate-400 hover:bg-slate-800 hover:text-white"
              }`}
              aria-label="Table view"
            >
              <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M3 14h18m-9-4v8m-7 0h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
              </svg>
            </button>
            <button
              onClick={() => setView("grid")}
              className={`rounded-lg p-2 transition-colors ${
                view === "grid" ? "bg-slate-800 text-cyan-300" : "text-slate-400 hover:bg-slate-800 hover:text-white"
              }`}
              aria-label="Grid view"
            >
              <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
              </svg>
            </button>
          </div>
        </div>

        {/* Search and sort */}
        <div className="flex flex-col gap-3 sm:flex-row">
          <div className="relative flex-1">
            <svg
              className={`absolute top-1/2 h-5 w-5 -translate-y-1/2 text-slate-400 ${isRtl ? 'right-3' : 'left-3'}`}
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
            <input
              type="search"
              placeholder={t.admin.searchPlaceholder}
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full rounded-lg border border-slate-700 bg-slate-950 py-2 text-sm text-white placeholder-slate-400 focus:border-cyan-500 focus:outline-none focus:ring-1 focus:ring-cyan-500 ps-10 pe-4"
            />
          </div>

          <div className="flex gap-2">
            <button
              onClick={() => toggleSort("title")}
              className={`flex items-center gap-2 rounded-lg border border-slate-700 px-4 py-2 text-sm transition-colors hover:bg-slate-800 ${
                sortBy === "title" ? "text-cyan-300" : "text-slate-300"
              }`}
            >
              {t.admin.courseTitle}
              {sortBy === "title" && (
                <span>{sortOrder === "asc" ? "↑" : "↓"}</span>
              )}
            </button>
            <button
              onClick={() => toggleSort("date")}
              className={`flex items-center gap-2 rounded-lg border border-slate-700 px-4 py-2 text-sm transition-colors hover:bg-slate-800 ${
                sortBy === "date" ? "text-cyan-300" : "text-slate-300"
              }`}
            >
              Date
              {sortBy === "date" && (
                <span>{sortOrder === "asc" ? "↑" : "↓"}</span>
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Empty state */}
      {sortedCourses.length === 0 && (
        <div className="rounded-3xl border border-dashed border-slate-700 bg-slate-900/50 p-12 text-center">
          <div className="mx-auto max-w-sm">
            <div className="mb-4 text-4xl">📚</div>
            <h3 className="text-lg font-semibold text-white">
              {t.admin.noCourses}
            </h3>
          </div>
        </div>
      )}

      {/* Table view */}
      {view === "table" && sortedCourses.length > 0 && (
        <div className="overflow-hidden rounded-2xl border border-slate-800 bg-slate-900/50">
          <div className="overflow-x-auto">
            <table className="w-full text-start">
              <thead className="border-b border-slate-800 bg-slate-950/50">
                <tr>
                  <th className="px-6 py-4 text-sm font-medium text-slate-300">{t.admin.coursesTitle}</th>
                  <th className="px-6 py-4 text-sm font-medium text-slate-300">{t.admin.courseCategory}</th>
                  <th className="px-6 py-4 text-sm font-medium text-slate-300">{t.admin.courseLevel}</th>
                  <th className="px-6 py-4 text-sm font-medium text-slate-300">{t.student.modules}</th>
                  <th className="px-6 py-4 text-sm font-medium text-slate-300">{t.admin.sidebarStudents}</th>
                  <th className="px-6 py-4 text-sm font-medium text-slate-300">Status</th>
                  <th className={`px-6 py-4 text-sm font-medium text-slate-300 ${isRtl ? 'text-start' : 'text-end'}`}>{t.admin.actionsColumn}</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800">
                {sortedCourses.map((course) => (
                  <tr key={course.id} className="transition-colors hover:bg-slate-800/30">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        {course.thumbnail ? (
                          <img src={course.thumbnail} alt={course.title} className="h-12 w-16 rounded-lg object-cover" />
                        ) : (
                          <div className="flex h-12 w-16 flex-shrink-0 items-center justify-center rounded-lg bg-slate-800 text-xs text-slate-400">
                            No image
                          </div>
                        )}
                        <div className="min-w-0">
                          <p className="font-medium text-white truncate">{course.title}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-sm text-slate-300">{course.category || "—"}</td>
                    <td className="px-6 py-4 text-sm text-slate-300">{course.level || "—"}</td>
                    <td className="px-6 py-4 text-sm text-slate-300">{course.modules.length}</td>
                    <td className="px-6 py-4 text-sm text-slate-300">{course.enrollments.length}</td>
                    <td className="px-6 py-4">
                      <span
                        className={`inline-flex rounded-full px-2 py-1 text-xs font-medium ${
                          course.isPublished ? "bg-emerald-500/15 text-emerald-300" : "bg-amber-500/15 text-amber-300"
                        }`}
                      >
                        {course.isPublished ? t.admin.publishedStatus : t.admin.draftStatus}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center justify-end gap-2">
                        {course.isPublished && (
                          <Link
                            href={`/courses/${course.slug}`}
                            className="rounded-lg p-2 text-slate-400 transition-colors hover:bg-slate-800 hover:text-white"
                            title={t.common.view}
                          >
                            <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                            </svg>
                          </Link>
                        )}
                        <Link
                          href={`/admin/courses/${course.id}`}
                          className="rounded-lg p-2 text-slate-400 transition-colors hover:bg-slate-800 hover:text-white"
                          title={t.common.edit}
                        >
                          <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                          </svg>
                        </Link>
                        <button
                          onClick={() => setDeleteConfirm(course.id)}
                          className="rounded-lg p-2 text-slate-400 transition-colors hover:bg-red-500/10 hover:text-red-400"
                          title={t.common.delete}
                        >
                          <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                          </svg>
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Grid view */}
      {view === "grid" && sortedCourses.length > 0 && (
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {sortedCourses.map((course) => (
            <article key={course.id} className="group rounded-2xl border border-slate-800 bg-slate-900/50 backdrop-blur-sm overflow-hidden transition-all hover:border-slate-700 hover:shadow-lg hover:shadow-cyan-500/5">
              {/* Thumbnail */}
              <div className="relative aspect-video overflow-hidden bg-slate-800">
                {course.thumbnail ? (
                  <img src={course.thumbnail} alt={course.title} className="h-full w-full object-cover transition-transform group-hover:scale-105" />
                ) : (
                  <div className="flex h-full w-full items-center justify-center text-slate-400">
                    <svg className="h-12 w-12" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                  </div>
                )}
                {/* Status badge */}
                <div className={`absolute ${isRtl ? 'left-3' : 'right-3'} top-3`}>
                  <span
                    className={`inline-flex rounded-full px-2.5 py-1 text-xs font-medium backdrop-blur-sm ${
                      course.isPublished ? "bg-emerald-500/90 text-white" : "bg-amber-500/90 text-white"
                    }`}
                  >
                    {course.isPublished ? t.admin.publishedStatus : t.admin.draftStatus}
                  </span>
                </div>
              </div>

              {/* Content */}
              <div className="p-5">
                <h3 className="text-lg font-semibold text-white line-clamp-2">{course.title}</h3>

                {/* Meta */}
                <div className="mt-3 flex flex-wrap items-center gap-3 text-xs text-slate-400">
                  {course.category && <span className="flex items-center gap-1">📂 {course.category}</span>}
                  {course.level && <span className="flex items-center gap-1">📊 {course.level}</span>}
                </div>

                <div className="mt-4 flex items-center gap-4 text-sm text-slate-300">
                  <span>{course.modules.length} {t.student.modules}</span>
                  <span>•</span>
                  <span>{course.enrollments.length} {t.admin.sidebarStudents}</span>
                </div>

                {/* Actions */}
                <div className="mt-5 flex gap-2">
                  <Link
                    href={`/admin/courses/${course.id}`}
                    className="flex-1 rounded-lg border border-slate-700 px-3 py-2 text-center text-sm text-slate-200 transition-colors hover:bg-slate-800"
                  >
                    {t.common.edit}
                  </Link>
                  {course.isPublished && (
                    <Link
                      href={`/courses/${course.slug}`}
                      className="rounded-lg border border-slate-700 px-3 py-2 text-sm text-slate-200 transition-colors hover:bg-slate-800"
                      title={t.common.view}
                    >
                      <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                      </svg>
                    </Link>
                  )}
                  <button
                    onClick={() => setDeleteConfirm(course.id)}
                    className="rounded-lg border border-slate-700 px-3 py-2 text-sm text-slate-400 transition-colors hover:border-red-500/30 hover:bg-red-500/10 hover:text-red-400"
                    title={t.common.delete}
                  >
                    <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                    </svg>
                  </button>
                </div>
              </div>
            </article>
          ))}
        </div>
      )}

      {/* Delete confirmation dialog */}
      {deleteConfirm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/80 backdrop-blur-sm">
          <div className="mx-4 w-full max-w-md rounded-2xl border border-slate-800 bg-slate-900 p-6 shadow-xl">
            <h3 className="text-xl font-semibold text-white">{t.admin.confirmDelete}</h3>
            <p className="mt-2 text-sm text-slate-400">
              {t.admin.confirmDeleteMessage}
            </p>
            <div className="mt-6 flex gap-3">
              <button
                onClick={() => setDeleteConfirm(null)}
                disabled={deleting}
                className="flex-1 rounded-lg border border-slate-700 px-4 py-2 text-sm text-slate-200 transition-colors hover:bg-slate-800 disabled:opacity-50"
              >
                {t.common.cancel}
              </button>
              <button
                onClick={() => handleDelete(deleteConfirm)}
                disabled={deleting}
                className="flex-1 rounded-lg bg-red-500 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-red-600 disabled:opacity-50"
              >
                {deleting ? t.common.loading : t.common.delete}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
