"use server";

import { prisma } from "@/lib/db";
import { courseSchema, lessonSchema, moduleSchema } from "@/lib/course-schemas";
import { getCurrentUser } from "@/lib/session";
import { getLocalVideoPlaybackUrl, getVideoProviderInstance } from "@/lib/video-provider";

export type CourseManagementError = { error: string };

function ensureAdminUser() {
  return getCurrentUser().then((user) => {
    if (!user || user.role !== "ADMIN") {
      return { error: "Unauthorized" } as const;
    }

    return { user } as const;
  });
}

export async function getAllCoursesForAdmin() {
  const auth = await ensureAdminUser();
  if ("error" in auth) return { error: auth.error };

  const courses = await prisma.course.findMany({
    orderBy: [{ createdAt: "desc" }],
    include: {
      modules: {
        orderBy: [{ order: "asc" }],
        include: {
          lessons: {
            orderBy: [{ order: "asc" }],
            include: {
              videoMetadata: true,
              progress: {
                select: {
                  completionPercent: true,
                  isCompleted: true,
                },
              },
            },
          },
        },
      },
      enrollments: true,
    },
  });

  const stats = {
    totalCourses: courses.length,
    publishedCourses: courses.filter((course) => course.isPublished).length,
    totalStudents: await prisma.user.count({ where: { role: "STUDENT" } }),
    totalEnrollments: await prisma.enrollment.count({ where: { isActive: true } }),
  };

  return { courses, stats };
}

export async function createCourseRecord(data: {
  title: string;
  slug?: string;
  shortDescription?: string;
  description?: string;
  thumbnail?: string;
  category?: string;
  level?: string;
  duration?: number;
  price?: string | number | null;
  isFree?: boolean;
}) {
  const auth = await ensureAdminUser();
  if ("error" in auth) return { error: auth.error };

  const normalized = {
    title: data.title,
    slug: (data.slug || data.title).trim().toLowerCase().replace(/[^a-z0-9-\s]/g, "").replace(/\s+/g, "-").replace(/-+/g, "-"),
    shortDescription: data.shortDescription || "",
    description: data.description || "",
    thumbnail: data.thumbnail || "",
    category: data.category || "",
    level: data.level || "",
    duration: data.duration || 0,
    price: data.price ? String(data.price) : "",
    isFree: Boolean(data.isFree),
    isPublished: false,
  };

  const validation = courseSchema.safeParse(normalized);
  if (!validation.success) {
    return { error: validation.error.issues[0]?.message || "Invalid course data" };
  }

  const existing = await prisma.course.findUnique({ where: { slug: validation.data.slug } });
  if (existing) {
    return { error: "This course slug already exists" };
  }

  const course = await prisma.course.create({
    data: {
      title: validation.data.title,
      slug: validation.data.slug,
      shortDescription: validation.data.shortDescription || null,
      description: validation.data.description || null,
      thumbnail: validation.data.thumbnail || null,
      category: validation.data.category || null,
      level: validation.data.level || null,
      duration: validation.data.duration || null,
      price: validation.data.price ? Number(validation.data.price) : null,
      isFree: validation.data.isFree || false,
      isPublished: false,
    },
  });

  return { success: true, course };
}

export async function updateCourseRecord(courseId: string, data: {
  title?: string;
  slug?: string;
  shortDescription?: string;
  description?: string;
  thumbnail?: string;
  price?: string | number | null;
  isFree?: boolean;
}) {
  const auth = await ensureAdminUser();
  if ("error" in auth) return { error: auth.error };

  const existingCourse = await prisma.course.findUnique({ where: { id: courseId } });
  if (!existingCourse) {
    return { error: "Course not found" };
  }

  const normalized = {
    title: data.title || existingCourse.title,
    slug: (data.slug || existingCourse.slug).trim().toLowerCase().replace(/[^a-z0-9-\s]/g, "").replace(/\s+/g, "-").replace(/-+/g, "-"),
    shortDescription: data.shortDescription ?? existingCourse.shortDescription ?? "",
    description: data.description ?? existingCourse.description ?? "",
    thumbnail: data.thumbnail ?? existingCourse.thumbnail ?? "",
    price: data.price !== undefined ? String(data.price) : existingCourse.price ? String(existingCourse.price) : "",
    isFree: data.isFree ?? existingCourse.isFree,
    isPublished: existingCourse.isPublished,
  };

  const validation = courseSchema.safeParse(normalized);
  if (!validation.success) {
    return { error: validation.error.issues[0]?.message || "Invalid course data" };
  }

  const course = await prisma.course.update({
    where: { id: courseId },
    data: {
      title: validation.data.title,
      slug: validation.data.slug,
      shortDescription: validation.data.shortDescription || null,
      description: validation.data.description || null,
      thumbnail: validation.data.thumbnail || null,
      price: validation.data.price ? Number(validation.data.price) : null,
      isFree: validation.data.isFree,
    },
  });

  return { success: true, course };
}

export async function deleteCourseRecord(courseId: string) {
  const auth = await ensureAdminUser();
  if ("error" in auth) return { error: auth.error };

  const exists = await prisma.course.findUnique({ where: { id: courseId } });
  if (!exists) {
    return { error: "Course not found" };
  }

  await prisma.course.delete({ where: { id: courseId } });
  return { success: true };
}

export async function toggleCoursePublishRecord(courseId: string) {
  const auth = await ensureAdminUser();
  if ("error" in auth) return { error: auth.error };

  const course = await prisma.course.findUnique({ where: { id: courseId } });
  if (!course) {
    return { error: "Course not found" };
  }

  const updated = await prisma.course.update({ where: { id: courseId }, data: { isPublished: !course.isPublished } });
  return { success: true, isPublished: updated.isPublished };
}

export async function createModuleRecord(courseId: string, data: { title: string; description?: string; order?: number }) {
  const auth = await ensureAdminUser();
  if ("error" in auth) return { error: auth.error };

  const course = await prisma.course.findUnique({ where: { id: courseId } });
  if (!course) {
    return { error: "Course not found" };
  }

  const existingModules = await prisma.module.count({ where: { courseId } });
  const order = data.order ?? existingModules + 1;
  const validation = moduleSchema.safeParse({ title: data.title, description: data.description || "", order });
  if (!validation.success) {
    return { error: validation.error.issues[0]?.message || "Invalid module data" };
  }

  const module = await prisma.module.create({
    data: {
      courseId,
      title: validation.data.title,
      description: validation.data.description || null,
      order: validation.data.order,
    },
  });

  return { success: true, module };
}

export async function updateModuleRecord(moduleId: string, data: { title: string; description?: string; order?: number }) {
  const auth = await ensureAdminUser();
  if ("error" in auth) return { error: auth.error };

  const module = await prisma.module.findUnique({ where: { id: moduleId } });
  if (!module) {
    return { error: "Module not found" };
  }

  const validation = moduleSchema.safeParse({ title: data.title, description: data.description || "", order: data.order ?? module.order });
  if (!validation.success) {
    return { error: validation.error.issues[0]?.message || "Invalid module data" };
  }

  const updated = await prisma.module.update({
    where: { id: moduleId },
    data: {
      title: validation.data.title,
      description: validation.data.description || null,
      order: validation.data.order,
    },
  });

  return { success: true, module: updated };
}

export async function deleteModuleRecord(moduleId: string) {
  const auth = await ensureAdminUser();
  if ("error" in auth) return { error: auth.error };

  const module = await prisma.module.findUnique({ where: { id: moduleId } });
  if (!module) {
    return { error: "Module not found" };
  }

  await prisma.module.delete({ where: { id: moduleId } });
  return { success: true };
}

export async function createLessonRecord(moduleId: string, data: {
  title: string;
  description?: string;
  durationSeconds?: number;
  order?: number;
  isPreview?: boolean;
  status?: "DRAFT" | "PUBLISHED" | "ARCHIVED";
  videoProvider?: "LOCAL" | "VDOCIPHER" | "BUNNY";
  providerVideoId?: string;
}) {
  const auth = await ensureAdminUser();
  if ("error" in auth) return { error: auth.error };

  const module = await prisma.module.findUnique({ where: { id: moduleId } });
  if (!module) {
    return { error: "Module not found" };
  }

  const existingLessons = await prisma.lesson.count({ where: { moduleId } });
  const order = data.order ?? existingLessons + 1;
  const validation = lessonSchema.safeParse({
    title: data.title,
    description: data.description || "",
    content: "",
    durationSeconds: data.durationSeconds || 120,
    order,
    status: data.status || "PUBLISHED",
    isPreview: Boolean(data.isPreview),
    videoProvider: data.videoProvider || "LOCAL",
    providerVideoId: data.providerVideoId || `local-${Date.now()}`,
    videoThumbnail: "",
  });

  if (!validation.success) {
    return { error: validation.error.issues[0]?.message || "Invalid lesson data" };
  }

  const lesson = await prisma.lesson.create({
    data: {
      moduleId,
      title: validation.data.title,
      description: validation.data.description || null,
      content: "",
      durationSeconds: validation.data.durationSeconds || 120,
      status: validation.data.status,
      order: validation.data.order,
      isPreview: validation.data.isPreview,
      videoMetadata: {
        create: {
          videoProvider: validation.data.videoProvider as "LOCAL" | "VDOCIPHER" | "BUNNY",
          providerVideoId: validation.data.providerVideoId || `local-${Date.now()}`,
          duration: validation.data.durationSeconds || 120,
          thumbnail: validation.data.videoThumbnail || undefined,
        },
      },
    },
    include: { videoMetadata: true },
  });

  return { success: true, lesson };
}

export async function updateLessonRecord(lessonId: string, data: {
  title?: string;
  description?: string;
  durationSeconds?: number;
  order?: number;
  isPreview?: boolean;
  status?: "DRAFT" | "PUBLISHED" | "ARCHIVED";
  videoProvider?: "LOCAL" | "VDOCIPHER" | "BUNNY";
  providerVideoId?: string;
}) {
  const auth = await ensureAdminUser();
  if ("error" in auth) return { error: auth.error };

  const lesson = await prisma.lesson.findUnique({
    where: { id: lessonId },
    include: { videoMetadata: true },
  });

  if (!lesson) {
    return { error: "Lesson not found" };
  }

  const validation = lessonSchema.safeParse({
    title: data.title || lesson.title,
    description: data.description ?? lesson.description ?? "",
    content: lesson.content || "",
    durationSeconds: data.durationSeconds ?? lesson.durationSeconds ?? 120,
    order: data.order ?? lesson.order,
    status: data.status ?? lesson.status,
    isPreview: data.isPreview ?? lesson.isPreview,
    videoProvider: data.videoProvider || lesson.videoMetadata?.videoProvider || "LOCAL",
    providerVideoId: data.providerVideoId || lesson.videoMetadata?.providerVideoId || `local-${lesson.id}`,
    videoThumbnail: lesson.videoMetadata?.thumbnail || "",
  });

  const safeVideoProvider = (validation.data?.videoProvider ?? "LOCAL") as "LOCAL" | "VDOCIPHER" | "BUNNY";

  if (!validation.success) {
    return { error: validation.error.issues[0]?.message || "Invalid lesson data" };
  }

  const updatedLesson = await prisma.lesson.update({
    where: { id: lessonId },
    data: {
      title: validation.data.title,
      description: validation.data.description || null,
      durationSeconds: validation.data.durationSeconds,
      order: validation.data.order,
      status: validation.data.status,
      isPreview: Boolean(validation.data.isPreview),
      videoMetadata: {
        upsert: {
          create: {
            videoProvider: safeVideoProvider,
            providerVideoId: validation.data.providerVideoId || `local-${lesson.id}`,
            duration: validation.data.durationSeconds,
            thumbnail: validation.data.videoThumbnail || undefined,
          },
          update: {
            videoProvider: safeVideoProvider,
            providerVideoId: validation.data.providerVideoId || `local-${lesson.id}`,
            duration: validation.data.durationSeconds,
            thumbnail: validation.data.videoThumbnail || undefined,
          },
        },
      },
    },
    include: { videoMetadata: true },
  });

  return { success: true, lesson: updatedLesson };
}

export async function deleteLessonRecord(lessonId: string) {
  const auth = await ensureAdminUser();
  if ("error" in auth) return { error: auth.error };

  const lesson = await prisma.lesson.findUnique({ where: { id: lessonId } });
  if (!lesson) {
    return { error: "Lesson not found" };
  }

  await prisma.lesson.delete({ where: { id: lessonId } });
  return { success: true };
}

export async function getPublishedCourseCatalog() {
  return prisma.course.findMany({
    where: { isPublished: true },
    orderBy: [{ createdAt: "desc" }],
    include: {
      modules: { include: { lessons: true } },
      enrollments: true,
    },
  });
}

export async function getCourseDetailBySlug(slug: string) {
  return prisma.course.findUnique({
    where: { slug },
    include: {
      modules: {
        orderBy: [{ order: "asc" }],
        include: {
          lessons: { orderBy: [{ order: "asc" }], include: { videoMetadata: true } },
        },
      },
      enrollments: true,
    },
  });
}

export async function getStudentDashboardData() {
  const user = await getCurrentUser();
  if (!user) {
    return { enrolledCourses: [], recentLesson: null, completedLessons: 0, overallProgress: 0 };
  }

  const enrollments = await prisma.enrollment.findMany({
    where: { userId: user.userId, isActive: true },
    include: {
      course: {
        include: {
          modules: { include: { lessons: true } },
        },
      },
    },
    orderBy: [{ enrolledAt: "desc" }],
  });

  const completedLessons = await prisma.lessonProgress.count({
    where: { userId: user.userId, isCompleted: true },
  });

  const recentLesson = await prisma.lessonProgress.findFirst({
    where: { userId: user.userId },
    orderBy: [{ lastWatchedAt: "desc" }],
    include: { lesson: { include: { module: { include: { course: true } } } } },
  });

  let totalProgress = 0;
  const lessonProgress = await prisma.lessonProgress.findMany({
    where: {
      userId: user.userId,
      lesson: {
        module: {
          courseId: { in: enrollments.map((enrollment) => enrollment.courseId) },
        },
      },
    },
    select: { lessonId: true, isCompleted: true },
  });

  const progressByLessonId = new Map(lessonProgress.map((entry) => [entry.lessonId, entry]));

  const safeCourses = enrollments.map((enrollment) => {
    const allLessons = enrollment.course.modules.flatMap((module) => module.lessons);
    const total = allLessons.length;
    const completed = allLessons.filter((lesson) => progressByLessonId.get(lesson.id)?.isCompleted).length;
    const percent = total > 0 ? Math.round((completed / total) * 100) : 0;
    totalProgress += percent;
    return { ...enrollment, progressPercent: percent };
  });

  const overallProgress = safeCourses.length > 0 ? Math.round(totalProgress / safeCourses.length) : 0;

  return {
    enrolledCourses: safeCourses,
    recentLesson,
    completedLessons,
    overallProgress,
  };
}

export async function getStudentCourseLearningData(courseId: string) {
  const user = await getCurrentUser();
  if (!user) {
    return { error: "Please sign in to continue learning." } as const;
  }

  const enrollment = await prisma.enrollment.findUnique({
    where: { userId_courseId: { userId: user.userId, courseId } },
    include: { course: true },
  });

  if (!enrollment || !enrollment.isActive || !enrollment.course.isPublished) {
    return { error: "You are not enrolled in this course." } as const;
  }

  const course = await prisma.course.findUnique({
    where: { id: courseId },
    include: {
      modules: {
        orderBy: [{ order: "asc" }],
        include: {
          lessons: {
            orderBy: [{ order: "asc" }],
            include: {
              videoMetadata: true,
              progress: {
                where: { userId: user.userId },
                select: { isCompleted: true, completionPercent: true, isStarted: true },
              },
            },
          },
        },
      },
    },
  });

  if (!course) {
    return { error: "Course not found." } as const;
  }

  const firstLesson = course.modules.flatMap((module) => module.lessons).find((lesson) => lesson.status === "PUBLISHED") ?? null;
  return { course, firstLesson };
}

export async function startLessonForStudent(lessonId: string) {
  const user = await getCurrentUser();
  if (!user) {
    return { error: "Please sign in." };
  }

  const lesson = await prisma.lesson.findUnique({
    where: { id: lessonId },
    include: { module: { include: { course: true } } },
  });

  if (!lesson) return { error: "Lesson not found." };

  const enrollment = await prisma.enrollment.findUnique({
    where: { userId_courseId: { userId: user.userId, courseId: lesson.module.courseId } },
  });

  if (!enrollment || !enrollment.isActive || !lesson.module.course.isPublished) {
    return { error: "Unauthorized lesson access." };
  }

  const progress = await prisma.lessonProgress.upsert({
    where: { userId_lessonId: { userId: user.userId, lessonId } },
    create: {
      userId: user.userId,
      lessonId,
      isStarted: true,
      completionPercent: 0,
      isCompleted: false,
      watchTimeSeconds: 0,
      lastWatchedAt: new Date(),
    },
    update: {
      isStarted: true,
      lastWatchedAt: new Date(),
    },
  });

  return { success: true, progress };
}

export async function completeLessonForStudent(lessonId: string) {
  const user = await getCurrentUser();
  if (!user) {
    return { error: "Please sign in." };
  }

  const lesson = await prisma.lesson.findUnique({
    where: { id: lessonId },
    include: { module: { include: { course: true } } },
  });

  if (!lesson || !lesson.module.course.isPublished) {
    return { error: "Lesson not found." };
  }

  const enrollment = await prisma.enrollment.findUnique({
    where: { userId_courseId: { userId: user.userId, courseId: lesson.module.courseId } },
  });

  if (!enrollment || !enrollment.isActive) {
    return { error: "You are not enrolled in this course." };
  }

  const progress = await prisma.lessonProgress.upsert({
    where: { userId_lessonId: { userId: user.userId, lessonId } },
    create: {
      userId: user.userId,
      lessonId,
      isStarted: true,
      isCompleted: true,
      completionPercent: 100,
      watchTimeSeconds: lesson.durationSeconds || 0,
      lastWatchedAt: new Date(),
    },
    update: {
      isStarted: true,
      isCompleted: true,
      completionPercent: 100,
      watchTimeSeconds: lesson.durationSeconds || 0,
      lastWatchedAt: new Date(),
    },
  });

  return { success: true, progress };
}

export async function getCourseProgressSnapshot(courseId: string) {
  const user = await getCurrentUser();
  if (!user) return { error: "Unauthorized" };

  const enrollment = await prisma.enrollment.findUnique({
    where: { userId_courseId: { userId: user.userId, courseId } },
  });

  if (!enrollment || !enrollment.isActive) {
    return { error: "You are not enrolled in this course." };
  }

  const course = await prisma.course.findUnique({
    where: { id: courseId },
    include: {
      modules: {
        include: {
          lessons: { include: { progress: { where: { userId: user.userId }, select: { completionPercent: true, isCompleted: true, lastWatchedAt: true } } } },
        },
      },
    },
  });

  if (!course) {
    return { error: "Course not found." };
  }

  const allLessons = course.modules.flatMap((module) => module.lessons);
  const completed = allLessons.filter((lesson) => lesson.progress.some((entry) => entry.isCompleted)).length;
  const percent = allLessons.length > 0 ? Math.round((completed / allLessons.length) * 100) : 0;

  return { course, completed, total: allLessons.length, percent };
}

export async function getVideoLessonAccess(lessonId: string) {
  const user = await getCurrentUser();
  if (!user) {
    return { error: "Please sign in." };
  }

  const lesson = await prisma.lesson.findUnique({
    where: { id: lessonId },
    include: { module: { include: { course: true } }, videoMetadata: true },
  });

  if (!lesson) {
    return { error: "Lesson not found." };
  }

  const enrollment = await prisma.enrollment.findUnique({
    where: { userId_courseId: { userId: user.userId, courseId: lesson.module.courseId } },
  });

  if (!enrollment || !enrollment.isActive || !lesson.module.course.isPublished) {
    return { error: "Unauthorized lesson access." };
  }

  const videoMeta = lesson.videoMetadata ?? null;
  const providerVideoId = videoMeta?.providerVideoId ?? `local-${lesson.id}`;
  const provider = videoMeta?.videoProvider ?? "LOCAL";
  const playbackUrl = getLocalVideoPlaybackUrl(providerVideoId);

  return {
    success: true,
    lesson,
    playbackUrl,
    provider,
    duration: lesson.durationSeconds ?? videoMeta?.duration ?? 180,
    thumbnail: videoMeta?.thumbnail ?? "",
  };
}

export async function enrollInCourse(courseId: string) {
  const user = await getCurrentUser();
  if (!user) {
    return { error: "Please sign in to enroll in a course." };
  }

  const course = await prisma.course.findUnique({
    where: { id: courseId },
  });

  if (!course || !course.isPublished) {
    return { error: "This course is not available." };
  }

  // Check if already enrolled
  const existingEnrollment = await prisma.enrollment.findUnique({
    where: { userId_courseId: { userId: user.userId, courseId } },
  });

  if (existingEnrollment) {
    return { error: "You are already enrolled in this course." };
  }

  const enrollment = await prisma.enrollment.create({
    data: {
      userId: user.userId,
      courseId,
      isActive: true,
    },
  });

  return { success: true, enrollment };
}
