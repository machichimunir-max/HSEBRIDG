"use client";

import { useState } from "react";
import Link from "next/link";
import { formatDate } from "@/lib/date-utils";
import { ManualEnrollDialog } from "./ManualEnrollDialog";
import { useI18n } from "@/lib/i18n/I18nContext";

type Enrollment = {
  id: string;
  enrolledAt: string; // ISO string
  user: {
    id: string;
    name: string | null;
    email: string;
  };
  course: {
    id: string;
    title: string;
    slug: string;
    thumbnail: string | null;
  };
};

type Course = {
  id: string;
  title: string;
};

interface EnrollmentsTableClientProps {
  enrollments: Enrollment[];
  courses: Course[];
}

export function EnrollmentsTableClient({ enrollments, courses }: EnrollmentsTableClientProps) {
  const { t, isRtl } = useI18n();
  const [search, setSearch] = useState("");
  const [courseFilter, setCourseFilter] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [showEnrollDialog, setShowEnrollDialog] = useState(false);
  const itemsPerPage = 10;

  // Filter enrollments
  const filteredEnrollments = enrollments.filter((enrollment) => {
    // Course filter
    if (courseFilter && enrollment.course.id !== courseFilter) return false;

    // Search filter
    if (search) {
      const searchLower = search.toLowerCase();
      return (
        enrollment.user.name?.toLowerCase().includes(searchLower) ||
        enrollment.user.email.toLowerCase().includes(searchLower) ||
        enrollment.course.title.toLowerCase().includes(searchLower)
      );
    }

    return true;
  });

  // Paginate
  const totalPages = Math.ceil(filteredEnrollments.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedEnrollments = filteredEnrollments.slice(startIndex, startIndex + itemsPerPage);

  const handleEnrollSuccess = () => {
    window.location.reload();
  };

  return (
    <div dir={isRtl ? "rtl" : "ltr"}>
      {/* Header with Add Button */}
      <div className="mb-6 flex items-center justify-between">
        <div className="flex flex-1 flex-col gap-3 sm:flex-row">
          <div className="relative flex-1">
            <svg
              className={`absolute top-1/2 h-5 w-5 -translate-y-1/2 text-slate-400 ${isRtl ? 'right-3' : 'left-3'}`}
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
              />
            </svg>
            <input
              type="search"
              placeholder={t.admin.searchPlaceholder}
              value={search}
              onChange={(e) => {
                setSearch(e.target.value);
                setCurrentPage(1);
              }}
              className="w-full rounded-lg border border-slate-700 bg-slate-950 py-2 ps-10 pe-4 text-sm text-white placeholder-slate-400 focus:border-cyan-500 focus:outline-none focus:ring-1 focus:ring-cyan-500"
            />
          </div>

          <select
            value={courseFilter}
            onChange={(e) => {
              setCourseFilter(e.target.value);
              setCurrentPage(1);
            }}
            className="rounded-lg border border-slate-700 bg-slate-950 px-4 py-2 text-sm text-white focus:border-cyan-500 focus:outline-none focus:ring-1 focus:ring-cyan-500"
          >
            <option value="">{t.admin.allCourses}</option>
            {courses.map((course) => (
              <option key={course.id} value={course.id}>
                {course.title}
              </option>
            ))}
          </select>
        </div>

        <button
          onClick={() => setShowEnrollDialog(true)}
          className="rounded-lg bg-cyan-500 px-4 py-2 text-sm font-medium text-slate-950 transition-colors hover:bg-cyan-600"
        >
          + {t.admin.enrollStudent}
        </button>
      </div>

      {/* Enrollments Table */}
      {paginatedEnrollments.length === 0 ? (
        <div className="rounded-3xl border border-dashed border-slate-700 bg-slate-900/50 p-12 text-center">
          <div className="mx-auto max-w-sm">
            <div className="mb-4 text-4xl">📝</div>
            <h3 className="text-lg font-semibold text-white">
              {search || courseFilter ? t.admin.noEnrollments : t.admin.noEnrollments}
            </h3>
            <p className="mt-2 text-sm text-slate-400">
              {search || courseFilter
                ? t.admin.searchPlaceholder
                : t.admin.noEnrollments}
            </p>
          </div>
        </div>
      ) : (
        <>
          <div className="overflow-hidden rounded-2xl border border-slate-800 bg-slate-900/50">
            <div className="overflow-x-auto">
              <table className="w-full text-start">
                <thead className="border-b border-slate-800 bg-slate-950/50">
                  <tr>
                    <th className="px-6 py-4 text-sm font-medium text-slate-300">
                      {t.admin.enrollmentStudentEmail}
                    </th>
                    <th className="px-6 py-4 text-sm font-medium text-slate-300">
                      {t.admin.enrollmentCourse}
                    </th>
                    <th className="px-6 py-4 text-sm font-medium text-slate-300">
                      {t.admin.enrollmentsTitle}
                    </th>
                    <th className="px-6 py-4 text-sm font-medium text-slate-300">
                      Status
                    </th>
                    <th className={`px-6 py-4 text-sm font-medium text-slate-300 ${isRtl ? 'text-start' : 'text-end'}`}>
                      {t.admin.actionsColumn}
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800">
                  {paginatedEnrollments.map((enrollment) => (
                    <tr
                      key={enrollment.id}
                      className="transition-colors hover:bg-slate-800/30"
                    >
                      <td className="px-6 py-4">
                        <div>
                          <p className="font-medium text-white">
                            {enrollment.user.name || t.admin.unnamed}
                          </p>
                          <p className="text-xs text-slate-400">
                            {enrollment.user.email}
                          </p>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          {enrollment.course.thumbnail ? (
                            <img
                              src={enrollment.course.thumbnail}
                              alt={enrollment.course.title}
                              className="h-10 w-14 rounded object-cover"
                            />
                          ) : (
                            <div className="flex h-10 w-14 items-center justify-center rounded bg-slate-800 text-xs text-slate-400">
                              No img
                            </div>
                          )}
                          <div className="min-w-0">
                            <Link
                              href={`/courses/${enrollment.course.slug}`}
                              className="font-medium text-white hover:text-cyan-300 transition-colors line-clamp-1"
                            >
                              {enrollment.course.title}
                            </Link>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-sm text-slate-300">
                        {formatDate(enrollment.enrolledAt)}
                      </td>
                      <td className="px-6 py-4">
                        <span className="inline-flex rounded-full bg-emerald-500/15 px-2 py-1 text-xs font-medium text-emerald-300">
                          {t.admin.enrollmentActive}
                        </span>
                      </td>
                      <td className={`px-6 py-4 ${isRtl ? 'text-start' : 'text-end'}`}>
                        <Link
                          href={`/admin/students/${enrollment.user.id}`}
                          className="inline-flex items-center gap-1 rounded-lg px-3 py-1.5 text-sm text-slate-300 transition-colors hover:bg-slate-800"
                        >
                          {t.admin.viewStudent}
                          <svg
                            className={`h-4 w-4 ${isRtl ? 'rotate-180' : ''}`}
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M9 5l7 7-7 7"
                            />
                          </svg>
                        </Link>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="mt-6 flex items-center justify-between">
              <p className="text-sm text-slate-400">
                {t.admin.showingResults
                  .replace("{start}", String(startIndex + 1))
                  .replace("{end}", String(Math.min(startIndex + itemsPerPage, filteredEnrollments.length)))
                  .replace("{total}", String(filteredEnrollments.length))}
              </p>

              <div className="flex gap-2">
                <button
                  onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                  disabled={currentPage === 1}
                  className="rounded-lg border border-slate-700 px-3 py-1.5 text-sm text-slate-300 transition-colors hover:bg-slate-800 disabled:opacity-30 disabled:hover:bg-transparent"
                >
                  {t.admin.previousPage}
                </button>
                <div className="flex gap-1">
                  {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                    <button
                      key={page}
                      onClick={() => setCurrentPage(page)}
                      className={`rounded-lg px-3 py-1.5 text-sm transition-colors ${
                        page === currentPage
                          ? "bg-cyan-500 text-slate-950 font-medium"
                          : "border border-slate-700 text-slate-300 hover:bg-slate-800"
                      }`}
                    >
                      {page}
                    </button>
                  ))}
                </div>
                <button
                  onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                  disabled={currentPage === totalPages}
                  className="rounded-lg border border-slate-700 px-3 py-1.5 text-sm text-slate-300 transition-colors hover:bg-slate-800 disabled:opacity-30 disabled:hover:bg-transparent"
                >
                  {t.admin.nextPage}
                </button>
              </div>
            </div>
          )}
        </>
      )}

      {/* Manual enroll dialog */}
      {showEnrollDialog && (
        <ManualEnrollDialog
          courses={courses}
          onClose={() => setShowEnrollDialog(false)}
          onSuccess={handleEnrollSuccess}
        />
      )}
    </div>
  );
}
