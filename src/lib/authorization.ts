import { prisma } from "@/lib/db";
import { UserRole } from "@/types/user";

export async function requireStudentEnrollment(userId: string, courseId: string) {
  const enrollment = await prisma.enrollment.findUnique({
    where: {
      userId_courseId: {
        userId,
        courseId,
      },
    },
    include: {
      course: true,
    },
  });

  if (!enrollment || !enrollment.isActive || !enrollment.course.isPublished) {
    return false;
  }

  return true;
}

export async function requireRole(userRole: UserRole | UserRole[], user: { role: UserRole } | null) {
  if (!user) return false;
  const roles = Array.isArray(userRole) ? userRole : [userRole];
  return roles.includes(user.role);
}

export function assertOwnershipOrAdmin(ownerId: string, currentUserId: string, currentUserRole: UserRole) {
  return currentUserRole === "ADMIN" || ownerId === currentUserId;
}
