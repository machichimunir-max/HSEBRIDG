import Link from "next/link";
import { prisma } from "@/lib/db";
import { CoursesTableClient } from "@/components/admin/CoursesTableClient";

export default async function AdminCoursesPage() {
  const courses = await prisma.course.findMany({
    orderBy: [{ createdAt: "desc" }],
    include: {
      modules: {
        select: { id: true },
      },
      enrollments: {
        select: { id: true },
      },
    },
  });

  // Serialize courses to plain objects (convert Decimal to string/number, Date to ISO string)
  const serializedCourses = courses.map((course) => ({
    ...course,
    price: course.price ? Number(course.price) : null,
    createdAt: course.createdAt.toISOString(),
    updatedAt: course.updatedAt.toISOString(),
  }));

  return (
    <div className="mx-auto max-w-7xl">
      <div className="mb-6 flex items-center justify-between gap-3">
        <div>
          <h1 className="text-3xl font-bold text-white">Course management</h1>
          <p className="mt-1 text-sm text-slate-400">Manage all your courses</p>
        </div>
        <Link
          href="/admin/courses/new"
          className="flex items-center gap-2 rounded-lg bg-[#FDCD1A] px-4 py-2 font-semibold text-[#0A0A0A] transition-colors hover:bg-[#e5b917]"
        >
          <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
          </svg>
          Créer une formation
        </Link>
      </div>

      <CoursesTableClient courses={serializedCourses} />
    </div>
  );
}
