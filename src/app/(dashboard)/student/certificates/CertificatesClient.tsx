"use client";

import Link from "next/link";
import { useI18n } from "@/lib/i18n/I18nContext";
import { DownloadIcon, CheckCircleIcon } from "@/components/icons/HseIcons";

interface Attestation {
  id: string;
  certificateNumber: string;
  issuedAt: string;
  pdfUrl: string | null;
  course: {
    id: string;
    title: string;
    slug: string;
    thumbnail: string | null;
    category: string | null;
  };
}

export default function CertificatesClient({
  attestations,
}: {
  attestations: Attestation[];
}) {
  const { t, isRtl } = useI18n();

  if (attestations.length === 0) {
    return (
      <main className="min-h-screen bg-slate-950 px-4 py-8 text-slate-50">
        <div className="mx-auto max-w-5xl">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-white">
              {t.certificate.myCertificates}
            </h1>
            <p className="mt-2 text-slate-400">
              Vos attestations de réussite des formations suivies
            </p>
          </div>

          <div className="rounded-3xl border border-slate-800 bg-slate-900/50 backdrop-blur-sm p-12 text-center">
            <CheckCircleIcon className="mx-auto mb-4 h-16 w-16 text-slate-600" />
            <h2 className="mb-3 text-xl font-semibold text-white">
              {t.certificate.noCertificates}
            </h2>
            <p className="mb-6 text-slate-400">
              Terminez une formation et réussissez le quiz pour obtenir votre première attestation.
            </p>
            <Link
              href="/catalog"
              className="inline-block rounded-lg bg-[#FDCD1A] px-6 py-3 font-medium text-slate-950 hover:bg-[#e5b917] transition-colors"
            >
              Parcourir le catalogue
            </Link>
          </div>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-slate-950 px-4 py-8 text-slate-50">
      <div className="mx-auto max-w-5xl">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-white">
            {t.certificate.myCertificates}
          </h1>
          <p className="mt-2 text-slate-400">
            Vos attestations de réussite des formations suivies
          </p>
        </div>

        <div className="grid gap-6 md:grid-cols-2">
          {attestations.map((attestation) => (
            <div
              key={attestation.id}
              className="rounded-3xl border border-slate-800 bg-slate-900/50 backdrop-blur-sm p-6 hover:border-slate-700 transition-all"
              data-testid={`certificate-${attestation.id}`}
            >
              <div className="mb-4 flex items-start justify-between gap-4">
                <div className="flex-1">
                  <div className="mb-2 flex items-center gap-2">
                    <CheckCircleIcon className="h-5 w-5 text-green-400" />
                    <span className="text-xs font-medium uppercase tracking-wider text-green-400">
                      {t.certificate.title}
                    </span>
                  </div>
                  <h2 className="text-xl font-semibold text-white">
                    {attestation.course.title}
                  </h2>
                </div>
              </div>

              <div className="mb-4 space-y-2 text-sm">
                <div className="flex items-center justify-between border-b border-slate-800 pb-2">
                  <span className="text-slate-400">
                    {t.certificate.certificateNumber}
                  </span>
                  <span className="font-mono text-slate-300">
                    {attestation.certificateNumber}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-slate-400">
                    {t.certificate.issuedDate}
                  </span>
                  <span className="text-slate-300">
                    {new Date(attestation.issuedAt).toLocaleDateString("fr-FR", {
                      day: "2-digit",
                      month: "long",
                      year: "numeric",
                    })}
                  </span>
                </div>
              </div>

              <div className="flex gap-3">
                <a
                  href={`/api/attestation/${attestation.id}/download`}
                  download
                  className="flex flex-1 items-center justify-center gap-2 rounded-lg bg-[#FDCD1A] px-4 py-3 font-medium text-slate-950 hover:bg-[#e5b917] transition-colors"
                  data-testid={`download-certificate-${attestation.id}`}
                >
                  <DownloadIcon className="h-5 w-5" />
                  {t.certificate.downloadPdf}
                </a>
                <Link
                  href={`/courses/${attestation.course.slug}`}
                  className="flex items-center justify-center rounded-lg border border-slate-700 px-4 py-3 text-slate-300 hover:bg-slate-800 transition-colors"
                  data-testid={`view-course-${attestation.id}`}
                >
                  Voir la formation
                </Link>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-8 rounded-2xl border border-slate-800 bg-slate-900/30 p-6">
          <h3 className="mb-2 font-semibold text-white">
            📋 À propos des attestations
          </h3>
          <ul className="space-y-2 text-sm text-slate-400">
            <li>
              • Les attestations sont délivrées automatiquement après la réussite du quiz final
            </li>
            <li>
              • Chaque attestation porte un numéro unique et la date de délivrance
            </li>
            <li>
              • Vous pouvez télécharger vos attestations au format PDF à tout moment
            </li>
            <li>
              • Les attestations sont valables sans limite de durée
            </li>
          </ul>
        </div>
      </div>
    </main>
  );
}
