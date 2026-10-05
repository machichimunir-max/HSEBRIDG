import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

const jobs = [
  {
    titleFr: "Responsable HSE",
    titleAr: "مسؤول HSE",
    domain: "Responsable HSE",
    contractType: "CDI" as const,
    scope: "NATIONAL" as const,
    location: "Casablanca",
    descriptionFr: "Responsable de la mise en place et du suivi des procédures HSE sur site industriel",
    descriptionAr: "مسؤول عن تنفيذ ومتابعة إجراءات HSE في الموقع الصناعي",
    requirementsFr: "Bac+5, 5 ans d'expérience minimum, certifications HSE requises",
    requirementsAr: "بكالوريوس +5، خبرة 5 سنوات على الأقل، شهادات HSE مطلوبة",
    isActive: true,
  },
  {
    titleFr: "Supervisor HSE",
    titleAr: "مشرف HSE",
    domain: "Supervisor HSE",
    contractType: "INTERIM" as const,
    scope: "INTERNATIONAL" as const,
    location: "Projets à l'international",
    descriptionFr: "Supervision des équipes HSE sur grands projets de construction",
    descriptionAr: "إشراف على فرق HSE في مشاريع البناء الكبرى",
    requirementsFr: "3 ans minimum, bilingue FR/EN, mobilité internationale",
    requirementsAr: "3 سنوات على الأقل، ثنائي اللغة FR/EN، تنقل دولي",
    isActive: true,
  },
  {
    titleFr: "Inspecteur HSE",
    titleAr: "مفتش HSE",
    domain: "Inspecteur HSE",
    contractType: "CDD" as const,
    scope: "NATIONAL" as const,
    location: "Tanger",
    descriptionFr: "Inspections régulières des installations et audits de conformité",
    descriptionAr: "عمليات تفتيش منتظمة للمنشآت وتدقيق الامتثال",
    requirementsFr: "Certification audit HSE, rigueur et autonomie",
    requirementsAr: "شهادة تدقيق HSE، دقة واستقلالية",
    isActive: true,
  },
];

async function main() {
  console.log("🌱 Seeding Recrutement HSE data...");

  for (const job of jobs) {
    await prisma.jobPosting.create({ data: job });
    console.log(`✅ Created job: ${job.titleFr}`);
  }

  const count = await prisma.jobPosting.count();
  console.log(`\n✨ Total job postings in database: ${count}`);
}

main()
  .catch((e) => {
    console.error("❌ Error seeding recruitment data:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
