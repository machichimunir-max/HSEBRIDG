"use client";

import Link from "next/link";
import { Logo } from "@/components/brand/Logo";
import { LanguageSwitcher } from "@/components/brand/LanguageSwitcher";
import { useI18n } from "@/lib/i18n/I18nContext";

export default function LoginPage() {
  const { t } = useI18n();

  return (
    <main className="flex min-h-screen items-center justify-center bg-[#041a14] px-6 py-10 relative">
      <div className="absolute top-6 end-6">
        <LanguageSwitcher />
      </div>

      <div className="w-full max-w-md rounded-3xl border border-[#073022] bg-[#073022]/90 p-8 shadow-2xl backdrop-blur-md">
        <div className="mb-8 text-center flex flex-col items-center">
          <Link href="/" className="mb-6 inline-block">
            <Logo variant="dark" width={180} height={55} priority />
          </Link>
          <h1 className="text-2xl font-bold text-white">{t.common.login}</h1>
          <p className="mt-2 text-xs text-slate-300">
            {t.common.slogan3}
          </p>
        </div>

        <form className="space-y-5" action="/api/auth/login" method="POST">
          <div>
            <label htmlFor="email" className="mb-2 block text-sm font-medium text-slate-200">
              {t.auth.emailLabel}
            </label>
            <input
              id="email"
              type="email"
              name="email"
              className="w-full rounded-xl border border-slate-700 bg-[#041a14] px-3.5 py-2.5 text-white outline-none placeholder:text-slate-500 focus:border-[#FDCD1A] focus:ring-1 focus:ring-[#FDCD1A]"
              placeholder={t.auth.emailPlaceholder}
              required
            />
          </div>

          <div>
            <label htmlFor="password" className="mb-2 block text-sm font-medium text-slate-200">
              {t.auth.passwordLabel}
            </label>
            <input
              id="password"
              type="password"
              name="password"
              className="w-full rounded-xl border border-slate-700 bg-[#041a14] px-3.5 py-2.5 text-white outline-none placeholder:text-slate-500 focus:border-[#FDCD1A] focus:ring-1 focus:ring-[#FDCD1A]"
              placeholder={t.auth.passwordPlaceholder}
              required
            />
          </div>

          <button
            type="submit"
            className="w-full rounded-xl bg-[#FDCD1A] px-4 py-3 font-bold text-[#0A0A0A] transition hover:bg-[#e5b917] cursor-pointer shadow-md"
          >
            {t.common.login}
          </button>
        </form>

        <div className="mt-6 border-t border-slate-700/80 pt-6 text-center">
          <p className="text-xs text-slate-300">
            {t.auth.noAccount}{" "}
            <Link href="/register" className="font-bold text-[#FDCD1A] hover:underline">
              {t.common.register}
            </Link>
          </p>
        </div>
      </div>
    </main>
  );
}
