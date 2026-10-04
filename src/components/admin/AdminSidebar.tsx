"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { Logo } from "@/components/brand/Logo";
import { useI18n } from "@/lib/i18n/I18nContext";
import {
  DashboardIcon,
  FormationIcon,
  BoutiqueIcon,
  RecrutementIcon,
  StudentsIcon,
  EnrollmentsIcon,
  UsersIcon,
  SettingsIcon,
  ChevronDownIcon,
  ChevronRightIcon
} from "@/components/icons/HseIcons";

export function AdminSidebar() {
  const pathname = usePathname();
  const { t, isRtl } = useI18n();
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [expandedSections, setExpandedSections] = useState<string[]>([
    "Formation HSE",
    "Boutique EPI/EPC",
    "Recrutement HSE"
  ]);

  const toggleSection = (label: string) => {
    setExpandedSections((prev) =>
      prev.includes(label) ? prev.filter((item) => item !== label) : [...prev, label]
    );
  };

  const navItems = [
    { href: "/admin", label: t.admin.sidebarDashboard, keyLabel: "Dashboard", icon: <DashboardIcon className="w-5 h-5" /> },
    {
      label: t.navigation.formations,
      keyLabel: "Formation HSE",
      icon: <FormationIcon className="w-5 h-5" />,
      subItems: [
        { href: "/admin/courses", label: t.admin.sidebarCourses },
        { href: "/admin/students", label: t.admin.sidebarStudents },
        { href: "/admin/enrollments", label: t.admin.sidebarEnrollments },
      ],
    },
    {
      label: t.navigation.boutique,
      keyLabel: "Boutique EPI/EPC",
      icon: <BoutiqueIcon className="w-5 h-5" />,
      subItems: [
        { href: "/admin/boutique/categories", label: t.admin.sidebarCategories },
        { href: "/admin/boutique/products", label: t.admin.sidebarProducts },
        { href: "/admin/boutique/quotes", label: t.admin.sidebarQuotes },
      ],
    },
    {
      label: t.navigation.recrutement,
      keyLabel: "Recrutement HSE",
      icon: <RecrutementIcon className="w-5 h-5" />,
      subItems: [
        { href: "/admin/recrutement/jobs", label: t.admin.sidebarJobs },
        { href: "/admin/recrutement/applications", label: t.admin.sidebarApplications },
        { href: "/admin/recrutement/candidates", label: t.admin.sidebarCandidates },
        { href: "/admin/recrutement/employer-requests", label: t.admin.sidebarEmployerRequests },
      ],
    },
    { href: "/admin/users", label: t.admin.sidebarUsers, keyLabel: "Utilisateurs", icon: <UsersIcon className="w-5 h-5" /> },
    { href: "/admin/settings", label: t.admin.sidebarSettings, keyLabel: "Paramètres", icon: <SettingsIcon className="w-5 h-5" /> },
  ];

  return (
    <>
      {/* Mobile overlay */}
      {!isCollapsed && (
        <div
          className="fixed inset-0 z-40 bg-slate-950/80 lg:hidden"
          onClick={() => setIsCollapsed(true)}
        />
      )}

      {/* Sidebar - Logical properties for RTL support */}
      <aside
        className={`fixed top-0 bottom-0 z-50 w-64 border-slate-800 bg-slate-900 transition-transform duration-300 ${
          isRtl ? "border-l right-0 translate-x-full lg:translate-x-0" : "border-r left-0 -translate-x-full lg:translate-x-0"
        } ${!isCollapsed ? (isRtl ? "!translate-x-0" : "!translate-x-0") : ""}`}
        dir={isRtl ? "rtl" : "ltr"}
      >
        <div className="flex h-full flex-col">
          {/* Logo */}
          <div className="flex h-16 items-center justify-between border-b border-slate-800 px-6">
            <Link href="/admin" className="flex items-center gap-2">
              <Logo variant="dark" width={140} height={45} priority />
            </Link>
            <button
              onClick={() => setIsCollapsed(true)}
              className="lg:hidden text-slate-400 hover:text-white"
              aria-label="Close sidebar"
            >
              <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          {/* Navigation */}
          <nav className="flex-1 space-y-1 px-3 py-4 overflow-y-auto">
            {navItems.map((item) => {
              // Simple link (no submenu)
              if (item.href) {
                const isActive = pathname === item.href;
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={`flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-colors ${
                      isActive
                        ? `bg-[#073022] text-[#FDCD1A] font-semibold border-[#FDCD1A] ${isRtl ? 'border-r-4' : 'border-l-4'}`
                        : "text-slate-300 hover:bg-slate-800 hover:text-white"
                    }`}
                  >
                    <span className={isActive ? "text-[#FDCD1A]" : "text-slate-400"}>{item.icon}</span>
                    <span>{item.label}</span>
                  </Link>
                );
              }

              // Section with submenu
              const isExpanded = expandedSections.includes(item.keyLabel);
              const hasActiveChild = item.subItems?.some((sub) => pathname.startsWith(sub.href));

              return (
                <div key={item.keyLabel}>
                  <button
                    onClick={() => toggleSection(item.keyLabel)}
                    className={`flex w-full items-center justify-between gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-colors ${
                      hasActiveChild
                        ? "bg-slate-800 text-[#FDCD1A]"
                        : "text-slate-300 hover:bg-slate-800 hover:text-white"
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <span className={hasActiveChild ? "text-[#FDCD1A]" : "text-slate-400"}>{item.icon}</span>
                      <span>{item.label}</span>
                    </div>
                    {isExpanded ? (
                      <ChevronDownIcon className="w-4 h-4 text-slate-500" />
                    ) : (
                      <ChevronRightIcon className={`w-4 h-4 text-slate-500 ${isRtl ? 'rotate-180' : ''}`} />
                    )}
                  </button>

                  {/* Submenu */}
                  {isExpanded && item.subItems && (
                    <div className={`mt-1 space-y-1 border-slate-700 ${isRtl ? 'mr-4 pr-4 border-r' : 'ml-4 pl-4 border-l'}`}>
                      {item.subItems.map((subItem) => {
                        const isActive = pathname === subItem.href || pathname.startsWith(`${subItem.href}/`);
                        return (
                          <Link
                            key={subItem.href}
                            href={subItem.href}
                            className={`block rounded-lg px-3 py-2 text-xs font-medium transition-colors ${
                              isActive
                                ? "bg-[#073022] text-[#FDCD1A] font-semibold"
                                : "text-slate-400 hover:bg-slate-800 hover:text-slate-200"
                            }`}
                          >
                            {subItem.label}
                          </Link>
                        );
                      })}
                    </div>
                  )}
                </div>
              );
            })}
          </nav>

          {/* Footer */}
          <div className="border-t border-slate-800 p-4" dir="ltr">
            <p className="text-xs text-slate-500 text-center">HSE BRIDGE Admin v2.0</p>
            <p className="text-[10px] text-slate-600 mt-0.5 text-center">Multi-pilier Management</p>
          </div>
        </div>
      </aside>

      {/* Mobile menu button */}
      <button
        onClick={() => setIsCollapsed(false)}
        className={`fixed top-4 z-30 rounded-lg bg-slate-900 p-2 text-slate-400 hover:text-white lg:hidden ${isRtl ? "right-4" : "left-4"}`}
        aria-label="Open sidebar"
      >
        <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
        </svg>
      </button>
    </>
  );
}
