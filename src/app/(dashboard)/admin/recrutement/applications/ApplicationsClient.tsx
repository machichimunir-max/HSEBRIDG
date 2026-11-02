"use client";

import { useState } from "react";
import { RecrutementIcon } from "@/components/icons/HseIcons";

type AppStatus = "NEW" | "SHORTLISTED" | "INTERVIEW" | "PLACED" | "REJECTED";

interface CandidateProfile {
  id: string;
  fullName: string;
  email: string;
  phone: string;
  domain: string;
  experience: string | null;
  availability: string | null;
}

interface JobPosting {
  id: string;
  titleFr: string;
  domain: string;
}

interface Application {
  id: string;
  status: AppStatus;
  coverLetter: string | null;
  appliedAt: string;
  candidateProfile: CandidateProfile;
  jobPosting: JobPosting;
}

const statusConfig: Record<AppStatus, { label: string; color: string; badge: string }> = {
  NEW: { label: "Nouvelle", color: "text-blue-400", badge: "bg-blue-500/10 border-blue-500/30 text-blue-400" },
  SHORTLISTED: { label: "Shortlisté", color: "text-yellow-400", badge: "bg-yellow-500/10 border-yellow-500/30 text-yellow-400" },
  INTERVIEW: { label: "Entretien", color: "text-purple-400", badge: "bg-purple-500/10 border-purple-500/30 text-purple-400" },
  PLACED: { label: "Placé", color: "text-emerald-400", badge: "bg-emerald-500/10 border-emerald-500/30 text-emerald-400" },
  REJECTED: { label: "Rejeté", color: "text-rose-400", badge: "bg-rose-500/10 border-rose-500/30 text-rose-400" },
};

export function ApplicationsClient({ applications }: { applications: Application[] }) {
  const [filter, setFilter] = useState<AppStatus | "ALL">("ALL");
  const [updating, setUpdating] = useState(false);

  const filtered = filter === "ALL" ? applications : applications.filter((a) => a.status === filter);

  const handleUpdateStatus = async (id: string, status: AppStatus) => {
    setUpdating(true);
    try {
      const res = await fetch(`/api/recrutement/applications/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status }),
      });
      if (res.ok) window.location.reload();
    } catch (e) {
      console.error(e);
      alert("Erreur lors de la mise à jour");
    } finally {
      setUpdating(false);
    }
  };

  return (
    <div className="mx-auto max-w-7xl">
      <header className="mb-8">
        <div className="flex items-center gap-3 mb-2">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#073022] text-[#FDCD1A]">
            <RecrutementIcon className="w-6 h-6" />
          </div>
          <div>
            <h1 className="text-3xl font-extrabold text-white uppercase">Pipeline de Candidatures</h1>
            <p className="text-sm text-slate-400">Suivi des candidats à chaque étape du processus</p>
          </div>
        </div>
      </header>

      <div className="grid gap-4 sm:grid-cols-3 lg:grid-cols-5 mb-6">
        {(Object.keys(statusConfig) as AppStatus[]).map((status) => (
          <button
            key={status}
            onClick={() => setFilter(status)}
            className={`rounded-2xl border p-4 text-left transition-colors ${
              filter === status
                ? statusConfig[status].badge
                : "border-slate-800 bg-slate-900/50 hover:border-slate-700"
            }`}
          >
            <p className={`text-xs font-semibold uppercase ${filter === status ? statusConfig[status].color : "text-slate-400"}`}>
              {statusConfig[status].label}
            </p>
            <p className="mt-2 text-2xl font-extrabold text-white">
              {applications.filter((a) => a.status === status).length}
            </p>
          </button>
        ))}
      </div>

      <button
        onClick={() => setFilter("ALL")}
        className="mb-4 rounded-lg border border-slate-700 px-4 py-2 text-sm font-medium text-slate-300 hover:bg-slate-800"
      >
        Tous ({applications.length})
      </button>

      {filtered.length === 0 ? (
        <div className="rounded-2xl border border-slate-800 bg-slate-900/50 p-12 text-center">
          <p className="text-slate-400">Aucune candidature dans ce statut.</p>
        </div>
      ) : (
        <div className="space-y-4">
          {filtered.map((app) => (
            <div
              key={app.id}
              className="rounded-2xl border border-slate-800 bg-slate-900/50 p-6 hover:border-slate-700 transition-colors"
            >
              <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-4">
                <div className="flex-1">
                  <div className="flex items-center gap-3 flex-wrap mb-2">
                    <h3 className="text-lg font-bold text-white">{app.candidateProfile.fullName}</h3>
                    <span className={`rounded-full border px-3 py-1 text-xs font-bold ${statusConfig[app.status].badge}`}>
                      {statusConfig[app.status].label}
                    </span>
                  </div>
                  <div className="flex flex-wrap gap-4 text-sm text-slate-400 mb-2">
                    <span className="flex items-center gap-1.5">
                      <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M21.75 6.75v10.5a2.25 2.25 0 01-2.25 2.25h-15a2.25 2.25 0 01-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25m19.5 0v.243a2.25 2.25 0 01-1.07 1.916l-7.5 4.615a2.25 2.25 0 01-2.36 0L3.32 8.91a2.25 2.25 0 01-1.07-1.916V6.75" /></svg>
                      {app.candidateProfile.email}
                    </span>
                    <span className="flex items-center gap-1.5">
                      <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M2.25 6.75c0 8.284 6.716 15 15 15h2.25a2.25 2.25 0 002.25-2.25v-1.372c0-.516-.351-.966-.852-1.091l-4.423-1.106c-.44-.11-.902.055-1.173.417l-.97 1.293c-.282.376-.769.542-1.21.38a12.035 12.035 0 01-7.143-7.143c-.162-.441.004-.928.38-1.21l1.293-.97c.363-.271.527-.734.417-1.173L6.963 3.102a1.125 1.125 0 00-1.091-.852H4.5A2.25 2.25 0 002.25 4.5v2.25z" /></svg>
                      {app.candidateProfile.phone}
                    </span>
                    <span className="flex items-center gap-1.5">
                      <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M15 10.5a3 3 0 11-6 0 3 3 0 016 0z" /><path strokeLinecap="round" strokeLinejoin="round" d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1115 0z" /></svg>
                      {app.candidateProfile.domain}
                    </span>
                  </div>
                  <div className="rounded-lg bg-slate-950/60 border border-slate-800 p-3">
                    <p className="text-xs font-semibold text-slate-500 uppercase mb-1">
                      Candidat au poste : {app.jobPosting.titleFr}
                    </p>
                    {app.coverLetter && <p className="text-sm text-slate-300">{app.coverLetter}</p>}
                  </div>
                  <p className="mt-2 text-xs text-slate-500">
                    Candidature du {new Date(app.appliedAt).toLocaleDateString("fr-FR")}
                  </p>
                </div>

                <div className="flex flex-col gap-2 lg:w-48">
                  <p className="text-xs font-semibold text-slate-400 uppercase">Étape suivante :</p>
                  {(Object.keys(statusConfig) as AppStatus[])
                    .filter((s) => s !== app.status)
                    .map((status) => (
                      <button
                        key={status}
                        onClick={() => handleUpdateStatus(app.id, status)}
                        disabled={updating}
                        className={`rounded-lg border px-3 py-2 text-xs font-medium transition-colors ${statusConfig[status].badge} hover:opacity-80 disabled:opacity-50`}
                      >
                        → {statusConfig[status].label}
                      </button>
                    ))}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
