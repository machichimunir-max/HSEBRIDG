import { prisma } from "@/lib/db";
import { AdminDashboardClient } from "./AdminDashboardClient";

async function getMultiPillarAnalytics() {
  const now = new Date();
  const lastMonth = new Date(now.getFullYear(), now.getMonth() - 1, now.getDate());

  // PILLAR 1 — FORMATION HSE (LMS)
  const [
    totalCourses,
    publishedCourses,
    totalStudents,
    totalEnrollments,
    lastMonthEnrollments,
  ] = await Promise.all([
    prisma.course.count(),
    prisma.course.count({ where: { isPublished: true } }),
    prisma.user.count({ where: { role: "STUDENT" } }),
    prisma.enrollment.count({ where: { isActive: true } }),
    prisma.enrollment.count({
      where: { isActive: true, enrolledAt: { lt: lastMonth } },
    }),
  ]);

  const enrollmentTrend =
    lastMonthEnrollments > 0
      ? ((totalEnrollments - lastMonthEnrollments) / lastMonthEnrollments) * 100
      : 0;

  // Get recent enrollments for formation pillar
  const recentEnrollments = await prisma.enrollment.findMany({
    where: { isActive: true },
    orderBy: { enrolledAt: "desc" },
    take: 5,
    include: {
      user: { select: { name: true, email: true } },
      course: { select: { title: true, slug: true } },
    },
  });

  // PILLAR 2 — BOUTIQUE EPI/EPC
  const [totalQuoteRequests, pendingQuotes, totalProducts, totalCategories] = await Promise.all([
    prisma.quoteRequest.count(),
    prisma.quoteRequest.count({ where: { status: "NEW" } }),
    prisma.product.count(),
    prisma.productCategory.count({ where: { isVisible: true } }),
  ]);

  // PILLAR 3 — RECRUTEMENT HSE
  const [totalJobPostings, activeJobs, totalApplications, newApplications] = await Promise.all([
    prisma.jobPosting.count(),
    prisma.jobPosting.count({ where: { isActive: true } }),
    prisma.application.count(),
    prisma.application.count({ where: { status: "NEW" } }),
  ]);

  return {
    formation: {
      totalCourses,
      publishedCourses,
      totalStudents,
      totalEnrollments,
      enrollmentTrend,
      recentEnrollments,
    },
    boutique: {
      totalQuoteRequests,
      pendingQuotes,
      totalProducts,
    },
    recrutement: {
      totalJobPostings,
      activeJobs,
      totalApplications,
      newApplications,
    },
  };
}

export default async function AdminDashboardPage() {
  const analytics = await getMultiPillarAnalytics();

  return <AdminDashboardClient analytics={analytics} />;
}
