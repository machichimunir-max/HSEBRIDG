"use server";

import { prisma } from "@/lib/db";
import { revalidatePath } from "next/cache";
import { verifySession } from "@/lib/session";
import { slugify } from "@/lib/utils";

export interface ProductInput {
  titleFr: string;
  titleAr: string;
  slug?: string;
  categoryId: string;
  shortDescFr?: string;
  shortDescAr?: string;
  descriptionFr?: string;
  descriptionAr?: string;
  images?: string[];
  price?: number | null;
  stockStatus?: string;
  certifications?: string[];
  specifications?: Record<string, string>;
  sku?: string;
  isVisible?: boolean;
  isFeatured?: boolean;
  order?: number;
}

export interface ProductUpdateInput extends ProductInput {
  id: string;
}

/**
 * Get all products with filters (admin)
 */
export async function getProductsAdmin({
  search,
  categoryId,
  isVisible,
  stockStatus,
  page = 1,
  limit = 20,
}: {
  search?: string;
  categoryId?: string;
  isVisible?: boolean | null;
  stockStatus?: string;
  page?: number;
  limit?: number;
} = {}) {
  const session = await verifySession();
  if (!session || session.role !== "ADMIN") {
    throw new Error("Unauthorized: Admin access required");
  }

  const where: any = {};

  if (search) {
    where.OR = [
      { titleFr: { contains: search, mode: "insensitive" } },
      { titleAr: { contains: search, mode: "insensitive" } },
      { sku: { contains: search, mode: "insensitive" } },
    ];
  }

  if (categoryId) {
    where.categoryId = categoryId;
  }

  if (isVisible !== null && isVisible !== undefined) {
    where.isVisible = isVisible;
  }

  if (stockStatus) {
    where.stockStatus = stockStatus;
  }

  const [products, total] = await Promise.all([
    prisma.product.findMany({
      where,
      include: {
        category: {
          select: { id: true, titleFr: true, titleAr: true, slug: true },
        },
        _count: { select: { quoteItems: true } },
      },
      orderBy: { order: "asc" },
      skip: (page - 1) * limit,
      take: limit,
    }),
    prisma.product.count({ where }),
  ]);

  return { products, total, page, limit, totalPages: Math.ceil(total / limit) };
}

/**
 * Get single product by ID (admin)
 */
export async function getProductAdmin(id: string) {
  const session = await verifySession();
  if (!session || session.role !== "ADMIN") {
    throw new Error("Unauthorized: Admin access required");
  }

  return prisma.product.findUnique({
    where: { id },
    include: {
      category: {
        select: { id: true, titleFr: true, titleAr: true, slug: true },
      },
    },
  });
}

/**
 * Create new product (admin)
 */
export async function createProduct(data: ProductInput) {
  const session = await verifySession();
  if (!session || session.role !== "ADMIN") {
    throw new Error("Unauthorized: Admin access required");
  }

  // Generate slug if not provided
  const slug = data.slug || slugify(data.titleFr);

  // Check slug uniqueness
  const existing = await prisma.product.findUnique({ where: { slug } });
  if (existing) {
    throw new Error("Slug already exists");
  }

  const product = await prisma.product.create({
    data: {
      titleFr: data.titleFr,
      titleAr: data.titleAr,
      slug,
      categoryId: data.categoryId,
      shortDescFr: data.shortDescFr || null,
      shortDescAr: data.shortDescAr || null,
      descriptionFr: data.descriptionFr || null,
      descriptionAr: data.descriptionAr || null,
      images: data.images || [],
      price: data.price !== undefined && data.price !== null ? data.price : null,
      stockStatus: data.stockStatus || "in_stock",
      certifications: data.certifications || [],
      specifications: data.specifications || {},
      sku: data.sku || null,
      isVisible: data.isVisible !== false,
      isFeatured: data.isFeatured || false,
      order: data.order || 0,
    },
  });

  revalidatePath("/admin/boutique/products");
  revalidatePath("/boutique");

  return { success: true, product };
}

/**
 * Update product (admin)
 */
export async function updateProduct(data: ProductUpdateInput) {
  const session = await verifySession();
  if (!session || session.role !== "ADMIN") {
    throw new Error("Unauthorized: Admin access required");
  }

  const { id, ...updateData } = data;

  // Check slug uniqueness if changed
  if (updateData.slug) {
    const existing = await prisma.product.findFirst({
      where: { slug: updateData.slug, NOT: { id } },
    });
    if (existing) {
      throw new Error("Slug already exists");
    }
  }

  const product = await prisma.product.update({
    where: { id },
    data: {
      titleFr: updateData.titleFr,
      titleAr: updateData.titleAr,
      slug: updateData.slug,
      categoryId: updateData.categoryId,
      shortDescFr: updateData.shortDescFr || null,
      shortDescAr: updateData.shortDescAr || null,
      descriptionFr: updateData.descriptionFr || null,
      descriptionAr: updateData.descriptionAr || null,
      images: updateData.images || [],
      price: updateData.price !== undefined && updateData.price !== null ? updateData.price : null,
      stockStatus: updateData.stockStatus || "in_stock",
      certifications: updateData.certifications || [],
      specifications: updateData.specifications || {},
      sku: updateData.sku || null,
      isVisible: updateData.isVisible !== false,
      isFeatured: updateData.isFeatured || false,
      order: updateData.order || 0,
    },
  });

  revalidatePath("/admin/boutique/products");
  revalidatePath("/boutique");
  revalidatePath(`/boutique/produit/${product.slug}`);

  return { success: true, product };
}

/**
 * Delete product (admin)
 */
export async function deleteProduct(id: string) {
  const session = await verifySession();
  if (!session || session.role !== "ADMIN") {
    throw new Error("Unauthorized: Admin access required");
  }

  await prisma.product.delete({ where: { id } });

  revalidatePath("/admin/boutique/products");
  revalidatePath("/boutique");

  return { success: true };
}

/**
 * Get categories for dropdown (admin)
 */
export async function getCategoriesForSelect() {
  const session = await verifySession();
  if (!session || session.role !== "ADMIN") {
    throw new Error("Unauthorized: Admin access required");
  }

  return prisma.productCategory.findMany({
    where: { isVisible: true },
    orderBy: { order: "asc" },
    select: { id: true, titleFr: true, titleAr: true, slug: true },
  });
}