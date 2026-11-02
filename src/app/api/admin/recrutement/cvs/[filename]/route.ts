import { NextRequest, NextResponse } from "next/server";
import { readFile } from "fs/promises";
import { existsSync } from "fs";
import path from "path";
import { verifySession } from "@/lib/session";

const UPLOAD_DIR = path.join(process.cwd(), "uploads", "cvs");

interface RouteContext {
  params: Promise<{ filename: string }>;
}

// GET /api/admin/recrutement/cvs/[filename] - Serve CV (admin only)
export async function GET(request: NextRequest, context: RouteContext) {
  try {
    // Verify admin session
    const session = await verifySession();
    if (!session || session.role !== "ADMIN") {
      return NextResponse.json(
        { error: "Unauthorized: Admin access required" },
        { status: 401 }
      );
    }

    const { filename } = await context.params;

    // Sanitize filename to prevent directory traversal
    const sanitizedFilename = path.basename(filename);
    if (sanitizedFilename !== filename || filename.includes("..")) {
      return NextResponse.json(
        { error: "Invalid filename" },
        { status: 400 }
      );
    }

    const filepath = path.join(UPLOAD_DIR, sanitizedFilename);

    // Check if file exists
    if (!existsSync(filepath)) {
      return NextResponse.json(
        { error: "File not found" },
        { status: 404 }
      );
    }

    // Read and serve file
    const fileBuffer = await readFile(filepath);

    return new NextResponse(fileBuffer, {
      headers: {
        "Content-Type": "application/pdf",
        "Content-Disposition": `inline; filename="${sanitizedFilename}"`,
        "Cache-Control": "private, max-age=3600",
      },
    });
  } catch (error) {
    console.error("Failed to serve CV:", error);
    return NextResponse.json(
      { error: "Failed to serve CV" },
      { status: 500 }
    );
  }
}
