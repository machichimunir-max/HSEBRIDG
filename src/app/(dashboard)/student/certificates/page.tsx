import { redirect } from "next/navigation";
import { prisma } from "@/lib/db";
import { getCurrentUser } from "@/lib/session";
import CertificatesClient from "./CertificatesClient";

export default async function StudentCertificatesPage() {
  const user = await getCurrentUser();
  if (!user) {
    redirect("/login");
  }

  // Fetch all attestations for this student
  const attestations = await prisma.attestation.findMany({
    where: {
      userId: user.userId,
    },
    include: {
      course: {
        select: {
          id: true,
          title: true,
          slug: true,
          thumbnail: true,
          category: true,
        },
      },
    },
    orderBy: {
      issuedAt: "desc",
    },
  });

  return (
    <CertificatesClient
      attestations={attestations.map((a) => ({
        id: a.id,
        certificateNumber: a.certificateNumber,
        issuedAt: a.issuedAt.toISOString(),
        pdfUrl: a.pdfUrl,
        course: a.course,
      }))}
    />
  );
}
