"use client";

import { useState } from "react";
import Image from "next/image";
import { useI18n } from "@/lib/i18n/I18nContext";
import { PublicHeader } from "@/components/public/PublicHeader";
import { PublicFooter } from "@/components/public/PublicFooter";
import { WhatsAppButton } from "@/components/public/WhatsAppButton";
import { SafetyShieldIcon } from "@/components/icons/HseIcons";

export default function ContactPage() {
  const { t, isRtl } = useI18n();
  const [form, setForm] = useState({
    fullName: "",
    email: "",
    phone: "",
    company: "",
    subject: "Formation HSE",
    message: "",
  });
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
  };

  return (
    <div className="min-h-screen bg-[#FFFFFF] text-[#0A0A0A] flex flex-col justify-between">
      <PublicHeader />

      <main className="flex-1">
        {/* Hero Section */}
        <section className="relative overflow-hidden bg-[#073022] text-white py-16 px-6">
          <div className="absolute inset-0 z-0 opacity-15">
            <Image
              src="/brand/cover-banner.jpg"
              alt="Contact HSE BRIDGE"
              fill
              className="object-cover"
              priority
            />
          </div>
          <div className="absolute inset-0 bg-gradient-to-t from-[#073022] via-[#073022]/90 to-[#073022]/60 z-0" />

          <div className="relative z-10 mx-auto max-w-7xl">
            <div className="inline-flex items-center gap-2 rounded-full border border-[#FDCD1A]/40 bg-[#FDCD1A]/10 px-4 py-1.5 text-xs font-bold uppercase tracking-wider text-[#FDCD1A]">
              <SafetyShieldIcon className="w-4 h-4 text-[#FDCD1A]" />
              {t.contact.title}
            </div>

            <h1 className="mt-4 text-3xl font-extrabold tracking-tight md:text-5xl uppercase text-white">
              Parlons de vos Projets HSE
            </h1>

            <p className="mt-3 text-lg font-bold text-[#FDCD1A] max-w-3xl uppercase">
              {t.contact.subtitle}
            </p>

            <p className="mt-4 text-base text-slate-200 max-w-2xl leading-relaxed">
              Que ce soit pour former vos équipes, équiper vos chantiers ou recruter un expert HSE qualifié, nos conseillers sont à votre entière disposition.
            </p>
          </div>
        </section>

        {/* Content Section: Form + Contact Info */}
        <section className="py-16 px-6 max-w-7xl mx-auto">
          <div className="grid gap-12 lg:grid-cols-12">
            {/* Left: Contact Form (7 cols) */}
            <div className="lg:col-span-7 rounded-3xl border border-slate-200 bg-white p-8 sm:p-10 shadow-xl">
              <h2 className="text-2xl font-extrabold text-[#0A0A0A] uppercase mb-2">
                {t.contact.formTitle}
              </h2>
              <p className="text-xs text-slate-600 mb-6">
                Renseignez vos coordonnées ci-dessous pour être recontacté dans les plus brefs délais.
              </p>

              {submitted ? (
                <div className="rounded-2xl bg-emerald-50 border border-emerald-200 p-8 text-center text-emerald-900 animate-in fade-in">
                  <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-emerald-100 text-emerald-600 mb-3">
                    <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                  <h3 className="text-lg font-bold">Message envoyé avec succès !</h3>
                  <p className="mt-2 text-xs text-emerald-800">
                    {t.contact.successMessage}
                  </p>
                  <button
                    onClick={() => setSubmitted(false)}
                    className="mt-6 rounded-full bg-[#073022] px-6 py-2.5 text-xs font-bold text-white hover:bg-[#0a4030]"
                  >
                    Envoyer un nouveau message
                  </button>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="grid gap-4 sm:grid-cols-2">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                      {t.common.fullName} *
                    </label>
                    <input
                      type="text"
                      required
                      value={form.fullName}
                      onChange={(e) => setForm({ ...form, fullName: e.target.value })}
                      className="w-full rounded-xl border border-slate-300 p-3 text-sm focus:border-[#073022] focus:ring-1 focus:ring-[#073022] outline-none"
                      placeholder="Ex: Karim Idrissi"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                      {t.common.company}
                    </label>
                    <input
                      type="text"
                      value={form.company}
                      onChange={(e) => setForm({ ...form, company: e.target.value })}
                      className="w-full rounded-xl border border-slate-300 p-3 text-sm focus:border-[#073022] focus:ring-1 focus:ring-[#073022] outline-none"
                      placeholder="Ex: Entreprise SARL"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                      {t.common.phone} *
                    </label>
                    <input
                      type="tel"
                      required
                      value={form.phone}
                      onChange={(e) => setForm({ ...form, phone: e.target.value })}
                      className="w-full rounded-xl border border-slate-300 p-3 text-sm focus:border-[#073022] focus:ring-1 focus:ring-[#073022] outline-none"
                      placeholder="+212 6 XX XX XX XX"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                      {t.common.email} *
                    </label>
                    <input
                      type="email"
                      required
                      value={form.email}
                      onChange={(e) => setForm({ ...form, email: e.target.value })}
                      className="w-full rounded-xl border border-slate-300 p-3 text-sm focus:border-[#073022] focus:ring-1 focus:ring-[#073022] outline-none"
                      placeholder="karim@email.com"
                    />
                  </div>

                  <div className="sm:col-span-2">
                    <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                      Sujet de votre demande *
                    </label>
                    <select
                      value={form.subject}
                      onChange={(e) => setForm({ ...form, subject: e.target.value })}
                      className="w-full rounded-xl border border-slate-300 p-3 text-sm focus:border-[#073022] focus:ring-1 focus:ring-[#073022] outline-none bg-white"
                    >
                      <option value="Formation HSE">Formation & Certification HSE</option>
                      <option value="Devis EPI">Devis Équipements EPI & EPC</option>
                      <option value="Recrutement HSE">Recrutement & Mandat de recherche</option>
                      <option value="Partenariat">Partenariat & Sous-traitance</option>
                      <option value="Autre">Autre demande générale</option>
                    </select>
                  </div>

                  <div className="sm:col-span-2">
                    <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                      Votre Message *
                    </label>
                    <textarea
                      required
                      rows={4}
                      value={form.message}
                      onChange={(e) => setForm({ ...form, message: e.target.value })}
                      className="w-full rounded-xl border border-slate-300 p-3 text-sm focus:border-[#073022] focus:ring-1 focus:ring-[#073022] outline-none"
                      placeholder="Précisez votre demande, effectifs concernés, délais souhaités..."
                    />
                  </div>

                  <div className="sm:col-span-2 mt-2">
                    <button
                      type="submit"
                      className="w-full rounded-full bg-[#073022] py-3.5 text-sm font-bold text-white shadow-md hover:bg-[#0a4030] transition-all transform hover:-translate-y-0.5"
                    >
                      {t.common.send} le message
                    </button>
                  </div>
                </form>
              )}
            </div>

            {/* Right: Coordinates & Direct WhatsApp (5 cols) */}
            <div className="lg:col-span-5 flex flex-col justify-between gap-6">
              {/* Coordinates Box */}
              <div className="rounded-3xl border border-slate-200 bg-white p-8 shadow-md">
                <h3 className="text-lg font-bold text-[#0A0A0A] uppercase border-b border-slate-100 pb-3">
                  {t.contact.infoTitle}
                </h3>

                <div className="mt-6 space-y-4 text-xs text-slate-700">
                  <div className="flex items-start gap-3">
                    <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-[#073022] text-[#FDCD1A]">
                      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                      </svg>
                    </div>
                    <div>
                      <p className="font-bold text-slate-900">Téléphone Direct</p>
                      <p className="text-slate-600">{t.footer.phone}</p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3">
                    <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-[#073022] text-[#FDCD1A]">
                      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                      </svg>
                    </div>
                    <div>
                      <p className="font-bold text-slate-900">Courrier Électronique</p>
                      <p className="text-slate-600">{t.footer.email}</p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3">
                    <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-[#073022] text-[#FDCD1A]">
                      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                      </svg>
                    </div>
                    <div>
                      <p className="font-bold text-slate-900">Siège & Couverture</p>
                      <p className="text-slate-600">{t.footer.location}</p>
                      <p className="text-slate-400 text-[11px]">Interventions & livraisons sur tout le Royaume</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Direct WhatsApp Card */}
              <div className="rounded-3xl border border-[#25D366]/30 bg-emerald-50/50 p-8 shadow-md">
                <div className="flex items-center gap-3 mb-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[#25D366] text-white">
                    <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24">
                      <path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946.003-6.556 5.338-11.891 11.893-11.891 3.181.001 6.167 1.24 8.413 3.488 2.245 2.248 3.481 5.236 3.48 8.414-.003 6.557-5.338 11.892-11.893 11.892-1.99-.001-3.951-.5-5.688-1.448l-6.305 1.654zm6.597-3.807c1.676.995 3.276 1.591 5.392 1.592 5.448 0 9.886-4.434 9.889-9.885.002-5.462-4.415-9.89-9.881-9.892-5.452 0-9.887 4.434-9.889 9.884-.001 2.225.651 3.891 1.746 5.634l-.999 3.648 3.742-.981zm11.387-5.464c-.074-.124-.272-.198-.57-.347-.297-.149-1.758-.868-2.031-.967-.272-.099-.47-.149-.669.149-.198.297-.768.967-.941 1.165-.173.198-.347.223-.644.074-.297-.149-1.255-.462-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.297-.347.446-.521.151-.172.2-.296.3-.495.099-.198.05-.372-.025-.521-.075-.148-.669-1.611-.916-2.206-.242-.579-.487-.501-.669-.51l-.57-.01c-.198 0-.52.074-.792.372s-1.04 1.016-1.04 2.479 1.065 2.876 1.213 3.074c.149.198 2.095 3.2 5.076 4.487.709.306 1.263.489 1.694.626.712.226 1.36.194 1.872.118.571-.085 1.758-.719 2.006-1.413.248-.695.248-1.29.173-1.414z"/>
                    </svg>
                  </div>
                  <h4 className="text-sm font-bold text-slate-900 uppercase">
                    {t.contact.directWhatsAppText}
                  </h4>
                </div>
                <p className="text-xs text-slate-600 mb-4 leading-relaxed">
                  Besoin d'une réponse instantanée ou d'un devis urgent ? Échangez directement avec un responsable HSE BRIDGE.
                </p>
                <WhatsAppButton
                  className="w-full justify-center"
                  message="Bonjour HSE BRIDGE, je vous contacte depuis la page de contact."
                />
              </div>
            </div>
          </div>
        </section>
      </main>

      <WhatsAppButton variant="floating" message="Bonjour HSE BRIDGE, je souhaite vous contacter." />
      <PublicFooter />
    </div>
  );
}
