import { copyFile, mkdir, readdir } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { PrismaClient } from "@prisma/client";

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const SOURCE_DIR = path.join(ROOT, "DOCS", "for site hsebridg");
const PUBLIC_DIR = path.join(ROOT, "public", "images", "boutique", "products");
const PUBLIC_URL = "/images/boutique/products";
const IMAGE_EXTENSIONS = new Set([".jpg", ".jpeg", ".png", ".webp"]);
const IGNORED_TOKENS = new Set([
  "anti",
  "air",
  "bottes",
  "casque",
  "chaussures",
  "de",
  "des",
  "du",
  "equipement",
  "equipements",
  "et",
  "gants",
  "haute",
  "hv",
  "la",
  "le",
  "les",
  "lunette",
  "lunettes",
  "masque",
  "pied",
  "pc",
  "protection",
  "securite",
  "visiere",
  "vetement",
  "vetements",
]);
const TOKEN_ALIASES = new Map([["nitri", "nitry"]]);

const args = new Set(process.argv.slice(2));
const confirmDeleteArg = process.argv.find((arg) => arg.startsWith("--confirm-delete="));
const confirmedDeleteCount = confirmDeleteArg
  ? Number(confirmDeleteArg.slice("--confirm-delete=".length))
  : undefined;
const applyChanges = args.has("--apply");
const deleteUnmatched = args.has("--delete-unmatched");

function normalize(value) {
  return value
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, " ")
    .trim();
}

function imageTokens(filename) {
  let stem = path.basename(filename, path.extname(filename));
  stem = stem
    .replace(/_\d{14}_[a-z0-9]+$/i, "")
    .replace(/\.(?:png|jpe?g)$/i, "")
    .replace(/-\d{10,}-[a-z0-9]+(?:\s*\(\d+\))?$/i, "")
    .replace(/\s*\(\d+\)$/i, "")
    .replace(/^\d+[-_]+/, "");

  return normalize(stem)
    .split(" ")
    .map((token) => TOKEN_ALIASES.get(token) ?? token)
    .filter((token) => token && !IGNORED_TOKENS.has(token));
}

function productTokens(product) {
  return normalize([product.slug, product.titleFr, product.sku ?? ""].join(" "))
    .split(" ")
    .map((token) => TOKEN_ALIASES.get(token) ?? token)
    .filter((token) => token && !IGNORED_TOKENS.has(token));
}

function numericTokens(tokens) {
  return tokens.filter((token) => /\d/.test(token));
}

function findProductMatch(image, products) {
  const tokens = imageTokens(image.filename);
  if (!tokens.length) return { status: "unmatched" };

  const imageNumbers = numericTokens(tokens);
  const candidates = products
    .map((product) => {
      const terms = productTokens(product);
      const shared = new Set(tokens.filter((token) => terms.includes(token)));
      const productNumbers = numericTokens(terms);
      if (
        !shared.size ||
        (imageNumbers.length &&
          productNumbers.length &&
          !imageNumbers.some((token) => productNumbers.includes(token)))
      ) {
        return null;
      }

      return { product, score: shared.size };
    })
    .filter(Boolean)
    .sort((left, right) => right.score - left.score);

  if (!candidates.length) return { status: "unmatched" };
  if (candidates.length > 1 && candidates[0].score === candidates[1].score) {
    return {
      status: "ambiguous",
      products: candidates
        .filter((candidate) => candidate.score === candidates[0].score)
        .map((candidate) => candidate.product),
    };
  }

  return { status: "matched", product: candidates[0].product };
}

async function findImageFiles(directory) {
  const entries = await readdir(directory, { withFileTypes: true });
  const files = [];

  for (const entry of entries) {
    const fullPath = path.join(directory, entry.name);
    if (entry.isDirectory()) {
      files.push(...(await findImageFiles(fullPath)));
    } else if (entry.isFile() && IMAGE_EXTENSIONS.has(path.extname(entry.name).toLowerCase())) {
      files.push(fullPath);
    }
  }

  return files.sort((left, right) => left.localeCompare(right));
}

function safeFilename(filename, index) {
  const extension = path.extname(filename).toLowerCase();
  const stem = path
    .basename(filename, path.extname(filename))
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "")
    .slice(0, 80);

  return `${String(index + 1).padStart(2, "0")}-${stem || "product"}${extension}`;
}

function assertArguments() {
  const allowed = new Set(["--apply", "--delete-unmatched"]);
  for (const arg of args) {
    if (!allowed.has(arg) && !arg.startsWith("--confirm-delete=")) {
      throw new Error(`Unknown option: ${arg}`);
    }
  }

  if (deleteUnmatched && !applyChanges) {
    console.log("Dry run: --delete-unmatched is only applied together with --apply.");
  }
  if (confirmDeleteArg && (!deleteUnmatched || !applyChanges)) {
    throw new Error("--confirm-delete requires both --apply and --delete-unmatched.");
  }
  if (confirmDeleteArg && (!Number.isInteger(confirmedDeleteCount) || confirmedDeleteCount < 0)) {
    throw new Error("--confirm-delete must be a non-negative integer.");
  }
}

async function main() {
  assertArguments();
  const imageFiles = await findImageFiles(SOURCE_DIR);
  if (!imageFiles.length) {
    throw new Error(`No supported image files found in ${SOURCE_DIR}`);
  }

  const prisma = new PrismaClient();
  try {
    const products = await prisma.product.findMany({
      select: { id: true, slug: true, titleFr: true, sku: true },
      orderBy: { slug: "asc" },
    });

    const matches = [];
    const unmatchedImages = [];
    const ambiguousImages = [];
    for (const filename of imageFiles) {
      const result = findProductMatch({ filename }, products);
      if (result.status === "matched") {
        matches.push({ filename, product: result.product });
      } else if (result.status === "ambiguous") {
        ambiguousImages.push({ filename, products: result.products });
      } else {
        unmatchedImages.push(filename);
      }
    }

    const imagesByProduct = new Map();
    for (const match of matches) {
      const current = imagesByProduct.get(match.product.id) ?? [];
      current.push(match);
      imagesByProduct.set(match.product.id, current);
    }

    const matchedProducts = new Set(imagesByProduct.keys());
    const unmatchedProducts = products.filter((product) => !matchedProducts.has(product.id));

    console.log(`Source images: ${imageFiles.length}`);
    console.log(`Products in database: ${products.length}`);
    console.log(`Matched images: ${matches.length} across ${matchedProducts.size} products`);
    console.log(`Unmatched images: ${unmatchedImages.length}`);
    console.log(`Ambiguous images: ${ambiguousImages.length}`);
    console.log(
      `${deleteUnmatched ? "Products to delete" : "Products without a matching image"}: ${unmatchedProducts.length}`,
    );

    for (const productImages of imagesByProduct.values()) {
      const product = productImages[0].product;
      console.log(
        `MATCH ${product.slug} | ${product.titleFr} <= ${productImages
          .map(({ filename }) => path.relative(SOURCE_DIR, filename))
          .join(", ")}`,
      );
    }
    for (const image of ambiguousImages) {
      console.log(
        `AMBIGUOUS ${path.relative(SOURCE_DIR, image.filename)} => ${image.products
          .map((product) => product.slug)
          .join(", ")}`,
      );
    }
    for (const product of unmatchedProducts) {
      console.log(
        `${deleteUnmatched ? "DELETE" : "NO_IMAGE"} ${product.slug} | ${product.titleFr}`,
      );
    }

    if (!applyChanges) {
      console.log("Dry run only. Add --apply to copy matched images and update product records.");
      return;
    }
    if (!matches.length) {
      throw new Error("No products matched; refusing to copy assets or change the database.");
    }
    if (
      deleteUnmatched &&
      confirmedDeleteCount !== unmatchedProducts.length
    ) {
      throw new Error(
        `Deletion not confirmed. Review the dry run, then pass --confirm-delete=${unmatchedProducts.length}.`,
      );
    }

    const urlsByProduct = new Map();
    for (const [productId, productImages] of imagesByProduct) {
      const product = productImages[0].product;
      const productDirectory = path.join(PUBLIC_DIR, product.slug);
      await mkdir(productDirectory, { recursive: true });

      const imageUrls = [];
      for (const [index, match] of productImages.entries()) {
        const filename = safeFilename(match.filename, index);
        await copyFile(match.filename, path.join(productDirectory, filename));
        imageUrls.push(`${PUBLIC_URL}/${product.slug}/${filename}`);
      }
      urlsByProduct.set(productId, imageUrls);
    }

    await prisma.$transaction(async (transaction) => {
      for (const [productId, images] of urlsByProduct) {
        await transaction.product.update({
          where: { id: productId },
          data: { images },
        });
      }

      if (deleteUnmatched && unmatchedProducts.length) {
        await transaction.product.deleteMany({
          where: { id: { in: unmatchedProducts.map((product) => product.id) } },
        });
      }
    });

    console.log(
      `Applied: copied ${matches.length} images and updated ${matchedProducts.size} products.`,
    );
    if (deleteUnmatched) {
      console.log(`Deleted ${unmatchedProducts.length} products without a matching image.`);
    }
  } finally {
    await prisma.$disconnect();
  }
}

main().catch((error) => {
  console.error("Boutique image sync failed:", error.message);
  process.exitCode = 1;
});
