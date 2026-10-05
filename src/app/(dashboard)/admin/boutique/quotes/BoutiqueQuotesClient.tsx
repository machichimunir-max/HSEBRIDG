"use client";

import { useState } from "react";
import { useI18n } from "@/lib/i18n/I18nContext";
import { BoutiqueIcon } from "@/components/icons/HseIcons";

type QuoteStatus = "NEW" | "CONTACTED" | "QUOTED" | "WON" | "LOST";

interface QuoteRequest {
  id: string;
  fullName: string;
  company: string | null;
  phone: string;
  email: string;
  categoryName: string | null;
  message: string;
  status: QuoteStatus;
  adminNotes: string | null;
  submittedAt: Date;
  updatedAt: Date;
}

interface BoutiqueQuotesClientProps {
  quotes: QuoteRequest[];
}

const statusConfig: Record<QuoteStatus, { label: string; labelAr: string; color: string; bgColor: string }> = {
  NEW: { label: "Nouveau", labelAr: "جديد", color: "text-blue-400", bgColor: "bg-blue-500/10 border-blue-500/30" },
  CONTACTED: { label: "Contacté", labelAr: "تم الاتصال", color: "text-yellow-400", bgColor: "bg-yellow-500/10 border-yellow-500/30" },
  QUOTED: { label: "Devis Envoyé", labelAr: "عرض مرسل", color: "text-purple-400", bgColor: "bg-purple-500/10 border-purple-500/30" },
  WON: { label: "Gagné", labelAr: "فاز", color: "text-emerald-400", bgColor: "bg-emerald-500/10 border-emerald-500/30" },
  LOST: { label: "Perdu", labelAr: "خسر", color: "text-rose-400", bgColor: "bg-rose-500/10 border-rose-500/30" },
};

export function BoutiqueQuotesClient({ quotes }: BoutiqueQuotesClientProps) {
  const { t, locale } = useI18n();
  const isRtl = locale === "ar";
  const [selectedQuote, setSelectedQuote] = useState<QuoteRequest | null>(null);
  const [filterStatus, setFilterStatus] = useState<QuoteStatus | "ALL">("ALL");
  const [updating, setUpdating] = useState(false);

  const filteredQuotes = filterStatus === "ALL"
    ? quotes
    : quotes.filter(q => q.status === filterStatus);

  const handleUpdateStatus = async (quoteId: string, newStatus: QuoteStatus) => {
    setUpdating(true);
    try {
      const response = await fetch(`/api/boutique/quote/${quoteId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: newStatus }),
      });

      if (!response.ok) throw new Error("Failed to update status");

      // Refresh page
      window.location.reload();
    } catch (error) {
      console.error("Error updating quote status:", error);
      alert("Erreur lors de la mise à jour du statut");
    } finally {
      setUpdating(false);
    }
  };

  const statusStats = {
    total: quotes.length,
    new: quotes.filter(q => q.status === "NEW").length,
    contacted: quotes.filter(q => q.status === "CONTACTED").length,
    quoted: quotes.filter(q => q.status === "QUOTED").length,
    won: quotes.filter(q => q.status === "WON").length,
    lost: quotes.filter(q => q.status === "LOST").length,
  };

  return (
    <div className="mx-auto max-w-7xl">
      <header className="mb-8">
        <div className="flex items-center gap-3 mb-2">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#FDCD1A] text-[#0A0A0A]">
            <BoutiqueIcon className="w-6 h-6" />
          </div>
          <h1 className="text-3xl font-extrabold text-white uppercase">
            {isRtl ? "طلبات عروض الأسعار المستلمة" : "Demandes de Devis Reçues"}
          </h1>
        </div>
        <p className="text-sm text-slate-400">
          {isRtl ? "إدارة الطلبات والتتبع التجاري" : "Gestion des demandes et suivi commercial"}
        </p>
      </header>

      {/* Stats Cards */}
      <div className="grid gap-4 sm:grid-cols-3 lg:grid-cols-6 mb-8">
        <div className="rounded-2xl border border-slate-800 bg-slate-900/50 p-4">
          <p className="text-xs font-semibold text-slate-400 uppercase">Total</p>
          <p className="mt-2 text-2xl font-extrabold text-white">{statusStats.total}</p>
        </div>
        <div className="rounded-2xl border border-blue-500/30 bg-blue-500/5 p-4">
          <p className="text-xs font-semibold text-blue-400 uppercase">{statusConfig.NEW.label}</p>
          <p className="mt-2 text-2xl font-extrabold text-white">{statusStats.new}</p>
        </div>
        <div className="rounded-2xl border border-yellow-500/30 bg-yellow-500/5 p-4">
          <p className="text-xs font-semibold text-yellow-400 uppercase">{statusConfig.CONTACTED.label}</p>
          <p className="mt-2 text-2xl font-extrabold text-white">{statusStats.contacted}</p>
        </div>
        <div className="rounded-2xl border border-purple-500/30 bg-purple-500/5 p-4">
          <p className="text-xs font-semibold text-purple-400 uppercase">{statusConfig.QUOTED.label}</p>
          <p className="mt-2 text-2xl font-extrabold text-white">{statusStats.quoted}</p>
        </div>
        <div className="rounded-2xl border border-emerald-500/30 bg-emerald-500/5 p-4">
          <p className="text-xs font-semibold text-emerald-400 uppercase">{statusConfig.WON.label}</p>
          <p className="mt-2 text-2xl font-extrabold text-white">{statusStats.won}</p>
        </div>
        <div className="rounded-2xl border border-rose-500/30 bg-rose-500/5 p-4">
          <p className="text-xs font-semibold text-rose-400 uppercase">{statusConfig.LOST.label}</p>
          <p className="mt-2 text-2xl font-extrabold text-white">{statusStats.lost}</p>
        </div>
      </div>

      {/* Filters */}
      <div className="mb-6 flex flex-wrap gap-2">
        <button
          onClick={() => setFilterStatus("ALL")}
          className={`rounded-lg px-4 py-2 text-sm font-medium transition-colors ${
            filterStatus === "ALL"
              ? "bg-[#FDCD1A] text-[#0A0A0A]"
              : "border border-slate-700 text-slate-300 hover:bg-slate-800"
          }`}
        >
          Tous ({statusStats.total})
        </button>
        {(Object.keys(statusConfig) as QuoteStatus[]).map((status) => (
          <button
            key={status}
            onClick={() => setFilterStatus(status)}
            className={`rounded-lg px-4 py-2 text-sm font-medium transition-colors ${
              filterStatus === status
                ? `${statusConfig[status].bgColor} border ${statusConfig[status].color}`
                : "border border-slate-700 text-slate-300 hover:bg-slate-800"
            }`}
          >
            {statusConfig[status].label} ({quotes.filter(q => q.status === status).length})
          </button>
        ))}
      </div>

      {/* Quotes Table */}
      {filteredQuotes.length === 0 ? (
        <div className="rounded-2xl border border-slate-800 bg-slate-900/50 p-12 text-center">
          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-slate-800 text-slate-500 mb-4">
            <BoutiqueIcon className="w-8 h-8" />
          </div>
          <p className="text-slate-400">
            {filterStatus === "ALL"
              ? "Aucune demande de devis reçue"
              : `Aucune demande avec le statut "${statusConfig[filterStatus as QuoteStatus].label}"`}
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {filteredQuotes.map((quote) => (
            <div
              key={quote.id}
              className="rounded-2xl border border-slate-800 bg-slate-900/50 p-6 hover:border-slate-700 transition-colors"
            >
              <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-4">
                {/* Left: Quote Info */}
                <div className="flex-1 space-y-3">
                  <div className="flex items-center gap-3 flex-wrap">
                    <h3 className="text-lg font-bold text-white">{quote.fullName}</h3>
                    <span className={`rounded-full border px-3 py-1 text-xs font-bold ${statusConfig[quote.status].bgColor} ${statusConfig[quote.status].color}`}>
                      {isRtl ? statusConfig[quote.status].labelAr : statusConfig[quote.status].label}
                    </span>
                  </div>

                  {quote.company && (
                    <p className="text-sm text-slate-400">
                      <span className="font-semibold">Entreprise:</span> {quote.company}
                    </p>
                  )}

                  <div className="flex flex-wrap gap-4 text-sm text-slate-400">
                    <span>📧 {quote.email}</span>
                    <span>📱 {quote.phone}</span>
                    {quote.categoryName && <span>📦 {quote.categoryName}</span>}
                  </div>

                  <div className="rounded-lg bg-slate-950/60 border border-slate-800 p-3">
                    <p className="text-xs font-semibold text-slate-500 uppercase mb-1">Message:</p>
                    <p className="text-sm text-slate-300">{quote.message}</p>
                  </div>

                  <p className="text-xs text-slate-500">
                    Reçu le {new Date(quote.submittedAt).toLocaleDateString("fr-FR", {
                      day: "2-digit",
                      month: "long",
                      year: "numeric",
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </p>
                </div>

                {/* Right: Actions */}
                <div className="flex flex-col gap-2 lg:w-48">
                  <p className="text-xs font-semibold text-slate-400 uppercase mb-1">Changer statut:</p>
                  {(Object.keys(statusConfig) as QuoteStatus[])
                    .filter(s => s !== quote.status)
                    .map((status) => (
                      <button
                        key={status}
                        onClick={() => handleUpdateStatus(quote.id, status)}
                        disabled={updating}
                        className={`rounded-lg px-3 py-2 text-xs font-medium transition-colors border ${statusConfig[status].bgColor} ${statusConfig[status].color} hover:opacity-80 disabled:opacity-50`}
                      >
                        → {statusConfig[status].label}
                      </button>
                    ))}

                  <div className="mt-2 pt-2 border-t border-slate-800 space-y-2">
                    <a
                      href={`https://wa.me/${quote.phone.replace(/\D/g, '')}?text=${encodeURIComponent(`Bonjour ${quote.fullName}, suite à votre demande de devis EPI/EPC...`)}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="block rounded-lg bg-emerald-500 px-3 py-2 text-center text-xs font-bold text-white hover:bg-emerald-600 transition-colors"
                    >
                      WhatsApp
                    </a>
                    <a
                      href={`mailto:${quote.email}?subject=${encodeURIComponent("Demande de devis EPI/EPC - HSE BRIDGE")}`}
                      className="block rounded-lg border border-slate-700 px-3 py-2 text-center text-xs font-medium text-slate-300 hover:bg-slate-800 transition-colors"
                    >
                      Email
                    </a>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
