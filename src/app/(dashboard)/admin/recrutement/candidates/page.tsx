import { prisma } from "@/lib/db";
import { RecrutementIcon } from "@/components/icons/HseIcons";

async function getCandidates() {
  const candidates = await prisma.candidateProfile.findMany({
    orderBy: { createdAt: "desc" },
    include: {
      _count: { select: { applications: true } },
    },
  });
  return candidates;
}

export default async function AdminCandidatesPage() {
  const candidates = await getCandidates();

  return (
    <div className="mx-auto max-w-7xl">
      <header className="mb-8">
        <div className="flex items-center gap-3 mb-2">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#073022] text-[#FDCD1A]">
            <RecrutementIcon className="w-6 h-6" />
          </div>
          <div>
            <h1 className="text-3xl font-extrabold text-white uppercase">CVthèque Candidats HSE</h1>
            <p className="text-sm text-slate-400">
              Base de candidats avec recherche par domaine, expérience et disponibilité
            </p>
          </div>
        </div>
      </header>

      <div className="rounded-2xl border border-slate-800 bg-slate-900/50 p-6 mb-6">
        <p className="text-sm font-semibold text-slate-400 uppercase">Total Candidats</p>
        <p className="mt-2 text-3xl font-extrabold text-white">{candidates.length}</p>
      </div>

      {candidates.length === 0 ? (
        <div className="rounded-2xl border border-slate-800 bg-slate-900/50 p-12 text-center">
          <p className="text-slate-400">
            Aucun candidat enregistré. Les candidats s&apos;inscrivent via la page publique /recrutement.
          </p>
        </div>
      ) : (
        <div className="grid gap-4 md:grid-cols-2">
          {candidates.map((c) => (
            <div
              key={c.id}
              className="rounded-2xl border border-slate-800 bg-slate-900/50 p-6 hover:border-slate-700 transition-colors"
            >
              <div className="flex items-start justify-between gap-3 mb-3">
                <div>
                  <h3 className="text-lg font-bold text-white">{c.fullName}</h3>
                  <p className="text-sm text-[#FDCD1A]">{c.domain}</p>
                </div>
                <span className="rounded-full bg-slate-800 px-3 py-1 text-xs font-bold text-slate-300">
                  {c._count.applications} candidature(s)
                </span>
              </div>

              <div className="space-y-1.5 text-sm text-slate-400">
                <p>📧 {c.email}</p>
                <p>📱 {c.phone}</p>
                {c.experience && <p>💼 Expérience : {c.experience}</p>}
                {c.availability && <p>📍 Disponibilité : {c.availability}</p>}
              </div>

              {c.certifications.length > 0 && (
                <div className="mt-3 pt-3 border-t border-slate-800">
                  <p className="text-xs font-semibold text-slate-500 uppercase mb-1">Certifications</p>
                  <div className="flex flex-wrap gap-1.5">
                    {c.certifications.map((cert, i) => (
                      <span
                        key={i}
                        className="rounded-full bg-[#073022] px-2.5 py-0.5 text-xs text-[#FDCD1A]"
                      >
                        {cert}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              <div className="mt-4 pt-3 border-t border-slate-800 flex gap-2">
                <a
                  href={`mailto:${c.email}`}
                  className="flex-1 rounded-lg border border-slate-700 px-3 py-2 text-center text-xs font-medium text-slate-300 hover:bg-slate-800 transition-colors"
                >
                  Contact Email
                </a>
                <a
                  href={`https://wa.me/${c.phone.replace(/\D/g, "")}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex-1 rounded-lg bg-emerald-500 px-3 py-2 text-center text-xs font-bold text-white hover:bg-emerald-600 transition-colors"
                >
                  WhatsApp
                </a>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
