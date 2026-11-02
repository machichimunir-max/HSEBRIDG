import { prisma } from "@/lib/db";
import { RecrutementIcon } from "@/components/icons/HseIcons";
import { ApplicationsClient } from "./ApplicationsClient";

async function getApplications() {
  const applications = await prisma.application.findMany({
    orderBy: { appliedAt: "desc" },
    include: {
      jobPosting: true,
      candidateProfile: true,
    },
  });

  // Serialize dates for client component
  return applications.map((app) => ({
    ...app,
    appliedAt: app.appliedAt.toISOString(),
    updatedAt: app.updatedAt.toISOString(),
    jobPosting: {
      ...app.jobPosting,
      createdAt: app.jobPosting.createdAt.toISOString(),
      updatedAt: app.jobPosting.updatedAt.toISOString(),
    },
    candidateProfile: {
      ...app.candidateProfile,
      createdAt: app.candidateProfile.createdAt.toISOString(),
      updatedAt: app.candidateProfile.updatedAt.toISOString(),
    },
  }));
}

export default async function AdminApplicationsPage() {
  const applications = await getApplications();

  return <ApplicationsClient applications={applications} />;
}
