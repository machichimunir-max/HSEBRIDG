import { prisma } from "@/lib/db";
import { EnrollmentsTableClient } from "@/components/admin/EnrollmentsTableClient";

export default async function AdminEnrollmentsPage() {
  const enrollments = await prisma.enrollment.findMany({
    where: { isActive: true },
    orderBy: { enrolledAt: "desc" },
    include: {
      user: {
        select: {
          id: true,
          name: true,
          email: true,
        },
      },
      course: {
        select: {
          id: true,
          title: true,
          slug: true,
          thumbnail: true,
        },
      },
    },
  });

  const courses = await prisma.course.findMany({
    where: { isPublished: true },
    select: { id: true, title: true },
    orderBy: { title: "asc" },
  });

  // Serialize dates to ISO strings
  const serializedEnrollments = enrollments.map((enrollment) => ({
    ...enrollment,
    enrolledAt: enrollment.enrolledAt.toISOString(),
  }));

  return (
    <div className="mx-auto max-w-7xl">
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-white">Enrollments</h1>
          <p className="mt-1 text-sm text-slate-400">
            Manage course enrollments
          </p>
        </div>
      </div>

      <EnrollmentsTableClient enrollments={serializedEnrollments} courses={courses} />
    </div>
  );
}
