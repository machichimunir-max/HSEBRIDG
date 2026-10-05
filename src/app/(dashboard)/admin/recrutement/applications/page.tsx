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
  return applications;
}

export default async function AdminApplicationsPage() {
  const applications = await getApplications();

  return <ApplicationsClient applications={applications} />;
}
