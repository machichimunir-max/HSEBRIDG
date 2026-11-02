import { notFound } from "next/navigation";
import { prisma } from "@/lib/db";
import { CategoryProductsClient } from "./CategoryProductsClient";

interface PageProps {
  params: Promise<{ category: string }>;
}

export default async function CategoryPage({ params }: PageProps) {
  const { category: slug } = await params;

  const category = await prisma.productCategory.findUnique({
    where: { slug },
    include: {
      products: {
        where: { isVisible: true },
        orderBy: { order: "asc" },
      },
    },
  });

  if (!category) {
    notFound();
  }

  // Convert Decimal to number for client
  const productsWithNumberPrice = category.products.map((p) => ({
    ...p,
    price: p.price ? Number(p.price) : null,
    specifications: (p.specifications as Record<string, string>) || {},
  }));

  return (
    <CategoryProductsClient
      category={{
        ...category,
        products: productsWithNumberPrice,
      }}
    />
  );
}
