import { prisma } from "@/lib/db";
import { StudentsTableClient } from "@/components/admin/StudentsTableClient";
import { ClientStudentsPageHeader } from "./ClientStudentsPageHeader";

export default async function AdminStudentsPage() {
  const students = await prisma.user.findMany({
    where: { role: "STUDENT" },
    orderBy: { createdAt: "desc" },
    include: {
      enrollments: {
        where: { isActive: true },
        include: {
          course: {
            select: { title: true, slug: true },
          },
        },
      },
      lessonProgress: {
        select: {
          isCompleted: true,
        },
      },
    },
  });

  // Serialize dates to ISO strings to avoid hydration mismatch
  const serializedStudents = students.map((student) => ({
    ...student,
    createdAt: student.createdAt.toISOString(),
    updatedAt: student.updatedAt.toISOString(),
  }));

  return (
    <div className="mx-auto max-w-7xl">
      <ClientStudentsPageHeader />
      <StudentsTableClient students={serializedStudents} />
    </div>
  );
}
