import { BoutiqueIcon } from "@/components/icons/HseIcons";

export default function BoutiqueCategoriesPage() {
  return (
    <div className="mx-auto max-w-7xl">
      <header className="mb-8">
        <div className="flex items-center gap-3 mb-2">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#FDCD1A] text-[#0A0A0A]">
            <BoutiqueIcon className="w-6 h-6" />
          </div>
          <h1 className="text-3xl font-extrabold text-white uppercase">Catégories EPI / EPC</h1>
        </div>
        <p className="text-sm text-slate-400">
          Gestion des 10 catégories d'équipements de protection (Phase 6)
        </p>
      </header>

      <div className="rounded-2xl border border-amber-500/30 bg-amber-500/5 p-8 text-center">
        <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-amber-500/20 text-amber-400 mb-4">
          <span className="text-3xl">⏳</span>
        </div>
        <h2 className="text-xl font-bold text-white mb-2">Module en développement</h2>
        <p className="text-sm text-slate-400 max-w-2xl mx-auto leading-relaxed">
          La gestion des catégories EPI/EPC (Protection de la tête, des yeux, auditive, des mains, des pieds,
          vêtements haute visibilité, travail en hauteur, respiratoire, lutte incendie, EPC signalisation)
          sera implémentée dans <span className="font-bold text-amber-400">PHASE 6</span>.
        </p>
        <div className="mt-6">
          <a
            href="/boutique"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex rounded-full bg-[#FDCD1A] px-6 py-2.5 text-sm font-bold text-[#0A0A0A] hover:bg-[#e5b917] transition-colors"
          >
            Voir la page publique Boutique →
          </a>
        </div>
      </div>
    </div>
  );
}
