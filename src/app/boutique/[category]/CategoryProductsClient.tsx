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

interface Product {
  id: string;
  titleFr: string;
  titleAr: string;
  slug: string;
  shortDescFr: string | null;
  shortDescAr: string | null;
  images: string[];
  price: number | null;
  stockStatus: string;
  certifications: string[];
  isFeatured: boolean;
}

interface Category {
  id: string;
  titleFr: string;
  titleAr: string;
  slug: string;
  descriptionFr: string | null;
  descriptionAr: string | null;
  products: Product[];
}

interface CategoryProductsClientProps {
  category: Category;
}

export function CategoryProductsClient({ category }: CategoryProductsClientProps) {
  const { t, locale, isRtl } = useI18n();
  const [stockFilter, setStockFilter] = useState<string>("all");

  const title = locale === "ar" ? category.titleAr : category.titleFr;
  const description = locale === "ar" ? category.descriptionAr : category.descriptionFr;

  const filteredProducts =
    stockFilter === "all"
      ? category.products
      : category.products.filter((p) => p.stockStatus === stockFilter);

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
      in_stock: "bg-emerald-100 text-emerald-800 border-emerald-300",
      on_order: "bg-amber-100 text-amber-800 border-amber-300",
      out_of_stock: "bg-slate-100 text-slate-600 border-slate-300",
    };
    return classes[status] || classes.in_stock;
  };

  return (
    <div className="min-h-screen bg-white">
      <PublicHeader />

      <main className="flex-1">
        {/* Hero Section */}
        <section className="relative bg-[#073022] text-white py-12 px-6">
          <div className="mx-auto max-w-7xl">
            <nav className="mb-4 flex items-center gap-2 text-sm text-slate-300">
              <Link href="/boutique" className="hover:text-white transition-colors">
                {t.pillars.boutique.title}
              </Link>
              <ChevronDownIcon className={`w-4 h-4 ${isRtl ? "rotate-90" : "-rotate-90"}`} />
              <span className="text-[#FDCD1A]">{title}</span>
            </nav>

            <div className="flex items-center gap-3 mb-3">
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[#FDCD1A] text-[#0A0A0A]">
                <SafetyShieldIcon className="w-7 h-7" />
              </div>
              <h1 className="text-3xl font-extrabold text-white uppercase md:text-4xl">
                {title}
              </h1>
            </div>

            {description && (
              <p className="mt-3 text-base text-slate-200 max-w-3xl leading-relaxed">
                {description}
              </p>
            )}
          </div>
        </section>

        {/* Products Section */}
        <section className="py-12 px-6">
          <div className="mx-auto max-w-7xl">
            {/* Filter Bar */}
            <div className="mb-8 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <p className="text-sm text-slate-600">
                {filteredProducts.length} {locale === "ar" ? "منتج" : "produit(s)"}
              </p>
              <div className="flex items-center gap-3">
                <label className="text-sm font-medium text-slate-700">
                  {locale === "ar" ? "حالة المخزون:" : "Disponibilité:"}
                </label>
                <select
                  value={stockFilter}
                  onChange={(e) => setStockFilter(e.target.value)}
                  className="rounded-xl border border-slate-300 px-4 py-2 text-sm focus:border-[#073022] focus:outline-none focus:ring-1 focus:ring-[#073022]"
                >
                  <option value="all">
                    {locale === "ar" ? "الكل" : "Tous"}
                  </option>
                  <option value="in_stock">
                    {locale === "ar" ? "متوفر" : "En stock"}
                  </option>
                  <option value="on_order">
                    {locale === "ar" ? "عند الطلب" : "Sur commande"}
                  </option>
                </select>
              </div>
            </div>

            {/* Products Grid */}
            {filteredProducts.length === 0 ? (
              <div className="rounded-2xl border-2 border-dashed border-slate-200 bg-slate-50 p-12 text-center">
                <ImageIcon className="mx-auto h-16 w-16 text-slate-400 mb-4" />
                <h3 className="text-lg font-semibold text-slate-700 mb-2">
                  {locale === "ar" ? "لا توجد منتجات" : "Aucun produit disponible"}
                </h3>
                <p className="text-sm text-slate-500">
                  {locale === "ar"
                    ? "لا توجد منتجات في هذه الفئة حالياً"
                    : "Il n'y a pas de produits dans cette catégorie pour le moment"}
                </p>
              </div>
            ) : (
              <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                {filteredProducts.map((product) => {
                  const productTitle = locale === "ar" ? product.titleAr : product.titleFr;
                  const productDesc =
                    locale === "ar" ? product.shortDescAr : product.shortDescFr;

                  return (
                    <div
                      key={product.id}
                      className="group relative flex flex-col rounded-2xl border border-slate-200 bg-white shadow-sm hover:shadow-xl transition-all duration-300 hover:border-[#073022] overflow-hidden"
                    >
                      {/* Image */}
                      <Link
                        href={`/boutique/produit/${product.slug}`}
                        className="relative aspect-square bg-slate-100 overflow-hidden"
                      >
                        {product.images[0] ? (
                          <img
                            src={product.images[0]}
                            alt={productTitle}
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center text-slate-400">
                            <ImageIcon className="w-16 h-16" />
                          </div>
                        )}

                        {/* Badges */}
                        <div className="absolute top-2 right-2 flex flex-col gap-1">
                          {product.isFeatured && (
                            <span className="flex items-center gap-1 rounded-full bg-amber-500/95 px-2 py-1 text-[10px] font-bold text-white shadow">
                              <StarIcon className="w-3 h-3" />
                              {locale === "ar" ? "مميز" : "Vedette"}
                            </span>
                          )}
                          <span
                            className={`rounded-full px-2 py-1 text-[10px] font-bold border shadow-sm ${getStockBadgeClass(
                              product.stockStatus
                            )}`}
                          >
                            {getStockLabel(product.stockStatus)}
                          </span>
                        </div>
                      </Link>

                      {/* Content */}
                      <div className="flex-1 flex flex-col justify-between p-4">
                        <div>
                          <Link href={`/boutique/produit/${product.slug}`}>
                            <h3 className="font-bold text-slate-900 line-clamp-2 mb-2 group-hover:text-[#073022] transition-colors">
                              {productTitle}
                            </h3>
                          </Link>

                          {productDesc && (
                            <p className="text-xs text-slate-600 line-clamp-2 mb-3">
                              {productDesc}
                            </p>
                          )}

                          {/* Certifications - Enhanced Display */}
                          {product.certifications.length > 0 && (
                            <div className="flex flex-wrap gap-1 mb-3">
                              {product.certifications.slice(0, 3).map((cert, idx) => (
                                <span
                                  key={idx}
                                  className="inline-flex items-center gap-1 rounded-full bg-emerald-50 border border-emerald-200 px-2 py-0.5 text-[10px] font-bold text-emerald-700"
                                >
                                  <SafetyShieldIcon className="w-3 h-3" />
                                  {cert}
                                </span>
                              ))}
                              {product.certifications.length > 3 && (
                                <span className="inline-flex items-center rounded-full bg-slate-100 px-2 py-0.5 text-[10px] font-semibold text-slate-600">
                                  +{product.certifications.length - 3}
                                </span>
                              )}
                            </div>
                          )}
                        </div>

                        {/* Price & Actions */}
                        <div className="mt-auto">
                          <div className="mb-3 pb-3 border-b border-slate-100">
                            {product.price ? (
                              <p className="text-lg font-bold text-[#073022]">
                                {product.price.toLocaleString()} <span className="text-sm">MAD</span>
                              </p>
                            ) : (
                              <p className="text-sm font-semibold text-slate-600">
                                {locale === "ar" ? "السعر عند الطلب" : "Prix sur devis"}
                              </p>
                            )}
                          </div>

                          {/* Quick Quote Button */}
                          <div className="flex gap-2">
                            <Link
                              href={`/boutique/produit/${product.slug}`}
                              className="flex-1 rounded-full bg-[#073022] py-2 text-center text-xs font-bold text-white hover:bg-[#0a4030] transition-colors"
                            >
                              {locale === "ar" ? "التفاصيل" : "Détails"}
                            </Link>
                            <a
                              href={`https://wa.me/212600000000?text=${encodeURIComponent(
                                `Bonjour HSE BRIDGE, je suis intéressé par : ${product.titleFr}${product.price ? ` (${product.price} MAD)` : ''}`
                              )}`}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="flex items-center justify-center rounded-full border-2 border-[#25D366] bg-[#25D366] px-3 py-2 hover:bg-[#20BA5A] transition-colors"
                              title={locale === "ar" ? "استفسار سريع عبر واتساب" : "Devis rapide WhatsApp"}
                            >
                              <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 24 24">
                                <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
                              </svg>
                            </a>
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </section>

        {/* CTA Section */}
        <section className="bg-slate-50 border-t border-slate-200 py-12 px-6">
          <div className="mx-auto max-w-4xl text-center">
            <h2 className="text-2xl font-extrabold text-[#0A0A0A] uppercase mb-4">
              {locale === "ar"
                ? "هل تحتاج إلى مساعدة في اختيار المنتج؟"
                : "Besoin d'aide pour choisir ?"}
            </h2>
            <p className="text-sm text-slate-600 mb-6 max-w-2xl mx-auto">
              {locale === "ar"
                ? "فريقنا من خبراء السلامة متاح لمساعدتك في اختيار المعدات المناسبة لاحتياجاتك"
                : "Notre équipe d'experts en sécurité est disponible pour vous conseiller sur les équipements adaptés à vos besoins"}
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link
                href="/boutique#quote-form"
                className="rounded-full bg-[#073022] px-8 py-3.5 text-sm font-bold text-white hover:bg-[#0a4030] transition-all shadow-md"
              >
                {t.common.requestQuote}
              </Link>
              <WhatsAppButton
                text={locale === "ar" ? "اتصل بنا عبر واتساب" : "Contactez-nous"}
                message={`Bonjour HSE BRIDGE, je souhaite des informations sur la catégorie ${title}.`}
              />
            </div>
          </div>
        </section>
      </main>

      <WhatsAppButton
        variant="floating"
        message={`Bonjour HSE BRIDGE, je consulte la catégorie ${title}.`}
      />
      <PublicFooter />
    </div>
  );
}
