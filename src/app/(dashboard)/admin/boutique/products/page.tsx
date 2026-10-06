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

  return products;
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