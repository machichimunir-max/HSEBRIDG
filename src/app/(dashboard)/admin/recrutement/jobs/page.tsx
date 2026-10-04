import { RecrutementIcon } from "@/components/icons/HseIcons";

export default function RecrutementJobsPage() {
  return (
    <div className="mx-auto max-w-7xl">
      <header className="mb-8">
        <div className="flex items-center gap-3 mb-2">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#073022] text-[#FDCD1A]">
            <RecrutementIcon className="w-6 h-6" />
          </div>
          <h1 className="text-3xl font-extrabold text-white uppercase">Offres d'Emploi HSE</h1>
        </div>
        <p className="text-sm text-slate-400">
          CRUD des offres — domaines, contrats (CDI/CDD/Intérim), national/international (Phase 7)
        </p>
      </header>

      <div className="rounded-2xl border border-amber-500/30 bg-amber-500/5 p-8 text-center">
        <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-amber-500/20 text-amber-400 mb-4">
          <span className="text-3xl">💼</span>
        </div>
        <h2 className="text-xl font-bold text-white mb-2">Gestion des offres d'emploi — Phase 7</h2>
        <p className="text-sm text-slate-400 max-w-2xl mx-auto leading-relaxed">
          Publication d'offres HSE dans les 8 domaines de spécialité, filtres côté public (domaine, contrat, localisation),
          et statut actif/expiré.
        </p>
        <div className="mt-6">
          <a
            href="/recrutement"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex rounded-full bg-[#073022] px-6 py-2.5 text-sm font-bold text-[#FDCD1A] hover:bg-[#0a4030] transition-colors"
          >
            Voir la page publique Recrutement →
          </a>
        </div>
      </div>
    </div>
  );
}
