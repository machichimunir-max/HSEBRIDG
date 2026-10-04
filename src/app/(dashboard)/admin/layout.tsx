import { ReactNode } from "react";
import { redirect } from "next/navigation";
import { getCurrentUser } from "@/lib/session";
import { AdminSidebar } from "@/components/admin/AdminSidebar";
import { AdminTopBar } from "@/components/admin/AdminTopBar";

export default async function AdminLayout({ children }: { children: ReactNode }) {
  const user = await getCurrentUser();

  if (!user || user.role !== "ADMIN") {
    redirect("/login");
  }

  return (
    <div className="min-h-screen bg-slate-950">
      <AdminSidebar />

      <div className="lg:pl-64">
        <AdminTopBar userName={undefined} userEmail={user.email} />

        <main className="p-6">
          {children}
        </main>
      </div>
    </div>
  );
}
