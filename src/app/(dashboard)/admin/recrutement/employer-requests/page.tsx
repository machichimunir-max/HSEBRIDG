import { RecrutementIcon } from "@/components/icons/HseIcons";

export default function EmployerRequestsPage() {
  return (
    <div className="mx-auto max-w-7xl">
      <header className="mb-8">
        <div className="flex items-center gap-3 mb-2">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#073022] text-[#FDCD1A]">
            <RecrutementIcon className="w-6 h-6" />
          </div>
          <h1 className="text-3xl font-extrabold text-white uppercase">Demandes Entreprises</h1>
        </div>
        <p className="text-sm text-slate-400">
          Formulaires "Demander des profils" reçus des employeurs (Phase 7)
        </p>
      </header>

      <div className="rounded-2xl border border-amber-500/30 bg-amber-500/5 p-8 text-center">
        <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-amber-500/20 text-amber-400 mb-4">
          <span className="text-3xl">🏢</span>
        </div>
        <h2 className="text-xl font-bold text-white mb-2">Inbox demandes entreprises — Phase 7</h2>
        <p className="text-sm text-slate-400 max-w-2xl mx-auto leading-relaxed">
          Gestion des mandats de recherche soumis par les entreprises via le formulaire public,
          avec qualification des besoins, matching avec la CVthèque, et suivi commercial.
        </p>
      </div>
    </div>
  );
}
