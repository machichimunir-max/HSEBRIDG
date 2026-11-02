import { mkdir, writeFile } from "node:fs/promises";
import { join } from "node:path";
import { load } from "cheerio";
import { PrismaClient } from "@prisma/client";

const BASE_URL = "https://3smorocco.com";
const CATALOG_URL = `${BASE_URL}/category/btp-GFPPL/details`;
const ASSET_DIR = join(process.cwd(), "public", "images", "boutique", "reference-catalog");
const APPLY = process.argv.includes("--apply");
const WAIT_MS = 350;
const MAX_IMAGE_BYTES = 2 * 1024 * 1024;

const categories = [
  {
    slug: "protection-tete",
    titleFr: "Protection de la tête",
    titleAr: "حماية الرأس",
    descriptionFr: "Équipements de protection individuelle destinés à protéger la tête.",
    descriptionAr: "معدات حماية فردية مخصصة لحماية الرأس.",
    image: "https://images.unsplash.com/photo-1572981779307-38b8cabb2407?auto=format&fit=crop&w=1200&q=78&fm=jpg",
  },
  {
    slug: "protection-yeux",
    titleFr: "Protection des yeux et du visage",
    titleAr: "حماية العينين والوجه",
    descriptionFr: "Lunettes, écrans et visières de protection.",
    descriptionAr: "نظارات وشاشات وواقيات للوجه.",
    image: "https://images.unsplash.com/photo-1577803645773-f96470509666?auto=format&fit=crop&w=1200&q=78&fm=jpg",
  },
  {
    slug: "protection-auditive",
    titleFr: "Protection auditive",
    titleAr: "حماية السمع",
    descriptionFr: "Équipements de protection contre les expositions sonores.",
    descriptionAr: "معدات للحماية من التعرض للضوضاء.",
    image: "https://images.unsplash.com/photo-1589903308904-1010c2294adc?auto=format&fit=crop&w=1200&q=78&fm=jpg",
  },
  {
    slug: "protection-mains",
    titleFr: "Protection des mains",
    titleAr: "حماية اليدين",
    descriptionFr: "Gants et équipements de protection des mains.",
    descriptionAr: "قفازات ومعدات لحماية اليدين.",
    image: "https://images.unsplash.com/photo-1623935920795-b9d11a3149e2?auto=format&fit=crop&w=1200&q=78&fm=jpg",
  },
  {
    slug: "protection-pieds",
    titleFr: "Protection des pieds",
    titleAr: "حماية القدمين",
    descriptionFr: "Chaussures et équipements de protection des pieds.",
    descriptionAr: "أحذية ومعدات لحماية القدمين.",
    image: "https://images.unsplash.com/photo-1608231387042-66d1773070a5?auto=format&fit=crop&w=1200&q=78&fm=jpg",
  },
  {
    slug: "vetements-haute-visibilite",
    titleFr: "Vêtements de protection",
    titleAr: "ملابس الحماية",
    descriptionFr: "Vêtements et accessoires de protection pour les activités professionnelles.",
    descriptionAr: "ملابس وإكسسوارات حماية للأنشطة المهنية.",
    image: "https://images.unsplash.com/photo-1571687949921-1306bfb24b72?auto=format&fit=crop&w=1200&q=78&fm=jpg",
  },
  {
    slug: "travail-hauteur",
    titleFr: "Travail en hauteur",
    titleAr: "العمل على ارتفاع",
    descriptionFr: "Équipements pour les travaux en hauteur et la prévention des chutes.",
    descriptionAr: "معدات للعمل على ارتفاع والوقاية من السقوط.",
    image: "https://images.unsplash.com/photo-1581094271901-8022df4466f9?auto=format&fit=crop&w=1200&q=78&fm=jpg",
  },
  {
    slug: "protection-respiratoire",
    titleFr: "Protection respiratoire",
    titleAr: "حماية الجهاز التنفسي",
    descriptionFr: "Masques et équipements de protection respiratoire.",
    descriptionAr: "أقنعة ومعدات لحماية الجهاز التنفسي.",
    image: "https://images.unsplash.com/photo-1584483766114-2cea6facdf57?auto=format&fit=crop&w=1200&q=78&fm=jpg",
  },
  {
    slug: "lutte-incendie",
    titleFr: "Lutte contre l’incendie",
    titleAr: "مكافحة الحرائق",
    descriptionFr: "Équipements de première intervention et de lutte contre l’incendie.",
    descriptionAr: "معدات التدخل الأولي ومكافحة الحرائق.",
    image: "https://images.unsplash.com/photo-1551882547-ff40c63fe5fa?auto=format&fit=crop&w=1200&q=78&fm=jpg",
  },
  {
    slug: "epc-securisation",
    titleFr: "Équipements de protection collective",
    titleAr: "معدات الحماية الجماعية",
    descriptionFr: "Équipements de balisage, de signalisation et de sécurisation des zones.",
    descriptionAr: "معدات تحديد المناطق والإشارات وتأمينها.",
    image: "https://images.unsplash.com/photo-1530124566582-a618bc2615dc?auto=format&fit=crop&w=1200&q=78&fm=jpg",
  },
  {
    slug: "epi-divers",
    titleFr: "Équipements de sécurité divers",
    titleAr: "معدات سلامة متنوعة",
    descriptionFr: "Autres équipements de sécurité et de protection individuelle.",
    descriptionAr: "معدات أخرى للسلامة والحماية الفردية.",
    image: "https://images.unsplash.com/photo-1504307651254-35680f356dfd?auto=format&fit=crop&w=1200&q=78&fm=jpg",
  },
];

const categoryBySlug = new Map(categories.map((category) => [category.slug, category]));

const categoryRules = [
  { pattern: /lunette|visiere|visière|ecran facial|écran facial|soudure|soudeur/i, slug: "protection-yeux" },
  { pattern: /auditif|oreille|bouchon|anti.?bruit/i, slug: "protection-auditive" },
  { pattern: /gant|main|manchette/i, slug: "protection-mains" },
  { pattern: /chauss|botte|pied|surchauss/i, slug: "protection-pieds" },
  { pattern: /harnais|antichute|anti.?chute|longe|corde|ancrage|hauteur/i, slug: "travail-hauteur" },
  { pattern: /masque|respir|filtre|cartouche/i, slug: "protection-respiratoire" },
  { pattern: /incendie|extincteur|feu/i, slug: "lutte-incendie" },
  { pattern: /signalisation|balisage|barriere|barrière|cône|cone|chantier/i, slug: "epc-securisation" },
  { pattern: /vetement|vêtement|gilet|veste|pantalon|combinaison|haute visibilite|haute visibilité/i, slug: "vetements-haute-visibilite" },
  { pattern: /casque|tete|tête/i, slug: "protection-tete" },
];

const productLabels = {
  "protection-tete": { fr: "Casque de protection", ar: "خوذة واقية" },
  "protection-yeux": { fr: "Protection oculaire", ar: "واقي للعينين" },
  "protection-auditive": { fr: "Protection auditive", ar: "واقي سمعي" },
  "protection-mains": { fr: "Gants de protection", ar: "قفازات واقية" },
  "protection-pieds": { fr: "Protection des pieds", ar: "واقي للقدمين" },
  "vetements-haute-visibilite": { fr: "Vêtement de protection", ar: "ملابس واقية" },
  "travail-hauteur": { fr: "Équipement antichute", ar: "معدات منع السقوط" },
  "protection-respiratoire": { fr: "Protection respiratoire", ar: "واقي تنفسي" },
  "lutte-incendie": { fr: "Équipement incendie", ar: "معدات مكافحة الحرائق" },
  "epc-securisation": { fr: "Équipement de sécurisation", ar: "معدات تأمين" },
  "epi-divers": { fr: "Équipement de sécurité", ar: "معدات سلامة" },
};

function delay(milliseconds) {
  return new Promise((resolve) => setTimeout(resolve, milliseconds));
}

function text(value) {
  return value.replace(/\s+/g, " ").trim();
}

async function fetchHtml(url) {
  const response = await fetch(url, {
    headers: { "User-Agent": "HSEBridgeCatalogImporter/1.0 (catalog metadata import)" },
    signal: AbortSignal.timeout(20000),
  });
  if (!response.ok) throw new Error(`Request failed (${response.status}): ${url}`);
  return response.text();
}

function canonicalCategory(sourceCategory) {
  const rule = categoryRules.find(({ pattern }) => pattern.test(sourceCategory));
  return categoryBySlug.get(rule?.slug ?? "epi-divers");
}

function makeProduct(detailUrl, $) {
  const sourceId = new URL(detailUrl).pathname.split("/").filter(Boolean).at(-1);
  const sourceTitle = text($("h1.product-title").first().text());
  const breadcrumb = $("nav.breadcrumb-nav .breadcrumb-item a")
    .map((_, element) => text($(element).text()))
    .get()
    .filter((label) => label && label.toLowerCase() !== "accueil");
  const sourceCategory = breadcrumb.at(-1) ?? "";
  const category = canonicalCategory(sourceCategory);
  const labels = productLabels[category.slug];
  const certifications = $(".tag")
    .map((_, element) => text($(element).text()))
    .get()
    .filter(Boolean);

  if (!sourceId || !sourceTitle) return null;

  const titleFr = `${labels.fr} ${sourceTitle}`;
  const titleAr = `${labels.ar} ${sourceTitle}`;
  const certificationFr = certifications.length
    ? ` Références affichées sur la page source : ${certifications.join(", ")}.`
    : " Les références normatives sont à confirmer sur la fiche fabricant.";
  const certificationAr = certifications.length
    ? ` المعايير المعروضة في الصفحة المصدر: ${certifications.join("، ")}.`
    : " يرجى التحقق من المعايير في نشرة الشركة المصنعة.";

  return {
    sourceId,
    sourceTitle,
    sourceCategory,
    category,
    titleFr,
    titleAr,
    slug: `3sm-${sourceId.toLowerCase()}`,
    sku: `3SM-${sourceId.toUpperCase()}`,
    shortDescFr: `${labels.fr} ${sourceTitle}. Visuel illustratif.`,
    shortDescAr: `${labels.ar} ${sourceTitle}. الصورة توضيحية.`,
    descriptionFr: `Équipement référencé sous le nom « ${sourceTitle} ». Vérifiez la taille, l’usage prévu et l’adéquation avec votre évaluation des risques avant commande.${certificationFr} Photo de catégorie à titre illustratif; elle ne représente pas nécessairement le modèle exact.`,
    descriptionAr: `معدات مدرجة باسم « ${sourceTitle} ». يرجى التحقق من المقاس والاستخدام المقصود ومدى ملاءمتها لتقييم المخاطر قبل الطلب.${certificationAr} صورة الفئة للتوضيح فقط وقد لا تمثل الطراز نفسه.`,
    certifications,
    specifications: {},
  };
}

async function discoverProductUrls() {
  const urls = new Set();
  const firstPage = await fetchHtml(CATALOG_URL);
  const $first = load(firstPage);
  const pageNumbers = $first("a[href*='?page=']")
    .map((_, element) => Number(new URL($first(element).attr("href"), BASE_URL).searchParams.get("page")))
    .get()
    .filter(Number.isInteger);
  const lastPage = Math.min(20, Math.max(1, ...pageNumbers));

  for (let page = 1; page <= lastPage; page++) {
    const url = page === 1 ? CATALOG_URL : `${CATALOG_URL}?page=${page}`;
    const html = page === 1 ? firstPage : await fetchHtml(url);
    const $ = load(html);

    $("a[href*='/product/detail/']").each((_, element) => {
      const href = $(element).attr("href");
      if (!href) return;
      const productUrl = new URL(href, BASE_URL);
      if (productUrl.hostname === "3smorocco.com") urls.add(productUrl.href);
    });

    if (page < lastPage) await delay(WAIT_MS);
  }

  return [...urls];
}

async function scrapeProducts(urls) {
  const products = [];
  const failures = [];

  for (const [index, url] of urls.entries()) {
    try {
      const html = await fetchHtml(url);
      const product = makeProduct(url, load(html));
      if (product) products.push(product);
      else failures.push(`${url}: missing product title or reference`);
    } catch (error) {
      failures.push(`${url}: ${error.message}`);
    }

    if (index < urls.length - 1) await delay(WAIT_MS);
  }

  return { products, failures };
}

async function downloadCategoryImages(usedCategories) {
  await mkdir(ASSET_DIR, { recursive: true });
  const imagePaths = new Map();

  for (const category of usedCategories) {
    const response = await fetch(category.image, {
      headers: { "User-Agent": "HSEBridgeCatalogImporter/1.0" },
      signal: AbortSignal.timeout(20000),
    });
    const contentType = response.headers.get("content-type") ?? "";
    if (!response.ok || !contentType.startsWith("image/")) {
      throw new Error(`Could not download licensed category image for ${category.slug}`);
    }

    const bytes = Buffer.from(await response.arrayBuffer());
    const isJpeg = bytes[0] === 0xff && bytes[1] === 0xd8 && bytes[2] === 0xff;
    if (!isJpeg || bytes.length > MAX_IMAGE_BYTES || bytes.length < 100) {
      throw new Error(`Category image has an invalid size: ${category.slug}`);
    }

    const filename = `${category.slug}.jpg`;
    await writeFile(join(ASSET_DIR, filename), bytes);
    imagePaths.set(category.slug, `/images/boutique/reference-catalog/${filename}`);
    await delay(WAIT_MS);
  }

  return imagePaths;
}

async function applyProducts(products, imagePaths) {
  const prisma = new PrismaClient();

  try {
    await prisma.$connect();
    await prisma.$transaction(async (transaction) => {
      const dbCategories = new Map();

      for (const category of new Set(products.map((product) => product.category))) {
        const saved = await transaction.productCategory.upsert({
          where: { slug: category.slug },
          update: {},
          create: {
            slug: category.slug,
            titleFr: category.titleFr,
            titleAr: category.titleAr,
            descriptionFr: category.descriptionFr,
            descriptionAr: category.descriptionAr,
            image: imagePaths.get(category.slug),
            isVisible: true,
          },
        });
        dbCategories.set(category.slug, saved.id);
      }

      for (const [index, product] of products.entries()) {
        const image = imagePaths.get(product.category.slug);
        const data = {
          titleFr: product.titleFr,
          titleAr: product.titleAr,
          shortDescFr: product.shortDescFr,
          shortDescAr: product.shortDescAr,
          descriptionFr: product.descriptionFr,
          descriptionAr: product.descriptionAr,
          images: image ? [image] : [],
          price: null,
          stockStatus: "on_order",
          certifications: product.certifications,
          specifications: product.specifications,
          sku: product.sku,
          isVisible: true,
          isFeatured: false,
          order: index + 1,
          categoryId: dbCategories.get(product.category.slug),
        };

        await transaction.product.upsert({
          where: { slug: product.slug },
          update: data,
          create: { ...data, slug: product.slug },
        });
      }
    }, { maxWait: 10000, timeout: 120000 });
  } finally {
    await prisma.$disconnect();
  }
}

async function main() {
  console.log(`Reading product links from ${CATALOG_URL}`);
  const urls = await discoverProductUrls();
  const { products, failures } = await scrapeProducts(urls);
  const usedCategories = [...new Map(products.map((product) => [product.category.slug, product.category])).values()];

  console.log(`Found ${urls.length} product links; parsed ${products.length} products.`);
  console.log(`Mapped categories: ${usedCategories.map((category) => category.slug).join(", ") || "none"}`);
  for (const product of products.slice(0, 8)) {
    console.log(`- ${product.titleFr} | ${product.sourceCategory || "uncategorized"} | ${product.certifications.join(", ") || "no standards listed"}`);
  }
  if (failures.length) {
    console.warn(`${failures.length} product pages could not be parsed:`);
    for (const failure of failures.slice(0, 10)) console.warn(`- ${failure}`);
  }

  if (!products.length) throw new Error("No product records were parsed; nothing was imported.");
  if (!APPLY) {
    console.log("Dry run only. Review the parsed records, then rerun with --apply to save images and upsert products.");
    return;
  }

  const imagePaths = await downloadCategoryImages(usedCategories);
  await applyProducts(products, imagePaths);
  console.log(`Imported ${products.length} products and ${imagePaths.size} illustrative category images.`);
}

main().catch((error) => {
  console.error("Boutique reference import failed:", error.message);
  process.exitCode = 1;
});