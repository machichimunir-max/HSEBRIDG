"use client";

import Link from "next/link";
import Image from "next/image";
import { useI18n } from "@/lib/i18n/I18nContext";
import { PublicHeader } from "@/components/public/PublicHeader";
import { PublicFooter } from "@/components/public/PublicFooter";
import { WhatsAppButton } from "@/components/public/WhatsAppButton";
import { FormationIcon, SafetyShieldIcon } from "@/components/icons/HseIcons";

export default function FormationsPage() {
  const { t, isRtl } = useI18n();

  return (
    <div className="min-h-screen bg-[#FFFFFF] text-[#0A0A0A] flex flex-col justify-between">
      <PublicHeader />

      <main className="flex-1">
        {/* Hero Section */}
        <section className="relative overflow-hidden bg-[#073022] text-white py-16 px-6">
          <div className="absolute inset-0 z-0 opacity-15">
            <Image
              src="/brand/cover-banner.jpg"
              alt="HSE Formations"
              fill
              className="object-cover"
              priority
            />
          </div>
          <div className="absolute inset-0 bg-gradient-to-t from-[#073022] via-[#073022]/90 to-[#073022]/60 z-0" />

          <div className="relative z-10 mx-auto max-w-7xl">
            <div className="inline-flex items-center gap-2 rounded-full border border-[#FDCD1A]/40 bg-[#FDCD1A]/10 px-4 py-1.5 text-xs font-bold uppercase tracking-wider text-[#FDCD1A]">
              <FormationIcon className="w-4 h-4 text-[#FDCD1A]" />
              {t.pillars.formation.badge}
            </div>

            <h1 className="mt-4 text-3xl font-extrabold tracking-tight md:text-5xl uppercase text-white">
              {t.pillars.formation.title}
            </h1>

            <p className="mt-3 text-lg font-bold text-[#FDCD1A] max-w-3xl uppercase">
              {t.pillars.formation.subtitle}
            </p>

            <p className="mt-4 text-base text-slate-200 max-w-2xl leading-relaxed">
              {t.pillars.formation.description}
            </p>

            <div className="mt-8 flex flex-wrap items-center gap-4">
              <a
                href="#catalog"
                className="rounded-full bg-[#FDCD1A] px-7 py-3.5 text-sm font-bold text-[#0A0A0A] shadow-md hover:bg-[#e5b917] transition-all transform hover:-translate-y-0.5"
              >
                {t.pillars.formation.cta}
              </a>
              <WhatsAppButton
                text="Demander un programme sur-mesure"
                message="Bonjour HSE BRIDGE, je souhaite un devis ou programme sur-mesure pour une formation HSE."
              />
            </div>
          </div>
        </section>

        {/* Benefits Strip */}
        <section className="border-b border-slate-200 bg-slate-50 py-8 px-6">
          <div className="mx-auto max-w-7xl">
            <h3 className="text-center text-xs font-extrabold uppercase tracking-widest text-[#073022] mb-6">
              {t.pillars.formation.benefitsTitle}
            </h3>
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
              {t.pillars.formation.benefits.map((benefit: string, idx: number) => (
                <div
                  key={idx}
                  className="flex items-center gap-3 rounded-2xl border border-slate-200 bg-white p-4 shadow-xs"
                >
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-[#073022] text-[#FDCD1A] font-bold text-sm">
                    0{idx + 1}
                  </div>
                  <p className="text-xs font-bold text-slate-800 leading-snug">{benefit}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* 8 Official HSE Trainings Catalog */}
        <section id="catalog" className="py-16 px-6 max-w-7xl mx-auto">
          <div className="text-center max-w-3xl mx-auto mb-12">
            <span className="rounded-full bg-[#073022]/10 px-4 py-1 text-xs font-bold uppercase tracking-wider text-[#073022]">
              Catalogue Officiel
            </span>
            <h2 className="mt-3 text-3xl font-extrabold text-[#0A0A0A] uppercase sm:text-4xl">
              {t.pillars.formation.trainingsListTitle}
            </h2>
            <p className="mt-3 text-sm text-slate-600">
              Chaque formation est dispensée par des experts confirmés et donne droit à une attestation nominative officielle après validation des acquis.
            </p>
          </div>

          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
            {t.pillars.formation.trainings.map((training: any, idx: number) => (
              <div
                key={idx}
                className="flex flex-col justify-between rounded-3xl border border-slate-200 bg-white p-6 shadow-md hover:shadow-xl transition-all duration-300 hover:border-[#073022] group"
              >
                <div>
                  <div className="flex items-center justify-between gap-2 mb-3">
                    <span className="text-xs font-extrabold text-[#073022] bg-[#FDCD1A]/20 px-2.5 py-1 rounded-full">
                      {training.code}
                    </span>
                    <span className="text-xs font-semibold text-slate-500 bg-slate-100 px-2.5 py-0.5 rounded-full">
                      {training.duration}
                    </span>
                  </div>

                  <h3 className="text-lg font-bold text-[#0A0A0A] group-hover:text-[#073022] transition-colors">
                    {training.title}
                  </h3>

                  <p className="mt-2.5 text-xs text-slate-600 leading-relaxed">
                    {training.description}
                  </p>

                  <div className="mt-4 pt-4 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
                    <span className="inline-flex items-center gap-1 text-[#073022] font-semibold">
                      <SafetyShieldIcon className="w-3.5 h-3.5 text-[#073022]" />
                      {t.common.theoryPractice}
                    </span>
                    <span className="font-bold text-slate-700">{training.badge}</span>
                  </div>
                </div>

                <div className="mt-6 pt-4 border-t border-slate-100 flex flex-col gap-2">
                  <Link
                    href="/login"
                    className="w-full rounded-full bg-[#073022] py-2.5 text-center text-xs font-bold text-white hover:bg-[#0a4030] transition-colors"
                  >
                    S'inscrire à cette session
                  </Link>
                  <a
                    href={`https://wa.me/212600000000?text=${encodeURIComponent(`Bonjour HSE BRIDGE, je souhaite des détails sur la formation ${training.title} (${training.code}).`)}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-full rounded-full border border-slate-300 py-2 text-center text-xs font-bold text-slate-700 hover:border-[#FDCD1A] hover:bg-[#FDCD1A]/10 transition-colors"
                  >
                    Demander le syllabus
                  </a>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Training Methodology & Attestation Banner */}
        <section className="bg-[#073022] py-16 px-6 text-white">
          <div className="mx-auto max-w-7xl grid gap-10 lg:grid-cols-2 lg:items-center">
            <div>
              <span className="rounded-full bg-[#FDCD1A]/20 px-3.5 py-1 text-xs font-bold uppercase tracking-wider text-[#FDCD1A]">
                Méthode Pédagogique
              </span>
              <h2 className="mt-4 text-3xl font-extrabold uppercase sm:text-4xl text-white">
                Allier théorie et pratique sur le terrain
              </h2>
              <p className="mt-4 text-sm text-slate-200 leading-relaxed">
                Nos cursus s'appuient sur des études de cas réels de chantiers et d'usines, des ateliers pratiques de manipulation (extincteurs, harnais, appareils respiratoires) et des simulations de situations d'urgence.
              </p>

              <div className="mt-6 space-y-3">
                <div className="flex items-center gap-3">
                  <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-[#FDCD1A] text-[#0A0A0A] font-bold text-xs">✓</span>
                  <p className="text-xs text-slate-200">Attestation officielle numérotée et vérifiable en ligne</p>
                </div>
                <div className="flex items-center gap-3">
                  <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-[#FDCD1A] text-[#0A0A0A] font-bold text-xs">✓</span>
                  <p className="text-xs text-slate-200">Formations dispensées en présentiel (en entreprise ou centre) et en ligne</p>
                </div>
                <div className="flex items-center gap-3">
                  <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-[#FDCD1A] text-[#0A0A0A] font-bold text-xs">✓</span>
                  <p className="text-xs text-slate-200">Support de cours complet et fiches réflexes opérationnelles</p>
                </div>
              </div>
            </div>

            <div className="rounded-3xl border border-[#FDCD1A]/30 bg-[#041a14]/80 p-8 backdrop-blur-md shadow-2xl text-center">
              <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-[#FDCD1A] text-[#0A0A0A] mb-4">
                <SafetyShieldIcon className="w-8 h-8" />
              </div>
              <h3 className="text-xl font-extrabold text-white uppercase">
                Besoin d'une formation sur mesure pour vos équipes ?
              </h3>
              <p className="mt-3 text-xs text-slate-300 leading-relaxed">
                Nous concevons des programmes intra-entreprises personnalisés selon vos risques spécifiques, vos plannings et vos sites opérationnels.
              </p>
              <div className="mt-6 flex flex-col sm:flex-row justify-center gap-3">
                <Link
                  href="/contact"
                  className="rounded-full bg-[#FDCD1A] px-6 py-3 text-xs font-bold text-[#0A0A0A] shadow-md hover:bg-[#e5b917] transition-all"
                >
                  Demander un devis groupe
                </Link>
                <WhatsAppButton
                  text="Conseiller formation WhatsApp"
                  message="Bonjour HSE BRIDGE, nous souhaitons organiser une formation pour notre personnel."
                />
              </div>
            </div>
          </div>
        </section>
      </main>

      <WhatsAppButton variant="floating" message="Bonjour HSE BRIDGE, je souhaite des informations sur vos formations." />
      <PublicFooter />
    </div>
  );
}
