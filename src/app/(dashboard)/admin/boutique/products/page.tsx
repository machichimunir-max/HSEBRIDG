import { prisma } from "@/lib/db";
import { ProductsClient } from "./ProductsClient";

async function getProducts() {
  const products = await prisma.product.findMany({
    include: {
      category: {
        select: { id: true, titleFr: true, titleAr: true, slug: true },
      },
      _count: { select: { quoteItems: true } },
    },
    orderBy: { order: "asc" },
  });

  // Convert Prisma types to client-compatible types
  return products.map(p => ({
    ...p,
    price: p.price ? Number(p.price) : 0,
    specifications: (p.specifications as Record<string, string>) || {},
  }));
}

async function getCategories() {
  return prisma.productCategory.findMany({
    where: { isVisible: true },
    orderBy: { order: "asc" },
    select: { id: true, titleFr: true, titleAr: true, slug: true },
  });
}

export default async function BoutiqueProductsPage() {
  const [products, categories] = await Promise.all([getProducts(), getCategories()]);

  return <ProductsClient products={products} categories={categories} />;
}