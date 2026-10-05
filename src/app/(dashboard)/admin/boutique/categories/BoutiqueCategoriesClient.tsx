"use client";

import { useState } from "react";
import { useI18n } from "@/lib/i18n/I18nContext";
import { BoutiqueIcon, SafetyShieldIcon } from "@/components/icons/HseIcons";

interface ProductCategory {
  id: string;
  slug: string;
  titleFr: string;
  titleAr: string;
  descriptionFr: string | null;
  descriptionAr: string | null;
  icon: string | null;
  order: number;
  isVisible: boolean;
  _count: {
    products: number;
  };
}

interface BoutiqueCategoriesClientProps {
  categories: ProductCategory[];
}

export function BoutiqueCategoriesClient({ categories }: BoutiqueCategoriesClientProps) {
  const { t, locale } = useI18n();
  const isRtl = locale === "ar";

  return (
    <div className="mx-auto max-w-7xl">
      <header className="mb-8">
        <div className="flex items-center justify-between gap-3 mb-2">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#FDCD1A] text-[#0A0A0A]">
              <BoutiqueIcon className="w-6 h-6" />
            </div>
            <div>
              <h1 className="text-3xl font-extrabold text-white uppercase">
                {isRtl ? "فئات EPI / EPC" : "Catégories EPI / EPC"}
              </h1>
              <p className="text-sm text-slate-400">
                {isRtl ? "إدارة الفئات العشر لمعدات الحماية" : "Gestion des 10 catégories d'équipements de protection"}
              </p>
            </div>
          </div>
        </div>
      </header>

      <div className="mb-6 rounded-2xl border border-slate-800 bg-slate-900/50 p-4 flex items-center gap-3">
        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-500/20 text-blue-400">
          <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        </div>
        <div>
          <p className="text-sm font-semibold text-white">
            {isRtl ? "الفئات مُعدّة مسبقًا" : "Catégories pré-configurées"}
          </p>
          <p className="text-xs text-slate-400">
            {isRtl
              ? "الفئات العشر محددة مسبقًا وفقًا لمعايير EPI/EPC. يمكن إضافة المنتجات لكل فئة."
              : "Les 10 catégories sont pré-définies selon les standards EPI/EPC. Vous pouvez ajouter des produits à chaque catégorie."}
          </p>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {categories.map((category, idx) => (
          <div
            key={category.id}
            className="rounded-2xl border border-slate-800 bg-slate-900/50 p-6 hover:border-slate-700 transition-all"
          >
            <div className="flex items-start justify-between gap-3 mb-4">
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[#073022] text-[#FDCD1A]">
                <SafetyShieldIcon className="w-6 h-6" />
              </div>
              <div className="flex flex-col items-end gap-1">
                <span className="text-xs font-bold text-slate-500 bg-slate-800 px-2 py-1 rounded-full">
                  #{category.order}
                </span>
                {category.isVisible ? (
                  <span className="text-xs font-bold text-emerald-400 bg-emerald-500/10 px-2 py-1 rounded-full">
                    {isRtl ? "مرئي" : "Visible"}
                  </span>
                ) : (
                  <span className="text-xs font-bold text-slate-500 bg-slate-800 px-2 py-1 rounded-full">
                    {isRtl ? "مخفي" : "Caché"}
                  </span>
                )}
              </div>
            </div>

            <h3 className="text-lg font-bold text-white mb-1">
              {isRtl ? category.titleAr : category.titleFr}
            </h3>

            <p className="text-sm text-slate-400 leading-relaxed mb-4">
              {isRtl ? category.descriptionAr : category.descriptionFr}
            </p>

            <div className="pt-4 border-t border-slate-800 flex items-center justify-between">
              <div className="text-xs text-slate-500">
                <span className="font-semibold text-slate-400">{category._count.products}</span> {isRtl ? "منتج" : "produit(s)"}
              </div>
              <a
                href={`/boutique#${category.slug}`}
                target="_blank"
                rel="noopener noreferrer"
                className="text-xs font-semibold text-[#FDCD1A] hover:text-[#e5b917] transition-colors"
              >
                {isRtl ? "عرض العام ←" : "Voir public →"}
              </a>
            </div>
          </div>
        ))}
      </div>

      <div className="mt-8 rounded-2xl border border-amber-500/30 bg-amber-500/5 p-6 text-center">
        <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-2xl bg-amber-500/20 text-amber-400 mb-3">
          <span className="text-2xl">📦</span>
        </div>
        <h3 className="text-lg font-bold text-white mb-2">
          {isRtl ? "جاهز لإضافة المنتجات" : "Prêt pour l'ajout de produits"}
        </h3>
        <p className="text-sm text-slate-400 max-w-2xl mx-auto leading-relaxed mb-4">
          {isRtl
            ? "الفئات جاهزة. يمكنك الآن إضافة المنتجات مع الصور والمواصفات والشهادات."
            : "Les catégories sont prêtes. Vous pouvez maintenant ajouter les produits avec images, spécifications et certifications."}
        </p>
        <a
          href="/admin/boutique/products"
          className="inline-flex rounded-full bg-[#FDCD1A] px-6 py-2.5 text-sm font-bold text-[#0A0A0A] hover:bg-[#e5b917] transition-colors"
        >
          {isRtl ? "إدارة المنتجات →" : "Gérer les Produits →"}
        </a>
      </div>
    </div>
  );
}
