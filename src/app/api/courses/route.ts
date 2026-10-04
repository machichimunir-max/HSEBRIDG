import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { getCurrentUser } from "@/lib/session";
import { v4 as uuidv4 } from "uuid";
import { writeFile, mkdir } from "fs/promises";
import { join } from "path";

// Minimal magic-byte headers for the image types we accept.
const MAGIC_BYTES: Record<string, string> = {
  // JPEG: FF D8 FF
  jpeg: "\xFF\xD8\xFF",
  // PNG: 89 50 4E 47
  png: "\x89PNG\r\n\x1A\n",
  // WebP: 52 49 46 46 __ __ __ __ W E B P
  webp: "RIFF\u0000\u0000\u0000WEBP",
};

// Validate decoded bytes against allowed image types.
function validateImageBytes(decoded: Buffer): string {
  const header = decoded.slice(0, 12).toString("hex");
  for (const [format, magic] of Object.entries(MAGIC_BYTES)) {
    const magicHex = Buffer.from(magic, "binary").toString("hex");
    if (header.startsWith(magicHex)) {
      return format;
    }
  }
  throw new Error("File is not a supported image (jpg, png, webp)");
}

export async function POST(request: NextRequest) {
  try {
    const user = await getCurrentUser();
    if (!user || user.role !== "ADMIN") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();

    let { thumbnail } = body;

    // --- Thumbnail upload handling (admin only, server-side type/size verified) ---
    if (thumbnail && typeof thumbnail === "string") {
      if (!thumbnail.startsWith("data:image/")) {
        return NextResponse.json(
          { error: "Thumbnail must be a PNG, JPG or WebP data URL" },
          { status: 400 }
        );
      }

      // Split header from payload: data:image/png;base64,...
      const headerMatch = thumbnail.match(/^data:image\/([a-zA-Z0-9-+]+);base64,(.+)$/);
      if (!headerMatch) {
        return NextResponse.json(
          { error: "Thumbnail must be a valid base64 data URL" },
          { status: 400 }
        );
      }

      const declaredType = headerMatch[1].toLowerCase();
      const payload = headerMatch[2];
      if (!/^[A-Za-z0-9+/=]+$/.test(payload)) {
        return NextResponse.json(
          { error: "Thumbnail must be a valid base64 data URL" },
          { status: 400 }
        );
      }

      const decoded = Buffer.from(payload, "base64");
      if (decoded.length > 2 * 1024 * 1024) {
        return NextResponse.json(
          { error: "Thumbnail must be smaller than 2MB" },
          { status: 413 }
        );
      }

      const realType = validateImageBytes(decoded);
      const isDeclaredJpeg = declaredType === "jpeg" || declaredType === "jpg";
      if (realType !== declaredType && !(isDeclaredJpeg && realType === "jpg")) {
        return NextResponse.json(
          { error: "Declared image type does not match the actual file type" },
          { status: 400 }
        );
      }

      const ext = realType === "jpg" ? "jpg" : realType;
      const safeName = `${uuidv4().replace(/-/g, "")}.${ext}`;
      const uploadsDir = join(process.cwd(), "public", "uploads", "thumbnails");
      await mkdir(uploadsDir, { recursive: true });
      const filePath = join(uploadsDir, safeName);
      await writeFile(filePath, decoded);

      // Store the public URL path so cleanup can delete it by filename.
      thumbnail = `/uploads/thumbnails/${safeName}`;
    }

    const course = await prisma.course.create({
      data: {
        title: body.title,
        slug: body.slug,
        shortDescription: body.shortDescription || undefined,
        description: body.description || undefined,
        thumbnail: thumbnail || undefined,
        category: body.category || undefined,
        level: body.level || undefined,
        duration: body.duration || undefined,
        modules: {
          create: (body.modules as any[])?.map((m: any) => ({
            title: m.title,
            description: m.description || undefined,
            order: m.order ?? 0,
            lessons: {
              create: (m.lessons as any[])?.map((l: any, idx: number) => ({
                title: l.title,
                description: l.description || undefined,
                content: l.content || undefined,
                durationSeconds: l.duration || undefined,
                order: l.order ?? idx,
                status: l.status || "PUBLISHED",
                isPreview: l.isPreview || false,
              })),
            },
          })),
        },
        price: body.price !== undefined ? parseFloat(body.price) : undefined,
        isFree: body.isFree !== undefined ? body.isFree : undefined,
        isPublished: body.isPublished !== undefined ? body.isPublished : false,
      },
      include: {
        modules: {
          include: { lessons: true },
        },
      },
    });

    return NextResponse.json(course);
  } catch (error) {
    console.error("Error creating course:", error);
    if (error instanceof Error && error.message.includes("P2002")) {
      return NextResponse.json({ error: "This slug already exists" }, { status: 409 });
    }
    if (error instanceof Error && error.message.includes("P2025")) {
      return NextResponse.json({ error: "Related record not found" }, { status: 404 });
    }
    return NextResponse.json({ error: "Failed to create course" }, { status: 500 });
  }
}

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const publishedOnly = searchParams.get("published") === "true";
    const category = searchParams.get("category");
    const level = searchParams.get("level");
    const search = searchParams.get("search");

    const where: any = { isPublished: true };

    if (category) where.category = category;
    if (level) where.level = level;
    if (search) {
      where.OR = [
        { title: { contains: search, mode: "insensitive" } },
        { description: { contains: search, mode: "insensitive" } },
      ];
    }

    const courses = await prisma.course.findMany({
      where,
      orderBy: [{ createdAt: "desc" }],
      include: {
        modules: {
          orderBy: { order: "asc" },
          include: { lessons: { orderBy: { order: "asc" } } },
        },
        _count: { select: { enrollments: true } },
      },
    });

    return NextResponse.json(courses);
  } catch (error) {
    console.error("Error fetching courses:", error);
    return NextResponse.json({ error: "Failed to fetch courses" }, { status: 500 });
  }
}
