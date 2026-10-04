"use client";

import { useI18n } from "@/lib/i18n/I18nContext";

export function ClientStudentsPageHeader() {
  const { t } = useI18n();

  return (
    <div className="mb-6">
      <h1 className="text-3xl font-bold text-white">{t.admin.studentsTitle}</h1>
      <p className="mt-1 text-sm text-slate-400">
        {t.admin.studentsTitle}
      </p>
    </div>
  );
}
