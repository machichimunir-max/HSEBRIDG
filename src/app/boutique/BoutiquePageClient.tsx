"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { useI18n } from "@/lib/i18n/I18nContext";
import { PublicHeader } from "@/components/public/PublicHeader";
import { PublicFooter } from "@/components/public/PublicFooter";
import { WhatsAppButton } from "@/components/public/WhatsAppButton";
import { BoutiqueIcon, SafetyShieldIcon, ChevronDownIcon } from "@/components/icons/HseIcons";

interface Category {
  id: string;
  titleFr: string;
  titleAr: string;
  slug: string;
  descriptionFr: string | null;
  descriptionAr: string | null;
  image: string | null;
  _count: { products: number };
}

interface BoutiquePageClientProps {
  categories: Category[];
}

export function BoutiquePageClient({ categories }: BoutiquePageClientProps) {
  const { t, locale, isRtl } = useI18n();
  const [quoteForm, setQuoteForm] = useState({
    fullName: "",
    company: "",
    phone: "",
    email: "",
    category: "",
    quantity: "",
    message: "",
  });
  const [submitted, setSubmitted] = useState(false);

  const handleSubmitQuote = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const response = await fetch("/api/boutique/quote", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(quoteForm),
      });

      if (!response.ok) {
        throw new Error("Failed to submit quote request");
      }

      setSubmitted(true);
      setQuoteForm({
        fullName: "",
        company: "",
        phone: "",
        email: "",
        category: "",
        quantity: "",
        message: "",
      });
    } catch (error) {
      console.error("Error submitting quote:", error);
      alert(locale === "ar" ? "حدث خطأ. يرجى المحاولة مرة أخرى." : "Une erreur s'est produite. Veuillez réessayer.");
    }
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
              alt="HSE Boutique EPI EPC"
              fill
              className="object-cover"
              priority
            />
          </div>
          <div className="absolute inset-0 bg-gradient-to-t from-[#073022] via-[#073022]/90 to-[#073022]/60 z-0" />

          <div className="relative z-10 mx-auto max-w-7xl">
            <div className="inline-flex items-center gap-2 rounded-full border border-[#FDCD1A]/40 bg-[#FDCD1A]/10 px-4 py-1.5 text-xs font-bold uppercase tracking-wider text-[#FDCD1A]">
              <BoutiqueIcon className="w-4 h-4 text-[#FDCD1A]" />
              {t.pillars.boutique.badge}
            </div>

            <h1 className="mt-4 text-3xl font-extrabold tracking-tight md:text-5xl uppercase text-white">
              {t.pillars.boutique.title}
            </h1>

            <p className="mt-3 text-lg font-bold text-[#FDCD1A] max-w-3xl uppercase">
              {t.pillars.boutique.subtitle}
            </p>

            <p className="mt-4 text-base text-slate-200 max-w-2xl leading-relaxed">
              {t.pillars.boutique.description}
            </p>

            <div className="mt-8 flex flex-wrap items-center gap-4">
              <a
                href="#categories"
                className="rounded-full bg-[#FDCD1A] px-7 py-3.5 text-sm font-bold text-[#0A0A0A] shadow-md hover:bg-[#e5b917] transition-all transform hover:-translate-y-0.5"
              >
                {t.pillars.boutique.cta}
              </a>
              <WhatsAppButton
                text="Devis Express WhatsApp"
                message="Bonjour HSE BRIDGE, je souhaite un devis pour des équipements EPI / EPC."
              />
            </div>
          </div>
        </section>

        {/* Benefits Strip */}
        <section className="border-b border-slate-200 bg-slate-50 py-8 px-6">
          <div className="mx-auto max-w-7xl">
            <h3 className="text-center text-xs font-extrabold uppercase tracking-widest text-[#073022] mb-6">
              {t.pillars.boutique.benefitsTitle}
            </h3>
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
              {t.pillars.boutique.benefits.map((benefit: string, idx: number) => (
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

        {/* Categories Catalog — loaded from DB */}
        <section id="categories" className="py-16 px-6 max-w-7xl mx-auto">
          <div className="text-center max-w-3xl mx-auto mb-12">
            <span className="rounded-full bg-[#073022]/10 px-4 py-1 text-xs font-bold uppercase tracking-wider text-[#073022]">
              Catalogue EPI &amp; EPC
            </span>
            <h2 className="mt-3 text-3xl font-extrabold text-[#0A0A0A] uppercase sm:text-4xl">
              {t.pillars.boutique.categoriesListTitle}
            </h2>
            <p className="mt-3 text-sm text-slate-600">
              {locale === "ar"
                ? "جميع معداتنا تستوفي أعلى معايير الامتثال الدولية (CE، EN، ANSI، ISO)"
                : "Tous nos équipements répondent aux normes internationales de conformité et de résistance les plus strictes (CE, EN, ANSI, ISO)."}
            </p>
          </div>

          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {categories.map((cat, idx) => {
              const catTitle = locale === "ar" ? cat.titleAr : cat.titleFr;
              const catDesc = locale === "ar" ? cat.descriptionAr : cat.descriptionFr;

              return (
                <div
                  key={cat.id}
                  className="flex flex-col justify-between rounded-3xl border border-slate-200 bg-white shadow-md hover:shadow-xl transition-all duration-300 hover:border-[#073022] group overflow-hidden"
                >
                  {/* Category Image */}
                  {cat.image && (
                    <div className="relative h-48 w-full overflow-hidden bg-slate-100">
                      <img
                        src={cat.image}
                        alt={catTitle}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent" />
                      <div className="absolute bottom-3 left-3 right-3">
                        <h3 className="text-lg font-bold text-white drop-shadow-lg">
                          {catTitle}
                        </h3>
                      </div>
                    </div>
                  )}

                  <div className="p-6 flex flex-col flex-1">
                    {!cat.image && (
                      <div className="flex items-center justify-between gap-2 mb-4">
                        <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[#073022] text-[#FDCD1A] group-hover:bg-[#FDCD1A] group-hover:text-[#0A0A0A] transition-colors">
                          <SafetyShieldIcon className="w-6 h-6" />
                        </div>
                        <div className="flex items-center gap-2">
                          {cat._count.products > 0 && (
                            <span className="text-xs font-bold text-slate-500 bg-slate-100 px-3 py-1 rounded-full">
                              {cat._count.products} {locale === "ar" ? "منتج" : "produit(s)"}
                            </span>
                          )}
                          <span className="text-xs font-bold text-slate-500 bg-slate-100 px-3 py-1 rounded-full">
                            #{idx + 1}
                          </span>
                        </div>
                      </div>
                    )}

                    {!cat.image && (
                      <h3 className="text-lg font-bold text-[#0A0A0A] group-hover:text-[#073022] transition-colors mb-2">
                        {catTitle}
                      </h3>
                    )}

                    {catDesc && (
                      <p className="mt-2 text-xs text-slate-600 leading-relaxed line-clamp-3 flex-1">
                        {catDesc}
                      </p>
                    )}

                    {cat._count.products > 0 && (
                      <div className="mt-3 flex items-center gap-2">
                        <span className="inline-flex items-center gap-1 text-xs font-bold text-emerald-700 bg-emerald-50 px-2 py-1 rounded-full">
                          <SafetyShieldIcon className="w-3 h-3" />
                          {cat._count.products} {locale === "ar" ? "منتج متوفر" : "produits disponibles"}
                        </span>
                      </div>
                    )}
                  </div>

                  <div className="px-6 pb-6 flex flex-col gap-2">
                    {cat._count.products > 0 ? (
                      <Link
                        href={`/boutique/${cat.slug}`}
                        className="w-full rounded-full bg-[#073022] py-2.5 text-center text-xs font-bold text-white hover:bg-[#0a4030] transition-colors flex items-center justify-center gap-2"
                      >
                        <span>
                          {locale === "ar" ? "عرض المنتجات" : "Voir les produits"}
                        </span>
                        <ChevronDownIcon className={`w-4 h-4 ${isRtl ? "rotate-90" : "-rotate-90"}`} />
                      </Link>
                    ) : (
                      <a
                        href="#quote-form"
                        onClick={() => setQuoteForm((prev) => ({ ...prev, category: catTitle }))}
                        className="w-full rounded-full bg-[#073022] py-2.5 text-center text-xs font-bold text-white hover:bg-[#0a4030] transition-colors"
                      >
                        {locale === "ar" ? "طلب عرض سعر" : "Demander un devis pour cette catégorie"}
                      </a>
                    )}
                    <a
                      href={`https://wa.me/212600000000?text=${encodeURIComponent(
                        `Bonjour HSE BRIDGE, je souhaite un devis ou catalogue pour la catégorie : ${catTitle}.`
                      )}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="w-full rounded-full border border-slate-300 py-2 text-center text-xs font-bold text-slate-700 hover:border-[#FDCD1A] hover:bg-[#FDCD1A]/10 transition-colors flex items-center justify-center gap-1.5"
                    >
                      <span>
                        {locale === "ar" ? "استفسر عبر واتساب" : "Disponibilité WhatsApp"}
                      </span>
                    </a>
                  </div>
                </div>
              );
            })}
          </div>
        </section>

        {/* Quote Request Form Section */}
        <section id="quote-form" className="bg-slate-50 border-t border-slate-200 py-16 px-6">
          <div className="mx-auto max-w-4xl rounded-3xl border border-slate-200 bg-white p-8 sm:p-12 shadow-xl">
            <div className="text-center max-w-2xl mx-auto mb-8">
              <span className="rounded-full bg-[#FDCD1A]/30 px-4 py-1 text-xs font-bold uppercase tracking-wider text-[#073022]">
                {locale === "ar" ? "نموذج طلب عرض السعر" : "Formulaire Devis Professionnel"}
              </span>
              <h2 className="mt-3 text-2xl sm:text-3xl font-extrabold text-[#0A0A0A] uppercase">
                {locale === "ar" ? "طلب عرض سعر EPI / EPC" : "Demande de Cotation EPI & EPC"}
              </h2>
              <p className="mt-2 text-xs sm:text-sm text-slate-600">
                {locale === "ar"
                  ? "أكمل التفاصيل أدناه للحصول على عرض تجاري مخصص في 24 ساعة"
                  : "Remplissez les détails ci-dessous pour recevoir une proposition commerciale sous 24h avec tarifs dégressifs."}
              </p>
            </div>

            {submitted ? (
              <div className="rounded-2xl bg-emerald-50 border border-emerald-200 p-8 text-center text-emerald-900 animate-in fade-in">
                <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-emerald-100 text-emerald-600 mb-3">
                  <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                <h3 className="text-lg font-bold">
                  {locale === "ar" ? "تم إرسال طلب عرض السعر بنجاح!" : "Demande de devis transmise avec succès !"}
                </h3>
                <p className="mt-2 text-xs text-emerald-800">
                  {locale === "ar"
                    ? "فريقنا التجاري يدرس احتياجاتك وسيتواصل معك خلال 24 ساعة"
                    : "Notre équipe commerciale étudie votre besoin et vous contactera sous 24 heures ouvrées."}
                </p>
                <button
                  onClick={() => setSubmitted(false)}
                  className="mt-6 rounded-full bg-[#073022] px-6 py-2.5 text-xs font-bold text-white hover:bg-[#0a4030]"
                >
                  {locale === "ar" ? "إرسال طلب آخر" : "Envoyer une autre demande"}
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmitQuote} className="grid gap-4 sm:grid-cols-2">
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                    {t.common.fullName} *
                  </label>
                  <input
                    type="text"
                    required
                    value={quoteForm.fullName}
                    onChange={(e) => setQuoteForm({ ...quoteForm, fullName: e.target.value })}
                    className="w-full rounded-xl border border-slate-300 p-3 text-sm focus:border-[#073022] focus:ring-1 focus:ring-[#073022] outline-none"
                    placeholder="Ex: Mohammed Alami"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                    {t.common.company}
                  </label>
                  <input
                    type="text"
                    value={quoteForm.company}
                    onChange={(e) => setQuoteForm({ ...quoteForm, company: e.target.value })}
                    className="w-full rounded-xl border border-slate-300 p-3 text-sm focus:border-[#073022] focus:ring-1 focus:ring-[#073022] outline-none"
                    placeholder="Ex: Société Industrielle BTP"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                    {t.common.phone} *
                  </label>
                  <input
                    type="tel"
                    required
                    value={quoteForm.phone}
                    onChange={(e) => setQuoteForm({ ...quoteForm, phone: e.target.value })}
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
                    value={quoteForm.email}
                    onChange={(e) => setQuoteForm({ ...quoteForm, email: e.target.value })}
                    className="w-full rounded-xl border border-slate-300 p-3 text-sm focus:border-[#073022] focus:ring-1 focus:ring-[#073022] outline-none"
                    placeholder="contact@entreprise.ma"
                  />
                </div>

                <div className="sm:col-span-2">
                  <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                    {locale === "ar" ? "الفئة المختارة" : `${t.common.category} sélectionnée`}
                  </label>
                  <select
                    value={quoteForm.category}
                    onChange={(e) => setQuoteForm({ ...quoteForm, category: e.target.value })}
                    className="w-full rounded-xl border border-slate-300 p-3 text-sm focus:border-[#073022] focus:ring-1 focus:ring-[#073022] outline-none bg-white"
                  >
                    <option value="">
                      {locale === "ar" ? "اختر فئة المعدات..." : "Sélectionnez une catégorie d'équipements..."}
                    </option>
                    {categories.map((cat) => (
                      <option key={cat.id} value={locale === "ar" ? cat.titleAr : cat.titleFr}>
                        {locale === "ar" ? cat.titleAr : cat.titleFr}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="sm:col-span-2">
                  <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                    {locale === "ar"
                      ? "تفاصيل المعدات والكميات المطلوبة *"
                      : "Détail des équipements souhaités & Quantités estimées *"}
                  </label>
                  <textarea
                    required
                    rows={4}
                    value={quoteForm.message}
                    onChange={(e) => setQuoteForm({ ...quoteForm, message: e.target.value })}
                    className="w-full rounded-xl border border-slate-300 p-3 text-sm focus:border-[#073022] focus:ring-1 focus:ring-[#073022] outline-none"
                    placeholder={locale === "ar"
                      ? "مثال: 50 خوذة واقية، 100 زوج قفازات مضادة للقطع، 20 طوق أمان..."
                      : "Ex: 50 Casques de sécurité avec jugulaire, 100 Paires de gants anti-coupure niveau D, 20 Harnais 2 points d'ancrage..."}
                  />
                </div>

                <div className="sm:col-span-2 mt-4 flex flex-col sm:flex-row items-center justify-between gap-4">
                  <button
                    type="submit"
                    className="w-full sm:w-auto rounded-full bg-[#073022] px-8 py-3.5 text-sm font-bold text-white shadow-md hover:bg-[#0a4030] transition-all transform hover:-translate-y-0.5"
                  >
                    {t.common.requestQuote}
                  </button>
                  <span className="text-xs text-slate-500">
                    {locale === "ar"
                      ? "🔒 بياناتك تبقى سرية تماماً"
                      : "🔒 Vos données restent strictement confidentielles."}
                  </span>
                </div>
              </form>
            )}
          </div>
        </section>
      </main>

      <WhatsAppButton variant="floating" message="Bonjour HSE BRIDGE, je souhaite des informations sur vos équipements EPI / EPC." />
      <PublicFooter />
    </div>
  );
}
