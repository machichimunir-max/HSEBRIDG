"use client";

import { useI18n } from "@/lib/i18n/I18nContext";
import { Locale, localeNames } from "@/lib/i18n/types";
import { cn } from "@/lib/utils";

interface LanguageSwitcherProps {
  className?: string;
}

export function LanguageSwitcher({ className }: LanguageSwitcherProps) {
  const { locale, setLocale } = useI18n();

  return (
    <div className={cn("inline-flex items-center rounded-full border border-slate-700 bg-slate-900/80 p-1 text-xs", className)}>
      <button
        onClick={() => setLocale("fr")}
        className={cn(
          "rounded-full px-3 py-1 font-medium transition-colors cursor-pointer",
          locale === "fr"
            ? "bg-[#FDCD1A] text-[#0A0A0A] font-bold"
            : "text-slate-300 hover:text-white"
        )}
      >
        FR
      </button>
      <button
        onClick={() => setLocale("ar")}
        className={cn(
          "rounded-full px-3 py-1 font-medium transition-colors cursor-pointer",
          locale === "ar"
            ? "bg-[#FDCD1A] text-[#0A0A0A] font-bold"
            : "text-slate-300 hover:text-white"
        )}
      >
        عربي
      </button>
    </div>
  );
}
