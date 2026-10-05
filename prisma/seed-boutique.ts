import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

const categories = [
  {
    slug: "protection-tete",
    titleFr: "Protection de la Tête",
    titleAr: "حماية الرأس",
    descriptionFr: "Casques de sécurité conformes aux normes EN 397, anti-choc et anti-perforation",
    descriptionAr: "خوذات أمان متوافقة مع معايير EN 397، مضادة للصدمات والثقب",
    order: 1,
  },
  {
    slug: "protection-yeux",
    titleFr: "Protection des Yeux",
    titleAr: "حماية العينين",
    descriptionFr: "Lunettes de sécurité anti-impact, masques de soudure et visières de protection",
    descriptionAr: "نظارات أمان مضادة للصدمات، أقنعة لحام ودروع واقية",
    order: 2,
  },
  {
    slug: "protection-auditive",
    titleFr: "Protection Auditive",
    titleAr: "حماية السمع",
    descriptionFr: "Bouchons d'oreilles et casques antibruit avec atténuation jusqu'à 35dB",
    descriptionAr: "سدادات أذن وخوذات مانعة للضوضاء بتوهين يصل إلى 35 ديسيبل",
    order: 3,
  },
  {
    slug: "protection-mains",
    titleFr: "Protection des Mains",
    titleAr: "حماية اليدين",
    descriptionFr: "Gants de sécurité anti-coupure, mécaniques, chimiques et thermiques",
    descriptionAr: "قفازات أمان مضادة للقطع، ميكانيكية، كيميائية وحرارية",
    order: 4,
  },
  {
    slug: "protection-pieds",
    titleFr: "Protection des Pieds",
    titleAr: "حماية القدمين",
    descriptionFr: "Chaussures de sécurité S1P à S3, embout acier/composite, semelle anti-perforation",
    descriptionAr: "أحذية أمان S1P إلى S3، مقدمة فولاذية/مركبة، نعل مضاد للثقب",
    order: 5,
  },
  {
    slug: "vetements-haute-visibilite",
    titleFr: "Vêtements Haute Visibilité",
    titleAr: "ملابس عالية الرؤية",
    descriptionFr: "Gilets, vestes et pantalons classe 2 et 3 conformes EN ISO 20471",
    descriptionAr: "سترات وجاكيتات وبناطيل من الفئة 2 و 3 متوافقة مع EN ISO 20471",
    order: 6,
  },
  {
    slug: "travail-hauteur",
    titleFr: "Travail en Hauteur",
    titleAr: "العمل على الارتفاع",
    descriptionFr: "Harnais de sécurité, longes, antichutes, points d'ancrage et lignes de vie",
    descriptionAr: "أحزمة أمان، حبال، واقيات سقوط، نقاط تثبيت وخطوط حياة",
    order: 7,
  },
  {
    slug: "protection-respiratoire",
    titleFr: "Protection Respiratoire",
    titleAr: "حماية الجهاز التنفسي",
    descriptionFr: "Masques FFP2/FFP3, demi-masques, masques complets et filtres adaptés",
    descriptionAr: "أقنعة FFP2/FFP3، أقنعة نصفية، أقنعة كاملة ومرشحات مناسبة",
    order: 8,
  },
  {
    slug: "lutte-incendie",
    titleFr: "Lutte contre l'Incendie",
    titleAr: "مكافحة الحرائق",
    descriptionFr: "Extincteurs poudre/CO2/mousse, RIA, couvertures anti-feu et signalétique",
    descriptionAr: "طفايات مسحوق/CO2/رغوة، خراطيم حريق، بطانيات مقاومة للحريق وعلامات",
    order: 9,
  },
  {
    slug: "epc-securisation",
    titleFr: "EPC Sécurisation",
    titleAr: "معدات الحماية الجماعية",
    descriptionFr: "Signalisation de sécurité, balises, cônes, barrières, rubans de balisage",
    descriptionAr: "لافتات أمان، منارات، أقماع، حواجز، أشرطة تحذيرية",
    order: 10,
  },
];

async function main() {
  console.log("🌱 Seeding Boutique EPI/EPC categories...");

  for (const category of categories) {
    await prisma.productCategory.upsert({
      where: { slug: category.slug },
      update: category,
      create: category,
    });
    console.log(`✅ Created/Updated: ${category.titleFr}`);
  }

  const count = await prisma.productCategory.count();
  console.log(`\n✨ Total categories in database: ${count}`);
}

main()
  .catch((e) => {
    console.error("❌ Error seeding boutique categories:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
