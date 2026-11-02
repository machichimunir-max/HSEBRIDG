import { prisma } from "@/lib/db";
import { BoutiquePageClient } from "./BoutiquePageClient";

export default async function BoutiquePage() {
  const categories = await prisma.productCategory.findMany({
    where: { isVisible: true },
    include: {
      _count: { select: { products: { where: { isVisible: true } } } },
    },
    orderBy: { order: "asc" },
  });

  return <BoutiquePageClient categories={categories} />;
}
