"use client";

import React, { createContext, useContext, useState, useEffect } from "react";
import { Locale, defaultLocale, localeDirections, Translations } from "./types";
import { fr } from "./locales/fr";
import { ar } from "./locales/ar";

const dictionaries: Record<Locale, Translations> = {
  fr,
  ar,
};

interface I18nContextType {
  locale: Locale;
  t: Translations;
  dir: "ltr" | "rtl";
  setLocale: (locale: Locale) => void;
  isRtl: boolean;
}

const I18nContext = createContext<I18nContextType | undefined>(undefined);

export function I18nProvider({ children }: { children: React.ReactNode }) {
  const [locale, setLocaleState] = useState<Locale>(defaultLocale);

  useEffect(() => {
    try {
      const getCookie = (name: string) => {
        const match = document.cookie.match(new RegExp('(^| )' + name + '=([^;]+)'));
        return match ? match[2] : null;
      };
      const cookieLocale = getCookie("hse_locale") as Locale;
      const savedLocale = (cookieLocale || localStorage.getItem("hse_locale")) as Locale;
      if (savedLocale && (savedLocale === "fr" || savedLocale === "ar")) {
        setLocaleState(savedLocale);
        document.documentElement.lang = savedLocale;
        document.documentElement.dir = localeDirections[savedLocale];
      }
    } catch (e) {
      console.error("Failed to read locale from localStorage/cookie", e);
    }
  }, []);

  const setLocale = (newLocale: Locale) => {
    setLocaleState(newLocale);
    try {
      localStorage.setItem("hse_locale", newLocale);
      document.cookie = `hse_locale=${newLocale};path=/;max-age=31536000;SameSite=Lax`;
      document.documentElement.lang = newLocale;
      document.documentElement.dir = localeDirections[newLocale];
    } catch (e) {
      console.error("Failed to save locale to localStorage/cookie", e);
    }
  };

  const dir = localeDirections[locale];
  const isRtl = dir === "rtl";
  const t = dictionaries[locale] || dictionaries.fr;

  return (
    <I18nContext.Provider value={{ locale, t, dir, setLocale, isRtl }}>
      <div dir={dir} className={isRtl ? "rtl" : "ltr"}>
        {children}
      </div>
    </I18nContext.Provider>
  );
}

export function useI18n() {
  const context = useContext(I18nContext);
  if (!context) {
    // Fallback for SSR or outside provider
    return {
      locale: defaultLocale,
      t: fr,
      dir: "ltr" as const,
      setLocale: () => {},
      isRtl: false,
    };
  }
  return context;
}
