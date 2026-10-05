import { SettingsIcon } from "@/components/icons/HseIcons";

export default function AdminSettingsPage() {
  return (
    <div className="mx-auto max-w-7xl">
      <div className="mb-6">
        <div className="flex items-center gap-3 mb-2">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#073022] text-[#FDCD1A]">
            <SettingsIcon className="w-6 h-6" />
          </div>
          <h1 className="text-3xl font-bold text-white">Paramètres</h1>
        </div>
        <p className="mt-1 text-sm text-slate-400">Configuration de la plateforme</p>
      </div>

      <div className="rounded-3xl border border-dashed border-slate-700 bg-slate-900/50 p-12 text-center">
        <div className="mx-auto max-w-sm">
          <div className="mb-4 flex justify-center">
            <SettingsIcon className="h-12 w-12 text-slate-600" />
          </div>
          <h3 className="text-lg font-semibold text-white">Configuration système</h3>
          <p className="mt-2 text-sm text-slate-400">
            Paramètres site (nom, contact, WhatsApp, réseaux sociaux) - à venir
          </p>
        </div>
      </div>
    </div>
  );
}
