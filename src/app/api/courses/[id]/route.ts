import { NextRequest, NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/session";
import { prisma } from "@/lib/db";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const user = await getCurrentUser();
    if (!user || user.role !== "ADMIN") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id } = await params;
    const course = await prisma.course.findUnique({
      where: { id },
      include: {
        modules: true,
        enrollments: true,
      },
    });

    if (!course) {
      return NextResponse.json({ error: "Course not found" }, { status: 404 });
    }

    return NextResponse.json(course);
  } catch (error) {
    console.error("Error fetching course:", error);
    return NextResponse.json({ error: "Failed to fetch course" }, { status: 500 });
  }
}

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const user = await getCurrentUser();
    if (!user || user.role !== "ADMIN") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id } = await params;
    const body = await request.json();

    // --- Course-level fields (unchanged) ---
    const courseLevelFields: Record<string, unknown> = {};
    if ("title" in body) courseLevelFields.title = body.title || undefined;
    if ("slug" in body) courseLevelFields.slug = body.slug || undefined;
    if ("shortDescription" in body) courseLevelFields.shortDescription = body.shortDescription || undefined;
    if ("description" in body) courseLevelFields.description = body.description || undefined;
    if ("thumbnail" in body) courseLevelFields.thumbnail = body.thumbnail || undefined;
    if ("category" in body) courseLevelFields.category = body.category || undefined;
    if ("level" in body) courseLevelFields.level = body.level || undefined;
    if ("duration" in body) courseLevelFields.duration = body.duration || undefined;
    if ("price" in body) courseLevelFields.price = body.price ? parseFloat(body.price) : undefined;
    if ("isFree" in body) courseLevelFields.isFree = body.isFree !== undefined ? body.isFree : undefined;
    if ("isPublished" in body) courseLevelFields.isPublished = body.isPublished !== undefined ? body.isPublished : undefined;

    // --- Lesson titles (admin only, ownership verified) ---
    if ("lessons" in body && Array.isArray(body.lessons)) {
      // Verify every lesson id belongs to THIS course before accepting any change.
      const moduleLessonIds = new Set<string>();
      const modules = await prisma.module.findMany({
        where: { courseId: id },
        include: { lessons: true },
      });
      for (const module of modules) {
        for (const lesson of module.lessons) {
          moduleLessonIds.add(lesson.id);
        }
      }

      const invalid: string[] = [];
      for (const item of body.lessons) {
        if (!item?.id) {
          return NextResponse.json(
            { error: "Each lesson update must include a lesson id" },
            { status: 400 }
          );
        }
        if (!moduleLessonIds.has(item.id)) {
          invalid.push(item.id);
        }
      }
      if (invalid.length > 0) {
        return NextResponse.json(
          { error: `Lessons do not belong to this course: ${invalid.slice(0, 10).join(", ")}` },
          { status: 409 }
        );
      }

      // Apply updates in a single transaction so all-or-nothing applies.
      const lessonUpdates = body.lessons.filter((l: any) => l.title !== undefined);
      if (lessonUpdates.length > 0) {
        await prisma.$transaction(
          lessonUpdates.map((l: any) =>
            prisma.lesson.update({
              where: { id: l.id },
              data: { title: l.title },
            })
          )
        );
      }
    }

    const course = await prisma.course.update({
      where: { id },
      data: courseLevelFields,
      include: {
        modules: true,
        enrollments: true,
      },
    });

    return NextResponse.json(course);
  } catch (error) {
    console.error("Error updating course:", error);
    return NextResponse.json({ error: "Failed to update course" }, { status: 500 });
  }
}
