"use client";

import Link from "next/link";
import Image from "next/image";
import { useI18n } from "@/lib/i18n/I18nContext";
import { PublicHeader } from "@/components/public/PublicHeader";
import { PublicFooter } from "@/components/public/PublicFooter";
import { WhatsAppButton } from "@/components/public/WhatsAppButton";
import { FormationIcon, BoutiqueIcon, RecrutementIcon, SafetyShieldIcon } from "@/components/icons/HseIcons";

export default function HomePage() {
  const { t, isRtl } = useI18n();

  return (
    <div className="min-h-screen bg-[#FFFFFF] text-[#0A0A0A] flex flex-col justify-between">
      <PublicHeader />

      <main className="flex-1">
        {/* Hero Section with Cover Banner */}
        <section className="relative overflow-hidden bg-[#073022] text-white py-16 md:py-24 px-6">
          <div className="absolute inset-0 z-0 opacity-20">
            <Image
              src="/brand/cover-banner.jpg"
              alt="HSE BRIDGE Background"
              fill
              className="object-cover object-center"
              priority
            />
          </div>
          <div className="absolute inset-0 z-0 bg-gradient-to-r from-[#073022] via-[#073022]/90 to-transparent" />

          <div className="relative z-10 mx-auto grid max-w-7xl gap-8 lg:grid-cols-12 lg:items-center">
            <div className="lg:col-span-7">
              <div className="inline-flex items-center gap-2 rounded-full border border-[#FDCD1A]/40 bg-[#FDCD1A]/10 px-4 py-1.5 text-xs font-bold uppercase tracking-wider text-[#FDCD1A]">
                <SafetyShieldIcon className="w-4 h-4 text-[#FDCD1A]" />
                {t.common.brandName} • Health • Safety • Environment
              </div>

              <h1 className="mt-6 text-4xl font-extrabold tracking-tight md:text-5xl lg:text-6xl text-white uppercase leading-tight">
                {t.home.heroTitle}
              </h1>

              <p className="mt-6 text-lg text-slate-200 max-w-2xl font-normal leading-relaxed">
                {t.home.heroSubtitle}
              </p>

              <div className="mt-8 flex flex-wrap items-center gap-4">
                <Link
                  href="/formations"
                  className="rounded-full bg-[#FDCD1A] px-7 py-3.5 text-base font-bold text-[#0A0A0A] shadow-lg hover:bg-[#e5b917] transition-all transform hover:-translate-y-0.5"
                >
                  {t.home.heroCtaPrimary}
                </Link>
                <Link
                  href="/boutique"
                  className="rounded-full border-2 border-white px-7 py-3.5 text-base font-bold text-white hover:bg-white hover:text-[#073022] transition-all"
                >
                  {t.home.heroCtaSecondary}
                </Link>
                <WhatsAppButton
                  text="Contact Rapide WhatsApp"
                  message="Bonjour HSE BRIDGE, je souhaite des informations sur vos services."
                />
              </div>
            </div>

            <div className="lg:col-span-5">
              <div className="rounded-3xl border-2 border-[#FDCD1A]/30 bg-[#041a14]/80 p-6 sm:p-8 backdrop-blur-md shadow-2xl">
                <h3 className="text-xl font-bold text-[#FDCD1A] uppercase tracking-wide">
                  Nos 3 Piliers d'Excellence
                </h3>
                <p className="mt-1 text-xs text-slate-300">
                  Une réponse globale et certifiée à tous vos besoins HSE
                </p>

                <div className="mt-6 space-y-4">
                  <Link
                    href="/formations"
                    className="flex items-start gap-4 rounded-2xl bg-white/5 p-4 border border-white/10 hover:border-[#FDCD1A] transition-colors group block"
                  >
                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-[#FDCD1A] text-[#0A0A0A] group-hover:scale-105 transition-transform">
                      <FormationIcon className="w-6 h-6" />
                    </div>
                    <div>
                      <h4 className="font-bold text-white group-hover:text-[#FDCD1A] transition-colors">
                        {t.pillars.formation.title}
                      </h4>
                      <p className="mt-1 text-xs text-slate-300">{t.pillars.formation.subtitle}</p>
                    </div>
                  </Link>

                  <Link
                    href="/boutique"
                    className="flex items-start gap-4 rounded-2xl bg-white/5 p-4 border border-white/10 hover:border-[#FDCD1A] transition-colors group block"
                  >
                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-[#FDCD1A] text-[#0A0A0A] group-hover:scale-105 transition-transform">
                      <BoutiqueIcon className="w-6 h-6" />
                    </div>
                    <div>
                      <h4 className="font-bold text-white group-hover:text-[#FDCD1A] transition-colors">
                        {t.pillars.boutique.title}
                      </h4>
                      <p className="mt-1 text-xs text-slate-300">{t.pillars.boutique.subtitle}</p>
                    </div>
                  </Link>

                  <Link
                    href="/recrutement"
                    className="flex items-start gap-4 rounded-2xl bg-white/5 p-4 border border-white/10 hover:border-[#FDCD1A] transition-colors group block"
                  >
                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-[#FDCD1A] text-[#0A0A0A] group-hover:scale-105 transition-transform">
                      <RecrutementIcon className="w-6 h-6" />
                    </div>
                    <div>
                      <h4 className="font-bold text-white group-hover:text-[#FDCD1A] transition-colors">
                        {t.pillars.recrutement.title}
                      </h4>
                      <p className="mt-1 text-xs text-slate-300">{t.pillars.recrutement.subtitle}</p>
                    </div>
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Stats Section */}
        <section className="border-y border-slate-200 bg-slate-50 py-10 px-6">
          <div className="mx-auto max-w-7xl">
            <div className="grid grid-cols-2 gap-6 md:grid-cols-4">
              <div className="text-center">
                <div className="text-4xl font-extrabold text-[#073022]">{t.home.stats.formationsCount}</div>
                <div className="mt-1 text-sm font-medium text-slate-600">{t.home.stats.formationsLabel}</div>
              </div>
              <div className="text-center">
                <div className="text-4xl font-extrabold text-[#073022]">{t.home.stats.productsCount}</div>
                <div className="mt-1 text-sm font-medium text-slate-600">{t.home.stats.productsLabel}</div>
              </div>
              <div className="text-center">
                <div className="text-4xl font-extrabold text-[#073022]">{t.home.stats.candidatesCount}</div>
                <div className="mt-1 text-sm font-medium text-slate-600">{t.home.stats.candidatesLabel}</div>
              </div>
              <div className="text-center">
                <div className="text-4xl font-extrabold text-[#073022]">{t.home.stats.satisfactionRate}</div>
                <div className="mt-1 text-sm font-medium text-slate-600">{t.home.stats.satisfactionLabel}</div>
              </div>
            </div>
          </div>
        </section>

        {/* 3 Pillars Showcase Section */}
        <section className="py-20 px-6 max-w-7xl mx-auto">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <span className="inline-flex rounded-full bg-[#073022]/10 px-4 py-1 text-xs font-bold uppercase tracking-wider text-[#073022]">
              Nos 3 Métiers
            </span>
            <h2 className="mt-4 text-3xl font-extrabold text-[#0A0A0A] sm:text-4xl uppercase">
              3 Pôles d'Expertise Dédiés à Votre Sécurité
            </h2>
            <p className="mt-4 text-base text-slate-600">
              HSE BRIDGE rassemble la formation certifiante, l'équipement professionnel et le recrutement de spécialistes sur une plateforme unique.
            </p>
          </div>

          <div className="grid gap-8 md:grid-cols-3">
            {/* Pillar 1: Formation */}
            <div className="flex flex-col justify-between rounded-3xl border border-slate-200 bg-white p-8 shadow-md hover:shadow-xl transition-all duration-300 border-t-4 border-t-[#073022]">
              <div>
                <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-[#073022] text-[#FDCD1A]">
                  <FormationIcon className="w-8 h-8" />
                </div>
                <span className="mt-4 inline-block rounded-full bg-[#FDCD1A]/20 px-3 py-1 text-xs font-bold text-[#073022]">
                  {t.pillars.formation.badge}
                </span>
                <h3 className="mt-3 text-2xl font-bold text-[#0A0A0A]">{t.pillars.formation.title}</h3>
                <p className="mt-3 text-sm text-slate-600 leading-relaxed">
                  {t.pillars.formation.description}
                </p>

                <div className="mt-6 border-t border-slate-100 pt-6">
                  <p className="text-xs font-bold uppercase text-slate-400">{t.pillars.formation.benefitsTitle}</p>
                  <ul className="mt-3 space-y-2">
                    {t.pillars.formation.benefits.map((benefit: string, idx: number) => (
                      <li key={idx} className="flex items-center gap-2 text-xs text-slate-700">
                        <span className="h-1.5 w-1.5 rounded-full bg-[#073022]" />
                        {benefit}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              <Link
                href="/formations"
                className="mt-8 block rounded-full bg-[#073022] px-6 py-3 text-center text-sm font-bold text-white hover:bg-[#0a4030] transition-colors"
              >
                {t.pillars.formation.cta}
              </Link>
            </div>

            {/* Pillar 2: Boutique */}
            <div className="flex flex-col justify-between rounded-3xl border border-slate-200 bg-white p-8 shadow-md hover:shadow-xl transition-all duration-300 border-t-4 border-t-[#FDCD1A]">
              <div>
                <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-[#FDCD1A] text-[#0A0A0A]">
                  <BoutiqueIcon className="w-8 h-8" />
                </div>
                <span className="mt-4 inline-block rounded-full bg-[#073022]/10 px-3 py-1 text-xs font-bold text-[#073022]">
                  {t.pillars.boutique.badge}
                </span>
                <h3 className="mt-3 text-2xl font-bold text-[#0A0A0A]">{t.pillars.boutique.title}</h3>
                <p className="mt-3 text-sm text-slate-600 leading-relaxed">
                  {t.pillars.boutique.description}
                </p>

                <div className="mt-6 border-t border-slate-100 pt-6">
                  <p className="text-xs font-bold uppercase text-slate-400">{t.pillars.boutique.benefitsTitle}</p>
                  <ul className="mt-3 space-y-2">
                    {t.pillars.boutique.benefits.map((benefit: string, idx: number) => (
                      <li key={idx} className="flex items-center gap-2 text-xs text-slate-700">
                        <span className="h-1.5 w-1.5 rounded-full bg-[#FDCD1A]" />
                        {benefit}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              <Link
                href="/boutique"
                className="mt-8 block rounded-full bg-[#FDCD1A] px-6 py-3 text-center text-sm font-bold text-[#0A0A0A] hover:bg-[#e5b917] transition-colors"
              >
                {t.pillars.boutique.cta}
              </Link>
            </div>

            {/* Pillar 3: Recrutement */}
            <div className="flex flex-col justify-between rounded-3xl border border-slate-200 bg-white p-8 shadow-md hover:shadow-xl transition-all duration-300 border-t-4 border-t-[#073022]">
              <div>
                <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-[#073022] text-[#FDCD1A]">
                  <RecrutementIcon className="w-8 h-8" />
                </div>
                <span className="mt-4 inline-block rounded-full bg-[#FDCD1A]/20 px-3 py-1 text-xs font-bold text-[#073022]">
                  {t.pillars.recrutement.badge}
                </span>
                <h3 className="mt-3 text-2xl font-bold text-[#0A0A0A]">{t.pillars.recrutement.title}</h3>
                <p className="mt-3 text-sm text-slate-600 leading-relaxed">
                  {t.pillars.recrutement.description}
                </p>

                <div className="mt-6 border-t border-slate-100 pt-6">
                  <p className="text-xs font-bold uppercase text-slate-400">{t.pillars.recrutement.benefitsTitle}</p>
                  <ul className="mt-3 space-y-2">
                    {t.pillars.recrutement.benefits.map((benefit: string, idx: number) => (
                      <li key={idx} className="flex items-center gap-2 text-xs text-slate-700">
                        <span className="h-1.5 w-1.5 rounded-full bg-[#073022]" />
                        {benefit}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              <Link
                href="/recrutement"
                className="mt-8 block rounded-full bg-[#073022] px-6 py-3 text-center text-sm font-bold text-white hover:bg-[#0a4030] transition-colors"
              >
                {t.pillars.recrutement.cta}
              </Link>
            </div>
          </div>
        </section>

        {/* Contact CTA Section */}
        <section className="bg-[#073022] py-16 px-6 text-white text-center">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-3xl font-extrabold uppercase tracking-tight sm:text-4xl text-[#FDCD1A]">
              {t.home.contactCtaTitle}
            </h2>
            <p className="mt-4 text-base text-slate-200 max-w-2xl mx-auto">
              {t.home.contactCtaSubtitle}
            </p>
            <div className="mt-8 flex flex-wrap justify-center gap-4">
              <Link
                href="/contact"
                className="rounded-full bg-[#FDCD1A] px-8 py-3.5 text-base font-bold text-[#0A0A0A] shadow-lg hover:bg-[#e5b917] transition-all transform hover:-translate-y-0.5"
              >
                {t.home.contactCtaButton}
              </Link>
              <WhatsAppButton message="Bonjour HSE BRIDGE, je souhaite un devis ou des renseignements." />
            </div>
          </div>
        </section>
      </main>

      <WhatsAppButton variant="floating" message="Bonjour HSE BRIDGE, je souhaite des renseignements." />
      <PublicFooter />
    </div>
  );
}
