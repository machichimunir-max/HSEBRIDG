import { BoutiqueIcon } from "@/components/icons/HseIcons";

export default function BoutiqueQuotesPage() {
  return (
    <div className="mx-auto max-w-7xl">
      <header className="mb-8">
        <div className="flex items-center gap-3 mb-2">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#FDCD1A] text-[#0A0A0A]">
            <BoutiqueIcon className="w-6 h-6" />
          </div>
          <h1 className="text-3xl font-extrabold text-white uppercase">Demandes de Devis Reçues</h1>
        </div>
        <p className="text-sm text-slate-400">
          Inbox professionnel — statuts (nouveau, contacté, devis envoyé, gagné, perdu) — Phase 6
        </p>
      </header>

      <div className="rounded-2xl border border-amber-500/30 bg-amber-500/5 p-8 text-center">
        <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-amber-500/20 text-amber-400 mb-4">
          <span className="text-3xl">📋</span>
        </div>
        <h2 className="text-xl font-bold text-white mb-2">Gestion demandes de devis — Phase 6</h2>
        <p className="text-sm text-slate-400 max-w-2xl mx-auto leading-relaxed">
          Pipeline complet des demandes de devis B2B avec statuts, notes internes, notifications email/WhatsApp,
          et suivi commercial.
        </p>
      </div>
    </div>
  );
}
