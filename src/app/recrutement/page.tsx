"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { useI18n } from "@/lib/i18n/I18nContext";
import { PublicHeader } from "@/components/public/PublicHeader";
import { PublicFooter } from "@/components/public/PublicFooter";
import { WhatsAppButton } from "@/components/public/WhatsAppButton";
import { RecrutementIcon, SafetyShieldIcon } from "@/components/icons/HseIcons";

export default function RecrutementPage() {
  const { t, isRtl } = useI18n();
  const [activeTab, setActiveTab] = useState<"candidate" | "employer">("candidate");

  // Candidate Form State
  const [candidateForm, setCandidateForm] = useState({
    fullName: "",
    email: "",
    phone: "",
    city: "",
    domain: "",
    experience: "1-3",
    linkedin: "",
    notes: "",
  });
  const [candidateSubmitted, setCandidateSubmitted] = useState(false);

  // Employer Form State
  const [employerForm, setEmployerForm] = useState({
    company: "",
    contactName: "",
    email: "",
    phone: "",
    positionNeeded: "",
    location: "",
    contractType: "CDI",
    urgency: "urgent",
    description: "",
  });
  const [employerSubmitted, setEmployerSubmitted] = useState(false);

  const handleCandidateSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setCandidateSubmitted(true);
  };

  const handleEmployerSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setEmployerSubmitted(true);
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
              alt="HSE Recrutement"
              fill
              className="object-cover"
              priority
            />
          </div>
          <div className="absolute inset-0 bg-gradient-to-t from-[#073022] via-[#073022]/90 to-[#073022]/60 z-0" />

          <div className="relative z-10 mx-auto max-w-7xl">
            <div className="inline-flex items-center gap-2 rounded-full border border-[#FDCD1A]/40 bg-[#FDCD1A]/10 px-4 py-1.5 text-xs font-bold uppercase tracking-wider text-[#FDCD1A]">
              <RecrutementIcon className="w-4 h-4 text-[#FDCD1A]" />
              {t.pillars.recrutement.badge}
            </div>

            <h1 className="mt-4 text-3xl font-extrabold tracking-tight md:text-5xl uppercase text-white">
              {t.pillars.recrutement.title}
            </h1>

            <p className="mt-3 text-lg font-bold text-[#FDCD1A] max-w-3xl uppercase">
              {t.pillars.recrutement.subtitle}
            </p>

            <p className="mt-4 text-base text-slate-200 max-w-2xl leading-relaxed">
              {t.pillars.recrutement.description}
            </p>

            <div className="mt-8 flex flex-wrap items-center gap-4">
              <a
                href="#action-hub"
                onClick={() => setActiveTab("candidate")}
                className="rounded-full bg-[#FDCD1A] px-7 py-3.5 text-sm font-bold text-[#0A0A0A] shadow-md hover:bg-[#e5b917] transition-all transform hover:-translate-y-0.5"
              >
                {t.pillars.recrutement.forCandidates.buttonText}
              </a>
              <a
                href="#action-hub"
                onClick={() => setActiveTab("employer")}
                className="rounded-full border-2 border-[#FDCD1A] px-7 py-3 text-sm font-bold text-[#FDCD1A] hover:bg-[#FDCD1A] hover:text-[#0A0A0A] transition-all transform hover:-translate-y-0.5"
              >
                {t.pillars.recrutement.forEmployers.buttonText}
              </a>
              <WhatsAppButton
                text="Recruteur WhatsApp"
                message="Bonjour HSE BRIDGE, je souhaite échanger sur un recrutement HSE."
              />
            </div>
          </div>
        </section>

        {/* Benefits Strip */}
        <section className="border-b border-slate-200 bg-slate-50 py-8 px-6">
          <div className="mx-auto max-w-7xl">
            <h3 className="text-center text-xs font-extrabold uppercase tracking-widest text-[#073022] mb-6">
              {t.pillars.recrutement.benefitsTitle}
            </h3>
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
              {t.pillars.recrutement.benefits.map((benefit: string, idx: number) => (
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

        {/* 8 HSE Placement Domains */}
        <section className="py-16 px-6 max-w-7xl mx-auto">
          <div className="text-center max-w-3xl mx-auto mb-12">
            <span className="rounded-full bg-[#073022]/10 px-4 py-1 text-xs font-bold uppercase tracking-wider text-[#073022]">
              Vivier de Spécialités
            </span>
            <h2 className="mt-3 text-3xl font-extrabold text-[#0A0A0A] uppercase sm:text-4xl">
              {t.pillars.recrutement.domainsListTitle}
            </h2>
            <p className="mt-3 text-sm text-slate-600">
              Nous sélectionnons et évaluons rigoureusement les profils pour répondre exactement aux exigences de vos opérations.
            </p>
          </div>

          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
            {t.pillars.recrutement.domains.map((domain: any, idx: number) => (
              <div
                key={idx}
                className="flex flex-col justify-between rounded-3xl border border-slate-200 bg-white p-6 shadow-md hover:shadow-xl transition-all duration-300 hover:border-[#073022] group"
              >
                <div>
                  <div className="flex items-center justify-between gap-2 mb-3">
                    <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#073022] text-[#FDCD1A] font-bold text-xs group-hover:bg-[#FDCD1A] group-hover:text-[#0A0A0A] transition-colors">
                      #{idx + 1}
                    </span>
                    <span className="text-xs font-bold text-emerald-700 bg-emerald-50 px-2.5 py-0.5 rounded-full">
                      Profils Actifs
                    </span>
                  </div>

                  <h3 className="text-base font-bold text-[#0A0A0A] group-hover:text-[#073022] transition-colors">
                    {domain.title}
                  </h3>

                  <p className="mt-2 text-xs text-slate-600 leading-relaxed">
                    {domain.description}
                  </p>
                </div>

                <div className="mt-6 pt-4 border-t border-slate-100">
                  <a
                    href="#action-hub"
                    onClick={() => {
                      setActiveTab("employer");
                      setEmployerForm((prev) => ({ ...prev, positionNeeded: domain.title }));
                    }}
                    className="text-xs font-bold text-[#073022] hover:text-[#D9A51F] flex items-center gap-1.5 transition-colors"
                  >
                    <span>Demander des profils</span>
                    <span className="text-sm">→</span>
                  </a>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Interactive Dual Action Hub: Candidate & Employer */}
        <section id="action-hub" className="bg-slate-50 border-t border-slate-200 py-16 px-6">
          <div className="mx-auto max-w-5xl">
            {/* Toggle Tabs */}
            <div className="flex justify-center mb-10">
              <div className="inline-flex rounded-full bg-slate-200 p-1.5 shadow-inner">
                <button
                  onClick={() => setActiveTab("candidate")}
                  className={`rounded-full px-6 sm:px-8 py-3 text-xs sm:text-sm font-extrabold uppercase transition-all ${
                    activeTab === "candidate"
                      ? "bg-[#073022] text-[#FDCD1A] shadow-md"
                      : "text-slate-700 hover:text-[#0A0A0A]"
                  }`}
                >
                  {t.pillars.recrutement.forCandidates.title}
                </button>
                <button
                  onClick={() => setActiveTab("employer")}
                  className={`rounded-full px-6 sm:px-8 py-3 text-xs sm:text-sm font-extrabold uppercase transition-all ${
                    activeTab === "employer"
                      ? "bg-[#073022] text-[#FDCD1A] shadow-md"
                      : "text-slate-700 hover:text-[#0A0A0A]"
                  }`}
                >
                  {t.pillars.recrutement.forEmployers.title}
                </button>
              </div>
            </div>

            {/* Candidate Space */}
            {activeTab === "candidate" && (
              <div className="rounded-3xl border border-slate-200 bg-white p-8 sm:p-12 shadow-xl animate-in fade-in duration-300">
                <div className="text-center max-w-2xl mx-auto mb-8">
                  <span className="rounded-full bg-[#FDCD1A]/30 px-4 py-1 text-xs font-bold uppercase tracking-wider text-[#073022]">
                    Espace Candidats HSE
                  </span>
                  <h2 className="mt-3 text-2xl sm:text-3xl font-extrabold text-[#0A0A0A] uppercase">
                    Déposez votre CV dans la CVthèque HSE BRIDGE
                  </h2>
                  <p className="mt-2 text-xs sm:text-sm text-slate-600">
                    {t.pillars.recrutement.forCandidates.description}
                  </p>
                </div>

                {candidateSubmitted ? (
                  <div className="rounded-2xl bg-emerald-50 border border-emerald-200 p-8 text-center text-emerald-900 animate-in fade-in">
                    <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-emerald-100 text-emerald-600 mb-3">
                      <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                    </div>
                    <h3 className="text-lg font-bold">Candidature enregistrée dans notre vivier !</h3>
                    <p className="mt-2 text-xs text-emerald-800">
                      Notre cellule recrutement étudie votre profil et prendra contact avec vous dès qu'une opportunité correspondante s'ouvre.
                    </p>
                    <button
                      onClick={() => setCandidateSubmitted(false)}
                      className="mt-6 rounded-full bg-[#073022] px-6 py-2.5 text-xs font-bold text-white hover:bg-[#0a4030]"
                    >
                      Modifier mes informations
                    </button>
                  </div>
                ) : (
                  <form onSubmit={handleCandidateSubmit} className="grid gap-4 sm:grid-cols-2">
                    <div>
                      <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                        {t.common.fullName} *
                      </label>
                      <input
                        type="text"
                        required
                        value={candidateForm.fullName}
                        onChange={(e) => setCandidateForm({ ...candidateForm, fullName: e.target.value })}
                        className="w-full rounded-xl border border-slate-300 p-3 text-sm focus:border-[#073022] focus:ring-1 focus:ring-[#073022] outline-none"
                        placeholder="Ex: Yassine Bennani"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                        {t.common.phone} *
                      </label>
                      <input
                        type="tel"
                        required
                        value={candidateForm.phone}
                        onChange={(e) => setCandidateForm({ ...candidateForm, phone: e.target.value })}
                        className="w-full rounded-xl border border-slate-300 p-3 text-sm focus:border-[#073022] focus:ring-1 focus:ring-[#073022] outline-none"
                        placeholder="Ex: +212 6 XX XX XX XX"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                        {t.common.email} *
                      </label>
                      <input
                        type="email"
                        required
                        value={candidateForm.email}
                        onChange={(e) => setCandidateForm({ ...candidateForm, email: e.target.value })}
                        className="w-full rounded-xl border border-slate-300 p-3 text-sm focus:border-[#073022] focus:ring-1 focus:ring-[#073022] outline-none"
                        placeholder="yassine.bennani@email.com"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                        Ville actuelle / Mobilité *
                      </label>
                      <input
                        type="text"
                        required
                        value={candidateForm.city}
                        onChange={(e) => setCandidateForm({ ...candidateForm, city: e.target.value })}
                        className="w-full rounded-xl border border-slate-300 p-3 text-sm focus:border-[#073022] focus:ring-1 focus:ring-[#073022] outline-none"
                        placeholder="Ex: Casablanca, Tanger (Mobile National)"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                        Domaine d'expertise HSE principal *
                      </label>
                      <select
                        required
                        value={candidateForm.domain}
                        onChange={(e) => setCandidateForm({ ...candidateForm, domain: e.target.value })}
                        className="w-full rounded-xl border border-slate-300 p-3 text-sm focus:border-[#073022] focus:ring-1 focus:ring-[#073022] outline-none bg-white"
                      >
                        <option value="">Sélectionnez votre domaine...</option>
                        {t.pillars.recrutement.domains.map((d: any, idx: number) => (
                          <option key={idx} value={d.title}>
                            {d.title}
                          </option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                        Années d'expérience HSE *
                      </label>
                      <select
                        value={candidateForm.experience}
                        onChange={(e) => setCandidateForm({ ...candidateForm, experience: e.target.value })}
                        className="w-full rounded-xl border border-slate-300 p-3 text-sm focus:border-[#073022] focus:ring-1 focus:ring-[#073022] outline-none bg-white"
                      >
                        <option value="junior">Débutant / Moins d'un an</option>
                        <option value="1-3">1 à 3 ans</option>
                        <option value="3-5">3 à 5 ans</option>
                        <option value="5-10">5 à 10 ans</option>
                        <option value="10+">Plus de 10 ans (Expert/Senior)</option>
                      </select>
                    </div>

                    <div className="sm:col-span-2">
                      <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                        Lien LinkedIn ou Synthèse du profil
                      </label>
                      <input
                        type="url"
                        value={candidateForm.linkedin}
                        onChange={(e) => setCandidateForm({ ...candidateForm, linkedin: e.target.value })}
                        className="w-full rounded-xl border border-slate-300 p-3 text-sm focus:border-[#073022] focus:ring-1 focus:ring-[#073022] outline-none"
                        placeholder="https://linkedin.com/in/mon-profil"
                      />
                    </div>

                    <div className="sm:col-span-2">
                      <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                        Formations & Certifications clés détenues
                      </label>
                      <textarea
                        rows={3}
                        value={candidateForm.notes}
                        onChange={(e) => setCandidateForm({ ...candidateForm, notes: e.target.value })}
                        className="w-full rounded-xl border border-slate-300 p-3 text-sm focus:border-[#073022] focus:ring-1 focus:ring-[#073022] outline-none"
                        placeholder="Ex: IOSH Managing Safely, NEBOSH IGC, SST, Habilitation Électrique, CACES..."
                      />
                    </div>

                    <div className="sm:col-span-2 mt-4 flex flex-col sm:flex-row items-center justify-between gap-4">
                      <button
                        type="submit"
                        className="w-full sm:w-auto rounded-full bg-[#073022] px-8 py-3.5 text-sm font-bold text-white shadow-md hover:bg-[#0a4030] transition-all transform hover:-translate-y-0.5"
                      >
                        {t.pillars.recrutement.forCandidates.buttonText}
                      </button>
                      <span className="text-xs text-slate-500">
                        🔒 Confidentialité garantie vis-à-vis de votre employeur actuel.
                      </span>
                    </div>
                  </form>
                )}
              </div>
            )}

            {/* Employer Space */}
            {activeTab === "employer" && (
              <div className="rounded-3xl border border-slate-200 bg-white p-8 sm:p-12 shadow-xl animate-in fade-in duration-300">
                <div className="text-center max-w-2xl mx-auto mb-8">
                  <span className="rounded-full bg-[#073022] px-4 py-1 text-xs font-bold uppercase tracking-wider text-[#FDCD1A]">
                    Espace Entreprises & Recruteurs
                  </span>
                  <h2 className="mt-3 text-2xl sm:text-3xl font-extrabold text-[#0A0A0A] uppercase">
                    Mandat de Recherche de Profils HSE
                  </h2>
                  <p className="mt-2 text-xs sm:text-sm text-slate-600">
                    {t.pillars.recrutement.forEmployers.description}
                  </p>
                </div>

                {employerSubmitted ? (
                  <div className="rounded-2xl bg-emerald-50 border border-emerald-200 p-8 text-center text-emerald-900 animate-in fade-in">
                    <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-emerald-100 text-emerald-600 mb-3">
                      <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                    </div>
                    <h3 className="text-lg font-bold">Demande de profils reçue avec succès !</h3>
                    <p className="mt-2 text-xs text-emerald-800">
                      Un consultant expert en recrutement HSE vous contactera sous 12h pour qualifier précisément vos fiches de poste.
                    </p>
                    <button
                      onClick={() => setEmployerSubmitted(false)}
                      className="mt-6 rounded-full bg-[#073022] px-6 py-2.5 text-xs font-bold text-white hover:bg-[#0a4030]"
                    >
                      Soumettre un autre besoin
                    </button>
                  </div>
                ) : (
                  <form onSubmit={handleEmployerSubmit} className="grid gap-4 sm:grid-cols-2">
                    <div>
                      <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                        Raison Sociale Entreprise *
                      </label>
                      <input
                        type="text"
                        required
                        value={employerForm.company}
                        onChange={(e) => setEmployerForm({ ...employerForm, company: e.target.value })}
                        className="w-full rounded-xl border border-slate-300 p-3 text-sm focus:border-[#073022] focus:ring-1 focus:ring-[#073022] outline-none"
                        placeholder="Ex: Groupe OCP, Somagec, Tanger Med..."
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                        Nom & Fonction du Contact *
                      </label>
                      <input
                        type="text"
                        required
                        value={employerForm.contactName}
                        onChange={(e) => setEmployerForm({ ...employerForm, contactName: e.target.value })}
                        className="w-full rounded-xl border border-slate-300 p-3 text-sm focus:border-[#073022] focus:ring-1 focus:ring-[#073022] outline-none"
                        placeholder="Ex: DRH / Responsable HSE"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                        {t.common.phone} Direct *
                      </label>
                      <input
                        type="tel"
                        required
                        value={employerForm.phone}
                        onChange={(e) => setEmployerForm({ ...employerForm, phone: e.target.value })}
                        className="w-full rounded-xl border border-slate-300 p-3 text-sm focus:border-[#073022] focus:ring-1 focus:ring-[#073022] outline-none"
                        placeholder="+212 5 XX XX XX XX"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                        {t.common.email} Professionnel *
                      </label>
                      <input
                        type="email"
                        required
                        value={employerForm.email}
                        onChange={(e) => setEmployerForm({ ...employerForm, email: e.target.value })}
                        className="w-full rounded-xl border border-slate-300 p-3 text-sm focus:border-[#073022] focus:ring-1 focus:ring-[#073022] outline-none"
                        placeholder="recrutement@groupe.ma"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                        Poste(s) HSE à pourvoir *
                      </label>
                      <input
                        type="text"
                        required
                        value={employerForm.positionNeeded}
                        onChange={(e) => setEmployerForm({ ...employerForm, positionNeeded: e.target.value })}
                        className="w-full rounded-xl border border-slate-300 p-3 text-sm focus:border-[#073022] focus:ring-1 focus:ring-[#073022] outline-none"
                        placeholder="Ex: 2 Superviseurs HSE Chantier BTP"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                        Lieu de la mission / Chantier *
                      </label>
                      <input
                        type="text"
                        required
                        value={employerForm.location}
                        onChange={(e) => setEmployerForm({ ...employerForm, location: e.target.value })}
                        className="w-full rounded-xl border border-slate-300 p-3 text-sm focus:border-[#073022] focus:ring-1 focus:ring-[#073022] outline-none"
                        placeholder="Ex: Jorf Lasfar / Kénitra / Nador"
                      />
                    </div>

                    <div className="sm:col-span-2">
                      <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                        Critères d'exigence & Contexte de la mission *
                      </label>
                      <textarea
                        required
                        rows={4}
                        value={employerForm.description}
                        onChange={(e) => setEmployerForm({ ...employerForm, description: e.target.value })}
                        className="w-full rounded-xl border border-slate-300 p-3 text-sm focus:border-[#073022] focus:ring-1 focus:ring-[#073022] outline-none"
                        placeholder="Ex: Expérience requise de 3 ans min en milieu chimique, maîtrise des permis de travail, disponibilité immédiate..."
                      />
                    </div>

                    <div className="sm:col-span-2 mt-4 flex flex-col sm:flex-row items-center justify-between gap-4">
                      <button
                        type="submit"
                        className="w-full sm:w-auto rounded-full bg-[#073022] px-8 py-3.5 text-sm font-bold text-[#FDCD1A] shadow-md hover:bg-[#0a4030] transition-all transform hover:-translate-y-0.5"
                      >
                        {t.pillars.recrutement.forEmployers.buttonText}
                      </button>
                      <WhatsAppButton
                        text="Échanger directement avec un consultant"
                        message="Bonjour HSE BRIDGE, notre entreprise a un besoin urgent en recrutement HSE."
                      />
                    </div>
                  </form>
                )}
              </div>
            )}
          </div>
        </section>
      </main>

      <WhatsAppButton variant="floating" message="Bonjour HSE BRIDGE, je souhaite des informations sur le recrutement HSE." />
      <PublicFooter />
    </div>
  );
}
