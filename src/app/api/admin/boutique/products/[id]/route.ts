import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { verifySession } from "@/lib/session";

// GET /api/admin/boutique/products/[id] - Get single product
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await verifySession();
    if (!session || session.role !== "ADMIN") {
      return NextResponse.json(
        { error: "Unauthorized: Admin access required" },
        { status: 401 }
      );
    }

    const { id } = await params;

    const product = await prisma.product.findUnique({
      where: { id },
      include: {
        category: {
          select: { id: true, titleFr: true, titleAr: true, slug: true },
        },
      },
    });

    if (!product) {
      return NextResponse.json(
        { error: "Product not found" },
        { status: 404 }
      );
    }

    // Convert Decimal to number for client
    const productWithNumberPrice = {
      ...product,
      price: product.price ? Number(product.price) : null,
    };

    return NextResponse.json(productWithNumberPrice);
  } catch (error) {
    console.error("Failed to fetch product:", error);
    return NextResponse.json(
      { error: "Failed to fetch product" },
      { status: 500 }
    );
  }
}

// PATCH /api/admin/boutique/products/[id] - Update product
export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await verifySession();
    if (!session || session.role !== "ADMIN") {
      return NextResponse.json(
        { error: "Unauthorized: Admin access required" },
        { status: 401 }
      );
    }

    const { id } = await params;
    const body = await request.json();
    const {
      titleFr,
      titleAr,
      slug,
      categoryId,
      shortDescFr,
      shortDescAr,
      descriptionFr,
      descriptionAr,
      images,
      price,
      stockStatus,
      certifications,
      specifications,
      sku,
      isVisible,
      isFeatured,
      order,
    } = body;

    // Check slug uniqueness if changed
    if (slug) {
      const existing = await prisma.product.findFirst({
        where: { slug, NOT: { id } },
      });
      if (existing) {
        return NextResponse.json(
          { error: "Slug already exists" },
          { status: 400 }
        );
      }
    }

    const product = await prisma.product.update({
      where: { id },
      data: {
        titleFr,
        titleAr,
        slug,
        categoryId,
        shortDescFr: shortDescFr || null,
        shortDescAr: shortDescAr || null,
        descriptionFr: descriptionFr || null,
        descriptionAr: descriptionAr || null,
        images: images || [],
        price: price !== undefined && price !== null ? parseFloat(price) : null,
        stockStatus: stockStatus || "in_stock",
        certifications: certifications || [],
        specifications: specifications || {},
        sku: sku || null,
        isVisible: isVisible !== false,
        isFeatured: isFeatured || false,
        order: order || 0,
      },
    });

    // Convert Decimal to number for client
    const productWithNumberPrice = {
      ...product,
      price: product.price ? Number(product.price) : null,
    };

    return NextResponse.json({ success: true, product: productWithNumberPrice });
  } catch (error) {
    console.error("Failed to update product:", error);
    return NextResponse.json(
      { error: "Failed to update product" },
      { status: 500 }
    );
  }
}

// DELETE /api/admin/boutique/products/[id] - Delete product
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await verifySession();
    if (!session || session.role !== "ADMIN") {
      return NextResponse.json(
        { error: "Unauthorized: Admin access required" },
        { status: 401 }
      );
    }

    const { id } = await params;

    await prisma.product.delete({ where: { id } });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Failed to delete product:", error);
    return NextResponse.json(
      { error: "Failed to delete product" },
      { status: 500 }
    );
  }
}