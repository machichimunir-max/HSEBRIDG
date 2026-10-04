import Link from "next/link";
import { prisma } from "@/lib/db";
import { FormationIcon, BoutiqueIcon, RecrutementIcon, StudentsIcon } from "@/components/icons/HseIcons";

async function getMultiPillarAnalytics() {
  const now = new Date();
  const lastMonth = new Date(now.getFullYear(), now.getMonth() - 1, now.getDate());

  // PILLAR 1 — FORMATION HSE (LMS)
  const [
    totalCourses,
    publishedCourses,
    totalStudents,
    totalEnrollments,
    lastMonthEnrollments,
  ] = await Promise.all([
    prisma.course.count(),
    prisma.course.count({ where: { isPublished: true } }),
    prisma.user.count({ where: { role: "STUDENT" } }),
    prisma.enrollment.count({ where: { isActive: true } }),
    prisma.enrollment.count({
      where: { isActive: true, enrolledAt: { lt: lastMonth } },
    }),
  ]);

  const enrollmentTrend =
    lastMonthEnrollments > 0
      ? ((totalEnrollments - lastMonthEnrollments) / lastMonthEnrollments) * 100
      : 0;

  // Get recent enrollments for formation pillar
  const recentEnrollments = await prisma.enrollment.findMany({
    where: { isActive: true },
    orderBy: { enrolledAt: "desc" },
    take: 5,
    include: {
      user: { select: { name: true, email: true } },
      course: { select: { title: true, slug: true } },
    },
  });

  // PILLAR 2 — BOUTIQUE EPI/EPC (placeholder counts until schema exists)
  const totalQuoteRequests = 0; // Will count from QuoteRequest model in phase 6
  const pendingQuotes = 0;
  const totalProducts = 0;

  // PILLAR 3 — RECRUTEMENT HSE (placeholder counts until schema exists)
  const totalJobPostings = 0; // Will count from JobPosting model in phase 7
  const activeJobs = 0;
  const totalApplications = 0;
  const newApplications = 0;

  return {
    formation: {
      totalCourses,
      publishedCourses,
      totalStudents,
      totalEnrollments,
      enrollmentTrend,
      recentEnrollments,
    },
    boutique: {
      totalQuoteRequests,
      pendingQuotes,
      totalProducts,
    },
    recrutement: {
      totalJobPostings,
      activeJobs,
      totalApplications,
      newApplications,
    },
  };
}

export default async function AdminDashboardPage() {
  const analytics = await getMultiPillarAnalytics();

  return (
    <div className="mx-auto max-w-7xl">
      <header className="mb-8">
        <h1 className="text-3xl font-extrabold text-white uppercase">Tableau de Bord Multi-Pilier</h1>
        <p className="mt-2 text-sm text-slate-400">
          Vue d'ensemble des 3 métiers HSE BRIDGE — Formation, Boutique EPI/EPC, Recrutement
        </p>
      </header>

      {/* PILLAR 1: FORMATION HSE */}
      <section className="mb-8">
        <div className="mb-4 flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#073022] text-[#FDCD1A]">
            <FormationIcon className="w-6 h-6" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-white">Formation HSE — Académie en Ligne</h2>
            <p className="text-xs text-slate-400">LMS, Étudiants, Inscriptions</p>
          </div>
        </div>

        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4 mb-6">
          <div className="rounded-2xl border border-slate-800 bg-slate-900/50 backdrop-blur-sm p-6">
            <p className="text-sm font-semibold text-slate-400 uppercase">Formations Total</p>
            <p className="mt-3 text-3xl font-extrabold text-white">{analytics.formation.totalCourses}</p>
            <p className="mt-1 text-xs text-slate-500">{analytics.formation.publishedCourses} publiées</p>
          </div>

          <div className="rounded-2xl border border-slate-800 bg-slate-900/50 backdrop-blur-sm p-6">
            <p className="text-sm font-semibold text-slate-400 uppercase">Étudiants Inscrits</p>
            <p className="mt-3 text-3xl font-extrabold text-white">{analytics.formation.totalStudents}</p>
            <p className="mt-1 text-xs text-slate-500">Comptes actifs</p>
          </div>

          <div className="rounded-2xl border border-slate-800 bg-slate-900/50 backdrop-blur-sm p-6">
            <p className="text-sm font-semibold text-slate-400 uppercase">Inscriptions Actives</p>
            <p className="mt-3 text-3xl font-extrabold text-white">{analytics.formation.totalEnrollments}</p>
            {analytics.formation.enrollmentTrend !== 0 && (
              <p
                className={`mt-2 flex items-center gap-1 text-xs font-semibold ${
                  analytics.formation.enrollmentTrend >= 0 ? "text-emerald-400" : "text-red-400"
                }`}
              >
                {analytics.formation.enrollmentTrend >= 0 ? "↑" : "↓"}
                {Math.abs(analytics.formation.enrollmentTrend).toFixed(1)}% vs mois dernier
              </p>
            )}
          </div>

          <div className="rounded-2xl border border-slate-800 bg-slate-900/50 backdrop-blur-sm p-6 flex flex-col justify-between">
            <p className="text-sm font-semibold text-slate-400 uppercase">Gestion</p>
            <div className="mt-3 flex flex-col gap-2">
              <Link
                href="/admin/courses"
                className="rounded-lg bg-[#073022] px-3 py-2 text-center text-xs font-bold text-[#FDCD1A] hover:bg-[#0a4030] transition-colors"
              >
                Gérer Formations
              </Link>
              <Link
                href="/admin/students"
                className="rounded-lg border border-slate-700 px-3 py-2 text-center text-xs font-medium text-slate-300 hover:bg-slate-800 transition-colors"
              >
                Voir Étudiants
              </Link>
            </div>
          </div>
        </div>

        {analytics.formation.recentEnrollments.length > 0 && (
          <div className="rounded-2xl border border-slate-800 bg-slate-900/50 p-6">
            <div className="mb-4 flex items-center justify-between">
              <h3 className="text-sm font-bold text-white uppercase">Dernières Inscriptions</h3>
              <Link
                href="/admin/enrollments"
                className="text-xs font-semibold text-[#FDCD1A] hover:text-[#e5b917] transition-colors"
              >
                Voir tout →
              </Link>
            </div>
            <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
              {analytics.formation.recentEnrollments.map((enrollment) => (
                <div
                  key={enrollment.id}
                  className="rounded-xl border border-slate-800 bg-slate-950/60 p-3"
                >
                  <p className="font-semibold text-white text-sm line-clamp-1">
                    {enrollment.user.name || "Étudiant"}
                  </p>
                  <p className="text-xs text-slate-400 line-clamp-1 mt-0.5">
                    {enrollment.course.title}
                  </p>
                  <p className="text-[10px] text-slate-500 mt-1">
                    {new Date(enrollment.enrolledAt).toLocaleDateString("fr-FR")}
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
            <h2 className="text-xl font-bold text-white">Boutique EPI / EPC — Équipements de Protection</h2>
            <p className="text-xs text-slate-400">Catalogue, Produits, Demandes de Devis</p>
          </div>
        </div>

        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <div className="rounded-2xl border border-slate-800 bg-slate-900/50 backdrop-blur-sm p-6">
            <p className="text-sm font-semibold text-slate-400 uppercase">Produits Catalogue</p>
            <p className="mt-3 text-3xl font-extrabold text-white">{analytics.boutique.totalProducts}</p>
            <p className="mt-1 text-xs text-slate-500">Disponible Phase 6</p>
          </div>

          <div className="rounded-2xl border border-slate-800 bg-slate-900/50 backdrop-blur-sm p-6">
            <p className="text-sm font-semibold text-slate-400 uppercase">Demandes Devis</p>
            <p className="mt-3 text-3xl font-extrabold text-white">{analytics.boutique.totalQuoteRequests}</p>
            <p className="mt-1 text-xs text-slate-500">{analytics.boutique.pendingQuotes} en attente</p>
          </div>

          <div className="rounded-2xl border border-slate-800 bg-slate-900/50 backdrop-blur-sm p-6">
            <p className="text-sm font-semibold text-slate-400 uppercase">Statut Module</p>
            <p className="mt-3 text-sm font-bold text-amber-400">⏳ En attente Phase 6</p>
            <p className="mt-1 text-xs text-slate-500">Catalogue + Devis pro</p>
          </div>

          <div className="rounded-2xl border border-slate-800 bg-slate-900/50 backdrop-blur-sm p-6 flex flex-col justify-between">
            <p className="text-sm font-semibold text-slate-400 uppercase">Gestion</p>
            <div className="mt-3 flex flex-col gap-2">
              <Link
                href="/admin/boutique/categories"
                className="rounded-lg bg-[#FDCD1A] px-3 py-2 text-center text-xs font-bold text-[#0A0A0A] hover:bg-[#e5b917] transition-colors"
              >
                Gérer Catégories
              </Link>
              <Link
                href="/admin/boutique/products"
                className="rounded-lg border border-slate-700 px-3 py-2 text-center text-xs font-medium text-slate-300 hover:bg-slate-800 transition-colors"
              >
                Gérer Produits
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
            <h2 className="text-xl font-bold text-white">Recrutement HSE — Emplois & Candidatures</h2>
            <p className="text-xs text-slate-400">Offres d'Emploi, Candidats, Demandes Entreprises</p>
          </div>
        </div>

        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <div className="rounded-2xl border border-slate-800 bg-slate-900/50 backdrop-blur-sm p-6">
            <p className="text-sm font-semibold text-slate-400 uppercase">Offres Publiées</p>
            <p className="mt-3 text-3xl font-extrabold text-white">{analytics.recrutement.totalJobPostings}</p>
            <p className="mt-1 text-xs text-slate-500">{analytics.recrutement.activeJobs} actives</p>
          </div>

          <div className="rounded-2xl border border-slate-800 bg-slate-900/50 backdrop-blur-sm p-6">
            <p className="text-sm font-semibold text-slate-400 uppercase">Candidatures</p>
            <p className="mt-3 text-3xl font-extrabold text-white">{analytics.recrutement.totalApplications}</p>
            <p className="mt-1 text-xs text-slate-500">{analytics.recrutement.newApplications} nouvelles</p>
          </div>

          <div className="rounded-2xl border border-slate-800 bg-slate-900/50 backdrop-blur-sm p-6">
            <p className="text-sm font-semibold text-slate-400 uppercase">Statut Module</p>
            <p className="mt-3 text-sm font-bold text-amber-400">⏳ En attente Phase 7</p>
            <p className="mt-1 text-xs text-slate-500">Jobs + CV + Pipeline</p>
          </div>

          <div className="rounded-2xl border border-slate-800 bg-slate-900/50 backdrop-blur-sm p-6 flex flex-col justify-between">
            <p className="text-sm font-semibold text-slate-400 uppercase">Gestion</p>
            <div className="mt-3 flex flex-col gap-2">
              <Link
                href="/admin/recrutement/jobs"
                className="rounded-lg bg-[#073022] px-3 py-2 text-center text-xs font-bold text-[#FDCD1A] hover:bg-[#0a4030] transition-colors"
              >
                Gérer Offres
              </Link>
              <Link
                href="/admin/recrutement/applications"
                className="rounded-lg border border-slate-700 px-3 py-2 text-center text-xs font-medium text-slate-300 hover:bg-slate-800 transition-colors"
              >
                Voir Candidatures
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
