"use client";

import { useState, useRef, useEffect } from "react";
import { useRouter } from "next/navigation";
import { LanguageSwitcher } from "@/components/brand/LanguageSwitcher";
import { useI18n } from "@/lib/i18n/I18nContext";

interface AdminTopBarProps {
  userName?: string;
  userEmail?: string;
}

export function AdminTopBar({ userName, userEmail }: AdminTopBarProps) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);
  const router = useRouter();
  const { t, isRtl } = useI18n();

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsMenuOpen(false);
      }
    }

    if (isMenuOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isMenuOpen]);

  async function handleLogout() {
    try {
      await fetch("/api/auth/logout", { method: "POST" });
      router.push("/login");
    } catch (error) {
      console.error("Logout error:", error);
    }
  }

  return (
    <header className="sticky top-0 z-30 h-16 border-b border-slate-800 bg-slate-900/95 backdrop-blur-sm">
      <div className="flex h-full items-center justify-between px-6 pl-16 lg:pl-6 ltr:pl-16 rtl:pr-16 lg:ltr:pl-6 lg:rtl:pr-6">
        {/* Search */}
        <div className="flex-1 max-w-md lg:max-w-xl">
          <div className="relative">
            <svg
              className={`absolute top-1/2 h-5 w-5 -translate-y-1/2 text-slate-400 ${isRtl ? 'right-3' : 'left-3'}`}
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
              />
            </svg>
            <input
              type="search"
              placeholder={t.admin.searchPlaceholder}
              className="w-full rounded-lg border border-slate-700 bg-slate-950 py-2 text-sm text-white placeholder-slate-400 focus:border-[#FDCD1A] focus:outline-none focus:ring-1 focus:ring-[#FDCD1A] ps-10 pe-4"
            />
          </div>
        </div>

        {/* Right actions */}
        <div className="flex items-center gap-4">
          <LanguageSwitcher />

          {/* User menu */}
          <div className="relative" ref={menuRef}>
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="flex items-center gap-3 rounded-lg px-3 py-2 transition-colors hover:bg-slate-800 cursor-pointer"
              aria-label="User menu"
              aria-expanded={isMenuOpen}
            >
              <div className="flex h-8 w-8 items-center justify-center rounded-full bg-[#FDCD1A] text-sm font-bold text-[#0A0A0A]">
                {userName?.charAt(0).toUpperCase() || "A"}
              </div>
              <div className="hidden text-start md:block">
                <p className="text-sm font-medium text-white">{userName || "Admin"}</p>
                <p className="text-xs text-slate-400">{userEmail || ""}</p>
              </div>
              <svg
                className={`h-5 w-5 text-slate-400 transition-transform ${isMenuOpen ? "rotate-180" : ""}`}
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </button>

              {/* Dropdown menu */}
              {isMenuOpen && (
                <div className={`absolute ${isRtl ? 'left-0' : 'right-0'} mt-2 w-56 rounded-lg border border-slate-700 bg-slate-900 py-2 shadow-xl`}>
                  <div className="border-b border-slate-800 px-4 py-3 text-start">
                    <p className="text-sm font-medium text-white">{userName || "Admin"}</p>
                    <p className="text-xs text-slate-400">{userEmail || ""}</p>
                  </div>
                  <button
                    onClick={handleLogout}
                    className="flex w-full items-center gap-3 px-4 py-2 text-sm text-slate-300 transition-colors hover:bg-slate-800 hover:text-white cursor-pointer"
                  >
                    <svg className={`h-5 w-5 ${isRtl ? 'rotate-180' : ''}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"
                      />
                    </svg>
                    {t.common.logout}
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </header>
    );
  }

