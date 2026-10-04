"use client";

import Link from "next/link";
import Image from "next/image";
import { useI18n } from "@/lib/i18n/I18nContext";
import { PublicHeader } from "@/components/public/PublicHeader";
import { PublicFooter } from "@/components/public/PublicFooter";
import { WhatsAppButton } from "@/components/public/WhatsAppButton";
import { FormationIcon, BoutiqueIcon, RecrutementIcon, SafetyShieldIcon } from "@/components/icons/HseIcons";

export default function AboutPage() {
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
              alt="À propos HSE BRIDGE"
              fill
              className="object-cover"
              priority
            />
          </div>
          <div className="absolute inset-0 bg-gradient-to-t from-[#073022] via-[#073022]/90 to-[#073022]/60 z-0" />

          <div className="relative z-10 mx-auto max-w-7xl">
            <div className="inline-flex items-center gap-2 rounded-full border border-[#FDCD1A]/40 bg-[#FDCD1A]/10 px-4 py-1.5 text-xs font-bold uppercase tracking-wider text-[#FDCD1A]">
              <SafetyShieldIcon className="w-4 h-4 text-[#FDCD1A]" />
              {t.about.title}
            </div>

            <h1 className="mt-4 text-3xl font-extrabold tracking-tight md:text-5xl uppercase text-white">
              L'Excellence en Santé, Sécurité & Environnement
            </h1>

            <p className="mt-3 text-lg font-bold text-[#FDCD1A] max-w-3xl uppercase">
              {t.about.subtitle}
            </p>

            <p className="mt-4 text-base text-slate-200 max-w-2xl leading-relaxed">
              {t.about.storyText1}
            </p>
          </div>
        </section>

        {/* Mission & Vision Section */}
        <section className="py-16 px-6 max-w-7xl mx-auto">
          <div className="grid gap-8 md:grid-cols-2">
            <div className="rounded-3xl border border-slate-200 bg-white p-8 shadow-md hover:border-[#073022] transition-colors">
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[#073022] text-[#FDCD1A] mb-4">
                <span className="text-xl font-bold">🎯</span>
              </div>
              <h2 className="text-2xl font-extrabold text-[#0A0A0A] uppercase">
                {t.about.missionTitle}
              </h2>
              <p className="mt-3 text-sm text-slate-600 leading-relaxed">
                {t.about.missionText}
              </p>
            </div>

            <div className="rounded-3xl border border-slate-200 bg-white p-8 shadow-md hover:border-[#073022] transition-colors">
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[#073022] text-[#FDCD1A] mb-4">
                <span className="text-xl font-bold">👁️</span>
              </div>
              <h2 className="text-2xl font-extrabold text-[#0A0A0A] uppercase">
                {t.about.visionTitle}
              </h2>
              <p className="mt-3 text-sm text-slate-600 leading-relaxed">
                {t.about.visionText}
              </p>
            </div>
          </div>
        </section>

        {/* Core Values Section */}
        <section className="bg-slate-50 border-t border-b border-slate-200 py-16 px-6">
          <div className="mx-auto max-w-7xl">
            <div className="text-center max-w-3xl mx-auto mb-12">
              <span className="rounded-full bg-[#073022]/10 px-4 py-1 text-xs font-bold uppercase tracking-wider text-[#073022]">
                Nos Piliers Éthiques
              </span>
              <h2 className="mt-3 text-3xl font-extrabold text-[#0A0A0A] uppercase sm:text-4xl">
                {t.about.valuesTitle}
              </h2>
            </div>

            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
              {t.about.values.map((val: any, idx: number) => (
                <div
                  key={idx}
                  className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm hover:shadow-md transition-all"
                >
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#FDCD1A] text-[#0A0A0A] font-extrabold text-sm mb-4">
                    0{idx + 1}
                  </div>
                  <h3 className="text-base font-bold text-[#0A0A0A] uppercase">
                    {val.title}
                  </h3>
                  <p className="mt-2 text-xs text-slate-600 leading-relaxed">
                    {val.description}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* 3 Pillars Synergy Section */}
        <section className="py-16 px-6 max-w-7xl mx-auto">
          <div className="text-center max-w-3xl mx-auto mb-12">
            <span className="rounded-full bg-[#FDCD1A]/30 px-4 py-1 text-xs font-bold uppercase tracking-wider text-[#073022]">
              L'Approche 360°
            </span>
            <h2 className="mt-3 text-3xl font-extrabold text-[#0A0A0A] uppercase sm:text-4xl">
              La Synergie des 3 Métiers HSE BRIDGE
            </h2>
            <p className="mt-3 text-sm text-slate-600">
              Une complémentarité unique au service de la performance opérationnelle et de la sécurité des hommes et des installations.
            </p>
          </div>

          <div className="grid gap-6 md:grid-cols-3">
            <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm hover:border-[#073022] transition-colors flex flex-col justify-between">
              <div>
                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[#073022] text-[#FDCD1A] mb-4">
                  <FormationIcon className="w-6 h-6" />
                </div>
                <h3 className="text-lg font-bold text-[#0A0A0A] uppercase">1. Formation Certifiante</h3>
                <p className="mt-2 text-xs text-slate-600 leading-relaxed">
                  Développer les compétences et réflexes de vos équipes grâce à des formateurs chevronnés et des programmes conformes aux normes internationales.
                </p>
              </div>
              <Link
                href="/formations"
                className="mt-6 text-xs font-bold text-[#073022] hover:text-[#D9A51F] flex items-center gap-1"
              >
                Découvrir nos formations →
              </Link>
            </div>

            <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm hover:border-[#073022] transition-colors flex flex-col justify-between">
              <div>
                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[#073022] text-[#FDCD1A] mb-4">
                  <BoutiqueIcon className="w-6 h-6" />
                </div>
                <h3 className="text-lg font-bold text-[#0A0A0A] uppercase">2. Vente EPI & EPC</h3>
                <p className="mt-2 text-xs text-slate-600 leading-relaxed">
                  Fournir les équipements certifiés indispensables pour prémunir vos collaborateurs de tout danger sur le terrain.
                </p>
              </div>
              <Link
                href="/boutique"
                className="mt-6 text-xs font-bold text-[#073022] hover:text-[#D9A51F] flex items-center gap-1"
              >
                Consulter le catalogue EPI →
              </Link>
            </div>

            <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm hover:border-[#073022] transition-colors flex flex-col justify-between">
              <div>
                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[#073022] text-[#FDCD1A] mb-4">
                  <RecrutementIcon className="w-6 h-6" />
                </div>
                <h3 className="text-lg font-bold text-[#0A0A0A] uppercase">3. Recrutement & Placement</h3>
                <p className="mt-2 text-xs text-slate-600 leading-relaxed">
                  Connecter les entreprises aux meilleurs profils HSE validés pour des missions temporaires ou des recrutements stratégiques permanents.
                </p>
              </div>
              <Link
                href="/recrutement"
                className="mt-6 text-xs font-bold text-[#073022] hover:text-[#D9A51F] flex items-center gap-1"
              >
                Accéder au recrutement →
              </Link>
            </div>
          </div>
        </section>

        {/* Call to action */}
        <section className="bg-[#073022] py-14 px-6 text-center text-white">
          <div className="mx-auto max-w-4xl">
            <h2 className="text-2xl sm:text-4xl font-extrabold uppercase text-white">
              Construisons ensemble votre culture de sécurité
            </h2>
            <p className="mt-3 text-sm text-slate-200 max-w-xl mx-auto">
              Contactez nos conseillers experts pour un diagnostic ou un échange personnalisé sur vos enjeux HSE.
            </p>
            <div className="mt-8 flex flex-wrap justify-center gap-4">
              <Link
                href="/contact"
                className="rounded-full bg-[#FDCD1A] px-8 py-3.5 text-sm font-bold text-[#0A0A0A] shadow-md hover:bg-[#e5b917] transition-all"
              >
                Prendre contact
              </Link>
              <WhatsAppButton message="Bonjour HSE BRIDGE, je souhaite échanger sur un partenariat ou une collaboration." />
            </div>
          </div>
        </section>
      </main>

      <WhatsAppButton variant="floating" message="Bonjour HSE BRIDGE, je souhaite des informations sur votre entreprise." />
      <PublicFooter />
    </div>
  );
}
