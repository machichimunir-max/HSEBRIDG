import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { verifySession } from "@/lib/session";

// GET /api/admin/boutique/products - List products with filters
export async function GET(request: NextRequest) {
  try {
    const session = await verifySession();
    if (!session || session.role !== "ADMIN") {
      return NextResponse.json(
        { error: "Unauthorized: Admin access required" },
        { status: 401 }
      );
    }

    const { searchParams } = new URL(request.url);
    const search = searchParams.get("search") || undefined;
    const categoryId = searchParams.get("categoryId") || undefined;
    const isVisible = searchParams.get("isVisible");
    const stockStatus = searchParams.get("stockStatus") || undefined;
    const page = parseInt(searchParams.get("page") || "1");
    const limit = parseInt(searchParams.get("limit") || "20");

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
      where.isVisible = isVisible === "true";
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

    return NextResponse.json({
      products,
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    });
  } catch (error) {
    console.error("Failed to fetch products:", error);
    return NextResponse.json(
      { error: "Failed to fetch products" },
      { status: 500 }
    );
  }
}

// POST /api/admin/boutique/products - Create new product
export async function POST(request: NextRequest) {
  try {
    const session = await verifySession();
    if (!session || session.role !== "ADMIN") {
      return NextResponse.json(
        { error: "Unauthorized: Admin access required" },
        { status: 401 }
      );
    }

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

    // Validation
    if (!titleFr || !titleAr || !categoryId) {
      return NextResponse.json(
        { error: "Missing required fields: titleFr, titleAr, categoryId" },
        { status: 400 }
      );
    }

    // Generate slug if not provided
    const productSlug = slug || titleFr
      .toLowerCase()
      .trim()
      .replace(/[^\w\s-]/g, "")
      .replace(/[\s_-]+/g, "-")
      .replace(/^-+|-+$/g, "");

    // Check slug uniqueness
    const existing = await prisma.product.findUnique({ where: { slug: productSlug } });
    if (existing) {
      return NextResponse.json(
        { error: "Slug already exists" },
        { status: 400 }
      );
    }

    const product = await prisma.product.create({
      data: {
        titleFr,
        titleAr,
        slug: productSlug,
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

    return NextResponse.json({ success: true, product });
  } catch (error) {
    console.error("Failed to create product:", error);
    return NextResponse.json(
      { error: "Failed to create product" },
      { status: 500 }
    );
  }
}