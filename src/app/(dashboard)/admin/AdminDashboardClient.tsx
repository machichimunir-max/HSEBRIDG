"use client";

import Link from "next/link";
import { FormationIcon, BoutiqueIcon, RecrutementIcon } from "@/components/icons/HseIcons";
import { useI18n } from "@/lib/i18n/I18nContext";

export function AdminDashboardClient({ analytics }: { analytics: any }) {
  const { t, locale } = useI18n();
  const isRtl = locale === "ar";

  return (
    <div className="mx-auto max-w-7xl">
      <header className="mb-8">
        <h1 className="text-3xl font-extrabold text-white uppercase">{t.admin.dashboardMultiPillar}</h1>
        <p className="mt-2 text-sm text-slate-400">
          {t.admin.dashboardMultiPillarDesc}
        </p>
      </header>

      {/* PILLAR 1: FORMATION HSE */}
      <section className="mb-8">
        <div className="mb-4 flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#073022] text-[#FDCD1A]">
            <FormationIcon className="w-6 h-6" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-white">{t.admin.pillarFormation}</h2>
            <p className="text-xs text-slate-400">{t.admin.pillarFormationDesc}</p>
          </div>
        </div>

        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4 mb-6">
          <div className="rounded-2xl border border-slate-800 bg-slate-900/50 backdrop-blur-sm p-6">
            <p className="text-sm font-semibold text-slate-400 uppercase">{t.admin.totalCourses}</p>
            <p className="mt-3 text-3xl font-extrabold text-white">{analytics.formation.totalCourses}</p>
            <p className="mt-1 text-xs text-slate-500">{analytics.formation.publishedCourses} {t.admin.published}</p>
          </div>

          <div className="rounded-2xl border border-slate-800 bg-slate-900/50 backdrop-blur-sm p-6">
            <p className="text-sm font-semibold text-slate-400 uppercase">{t.admin.totalStudents}</p>
            <p className="mt-3 text-3xl font-extrabold text-white">{analytics.formation.totalStudents}</p>
            <p className="mt-1 text-xs text-slate-500">{t.admin.activeAccounts}</p>
          </div>

          <div className="rounded-2xl border border-slate-800 bg-slate-900/50 backdrop-blur-sm p-6">
            <p className="text-sm font-semibold text-slate-400 uppercase">{t.admin.activeEnrollments}</p>
            <p className="mt-3 text-3xl font-extrabold text-white">{analytics.formation.totalEnrollments}</p>
            {analytics.formation.enrollmentTrend !== 0 && (
              <p
                className={`mt-2 flex items-center gap-1 text-xs font-semibold ${
                  analytics.formation.enrollmentTrend >= 0 ? "text-emerald-400" : "text-red-400"
                }`}
                dir="ltr"
              >
                {analytics.formation.enrollmentTrend >= 0 ? "↑" : "↓"}
                {Math.abs(analytics.formation.enrollmentTrend).toFixed(1)}% {t.admin.vsLastMonth}
              </p>
            )}
          </div>

          <div className="rounded-2xl border border-slate-800 bg-slate-900/50 backdrop-blur-sm p-6 flex flex-col justify-between">
            <p className="text-sm font-semibold text-slate-400 uppercase">{t.admin.management}</p>
            <div className="mt-3 flex flex-col gap-2">
              <Link
                href="/admin/courses"
                className="rounded-lg bg-[#073022] px-3 py-2 text-center text-xs font-bold text-[#FDCD1A] hover:bg-[#0a4030] transition-colors"
              >
                {t.admin.manageCourses}
              </Link>
              <Link
                href="/admin/students"
                className="rounded-lg border border-slate-700 px-3 py-2 text-center text-xs font-medium text-slate-300 hover:bg-slate-800 transition-colors"
              >
                {t.admin.viewStudents}
              </Link>
            </div>
          </div>
        </div>

        {analytics.formation.recentEnrollments.length > 0 && (
          <div className="rounded-2xl border border-slate-800 bg-slate-900/50 p-6">
            <div className="mb-4 flex items-center justify-between">
              <h3 className="text-sm font-bold text-white uppercase">{t.admin.latestEnrollments}</h3>
              <Link
                href="/admin/enrollments"
                className="text-xs font-semibold text-[#FDCD1A] hover:text-[#e5b917] transition-colors"
              >
                {t.admin.viewAll}
              </Link>
            </div>
            <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
              {analytics.formation.recentEnrollments.map((enrollment: any) => (
                <div
                  key={enrollment.id}
                  className="rounded-xl border border-slate-800 bg-slate-950/60 p-3"
                >
                  <p className="font-semibold text-white text-sm line-clamp-1">
                    {enrollment.user.name || t.admin.unnamed}
                  </p>
                  <p className="text-xs text-slate-400 line-clamp-1 mt-0.5">
                    {enrollment.course.title}
                  </p>
                  <p className="text-[10px] text-slate-500 mt-1">
                    {new Date(enrollment.enrolledAt).toLocaleDateString()}
                  </p>
                </div>
              ))}
            </div>
          </div>
        )}
      </section>

      {/* PILLAR 2: BOUTIQUE EPI/EPC */}
      <section className="mb-8">
        <div className="mb-4 flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#FDCD1A] text-[#0A0A0A]">
            <BoutiqueIcon className="w-6 h-6" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-white">{t.admin.pillarBoutique}</h2>
            <p className="text-xs text-slate-400">{t.admin.pillarBoutiqueDesc}</p>
          </div>
        </div>

        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <div className="rounded-2xl border border-slate-800 bg-slate-900/50 backdrop-blur-sm p-6">
            <p className="text-sm font-semibold text-slate-400 uppercase">{t.admin.catalogProducts}</p>
            <p className="mt-3 text-3xl font-extrabold text-white">{analytics.boutique.totalProducts}</p>
            <p className="mt-1 text-xs text-slate-500">Catalogue EPI/EPC</p>
          </div>

          <div className="rounded-2xl border border-slate-800 bg-slate-900/50 backdrop-blur-sm p-6">
            <p className="text-sm font-semibold text-slate-400 uppercase">{t.admin.quoteRequests}</p>
            <p className="mt-3 text-3xl font-extrabold text-white">{analytics.boutique.totalQuoteRequests}</p>
            <p className="mt-1 text-xs text-slate-500">{analytics.boutique.pendingQuotes} {t.admin.pendingQuotes}</p>
          </div>

          <div className="rounded-2xl border border-slate-800 bg-slate-900/50 backdrop-blur-sm p-6">
            <p className="text-sm font-semibold text-slate-400 uppercase">{t.admin.moduleStatus}</p>
            <p className="mt-3 text-sm font-bold text-emerald-400">{t.admin.boutiqueOperational}</p>
            <p className="mt-1 text-xs text-slate-500">{t.admin.catalogAndQuotes}</p>
          </div>

          <div className="rounded-2xl border border-slate-800 bg-slate-900/50 backdrop-blur-sm p-6 flex flex-col justify-between">
            <p className="text-sm font-semibold text-slate-400 uppercase">{t.admin.management}</p>
            <div className="mt-3 flex flex-col gap-2">
              <Link
                href="/admin/boutique/categories"
                className="rounded-lg bg-[#FDCD1A] px-3 py-2 text-center text-xs font-bold text-[#0A0A0A] hover:bg-[#e5b917] transition-colors"
              >
                {t.admin.manageCategories}
              </Link>
              <Link
                href="/admin/boutique/products"
                className="rounded-lg border border-slate-700 px-3 py-2 text-center text-xs font-medium text-slate-300 hover:bg-slate-800 transition-colors"
              >
                {t.admin.manageProducts}
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* PILLAR 3: RECRUTEMENT HSE */}
      <section>
        <div className="mb-4 flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#073022] text-[#FDCD1A]">
            <RecrutementIcon className="w-6 h-6" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-white">{t.admin.pillarRecrutement}</h2>
            <p className="text-xs text-slate-400">{t.admin.pillarRecrutementDesc}</p>
          </div>
        </div>

        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <div className="rounded-2xl border border-slate-800 bg-slate-900/50 backdrop-blur-sm p-6">
            <p className="text-sm font-semibold text-slate-400 uppercase">{t.admin.publishedJobs}</p>
            <p className="mt-3 text-3xl font-extrabold text-white">{analytics.recrutement.totalJobPostings}</p>
            <p className="mt-1 text-xs text-slate-500">{analytics.recrutement.activeJobs} {t.admin.activeJobs}</p>
          </div>

          <div className="rounded-2xl border border-slate-800 bg-slate-900/50 backdrop-blur-sm p-6">
            <p className="text-sm font-semibold text-slate-400 uppercase">{t.admin.applications}</p>
            <p className="mt-3 text-3xl font-extrabold text-white">{analytics.recrutement.totalApplications}</p>
            <p className="mt-1 text-xs text-slate-500">{analytics.recrutement.newApplications} {t.admin.newApplications}</p>
          </div>

          <div className="rounded-2xl border border-slate-800 bg-slate-900/50 backdrop-blur-sm p-6">
            <p className="text-sm font-semibold text-slate-400 uppercase">{t.admin.moduleStatus}</p>
            <p className="mt-3 text-sm font-bold text-emerald-400">{t.admin.recrutementOperational}</p>
            <p className="mt-1 text-xs text-slate-500">{t.admin.jobsAndCVs}</p>
          </div>

          <div className="rounded-2xl border border-slate-800 bg-slate-900/50 backdrop-blur-sm p-6 flex flex-col justify-between">
            <p className="text-sm font-semibold text-slate-400 uppercase">{t.admin.management}</p>
            <div className="mt-3 flex flex-col gap-2">
              <Link
                href="/admin/recrutement/jobs"
                className="rounded-lg bg-[#073022] px-3 py-2 text-center text-xs font-bold text-[#FDCD1A] hover:bg-[#0a4030] transition-colors"
              >
                {t.admin.manageJobs}
              </Link>
              <Link
                href="/admin/recrutement/applications"
                className="rounded-lg border border-slate-700 px-3 py-2 text-center text-xs font-medium text-slate-300 hover:bg-slate-800 transition-colors"
              >
                {t.admin.viewApplications}
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}