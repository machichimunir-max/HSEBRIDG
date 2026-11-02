import { notFound } from "next/navigation";
import { prisma } from "@/lib/db";
import { ProductDetailClient } from "./ProductDetailClient";

interface PageProps {
  params: Promise<{ slug: string }>;
}

export default async function ProductDetailPage({ params }: PageProps) {
  const { slug } = await params;

  const product = await prisma.product.findFirst({
    where: { slug, isVisible: true },
    include: {
      category: {
        select: {
          id: true,
          titleFr: true,
          titleAr: true,
          slug: true,
        },
      },
    },
  });

  if (!product) {
    notFound();
  }

  // Fetch related products from same category
  const relatedProducts = await prisma.product.findMany({
    where: {
      categoryId: product.categoryId,
      isVisible: true,
      NOT: { id: product.id },
    },
    take: 4,
    orderBy: { order: "asc" },
  });

  // Convert Decimal to number for client
  const productWithNumberPrice = {
    ...product,
    price: product.price ? Number(product.price) : null,
    specifications: (product.specifications as Record<string, string>) || {},
  };

  const relatedWithNumberPrice = relatedProducts.map((p) => ({
    ...p,
    price: p.price ? Number(p.price) : null,
    specifications: (p.specifications as Record<string, string>) || {},
  }));

  return (
    <ProductDetailClient
      product={productWithNumberPrice}
      relatedProducts={relatedWithNumberPrice}
    />
  );
}
