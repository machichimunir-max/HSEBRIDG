"use client";

import Link from "next/link";
import { Logo } from "@/components/brand/Logo";
import { LanguageSwitcher } from "@/components/brand/LanguageSwitcher";
import { useI18n } from "@/lib/i18n/I18nContext";

export default function RegisterPage() {
  const { t } = useI18n();

  return (
    <main className="flex min-h-screen items-center justify-center bg-[#041a14] px-6 py-10 relative">
      <div className="absolute top-6 right-6">
        <LanguageSwitcher />
      </div>

      <div className="w-full max-w-md rounded-3xl border border-[#073022] bg-[#073022]/90 p-8 shadow-2xl backdrop-blur-md">
        <div className="mb-8 text-center flex flex-col items-center">
          <Link href="/" className="mb-6 inline-block">
            <Logo variant="dark" width={180} height={55} priority />
          </Link>
          <h1 className="text-2xl font-bold text-white">{t.common.register}</h1>
          <p className="mt-2 text-xs text-slate-300">
            {t.common.slogan2}
          </p>
        </div>

        <form className="space-y-4" action="/api/auth/register" method="POST">
          <div>
            <label htmlFor="name" className="mb-1.5 block text-sm font-medium text-slate-200">
              Nom complet
            </label>
            <input
              id="name"
              type="text"
              name="name"
              className="w-full rounded-xl border border-slate-700 bg-[#041a14] px-3.5 py-2.5 text-white outline-none placeholder:text-slate-500 focus:border-[#FDCD1A] focus:ring-1 focus:ring-[#FDCD1A]"
              placeholder="Votre nom complet"
            />
          </div>

          <div>
            <label htmlFor="email" className="mb-1.5 block text-sm font-medium text-slate-200">
              Email
            </label>
            <input
              id="email"
              type="email"
              name="email"
              className="w-full rounded-xl border border-slate-700 bg-[#041a14] px-3.5 py-2.5 text-white outline-none placeholder:text-slate-500 focus:border-[#FDCD1A] focus:ring-1 focus:ring-[#FDCD1A]"
              placeholder="vous@exemple.com"
              required
            />
          </div>

          <div>
            <label htmlFor="password" className="mb-1.5 block text-sm font-medium text-slate-200">
              Mot de passe
            </label>
            <input
              id="password"
              type="password"
              name="password"
              className="w-full rounded-xl border border-slate-700 bg-[#041a14] px-3.5 py-2.5 text-white outline-none placeholder:text-slate-500 focus:border-[#FDCD1A] focus:ring-1 focus:ring-[#FDCD1A]"
              placeholder="Au moins 8 caractères"
              required
            />
          </div>

          <div>
            <label htmlFor="confirmPassword" className="mb-1.5 block text-sm font-medium text-slate-200">
              Confirmer le mot de passe
            </label>
            <input
              id="confirmPassword"
              type="password"
              name="confirmPassword"
              className="w-full rounded-xl border border-slate-700 bg-[#041a14] px-3.5 py-2.5 text-white outline-none placeholder:text-slate-500 focus:border-[#FDCD1A] focus:ring-1 focus:ring-[#FDCD1A]"
              placeholder="Répétez le mot de passe"
              required
            />
          </div>

          <button
            type="submit"
            className="w-full rounded-xl bg-[#FDCD1A] px-4 py-3 font-bold text-[#0A0A0A] transition hover:bg-[#e5b917] cursor-pointer shadow-md mt-2"
          >
            {t.common.register}
          </button>
        </form>

        <div className="mt-6 border-t border-slate-700/80 pt-6 text-center">
          <p className="text-xs text-slate-300">
            Vous avez déjà un compte ?{" "}
            <Link href="/login" className="font-bold text-[#FDCD1A] hover:underline">
              {t.common.login}
            </Link>
          </p>
        </div>
      </div>
    </main>
  );
}
