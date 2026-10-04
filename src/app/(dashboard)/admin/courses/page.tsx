"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { CoursesTableClient } from "@/components/admin/CoursesTableClient";
import { useI18n } from "@/lib/i18n/I18nContext";

export default function AdminCoursesPage() {
  const { t } = useI18n();
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadCourses() {
      try {
        const res = await fetch("/api/courses");
        if (res.ok) {
          const data = await res.json();
          setCourses(data);
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }
    loadCourses();
  }, []);

  if (loading) {
    return (
      <div className="mx-auto max-w-7xl">
        <p className="text-white">{t.common.loading}</p>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-7xl">
      <div className="mb-6 flex items-center justify-between gap-3">
        <div>
          <h1 className="text-3xl font-bold text-white">{t.admin.coursesTitle}</h1>
          <p className="mt-1 text-sm text-slate-400">{t.admin.manageCourses}</p>
        </div>
        <Link
          href="/admin/courses/new"
          className="flex items-center gap-2 rounded-lg bg-[#FDCD1A] px-4 py-2 font-semibold text-[#0A0A0A] transition-colors hover:bg-[#e5b917]"
        >
          <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
          </svg>
          {t.admin.createCourse}
        </Link>
      </div>

      <CoursesTableClient courses={courses} />
    </div>
  );
}
