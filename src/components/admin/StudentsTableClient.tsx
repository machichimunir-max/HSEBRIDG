"use client";

import { useState } from "react";
import Link from "next/link";
import { formatDate } from "@/lib/date-utils";

type Student = {
  id: string;
  name: string | null;
  email: string;
  createdAt: string; // ISO string
  enrollments: Array<{
    course: { title: string; slug: string };
  }>;
  lessonProgress: Array<{
    isCompleted: boolean;
  }>;
};

interface StudentsTableClientProps {
  students: Student[];
}

export function StudentsTableClient({ students }: StudentsTableClientProps) {
  const [search, setSearch] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  // Filter students
  const filteredStudents = students.filter((student) => {
    if (!search) return true;
    const searchLower = search.toLowerCase();
    return (
      student.name?.toLowerCase().includes(searchLower) ||
      student.email.toLowerCase().includes(searchLower)
    );
  });

  // Paginate
  const totalPages = Math.ceil(filteredStudents.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedStudents = filteredStudents.slice(startIndex, startIndex + itemsPerPage);

  return (
    <>
      {/* Search */}
      <div className="mb-6">
        <div className="relative">
          <svg
            className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-slate-400"
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
            placeholder="Search students by name or email..."
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
              setCurrentPage(1);
            }}
            className="w-full rounded-lg border border-slate-700 bg-slate-950 py-2 pl-10 pr-4 text-sm text-white placeholder-slate-400 focus:border-cyan-500 focus:outline-none focus:ring-1 focus:ring-cyan-500"
          />
        </div>
      </div>

      {/* Table */}
      {paginatedStudents.length === 0 ? (
        <div className="rounded-3xl border border-dashed border-slate-700 bg-slate-900/50 p-12 text-center">
          <div className="mx-auto max-w-sm">
            <div className="mb-4 text-4xl">👥</div>
            <h3 className="text-lg font-semibold text-white">
              {search ? "No students found" : "No students yet"}
            </h3>
            <p className="mt-2 text-sm text-slate-400">
              {search ? "Try a different search term" : "Students will appear here once they register"}
            </p>
          </div>
        </div>
      ) : (
        <>
          <div className="overflow-hidden rounded-2xl border border-slate-800 bg-slate-900/50">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="border-b border-slate-800 bg-slate-950/50">
                  <tr>
                    <th className="px-6 py-4 text-left text-sm font-medium text-slate-300">
                      Name
                    </th>
                    <th className="px-6 py-4 text-left text-sm font-medium text-slate-300">
                      Email
                    </th>
                    <th className="px-6 py-4 text-left text-sm font-medium text-slate-300">
                      Enrolled Courses
                    </th>
                    <th className="px-6 py-4 text-left text-sm font-medium text-slate-300">
                      Progress
                    </th>
                    <th className="px-6 py-4 text-left text-sm font-medium text-slate-300">
                      Joined
                    </th>
                    <th className="px-6 py-4 text-right text-sm font-medium text-slate-300">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800">
                  {paginatedStudents.map((student) => {
                    const completedLessons = student.lessonProgress.filter(
                      (p) => p.isCompleted
                    ).length;
                    const totalProgress =
                      student.lessonProgress.length > 0
                        ? Math.round(
                            (completedLessons / student.lessonProgress.length) * 100
                          )
                        : 0;

                    return (
                      <tr
                        key={student.id}
                        className="transition-colors hover:bg-slate-800/30"
                      >
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-3">
                            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-cyan-500/10 text-sm font-semibold text-cyan-300">
                              {student.name
                                ?.charAt(0)
                                .toUpperCase() || student.email.charAt(0).toUpperCase()}
                            </div>
                            <div>
                              <p className="font-medium text-white">
                                {student.name || "Unnamed"}
                              </p>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4 text-sm text-slate-300">
                          {student.email}
                        </td>
                        <td className="px-6 py-4 text-sm text-slate-300">
                          {student.enrollments.length}
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-2">
                            <div className="h-2 w-24 overflow-hidden rounded-full bg-slate-800">
                              <div
                                className="h-full bg-cyan-500 transition-all"
                                style={{ width: `${totalProgress}%` }}
                              />
                            </div>
                            <span className="text-sm text-slate-400">
                              {totalProgress}%
                            </span>
                          </div>
                        </td>
                        <td className="px-6 py-4 text-sm text-slate-400">
                          {formatDate(student.createdAt)}
                        </td>
                        <td className="px-6 py-4 text-right">
                          <Link
                            href={`/admin/students/${student.id}`}
                            className="inline-flex items-center gap-1 rounded-lg px-3 py-1.5 text-sm text-slate-300 transition-colors hover:bg-slate-800"
                          >
                            View details
                            <svg
                              className="h-4 w-4"
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
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="mt-6 flex items-center justify-between">
              <p className="text-sm text-slate-400">
                Showing {startIndex + 1} to {Math.min(startIndex + itemsPerPage, filteredStudents.length)} of{" "}
                {filteredStudents.length} students
              </p>

              <div className="flex gap-2">
                <button
                  onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                  disabled={currentPage === 1}
                  className="rounded-lg border border-slate-700 px-3 py-1.5 text-sm text-slate-300 transition-colors hover:bg-slate-800 disabled:opacity-30 disabled:hover:bg-transparent"
                >
                  Previous
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
                  Next
                </button>
              </div>
            </div>
          )}
        </>
      )}
    </>
  );
}
