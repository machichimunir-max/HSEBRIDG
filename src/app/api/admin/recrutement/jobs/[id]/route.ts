import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { verifySession } from "@/lib/session";

interface RouteContext {
  params: Promise<{ id: string }>;
}

// GET /api/admin/recrutement/jobs/[id] - Get single job posting
export async function GET(request: NextRequest, context: RouteContext) {
  try {
    const session = await verifySession();
    if (!session || session.role !== "ADMIN") {
      return NextResponse.json(
        { error: "Unauthorized: Admin access required" },
        { status: 401 }
      );
    }

    const { id } = await context.params;

    const job = await prisma.jobPosting.findUnique({
      where: { id },
      include: {
        _count: { select: { applications: true } },
      },
    });

    if (!job) {
      return NextResponse.json({ error: "Job posting not found" }, { status: 404 });
    }

    return NextResponse.json({ job });
  } catch (error) {
    console.error("Failed to fetch job posting:", error);
    return NextResponse.json(
      { error: "Failed to fetch job posting" },
      { status: 500 }
    );
  }
}

// PATCH /api/admin/recrutement/jobs/[id] - Update job posting
export async function PATCH(request: NextRequest, context: RouteContext) {
  try {
    const session = await verifySession();
    if (!session || session.role !== "ADMIN") {
      return NextResponse.json(
        { error: "Unauthorized: Admin access required" },
        { status: 401 }
      );
    }

    const { id } = await context.params;
    const body = await request.json();

    const {
      titleFr,
      titleAr,
      domain,
      contractType,
      scope,
      location,
      descriptionFr,
      descriptionAr,
      requirementsFr,
      requirementsAr,
      isActive,
    } = body;

    // Validate enum values if provided
    if (contractType) {
      const validContractTypes = ["INTERIM", "CDD", "CDI"];
      if (!validContractTypes.includes(contractType)) {
        return NextResponse.json(
          { error: `Invalid contractType. Must be one of: ${validContractTypes.join(", ")}` },
          { status: 400 }
        );
      }
    }

    if (scope) {
      const validScopes = ["NATIONAL", "INTERNATIONAL"];
      if (!validScopes.includes(scope)) {
        return NextResponse.json(
          { error: `Invalid scope. Must be one of: ${validScopes.join(", ")}` },
          { status: 400 }
        );
      }
    }

    const job = await prisma.jobPosting.update({
      where: { id },
      data: {
        ...(titleFr !== undefined && { titleFr }),
        ...(titleAr !== undefined && { titleAr }),
        ...(domain !== undefined && { domain }),
        ...(contractType !== undefined && { contractType }),
        ...(scope !== undefined && { scope }),
        ...(location !== undefined && { location }),
        ...(descriptionFr !== undefined && { descriptionFr }),
        ...(descriptionAr !== undefined && { descriptionAr }),
        ...(requirementsFr !== undefined && { requirementsFr }),
        ...(requirementsAr !== undefined && { requirementsAr }),
        ...(isActive !== undefined && { isActive }),
      },
    });

    return NextResponse.json({ success: true, job });
  } catch (error: any) {
    if (error.code === "P2025") {
      return NextResponse.json({ error: "Job posting not found" }, { status: 404 });
    }
    console.error("Failed to update job posting:", error);
    return NextResponse.json(
      { error: "Failed to update job posting" },
      { status: 500 }
    );
  }
}

// DELETE /api/admin/recrutement/jobs/[id] - Delete job posting
export async function DELETE(request: NextRequest, context: RouteContext) {
  try {
    const session = await verifySession();
    if (!session || session.role !== "ADMIN") {
      return NextResponse.json(
        { error: "Unauthorized: Admin access required" },
        { status: 401 }
      );
    }

    const { id } = await context.params;

    await prisma.jobPosting.delete({
      where: { id },
    });

    return NextResponse.json({ success: true });
  } catch (error: any) {
    if (error.code === "P2025") {
      return NextResponse.json({ error: "Job posting not found" }, { status: 404 });
    }
    console.error("Failed to delete job posting:", error);
    return NextResponse.json(
      { error: "Failed to delete job posting" },
      { status: 500 }
    );
  }
}
