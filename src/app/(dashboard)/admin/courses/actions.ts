"use server";

import { prisma } from "@/lib/db";
import { revalidatePath } from "next/cache";

export async function deleteCourseAction(id: string) {
  try {
    await prisma.course.delete({
      where: { id },
    });

    revalidatePath("/admin/courses");
    return { success: true };
  } catch (error) {
    console.error("Failed to delete course:", error);
    return { success: false, error: "Failed to delete course" };
  }
}
