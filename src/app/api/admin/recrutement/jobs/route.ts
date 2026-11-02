import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { verifySession } from "@/lib/session";

// GET /api/admin/recrutement/jobs - List all job postings
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
    const domain = searchParams.get("domain") || undefined;
    const contractType = searchParams.get("contractType") || undefined;
    const scope = searchParams.get("scope") || undefined;
    const isActive = searchParams.get("isActive");

    const where: any = {};

    if (search) {
      where.OR = [
        { titleFr: { contains: search, mode: "insensitive" } },
        { titleAr: { contains: search, mode: "insensitive" } },
        { domain: { contains: search, mode: "insensitive" } },
      ];
    }

    if (domain) {
      where.domain = domain;
    }

    if (contractType) {
      where.contractType = contractType;
    }

    if (scope) {
      where.scope = scope;
    }

    if (isActive !== null && isActive !== undefined) {
      where.isActive = isActive === "true";
    }

    const jobs = await prisma.jobPosting.findMany({
      where,
      include: {
        _count: { select: { applications: true } },
      },
      orderBy: { createdAt: "desc" },
    });

    return NextResponse.json({ jobs });
  } catch (error) {
    console.error("Failed to fetch job postings:", error);
    return NextResponse.json(
      { error: "Failed to fetch job postings" },
      { status: 500 }
    );
  }
}

// POST /api/admin/recrutement/jobs - Create new job posting
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

    // Validation
    if (!titleFr || !titleAr || !domain || !contractType || !scope) {
      return NextResponse.json(
        { error: "Missing required fields: titleFr, titleAr, domain, contractType, scope" },
        { status: 400 }
      );
    }

    // Validate enum values
    const validContractTypes = ["INTERIM", "CDD", "CDI"];
    const validScopes = ["NATIONAL", "INTERNATIONAL"];

    if (!validContractTypes.includes(contractType)) {
      return NextResponse.json(
        { error: `Invalid contractType. Must be one of: ${validContractTypes.join(", ")}` },
        { status: 400 }
      );
    }

    if (!validScopes.includes(scope)) {
      return NextResponse.json(
        { error: `Invalid scope. Must be one of: ${validScopes.join(", ")}` },
        { status: 400 }
      );
    }

    const job = await prisma.jobPosting.create({
      data: {
        titleFr,
        titleAr,
        domain,
        contractType,
        scope,
        location: location || null,
        descriptionFr: descriptionFr || null,
        descriptionAr: descriptionAr || null,
        requirementsFr: requirementsFr || null,
        requirementsAr: requirementsAr || null,
        isActive: isActive !== false,
      },
    });

    return NextResponse.json({ success: true, job });
  } catch (error) {
    console.error("Failed to create job posting:", error);
    return NextResponse.json(
      { error: "Failed to create job posting" },
      { status: 500 }
    );
  }
}
