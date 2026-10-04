import Link from "next/link";
import { prisma } from "@/lib/db";
import { getCurrentUser } from "@/lib/session";
import CourseDetailClient from "./CourseDetailClient";

export default async function CourseDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const currentUser = await getCurrentUser();

  const course = await prisma.course.findUnique({
    where: { slug },
    include: {
      modules: {
        orderBy: [{ order: "asc" }],
        include: {
          lessons: { orderBy: [{ order: "asc" }], include: { videoMetadata: true } },
        },
      },
      enrollments: true,
    },
  });

  if (!course || !course.isPublished) {
    return (
      <main className="min-h-screen bg-slate-950 px-6 py-16 text-slate-50">
        <div className="mx-auto max-w-2xl text-center">
          <p className="text-sm uppercase tracking-[0.2em] text-cyan-300">Cours</p>
          <h1 className="mt-4 text-4xl font-bold">Cette formation n'est pas disponible</h1>
          <Link href="/courses" className="mt-6 inline-block rounded-full bg-cyan-500 px-5 py-3 font-medium text-slate-950">
            Parcourir le catalogue
          </Link>
        </div>
      </main>
    );
  }

  const isEnrolled = currentUser
    ? await prisma.enrollment.findUnique({
        where: { userId_courseId: { userId: currentUser.userId, courseId: course.id } },
      })
    : null;

  return <CourseDetailClient course={JSON.parse(JSON.stringify(course))} isEnrolled={!!isEnrolled} currentUser={currentUser ? JSON.parse(JSON.stringify(currentUser)) : null} />;
}
