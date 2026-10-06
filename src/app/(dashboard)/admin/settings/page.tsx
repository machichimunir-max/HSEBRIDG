"use client";

import { useState } from "react";
import { useI18n } from "@/lib/i18n/I18nContext";
import { SettingsIcon } from "@/components/icons/HseIcons";
import { AlertCircleIcon, CheckCircleIcon, LoaderIcon } from "@/components/icons/HseIcons";

interface SiteSettings {
  id: string;
  siteName: string;
  contactEmail: string | null;
  contactPhone: string | null;
  whatsappNumber: string | null;
  address: string | null;
  instagramUrl: string | null;
  linkedinUrl: string | null;
  updatedAt: Date | string;
}

interface FormData {
  siteName: string;
  contactEmail: string;
  contactPhone: string;
  whatsappNumber: string;
  address: string;
  instagramUrl: string;
  linkedinUrl: string;
}

interface Toast {
  type: "success" | "error";
  message: string;
}

export default function AdminSettingsPage() {
  const { t, isRtl, locale } = useI18n();
  const [settings, setSettings] = useState<SiteSettings | null>(null);
  const [formData, setFormData] = useState<FormData>({
    siteName: "",
    contactEmail: "",
    contactPhone: "",
    whatsappNumber: "",
    address: "",
    instagramUrl: "",
    linkedinUrl: "",
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [toast, setToast] = useState<Toast | null>(null);

  async function fetchSettings() {
    try {
      const res = await fetch("/api/admin/settings");
      if (res.ok) {
        const data = await res.json();
        setSettings(data);
        setFormData({
          siteName: data.siteName || "",
          contactEmail: data.contactEmail || "",
          contactPhone: data.contactPhone || "",
          whatsappNumber: data.whatsappNumber || "",
          address: data.address || "",
          instagramUrl: data.instagramUrl || "",
          linkedinUrl: data.linkedinUrl || "",
        });
      }
    } catch (err) {
      console.error("Failed to fetch settings:", err);
    } finally {
      setLoading(false);
    }
  }

  async function handleSave(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    setToast(null);

    try {
      const res = await fetch("/api/admin/settings", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      if (res.ok) {
        const data = await res.json();
        setSettings(data);
        setToast({ type: "success", message: t.admin.settingsSaveSuccess });
      } else {
        const error = await res.json();
        throw new Error(error.message || t.admin.settingsSaveError);
      }
    } catch (err) {
      setToast({ type: "error", message: t.admin.settingsSaveError });
    } finally {
      setSaving(false);
    }
  }

  function handleChange(field: keyof FormData, value: string) {
    setFormData((prev) => ({ ...prev, [field]: value }));
  }

  function showInputError(value: string) {
    return value && !value.trim();
  }

  if (loading) {
    return (
      <div className="mx-auto max-w-7xl">
        <div className="flex items-center gap-3 mb-6">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#073022] text-[#FDCD1A]">
            <SettingsIcon className="w-6 h-6" />
          </div>
          <h1 className="text-3xl font-bold text-white">{t.admin.settingsPageTitle}</h1>
        </div>
        <div className="flex items-center justify-center h-64">
          <LoaderIcon className="w-8 h-8 text-[#FDCD1A] animate-spin" />
        </div>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-7xl">
      <div className="mb-6">
        <div className="flex items-center gap-3 mb-2">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#073022] text-[#FDCD1A]">
            <SettingsIcon className="w-6 h-6" />
          </div>
          <h1 className="text-3xl font-bold text-white">{t.admin.settingsPageTitle}</h1>
        </div>
        <p className="mt-1 text-sm text-slate-400">{t.admin.settingsPageDesc}</p>
      </div>

      {toast && (
        <div
          className={`mb-6 flex items-center gap-3 rounded-xl px-4 py-3 ${
            toast.type === "success"
              ? "bg-green-900/30 border border-green-700 text-green-300"
              : "bg-red-900/30 border border-red-700 text-red-300"
          } animate-slide-in`}
          role="alert"
        >
          {toast.type === "success" ? (
            <CheckCircleIcon className="w-5 h-5 flex-shrink-0" />
          ) : (
            <AlertCircleIcon className="w-5 h-5 flex-shrink-0" />
          )}
          <span>{toast.message}</span>
        </div>
      )}

      <form onSubmit={handleSave} className="space-y-6">
        {/* General Section */}
        <section className="rounded-2xl border border-slate-700 bg-slate-900/50 p-6">
          <h2 className="mb-4 text-lg font-semibold text-white flex items-center gap-2">
            <SettingsIcon className="w-5 h-5 text-[#FDCD1A]" />
            {t.admin.settingsGeneralSection}
          </h2>
          <div className="grid gap-4 md:grid-cols-2">
            <div>
              <label htmlFor="siteName" className="block mb-1 text-sm font-medium text-slate-300">
                {t.admin.settingsSiteName} <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                id="siteName"
                name="siteName"
                value={formData.siteName}
                onChange={(e) => handleChange("siteName", e.target.value)}
                className={`w-full rounded-xl border px-4 py-3 bg-slate-800 text-white placeholder-slate-500 focus:border-[#FDCD1A] focus:outline-none focus:ring-1 focus:ring-[#FDCD1A] transition-colors ${
                  showInputError(formData.siteName) ? "border-red-500" : "border-slate-600"
                }`}
                required
              />
            </div>
          </div>
        </section>

        {/* Contact Section */}
        <section className="rounded-2xl border border-slate-700 bg-slate-900/50 p-6">
          <h2 className="mb-4 text-lg font-semibold text-white flex items-center gap-2">
            <SettingsIcon className="w-5 h-5 text-[#FDCD1A]" />
            {t.admin.settingsContactSection}
          </h2>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            <div>
              <label htmlFor="contactEmail" className="block mb-1 text-sm font-medium text-slate-300">
                {t.admin.settingsContactEmail}
              </label>
              <input
                type="email"
                id="contactEmail"
                name="contactEmail"
                value={formData.contactEmail}
                onChange={(e) => handleChange("contactEmail", e.target.value)}
                className="w-full rounded-xl border border-slate-600 px-4 py-3 bg-slate-800 text-white placeholder-slate-500 focus:border-[#FDCD1A] focus:outline-none focus:ring-1 focus:ring-[#FDCD1A] transition-colors"
                placeholder="contact@hse-bridge.com"
              />
            </div>
            <div>
              <label htmlFor="contactPhone" className="block mb-1 text-sm font-medium text-slate-300">
                {t.admin.settingsContactPhone}
              </label>
              <input
                type="tel"
                id="contactPhone"
                name="contactPhone"
                value={formData.contactPhone}
                onChange={(e) => handleChange("contactPhone", e.target.value)}
                className="w-full rounded-xl border border-slate-600 px-4 py-3 bg-slate-800 text-white placeholder-slate-500 focus:border-[#FDCD1A] focus:outline-none focus:ring-1 focus:ring-[#FDCD1A] transition-colors"
                placeholder="+212 5 XX XX XX XX"
              />
            </div>
            <div>
              <label htmlFor="whatsappNumber" className="block mb-1 text-sm font-medium text-slate-300">
                {t.admin.settingsWhatsappNumber}
              </label>
              <input
                type="tel"
                id="whatsappNumber"
                name="whatsappNumber"
                value={formData.whatsappNumber}
                onChange={(e) => handleChange("whatsappNumber", e.target.value)}
                className="w-full rounded-xl border border-slate-600 px-4 py-3 bg-slate-800 text-white placeholder-slate-500 focus:border-[#FDCD1A] focus:outline-none focus:ring-1 focus:ring-[#FDCD1A] transition-colors"
                placeholder="+212 6 XX XX XX XX"
              />
            </div>
            <div className="md:col-span-2 lg:col-span-3">
              <label htmlFor="address" className="block mb-1 text-sm font-medium text-slate-300">
                {t.admin.settingsAddress}
              </label>
              <textarea
                id="address"
                name="address"
                value={formData.address}
                onChange={(e) => handleChange("address", e.target.value)}
                rows={3}
                className="w-full rounded-xl border border-slate-600 px-4 py-3 bg-slate-800 text-white placeholder-slate-500 focus:border-[#FDCD1A] focus:outline-none focus:ring-1 focus:ring-[#FDCD1A] transition-colors resize-none"
                placeholder="123 Rue de l'Industrie, Casablanca, Maroc"
              />
            </div>
          </div>
        </section>

        {/* Social Section */}
        <section className="rounded-2xl border border-slate-700 bg-slate-900/50 p-6">
          <h2 className="mb-4 text-lg font-semibold text-white flex items-center gap-2">
            <SettingsIcon className="w-5 h-5 text-[#FDCD1A]" />
            {t.admin.settingsSocialSection}
          </h2>
          <div className="grid gap-4 md:grid-cols-2">
            <div>
              <label htmlFor="instagramUrl" className="block mb-1 text-sm font-medium text-slate-300">
                {t.admin.settingsInstagramUrl}
              </label>
              <input
                type="url"
                id="instagramUrl"
                name="instagramUrl"
                value={formData.instagramUrl}
                onChange={(e) => handleChange("instagramUrl", e.target.value)}
                className="w-full rounded-xl border border-slate-600 px-4 py-3 bg-slate-800 text-white placeholder-slate-500 focus:border-[#FDCD1A] focus:outline-none focus:ring-1 focus:ring-[#FDCD1A] transition-colors"
                placeholder="https://instagram.com/hsebridge"
              />
            </div>
            <div>
              <label htmlFor="linkedinUrl" className="block mb-1 text-sm font-medium text-slate-300">
                {t.admin.settingsLinkedinUrl}
              </label>
              <input
                type="url"
                id="linkedinUrl"
                name="linkedinUrl"
                value={formData.linkedinUrl}
                onChange={(e) => handleChange("linkedinUrl", e.target.value)}
                className="w-full rounded-xl border border-slate-600 px-4 py-3 bg-slate-800 text-white placeholder-slate-500 focus:border-[#FDCD1A] focus:outline-none focus:ring-1 focus:ring-[#FDCD1A] transition-colors"
                placeholder="https://linkedin.com/company/hsebridge"
              />
            </div>
          </div>
        </section>

        {/* Save Button */}
        <div className="flex justify-end">
          <button
            type="submit"
            disabled={saving}
            className="flex items-center gap-2 rounded-xl bg-[#073022] px-6 py-3 text-white font-medium hover:bg-[#094530] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {saving ? (
              <>
                <LoaderIcon className="w-5 h-5 animate-spin" />
                <span>{t.admin.saving}</span>
              </>
            ) : (
              <>
                <CheckCircleIcon className="w-5 h-5" />
                <span>{t.common.save}</span>
              </>
            )}
          </button>
        </div>
      </form>

      {/* Last Updated */}
      {settings && (
        <div className="mt-6 text-sm text-slate-500 text-center">
          <p>
            {t.admin.lastUpdated}:{' '}
            {new Date(settings.updatedAt).toLocaleDateString(locale === "ar" ? "ar-MA" : "fr-FR", {
              year: "numeric",
              month: "long",
              day: "numeric",
              hour: "2-digit",
              minute: "2-digit",
            })}
          </p>
        </div>
      )}

      <style jsx>{`
        @keyframes slide-in {
          from {
            opacity: 0;
            transform: translateY(-10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        .animate-slide-in {
          animation: slide-in 0.3s ease-out;
        }
      `}</style>
    </div>
  );
}