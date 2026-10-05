import { prisma } from "@/lib/db";
import { BoutiqueCategoriesClient } from "./BoutiqueCategoriesClient";

async function getCategories() {
  const categories = await prisma.productCategory.findMany({
    orderBy: { order: "asc" },
    include: {
      _count: {
        select: { products: true },
      },
    },
  });

  return categories;
}

export default async function BoutiqueCategoriesPage() {
  const categories = await getCategories();

  return <BoutiqueCategoriesClient categories={categories} />;
}
