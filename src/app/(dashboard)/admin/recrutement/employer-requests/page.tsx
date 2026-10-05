import { prisma } from "@/lib/db";
import { RecrutementIcon } from "@/components/icons/HseIcons";

async function getRequests() {
  const requests = await prisma.employerRequest.findMany({
    orderBy: { submittedAt: "desc" },
  });
  return requests;
}

export default async function AdminEmployerRequestsPage() {
  const requests = await getRequests();

  return (
    <div className="mx-auto max-w-7xl">
      <header className="mb-8">
        <div className="flex items-center gap-3 mb-2">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#073022] text-[#FDCD1A]">
            <RecrutementIcon className="w-6 h-6" />
          </div>
          <div>
            <h1 className="text-3xl font-extrabold text-white uppercase">Demandes Entreprises</h1>
            <p className="text-sm text-slate-400">
              Boîte de réception des mandats de recherche de profils HSE
            </p>
          </div>
        </div>
      </header>

      <div className="rounded-2xl border border-slate-800 bg-slate-900/50 p-6 mb-6">
        <p className="text-sm font-semibold text-slate-400 uppercase">Demandes Reçues</p>
        <p className="mt-2 text-3xl font-extrabold text-white">{requests.length}</p>
      </div>

      {requests.length === 0 ? (
        <div className="rounded-2xl border border-slate-800 bg-slate-900/50 p-12 text-center">
          <p className="text-slate-400">
            Aucune demande d&apos;entreprise reçue. Les entreprises soumettent via la page publique /recrutement.
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {requests.map((req) => (
            <div
              key={req.id}
              className="rounded-2xl border border-slate-800 bg-slate-900/50 p-6 hover:border-slate-700 transition-colors"
            >
              <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
                <div className="flex-1">
                  <div className="flex items-center gap-3 flex-wrap mb-2">
                    <h3 className="text-lg font-bold text-white">{req.companyName}</h3>
                    <span className="rounded-full bg-slate-800 px-3 py-1 text-xs font-bold text-slate-300">
                      {req.status}
                    </span>
                  </div>

                  <div className="flex flex-wrap gap-4 text-sm text-slate-400 mb-2">
                    <span>👤 {req.contactName}</span>
                    <span>📧 {req.email}</span>
                    <span>📱 {req.phone}</span>
                  </div>

                  <div className="flex flex-wrap gap-4 text-sm text-slate-300 mb-3">
                    <span>🎯 {req.domain}</span>
                    <span>📋 {req.contractType}</span>
                    {req.location && <span>📍 {req.location}</span>}
                  </div>

                  <div className="rounded-lg bg-slate-950/60 border border-slate-800 p-3">
                    <p className="text-xs font-semibold text-slate-500 uppercase mb-1">Besoin</p>
                    <p className="text-sm text-slate-300">{req.needs}</p>
                  </div>

                  <p className="mt-2 text-xs text-slate-500">
                    Reçue le {new Date(req.submittedAt).toLocaleDateString("fr-FR", {
                      day: "2-digit",
                      month: "long",
                      year: "numeric",
                    })}
                  </p>
                </div>

                <div className="flex flex-col gap-2 sm:w-44">
                  <a
                    href={`https://wa.me/${req.phone.replace(/\D/g, "")}?text=${encodeURIComponent(`Bonjour ${req.contactName}, suite à votre demande de profils HSE pour ${req.companyName}...`)}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="rounded-lg bg-emerald-500 px-3 py-2 text-center text-xs font-bold text-white hover:bg-emerald-600 transition-colors"
                  >
                    WhatsApp
                  </a>
                  <a
                    href={`mailto:${req.email}?subject=${encodeURIComponent("Votre demande de profils HSE - HSE BRIDGE")}`}
                    className="rounded-lg border border-slate-700 px-3 py-2 text-center text-xs font-medium text-slate-300 hover:bg-slate-800 transition-colors"
                  >
                    Email
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
