"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useI18n } from "@/lib/i18n/I18nContext";
import { Logo } from "@/components/brand/Logo";
import { LanguageSwitcher } from "@/components/brand/LanguageSwitcher";
import { useState, useEffect } from "react";
import { useSettings } from "@/components/public/SettingsProvider";

export function PublicHeader() {
  const { t, isRtl } = useI18n();
  const { settings } = useSettings();
  const pathname = usePathname();
  const router = useRouter();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [currentUser, setCurrentUser] = useState<{ email: string; role: string } | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function checkAuth() {
      try {
        const response = await fetch("/api/auth/me");
        if (response.ok) {
          const data = await response.json();
          setCurrentUser(data.user);
        }
      } catch (err) {
        // Not logged in
      } finally {
        setLoading(false);
      }
    }
    checkAuth();
  }, []);

  const handleLogout = async () => {
    try {
      await fetch("/api/auth/logout", { method: "POST" });
      setCurrentUser(null);
      router.push("/");
      router.refresh();
    } catch (err) {
      console.error("Logout failed:", err);
    }
  };

  const navLinks = [
    { href: "/formations", label: t.navigation.formations },
    { href: "/boutique", label: t.navigation.boutique },
    { href: "/recrutement", label: t.navigation.recrutement },
    { href: "/a-propos", label: t.navigation.about },
    { href: "/contact", label: t.navigation.contact },
  ];

  return (
    <>
      {/* Top Brand Bar */}
      <div className="bg-[#073022] px-4 py-2 text-center text-xs font-semibold uppercase tracking-wider text-[#FDCD1A]">
        {t.common.slogan1} • {t.common.slogan3}
      </div>

      {/* Main Header */}
      <header className="sticky top-0 z-50 border-b border-slate-200 bg-white/95 backdrop-blur-md shadow-xs">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-4 sm:px-6 py-3.5">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2">
            <Logo variant="light" width={160} height={50} priority />
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center gap-6 text-sm font-bold text-[#0A0A0A]">
            {navLinks.map((link) => {
              const isActive = pathname === link.href;
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`transition-colors py-2 border-b-2 ${
                    isActive
                      ? "text-[#073022] border-[#FDCD1A]"
                      : "text-slate-700 border-transparent hover:text-[#073022] hover:border-[#073022]/30"
                  }`}
                >
                  {link.label}
                </Link>
              );
            })}
          </nav>

          {/* Right Actions */}
          <div className="flex items-center gap-3 sm:gap-4">
            <LanguageSwitcher />

            {!loading && !currentUser && (
              <>
                <Link
                  href="/login"
                  className="hidden sm:inline-flex rounded-full border-2 border-[#073022] px-4 py-1.5 text-xs sm:text-sm font-bold text-[#073022] hover:bg-[#073022] hover:text-white transition-colors"
                >
                  {t.common.login}
                </Link>

                <Link
                  href="/register"
                  className="rounded-full bg-[#FDCD1A] px-4 sm:px-5 py-1.5 sm:py-2 text-xs sm:text-sm font-bold text-[#0A0A0A] shadow-md hover:bg-[#e5b917] transition-all transform hover:-translate-y-0.5"
                >
                  {t.common.register}
                </Link>
              </>
            )}

            {!loading && currentUser && (
              <div className="relative group">
                <button className="flex items-center gap-2 rounded-full border-2 border-[#073022] px-4 py-1.5 text-xs sm:text-sm font-bold text-[#073022] hover:bg-[#073022] hover:text-white transition-colors">
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                  </svg>
                  <span className="hidden sm:inline">{currentUser.email.split('@')[0]}</span>
                </button>
                <div className="absolute right-0 mt-2 w-48 rounded-lg border border-slate-200 bg-white shadow-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all">
                  <Link
                    href={currentUser.role === "ADMIN" ? "/admin" : "/student/dashboard"}
                    className="block px-4 py-2 text-sm text-slate-700 hover:bg-slate-100 rounded-t-lg"
                  >
                    {currentUser.role === "ADMIN" ? t.navigation.admin : t.navigation.student}
                  </Link>
                  <button
                    onClick={handleLogout}
                    className="w-full text-left px-4 py-2 text-sm text-rose-600 hover:bg-slate-100 rounded-b-lg"
                  >
                    {t.common.logout}
                  </button>
                </div>
              </div>
            )}

            {/* Mobile Menu Toggle Button */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 text-slate-700 hover:text-[#073022] lg:hidden cursor-pointer"
              aria-label="Toggle navigation menu"
            >
              {mobileMenuOpen ? (
                <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              ) : (
                <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                </svg>
              )}
            </button>
          </div>
        </div>

        {/* Mobile Navigation Dropdown */}
        {mobileMenuOpen && (
          <div className="border-t border-slate-200 bg-white px-6 py-4 shadow-lg lg:hidden animate-in fade-in duration-200">
            <nav className="flex flex-col space-y-3">
              {navLinks.map((link) => {
                const isActive = pathname === link.href;
                return (
                  <Link
                    key={link.href}
                    href={link.href}
                    onClick={() => setMobileMenuOpen(false)}
                    className={`rounded-lg px-3 py-2 text-sm font-bold transition-colors ${
                      isActive
                        ? "bg-[#073022] text-[#FDCD1A]"
                        : "text-slate-800 hover:bg-slate-100"
                    }`}
                  >
                    {link.label}
                  </Link>
                );
              })}
              <div className="border-t border-slate-100 pt-3 flex flex-col gap-2">
                {!loading && !currentUser && (
                  <>
                    <Link
                      href="/login"
                      onClick={() => setMobileMenuOpen(false)}
                      className="rounded-full border border-[#073022] px-4 py-2 text-center text-sm font-bold text-[#073022]"
                    >
                      {t.common.login}
                    </Link>
                    <Link
                      href="/register"
                      onClick={() => setMobileMenuOpen(false)}
                      className="rounded-full bg-[#FDCD1A] px-4 py-2 text-center text-sm font-bold text-[#0A0A0A]"
                    >
                      {t.common.register}
                    </Link>
                  </>
                )}
                {!loading && currentUser && (
                  <>
                    <Link
                      href={currentUser.role === "ADMIN" ? "/admin" : "/student/dashboard"}
                      onClick={() => setMobileMenuOpen(false)}
                      className="rounded-full border border-[#073022] px-4 py-2 text-center text-sm font-bold text-[#073022]"
                    >
                      {currentUser.role === "ADMIN" ? t.navigation.admin : t.common.dashboard}
                    </Link>
                    <button
                      onClick={() => {
                        handleLogout();
                        setMobileMenuOpen(false);
                      }}
                      className="rounded-full bg-rose-600 px-4 py-2 text-center text-sm font-bold text-white"
                    >
                      {t.common.logout}
                    </button>
                  </>
                )}
              </div>
            </nav>
          </div>
        )}
      </header>
    </>
  );
}
