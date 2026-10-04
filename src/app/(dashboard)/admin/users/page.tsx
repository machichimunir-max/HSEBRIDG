import Link from "next/link";
import { prisma } from "@/lib/db";
import { UsersIcon } from "@/components/icons/HseIcons";

async function getUsers() {
  const users = await prisma.user.findMany({
    orderBy: { createdAt: "desc" },
    take: 50,
    select: {
      id: true,
      name: true,
      email: true,
      role: true,
      createdAt: true,
    },
  });

  const userCounts = await prisma.user.groupBy({
    by: ["role"],
    _count: true,
  });

  return { users, userCounts };
}

export default async function UsersPage() {
  const { users, userCounts } = await getUsers();

  const roleStats = userCounts.reduce((acc, item) => {
    acc[item.role] = item._count;
    return acc;
  }, {} as Record<string, number>);

  return (
    <div className="mx-auto max-w-7xl">
      <header className="mb-8">
        <div className="flex items-center gap-3 mb-2">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#073022] text-[#FDCD1A]">
            <UsersIcon className="w-6 h-6" />
          </div>
          <h1 className="text-3xl font-extrabold text-white uppercase">Gestion Utilisateurs</h1>
        </div>
        <p className="text-sm text-slate-400">
          Gérer les comptes administrateurs, étudiants, et futurs candidats/employeurs
        </p>
      </header>

      {/* Role Stats */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4 mb-8">
        <div className="rounded-2xl border border-slate-800 bg-slate-900/50 p-6">
          <p className="text-sm font-semibold text-slate-400 uppercase">Administrateurs</p>
          <p className="mt-3 text-3xl font-extrabold text-white">{roleStats.ADMIN || 0}</p>
        </div>

        <div className="rounded-2xl border border-slate-800 bg-slate-900/50 p-6">
          <p className="text-sm font-semibold text-slate-400 uppercase">Étudiants</p>
          <p className="mt-3 text-3xl font-extrabold text-white">{roleStats.STUDENT || 0}</p>
        </div>

        <div className="rounded-2xl border border-slate-800 bg-slate-900/50 p-6">
          <p className="text-sm font-semibold text-slate-400 uppercase">Total Utilisateurs</p>
          <p className="mt-3 text-3xl font-extrabold text-white">{users.length}</p>
        </div>

        <div className="rounded-2xl border border-slate-800 bg-slate-900/50 p-6">
          <p className="text-sm font-semibold text-slate-400 uppercase">Candidats / Employeurs</p>
          <p className="mt-3 text-sm font-bold text-amber-400">Phase 7</p>
        </div>
      </div>

      {/* Users Table */}
      <div className="rounded-2xl border border-slate-800 bg-slate-900/50 p-6">
        <h2 className="text-lg font-bold text-white mb-4">Liste des Utilisateurs</h2>

        {users.length === 0 ? (
          <p className="text-sm text-slate-400 text-center py-8">Aucun utilisateur trouvé</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-slate-800">
                  <th className="text-start text-xs font-bold text-slate-400 uppercase pb-3">Nom</th>
                  <th className="text-start text-xs font-bold text-slate-400 uppercase pb-3">Email</th>
                  <th className="text-start text-xs font-bold text-slate-400 uppercase pb-3">Rôle</th>
                  <th className="text-start text-xs font-bold text-slate-400 uppercase pb-3">Inscription</th>
                  <th className="text-end text-xs font-bold text-slate-400 uppercase pb-3">Actions</th>
                </tr>
              </thead>
              <tbody>
                {users.map((user) => (
                  <tr key={user.id} className="border-b border-slate-800/50 hover:bg-slate-800/30 transition-colors">
                    <td className="py-3 text-sm font-medium text-white">
                      {user.name || "Sans nom"}
                    </td>
                    <td className="py-3 text-sm text-slate-300">{user.email}</td>
                    <td className="py-3">
                      <span
                        className={`inline-flex rounded-full px-2.5 py-1 text-xs font-semibold ${
                          user.role === "ADMIN"
                            ? "bg-[#073022] text-[#FDCD1A]"
                            : "bg-slate-800 text-slate-300"
                        }`}
                      >
                        {user.role}
                      </span>
                    </td>
                    <td className="py-3 text-xs text-slate-400">
                      {new Date(user.createdAt).toLocaleDateString("fr-FR")}
                    </td>
                    <td className="py-3 text-end">
                      {user.role === "STUDENT" && (
                        <Link
                          href={`/admin/students/${user.id}`}
                          className="text-xs font-semibold text-[#FDCD1A] hover:text-[#e5b917] transition-colors"
                        >
                          Voir profil →
                        </Link>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
