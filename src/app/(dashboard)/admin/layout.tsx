"use client";

import { ReactNode } from "react";
import { redirect } from "next/navigation";
import { useEffect, useState } from "react";
import { AdminSidebar } from "@/components/admin/AdminSidebar";
import { AdminTopBar } from "@/components/admin/AdminTopBar";
import { useI18n } from "@/lib/i18n/I18nContext";

export default function AdminLayout({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<{ email: string; role: string } | null>(null);
  const [loading, setLoading] = useState(true);
  const { isRtl } = useI18n();

  useEffect(() => {
    async function checkAuth() {
      try {
        const res = await fetch("/api/auth/me");
        if (res.ok) {
          const data = await res.json();
          if (data.user && data.user.role === "ADMIN") {
            setUser({ email: data.user.email, role: data.user.role });
          } else {
            redirect("/login");
          }
        } else {
          redirect("/login");
        }
      } catch (err) {
        redirect("/login");
      } finally {
        setLoading(false);
      }
    }
    checkAuth();
  }, []);

  if (loading) {
    return <div className="min-h-screen bg-slate-950 flex items-center justify-center text-white">Loading...</div>;
  }

  if (!user) return null;

  return (
    <div className="min-h-screen bg-slate-950">
      <AdminSidebar />

      <div className={isRtl ? "lg:pr-64" : "lg:pl-64"}>
        <AdminTopBar userName={undefined} userEmail={user.email} />

        <main className="p-6">
          {children}
        </main>
      </div>
    </div>
  );
}
