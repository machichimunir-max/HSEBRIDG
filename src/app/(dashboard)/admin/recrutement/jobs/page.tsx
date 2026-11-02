import { prisma } from "@/lib/db";
import { JobsClient } from "./JobsClient";

async function getJobs() {
  const jobs = await prisma.jobPosting.findMany({
    orderBy: { createdAt: "desc" },
    include: {
      _count: { select: { applications: true } },
    },
  });
  return jobs;
}

export default async function AdminJobsPage() {
  const jobs = await getJobs();

  // Serialize dates for client component
  const serializedJobs = jobs.map((job) => ({
    ...job,
    createdAt: job.createdAt.toISOString(),
    updatedAt: job.updatedAt.toISOString(),
  }));

  return <JobsClient initialJobs={serializedJobs} />;
}
