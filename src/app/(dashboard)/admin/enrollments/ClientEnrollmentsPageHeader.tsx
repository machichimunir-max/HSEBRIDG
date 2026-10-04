"use client";

import { useI18n } from "@/lib/i18n/I18nContext";

export function ClientEnrollmentsPageHeader() {
  const { t } = useI18n();

  return (
    <div className="mb-6 flex items-center justify-between">
      <div>
        <h1 className="text-3xl font-bold text-white">{t.admin.enrollmentsTitle}</h1>
        <p className="mt-1 text-sm text-slate-400">
          {t.admin.enrollmentsTitle}
        </p>
      </div>
    </div>
  );
}
