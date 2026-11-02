"use client";

import { useState } from "react";
import Link from "next/link";
import { useI18n } from "@/lib/i18n/I18nContext";
import { PublicHeader } from "@/components/public/PublicHeader";
import { PublicFooter } from "@/components/public/PublicFooter";
import { WhatsAppButton } from "@/components/public/WhatsAppButton";
import {
  SafetyShieldIcon,
  ImageIcon,
  ChevronDownIcon,
  StarIcon,
} from "@/components/icons/HseIcons";

interface ProductCategory {
  id: string;
  titleFr: string;
  titleAr: string;
  slug: string;
}

interface Product {
  id: string;
  titleFr: string;
  titleAr: string;
  slug: string;
  shortDescFr: string | null;
  shortDescAr: string | null;
  descriptionFr: string | null;
  descriptionAr: string | null;
  images: string[];
  price: number | null;
  stockStatus: string;
  certifications: string[];
  specifications: Record<string, string>;
  isFeatured: boolean;
  category: ProductCategory;
}

interface ProductDetailClientProps {
  product: Product;
  relatedProducts: Omit<Product, "category">[];
}

export function ProductDetailClient({ product, relatedProducts }: ProductDetailClientProps) {
  const { t, locale, isRtl } = useI18n();
  const [selectedImage, setSelectedImage] = useState(0);
  const [quoteForm, setQuoteForm] = useState({
    fullName: "",
    company: "",
    phone: "",
    email: "",
    message: `Je souhaite un devis pour : ${product.titleFr}`,
  });
  const [quoteSubmitting, setQuoteSubmitting] = useState(false);
  const [quoteSubmitted, setQuoteSubmitted] = useState(false);

  const title = locale === "ar" ? product.titleAr : product.titleFr;
  const shortDesc = locale === "ar" ? product.shortDescAr : product.shortDescFr;
  const description = locale === "ar" ? product.descriptionAr : product.descriptionFr;
  const categoryTitle =
    locale === "ar" ? product.category.titleAr : product.category.titleFr;

  const getStockLabel = (status: string) => {
    const labels: Record<string, { fr: string; ar: string }> = {
      in_stock: { fr: "En stock", ar: "متوفر" },
      on_order: { fr: "Sur commande", ar: "عند الطلب" },
      out_of_stock: { fr: "Épuisé", ar: "نفذ من المخزن" },
    };
    return locale === "ar" ? labels[status]?.ar : labels[status]?.fr;
  };

  const getStockBadgeClass = (status: string) => {
    const classes: Record<string, string> = {
      in_stock: "bg-emerald-100 text-emerald-800 border-emerald-200",
      on_order: "bg-amber-100 text-amber-800 border-amber-200",
      out_of_stock: "bg-slate-100 text-slate-600 border-slate-200",
    };
    return classes[status] || classes.in_stock;
  };

  const handleSubmitQuote = async (e: React.FormEvent) => {
    e.preventDefault();
    setQuoteSubmitting(true);
    try {
      const res = await fetch("/api/boutique/quote", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...quoteForm,
          category: categoryTitle,
        }),
      });
      if (res.ok) {
        setQuoteSubmitted(true);
      }
    } catch (err) {
      console.error("Quote submission failed:", err);
    } finally {
      setQuoteSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-white">
      <PublicHeader />

      <main className="flex-1">
        {/* Breadcrumbs */}
        <div className="border-b border-slate-200 bg-slate-50 px-6 py-3">
          <div className="mx-auto max-w-7xl flex items-center gap-2 text-sm text-slate-600">
            <Link href="/boutique" className="hover:text-[#073022] transition-colors">
              {locale === "ar" ? "المتجر" : "Boutique"}
            </Link>
            <ChevronDownIcon className={`w-4 h-4 ${isRtl ? "rotate-90" : "-rotate-90"}`} />
            <Link
              href={`/boutique/${product.category.slug}`}
              className="hover:text-[#073022] transition-colors"
            >
              {categoryTitle}
            </Link>
            <ChevronDownIcon className={`w-4 h-4 ${isRtl ? "rotate-90" : "-rotate-90"}`} />
            <span className="text-[#073022] font-medium line-clamp-1">{title}</span>
          </div>
        </div>

        {/* Product Detail */}
        <section className="py-12 px-6">
          <div className="mx-auto max-w-7xl">
            <div className="grid gap-12 lg:grid-cols-2">
              {/* Image Gallery */}
              <div>
                {/* Main Image */}
                <div className="relative aspect-square rounded-3xl border border-slate-200 bg-slate-100 overflow-hidden mb-3">
                  {product.images[selectedImage] ? (
                    <img
                      src={product.images[selectedImage]}
                      alt={title}
                      className="w-full h-full object-contain"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-slate-400">
                      <ImageIcon className="w-24 h-24" />
                    </div>
                  )}

                  {product.isFeatured && (
                    <div className="absolute top-4 right-4">
                      <span className="flex items-center gap-1 rounded-full bg-amber-500 px-3 py-1.5 text-xs font-bold text-white shadow">
                        <StarIcon className="w-3.5 h-3.5" />
                        {locale === "ar" ? "منتج مميز" : "Produit vedette"}
                      </span>
                    </div>
                  )}
                </div>

                {/* Thumbnails */}
                {product.images.length > 1 && (
                  <div className="flex gap-2 overflow-x-auto pb-1">
                    {product.images.map((img, idx) => (
                      <button
                        key={idx}
                        onClick={() => setSelectedImage(idx)}
                        className={`relative flex-shrink-0 w-16 h-16 rounded-xl border-2 overflow-hidden transition-all ${
                          idx === selectedImage
                            ? "border-[#073022] shadow-md"
                            : "border-slate-200 hover:border-slate-400"
                        }`}
                      >
                        <img src={img} alt="" className="w-full h-full object-cover" />
                      </button>
                    ))}
                  </div>
                )}
              </div>

              {/* Product Info */}
              <div>
                <div className="mb-2">
                  <Link
                    href={`/boutique/${product.category.slug}`}
                    className="inline-flex items-center gap-1.5 rounded-full bg-[#073022]/10 px-3 py-1 text-xs font-bold text-[#073022] hover:bg-[#073022]/20 transition-colors"
                  >
                    <SafetyShieldIcon className="w-3.5 h-3.5" />
                    {categoryTitle}
                  </Link>
                </div>

                <h1 className="mt-3 text-2xl font-extrabold text-[#0A0A0A] uppercase sm:text-3xl leading-tight">
                  {title}
                </h1>

                <div className="mt-3 flex items-center gap-3">
                  <span
                    className={`inline-flex items-center rounded-full px-3 py-1 text-sm font-semibold border ${getStockBadgeClass(
                      product.stockStatus
                    )}`}
                  >
                    {getStockLabel(product.stockStatus)}
                  </span>
                </div>

                {shortDesc && (
                  <p className="mt-4 text-base text-slate-700 leading-relaxed">{shortDesc}</p>
                )}

                {/* Price */}
                <div className="mt-6 rounded-2xl border border-[#073022]/20 bg-[#073022]/5 p-5">
                  {product.price ? (
                    <div>
                      <p className="text-xs font-semibold uppercase text-slate-500 mb-1">
                        {locale === "ar" ? "السعر" : "Prix unitaire"}
                      </p>
                      <p className="text-3xl font-extrabold text-[#073022]">
                        {product.price.toLocaleString()} MAD
                      </p>
                      <p className="mt-1 text-xs text-slate-500">
                        {locale === "ar" ? "السعر دون ضريبة، التسليم حسب الاتفاق" : "HT, livraison selon accord"}
                      </p>
                    </div>
                  ) : (
                    <div>
                      <p className="text-xs font-semibold uppercase text-slate-500 mb-1">
                        {locale === "ar" ? "السعر" : "Tarification"}
                      </p>
                      <p className="text-xl font-bold text-[#073022]">
                        {locale === "ar" ? "السعر عند الطلب" : "Prix sur devis"}
                      </p>
                      <p className="mt-1 text-xs text-slate-500">
                        {locale === "ar"
                          ? "تواصل معنا للحصول على عرض سعر مخصص"
                          : "Contactez-nous pour une offre personnalisée"}
                      </p>
                    </div>
                  )}
                </div>

                {/* CTAs */}
                <div className="mt-5 flex flex-col gap-3">
                  <a
                    href="#quote-form"
                    className="rounded-full bg-[#073022] py-3.5 text-center text-sm font-bold text-white hover:bg-[#0a4030] transition-all shadow-md"
                  >
                    {t.common.requestQuote}
                  </a>
                  <WhatsAppButton
                    text={locale === "ar" ? "استفسر عبر واتساب" : "Demande via WhatsApp"}
                    message={`Bonjour HSE BRIDGE, je suis intéressé par le produit : ${product.titleFr}. Pouvez-vous me communiquer votre meilleur prix ?`}
                  />
                </div>

                {/* Certifications */}
                {product.certifications.length > 0 && (
                  <div className="mt-6">
                    <h3 className="text-sm font-bold text-slate-700 mb-3 uppercase tracking-wide">
                      {locale === "ar" ? "الشهادات والمعايير" : "Certifications"}
                    </h3>
                    <div className="flex flex-wrap gap-2">
                      {product.certifications.map((cert, idx) => (
                        <span
                          key={idx}
                          className="inline-flex items-center gap-1.5 rounded-full border border-[#073022]/30 bg-[#073022]/5 px-3 py-1.5 text-xs font-bold text-[#073022]"
                        >
                          <SafetyShieldIcon className="w-3.5 h-3.5" />
                          {cert}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                {/* Specifications */}
                {Object.keys(product.specifications).length > 0 && (
                  <div className="mt-6">
                    <h3 className="text-sm font-bold text-slate-700 mb-3 uppercase tracking-wide">
                      {locale === "ar" ? "المواصفات التقنية" : "Spécifications techniques"}
                    </h3>
                    <div className="rounded-2xl border border-slate-200 overflow-hidden">
                      <table className="w-full text-sm">
                        <tbody>
                          {Object.entries(product.specifications).map(([key, value], idx) => (
                            <tr
                              key={key}
                              className={idx % 2 === 0 ? "bg-slate-50" : "bg-white"}
                            >
                              <td className="px-4 py-2.5 font-semibold text-slate-700 border-b border-slate-100 w-2/5">
                                {key}
                              </td>
                              <td className="px-4 py-2.5 text-slate-600 border-b border-slate-100">
                                {value}
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Full Description */}
            {description && (
              <div className="mt-12 rounded-3xl border border-slate-200 bg-slate-50 p-8">
                <h2 className="text-xl font-extrabold text-[#0A0A0A] uppercase mb-4">
                  {locale === "ar" ? "وصف المنتج" : "Description du produit"}
                </h2>
                <div className="prose prose-slate max-w-none text-sm leading-relaxed text-slate-700 whitespace-pre-wrap">
                  {description}
                </div>
              </div>
            )}
          </div>
        </section>

        {/* Quote Request Form */}
        <section id="quote-form" className="bg-[#073022] py-16 px-6">
          <div className="mx-auto max-w-3xl">
            <div className="text-center mb-8">
              <span className="inline-flex items-center gap-1 rounded-full border border-[#FDCD1A]/40 bg-[#FDCD1A]/10 px-4 py-1.5 text-xs font-bold uppercase tracking-wider text-[#FDCD1A]">
                {locale === "ar" ? "طلب عرض السعر" : "Demande de devis"}
              </span>
              <h2 className="mt-3 text-2xl font-extrabold uppercase text-white">
                {locale === "ar" ? "طلب عرض سعر لهذا المنتج" : "Obtenir un devis pour ce produit"}
              </h2>
              <p className="mt-2 text-sm text-slate-300">
                {locale === "ar"
                  ? "فريقنا يرد خلال 24 ساعة بعرض سعر مفصل"
                  : "Notre équipe répond sous 24h avec une offre personnalisée"}
              </p>
            </div>

            <div className="rounded-3xl bg-white p-8">
              {quoteSubmitted ? (
                <div className="rounded-2xl bg-emerald-50 border border-emerald-200 p-8 text-center">
                  <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-emerald-100 text-emerald-600 mb-3">
                    <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                  <h3 className="text-lg font-bold text-emerald-900">
                    {locale === "ar" ? "تم إرسال طلبك بنجاح!" : "Demande envoyée avec succès !"}
                  </h3>
                  <p className="mt-2 text-sm text-emerald-700">
                    {locale === "ar"
                      ? "سيتواصل معك فريقنا التجاري خلال 24 ساعة"
                      : "Notre équipe commerciale vous contactera sous 24 heures"}
                  </p>
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
                      className="w-full rounded-xl border border-slate-300 px-4 py-3 text-sm focus:border-[#073022] focus:outline-none focus:ring-1 focus:ring-[#073022]"
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
                      className="w-full rounded-xl border border-slate-300 px-4 py-3 text-sm focus:border-[#073022] focus:outline-none focus:ring-1 focus:ring-[#073022]"
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
                      className="w-full rounded-xl border border-slate-300 px-4 py-3 text-sm focus:border-[#073022] focus:outline-none focus:ring-1 focus:ring-[#073022]"
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
                      className="w-full rounded-xl border border-slate-300 px-4 py-3 text-sm focus:border-[#073022] focus:outline-none focus:ring-1 focus:ring-[#073022]"
                    />
                  </div>
                  <div className="sm:col-span-2">
                    <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                      {locale === "ar" ? "تفاصيل الطلب" : "Détails de la demande"} *
                    </label>
                    <textarea
                      required
                      rows={4}
                      value={quoteForm.message}
                      onChange={(e) => setQuoteForm({ ...quoteForm, message: e.target.value })}
                      className="w-full rounded-xl border border-slate-300 px-4 py-3 text-sm focus:border-[#073022] focus:outline-none focus:ring-1 focus:ring-[#073022] resize-none"
                    />
                  </div>
                  <div className="sm:col-span-2">
                    <button
                      type="submit"
                      disabled={quoteSubmitting}
                      className="w-full rounded-full bg-[#073022] py-4 text-sm font-bold text-white shadow-md hover:bg-[#0a4030] transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {quoteSubmitting
                        ? locale === "ar"
                          ? "جارٍ الإرسال..."
                          : "Envoi en cours..."
                        : t.common.requestQuote}
                    </button>
                  </div>
                </form>
              )}
            </div>
          </div>
        </section>

        {/* Related Products */}
        {relatedProducts.length > 0 && (
          <section className="py-12 px-6 bg-slate-50 border-t border-slate-200">
            <div className="mx-auto max-w-7xl">
              <h2 className="text-xl font-extrabold text-[#0A0A0A] uppercase mb-6">
                {locale === "ar" ? "منتجات من نفس الفئة" : "Autres produits de la même catégorie"}
              </h2>

              <div className="grid gap-5 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
                {relatedProducts.map((related) => {
                  const relatedTitle = locale === "ar" ? related.titleAr : related.titleFr;
                  return (
                    <Link
                      key={related.id}
                      href={`/boutique/produit/${related.slug}`}
                      className="group rounded-2xl border border-slate-200 bg-white shadow-sm hover:shadow-md transition-all overflow-hidden"
                    >
                      <div className="aspect-square bg-slate-100 overflow-hidden">
                        {related.images[0] ? (
                          <img
                            src={related.images[0]}
                            alt={relatedTitle}
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center text-slate-400">
                            <ImageIcon className="w-10 h-10" />
                          </div>
                        )}
                      </div>
                      <div className="p-3">
                        <h3 className="font-bold text-sm text-slate-800 line-clamp-2 group-hover:text-[#073022] transition-colors">
                          {relatedTitle}
                        </h3>
                        {related.price ? (
                          <p className="mt-1 text-sm font-bold text-[#073022]">
                            {related.price.toLocaleString()} MAD
                          </p>
                        ) : (
                          <p className="mt-1 text-xs text-slate-500">
                            {locale === "ar" ? "السعر عند الطلب" : "Prix sur devis"}
                          </p>
                        )}
                      </div>
                    </Link>
                  );
                })}
              </div>
            </div>
          </section>
        )}
      </main>

      <WhatsAppButton
        variant="floating"
        message={`Bonjour HSE BRIDGE, je suis intéressé par le produit : ${product.titleFr}.`}
      />
      <PublicFooter />
    </div>
  );
}
