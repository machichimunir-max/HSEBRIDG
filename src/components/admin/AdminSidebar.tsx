"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { Logo } from "@/components/brand/Logo";
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

interface SubNavItem {
  href: string;
  label: string;
}

interface NavItem {
  href?: string;
  label: string;
  icon: React.ReactNode;
  subItems?: SubNavItem[];
}

const navItems: NavItem[] = [
  { href: "/admin", label: "Dashboard", icon: <DashboardIcon className="w-5 h-5" /> },
  {
    label: "Formation HSE",
    icon: <FormationIcon className="w-5 h-5" />,
    subItems: [
      { href: "/admin/courses", label: "Formations" },
      { href: "/admin/students", label: "Étudiants" },
      { href: "/admin/enrollments", label: "Inscriptions" },
    ],
  },
  {
    label: "Boutique EPI/EPC",
    icon: <BoutiqueIcon className="w-5 h-5" />,
    subItems: [
      { href: "/admin/boutique/categories", label: "Catégories" },
      { href: "/admin/boutique/products", label: "Produits" },
      { href: "/admin/boutique/quotes", label: "Demandes de devis" },
    ],
  },
  {
    label: "Recrutement HSE",
    icon: <RecrutementIcon className="w-5 h-5" />,
    subItems: [
      { href: "/admin/recrutement/jobs", label: "Offres d'emploi" },
      { href: "/admin/recrutement/applications", label: "Candidatures" },
      { href: "/admin/recrutement/candidates", label: "Base candidats" },
      { href: "/admin/recrutement/employer-requests", label: "Demandes entreprises" },
    ],
  },
  { href: "/admin/users", label: "Utilisateurs", icon: <UsersIcon className="w-5 h-5" /> },
  { href: "/admin/settings", label: "Paramètres", icon: <SettingsIcon className="w-5 h-5" /> },
];

export function AdminSidebar() {
  const pathname = usePathname();
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

  return (
    <>
      {/* Mobile overlay */}
      {!isCollapsed && (
        <div
          className="fixed inset-0 z-40 bg-slate-950/80 lg:hidden"
          onClick={() => setIsCollapsed(true)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`fixed left-0 top-0 z-50 h-screen w-64 border-r border-slate-800 bg-slate-900 transition-transform duration-300 lg:translate-x-0 ${
          isCollapsed ? "-translate-x-full" : "translate-x-0"
        }`}
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
                        ? "bg-[#073022] text-[#FDCD1A] font-semibold border-l-4 border-[#FDCD1A]"
                        : "text-slate-300 hover:bg-slate-800 hover:text-white"
                    }`}
                  >
                    <span className={isActive ? "text-[#FDCD1A]" : "text-slate-400"}>{item.icon}</span>
                    <span>{item.label}</span>
                  </Link>
                );
              }

              // Section with submenu
              const isExpanded = expandedSections.includes(item.label);
              const hasActiveChild = item.subItems?.some((sub) => pathname.startsWith(sub.href));

              return (
                <div key={item.label}>
                  <button
                    onClick={() => toggleSection(item.label)}
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
                      <ChevronRightIcon className="w-4 h-4 text-slate-500" />
                    )}
                  </button>

                  {/* Submenu */}
                  {isExpanded && item.subItems && (
                    <div className="ml-4 mt-1 space-y-1 border-l border-slate-700 pl-4">
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
          <div className="border-t border-slate-800 p-4">
            <p className="text-xs text-slate-500">HSE BRIDGE Admin v2.0</p>
            <p className="text-[10px] text-slate-600 mt-0.5">Multi-pilier Management</p>
          </div>
        </div>
      </aside>

      {/* Mobile menu button */}
      <button
        onClick={() => setIsCollapsed(false)}
        className="fixed left-4 top-4 z-30 rounded-lg bg-slate-900 p-2 text-slate-400 hover:text-white lg:hidden"
        aria-label="Open sidebar"
      >
        <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
        </svg>
      </button>
    </>
  );
}
