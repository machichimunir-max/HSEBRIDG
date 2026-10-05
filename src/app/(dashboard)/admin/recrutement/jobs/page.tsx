import { prisma } from "@/lib/db";
import { RecrutementIcon } from "@/components/icons/HseIcons";

async function getJobs() {
  const jobs = await prisma.jobPosting.findMany({
    orderBy: { createdAt: "desc" },
    include: {
      _count: { select: { applications: true } },
    },
  });
  return jobs;
}

export default async function AdminJobsPage() {
  const jobs = await getJobs();

  return (
    <div className="mx-auto max-w-7xl">
      <header className="mb-8">
        <div className="flex items-center gap-3 mb-2">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#073022] text-[#FDCD1A]">
            <RecrutementIcon className="w-6 h-6" />
          </div>
          <div>
            <h1 className="text-3xl font-extrabold text-white uppercase">Offres d&apos;Emploi HSE</h1>
            <p className="text-sm text-slate-400">
              Gestion des offres publiées et pipelines de candidatures
            </p>
          </div>
        </div>
      </header>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 mb-8">
        <div className="rounded-2xl border border-slate-800 bg-slate-900/50 p-6">
          <p className="text-sm font-semibold text-slate-400 uppercase">Offres Actives</p>
          <p className="mt-3 text-3xl font-extrabold text-white">
            {jobs.filter((j) => j.isActive).length}
          </p>
        </div>
        <div className="rounded-2xl border border-slate-800 bg-slate-900/50 p-6">
          <p className="text-sm font-semibold text-slate-400 uppercase">Candidatures</p>
          <p className="mt-3 text-3xl font-extrabold text-white">
            {jobs.reduce((sum, j) => sum + j._count.applications, 0)}
          </p>
        </div>
        <div className="rounded-2xl border border-slate-800 bg-slate-900/50 p-6">
          <p className="text-sm font-semibold text-slate-400 uppercase">Domaines</p>
          <p className="mt-3 text-3xl font-extrabold text-white">
            {new Set(jobs.map((j) => j.domain)).size}
          </p>
        </div>
      </div>

      {jobs.length === 0 ? (
        <div className="rounded-2xl border border-slate-800 bg-slate-900/50 p-12 text-center">
          <p className="text-slate-400">Aucune offre d&apos;emploi publiée pour le moment.</p>
        </div>
      ) : (
        <div className="space-y-4">
          {jobs.map((job) => (
            <div
              key={job.id}
              className="rounded-2xl border border-slate-800 bg-slate-900/50 p-6 hover:border-slate-700 transition-colors"
            >
              <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
                <div className="flex-1">
                  <div className="flex items-center gap-3 flex-wrap mb-2">
                    <h3 className="text-lg font-bold text-white">{job.titleFr}</h3>
                    <span
                      className={`rounded-full px-3 py-1 text-xs font-bold ${
                        job.isActive
                          ? "bg-emerald-500/10 text-emerald-400 border border-emerald-500/30"
                          : "bg-slate-700 text-slate-400"
                      }`}
                    >
                      {job.isActive ? "Active" : "Inactive"}
                    </span>
                  </div>
                  <div className="flex flex-wrap gap-4 text-sm text-slate-400 mb-2">
                    <span>🎯 {job.domain}</span>
                    <span>📋 {job.contractType}</span>
                    <span>{job.scope === "NATIONAL" ? "🇲🇦 National" : "🌍 International"}</span>
                    {job.location && <span>📍 {job.location}</span>}
                  </div>
                  <p className="text-sm text-slate-500 line-clamp-2">{job.descriptionFr}</p>
                </div>

                <div className="flex flex-col gap-2 sm:w-40">
                  <div className="rounded-lg bg-slate-950/60 border border-slate-800 p-3 text-center">
                    <p className="text-2xl font-extrabold text-[#FDCD1A]">{job._count.applications}</p>
                    <p className="text-xs text-slate-400">Candidatures</p>
                  </div>
                  <a
                    href="/admin/recrutement/applications"
                    className="rounded-lg bg-[#073022] px-3 py-2 text-center text-xs font-bold text-[#FDCD1A] hover:bg-[#0a4030] transition-colors"
                  >
                    Voir pipeline →
                  </a>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
