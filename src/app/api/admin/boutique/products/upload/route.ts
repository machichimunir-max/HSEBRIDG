import { NextRequest, NextResponse } from "next/server";
import { verifySession } from "@/lib/session";
import { writeFile, mkdir } from "fs/promises";
import { join } from "path";
import { existsSync } from "fs";

const ALLOWED_TYPES = ["image/jpeg", "image/png", "image/webp"];
const MAX_FILE_SIZE = 2 * 1024 * 1024; // 2MB
const UPLOAD_DIR = join(process.cwd(), "public", "uploads", "products");

// Magic byte signatures for validation
const MAGIC_BYTES: Record<string, number[][]> = {
  "image/jpeg": [[0xff, 0xd8, 0xff]],
  "image/png": [[0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a]],
  "image/webp": [[0x52, 0x49, 0x46, 0x46]], // RIFF header (need to check WEBP at offset 8)
};

async function validateFileType(buffer: Buffer, mimeType: string): Promise<boolean> {
  const signatures = MAGIC_BYTES[mimeType];
  if (!signatures) return false;

  for (const sig of signatures) {
    let matches = true;
    for (let i = 0; i < sig.length; i++) {
      if (buffer[i] !== sig[i]) {
        matches = false;
        break;
      }
    }
    // Special case for WebP: check "WEBP" at offset 8
    if (mimeType === "image/webp" && matches) {
      const webpSig = buffer.subarray(8, 12);
      if (webpSig.toString() !== "WEBP") matches = false;
    }
    if (matches) return true;
  }
  return false;
}

export async function POST(request: NextRequest) {
  try {
    const session = await verifySession();
    if (!session || session.role !== "ADMIN") {
      return NextResponse.json(
        { error: "Unauthorized: Admin access required" },
        { status: 401 }
      );
    }

    const formData = await request.formData();
    const file = formData.get("file") as File;

    if (!file) {
      return NextResponse.json({ error: "No file provided" }, { status: 400 });
    }

    // Check file size
    if (file.size > MAX_FILE_SIZE) {
      return NextResponse.json(
        { error: "File size exceeds 2MB limit" },
        { status: 400 }
      );
    }

    // Check MIME type
    if (!ALLOWED_TYPES.includes(file.type)) {
      return NextResponse.json(
        { error: "Invalid file type. Only JPG, PNG, and WebP are allowed" },
        { status: 400 }
      );
    }

    // Read file buffer for magic byte validation
    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    // Validate magic bytes
    const isValidType = await validateFileType(buffer, file.type);
    if (!isValidType) {
      return NextResponse.json(
        { error: "File content does not match declared type" },
        { status: 400 }
      );
    }

    // Ensure upload directory exists
    if (!existsSync(UPLOAD_DIR)) {
      await mkdir(UPLOAD_DIR, { recursive: true });
    }

    // Generate unique filename
    const timestamp = Date.now();
    const randomSuffix = Math.random().toString(36).substring(2, 10);
    const extension = file.type === "image/jpeg" ? "jpg" : file.type === "image/png" ? "png" : "webp";
    const filename = `product_${timestamp}_${randomSuffix}.${extension}`;
    const filepath = join(UPLOAD_DIR, filename);

    // Write file
    await writeFile(filepath, buffer);

    // Return public URL
    const publicUrl = `/uploads/products/${filename}`;

    return NextResponse.json({
      success: true,
      url: publicUrl,
      filename,
    });
  } catch (error) {
    console.error("Upload error:", error);
    return NextResponse.json(
      { error: "Upload failed" },
      { status: 500 }
    );
  }
}