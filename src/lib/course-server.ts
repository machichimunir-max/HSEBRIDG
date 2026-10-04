"use server";

import { prisma } from "@/lib/db";
import { getCurrentUser } from "@/lib/session";
import { courseSchema, moduleSchema, lessonSchema } from "@/lib/course-schemas";

// ADMIN ONLY: Create a new course
export async function createCourse(formData: FormData) {
  try {
    const user = await getCurrentUser();
    if (!user || user.role !== "ADMIN") {
      return { error: "Unauthorized" };
    }

    const title = formData.get("title") as string;
    const slug = formData.get("slug") as string;
    const shortDescription = formData.get("shortDescription") as string;
    const description = formData.get("description") as string;
    const price = formData.get("price") as string;
    const isFree = formData.get("isFree") === "on";

    const validation = courseSchema.safeParse({
      title,
      slug,
      shortDescription,
      description,
      price,
      isFree,
    });

    if (!validation.success) {
      return { error: validation.error.issues[0].message };
    }

    // Check if slug exists
    const existingCourse = await prisma.course.findUnique({
      where: { slug },
    });

    if (existingCourse) {
      return { error: "This course slug already exists" };
    }

    const course = await prisma.course.create({
      data: {
        title,
        slug,
        shortDescription: shortDescription || null,
        description: description || null,
        price: price ? parseFloat(price) : null,
        isFree,
        isPublished: false,
      },
    });

    return { success: true, courseId: course.id };
  } catch (error) {
    console.error("Create course error:", error);
    return { error: "Failed to create course" };
  }
}

// ADMIN ONLY: Update course
export async function updateCourse(courseId: string, formData: FormData) {
  try {
    const user = await getCurrentUser();
    if (!user || user.role !== "ADMIN") {
      return { error: "Unauthorized" };
    }

    const course = await prisma.course.findUnique({
      where: { id: courseId },
    });

    if (!course) {
      return { error: "Course not found" };
    }

    const title = formData.get("title") as string;
    const shortDescription = formData.get("shortDescription") as string;
    const description = formData.get("description") as string;
    const price = formData.get("price") as string;
    const isFree = formData.get("isFree") === "on";

    const updatedCourse = await prisma.course.update({
      where: { id: courseId },
      data: {
        title,
        shortDescription: shortDescription || null,
        description: description || null,
        price: price ? parseFloat(price) : null,
        isFree,
      },
    });

    return { success: true, courseId: updatedCourse.id };
  } catch (error) {
    console.error("Update course error:", error);
    return { error: "Failed to update course" };
  }
}

// ADMIN ONLY: Publish/unpublish course
export async function toggleCoursePublish(courseId: string) {
  try {
    const user = await getCurrentUser();
    if (!user || user.role !== "ADMIN") {
      return { error: "Unauthorized" };
    }

    const course = await prisma.course.findUnique({
      where: { id: courseId },
    });

    if (!course) {
      return { error: "Course not found" };
    }

    const updated = await prisma.course.update({
      where: { id: courseId },
      data: { isPublished: !course.isPublished },
    });

    return { success: true, isPublished: updated.isPublished };
  } catch (error) {
    console.error("Toggle publish error:", error);
    return { error: "Failed to update course" };
  }
}

// ADMIN ONLY: Delete course
export async function deleteCourse(courseId: string) {
  try {
    const user = await getCurrentUser();
    if (!user || user.role !== "ADMIN") {
      return { error: "Unauthorized" };
    }

    await prisma.course.delete({
      where: { id: courseId },
    });

    return { success: true };
  } catch (error) {
    console.error("Delete course error:", error);
    return { error: "Failed to delete course" };
  }
}

// PUBLIC: Get all published courses
export async function getPublishedCourses() {
  try {
    const courses = await prisma.course.findMany({
      where: { isPublished: true },
      select: {
        id: true,
        title: true,
        slug: true,
        shortDescription: true,
        thumbnail: true,
        price: true,
        isFree: true,
        _count: {
          select: { enrollments: true, modules: true },
        },
      },
    });

    return courses;
  } catch (error) {
    console.error("Get courses error:", error);
    return [];
  }
}
