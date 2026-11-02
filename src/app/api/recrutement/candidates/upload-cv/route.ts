import { NextRequest, NextResponse } from "next/server";
import { writeFile, mkdir } from "fs/promises";
import { existsSync } from "fs";
import path from "path";

const UPLOAD_DIR = path.join(process.cwd(), "uploads", "cvs");
const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB
const ALLOWED_MIME_TYPES = ["application/pdf"];

// Magic bytes for PDF validation
const PDF_MAGIC_BYTES = [0x25, 0x50, 0x44, 0x46]; // %PDF

function validatePDFMagicBytes(buffer: Buffer): boolean {
  if (buffer.length < 4) return false;
  for (let i = 0; i < PDF_MAGIC_BYTES.length; i++) {
    if (buffer[i] !== PDF_MAGIC_BYTES[i]) return false;
  }
  return true;
}

// POST /api/recrutement/candidates/upload-cv
export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const file = formData.get("cv") as File | null;

    if (!file) {
      return NextResponse.json(
        { error: "No file uploaded" },
        { status: 400 }
      );
    }

    // Validate MIME type
    if (!ALLOWED_MIME_TYPES.includes(file.type)) {
      return NextResponse.json(
        { error: "Invalid file type. Only PDF files are allowed." },
        { status: 400 }
      );
    }

    // Validate file size
    if (file.size > MAX_FILE_SIZE) {
      return NextResponse.json(
        { error: "File too large. Maximum size is 5MB." },
        { status: 400 }
      );
    }

    // Read file buffer
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    // Validate PDF magic bytes
    if (!validatePDFMagicBytes(buffer)) {
      return NextResponse.json(
        { error: "Invalid PDF file. File does not have valid PDF signature." },
        { status: 400 }
      );
    }

    // Ensure upload directory exists
    if (!existsSync(UPLOAD_DIR)) {
      await mkdir(UPLOAD_DIR, { recursive: true });
    }

    // Generate unique filename
    const timestamp = Date.now();
    const randomString = Math.random().toString(36).substring(2, 15);
    const sanitizedOriginalName = file.name
      .replace(/[^a-zA-Z0-9.-]/g, "_")
      .substring(0, 50);
    const filename = `${timestamp}-${randomString}-${sanitizedOriginalName}`;
    const filepath = path.join(UPLOAD_DIR, filename);

    // Save file
    await writeFile(filepath, buffer);

    // Return relative path (for storage in database)
    const cvUrl = `/uploads/cvs/${filename}`;

    return NextResponse.json({
      success: true,
      cvUrl,
      filename,
    });
  } catch (error) {
    console.error("Failed to upload CV:", error);
    return NextResponse.json(
      { error: "Failed to upload CV" },
      { status: 500 }
    );
  }
}
