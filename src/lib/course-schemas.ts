import { z } from "zod";

export const courseSchema = z.object({
  title: z.string().min(3, "Title must be at least 3 characters").max(200),
  slug: z.string().min(3).max(100).regex(/^[a-z0-9-]+$/, "Slug must be lowercase alphanumeric with hyphens"),
  shortDescription: z.string().max(500).optional().or(z.literal("")),
  description: z.string().max(5000).optional().or(z.literal("")),
  thumbnail: z.string().max(500).optional().or(z.literal("")),
  category: z.string().max(100).optional().or(z.literal("")),
  level: z.string().max(100).optional().or(z.literal("")),
  duration: z.number().int().nonnegative().optional().or(z.literal(0)),
  price: z.string().regex(/^\d+(\.\d{1,2})?$/, "Invalid price format").optional().or(z.literal("")),
  isFree: z.boolean().default(false),
  isPublished: z.boolean().default(false),
});

export const moduleSchema = z.object({
  title: z.string().min(3).max(200),
  description: z.string().max(1000).optional().or(z.literal("")),
  order: z.number().int().positive(),
});

export const lessonSchema = z.object({
  title: z.string().min(3).max(200),
  description: z.string().max(2000).optional().or(z.literal("")),
  content: z.string().optional().or(z.literal("")),
  durationSeconds: z.number().int().positive().optional(),
  order: z.number().int().positive(),
  status: z.enum(["DRAFT", "PUBLISHED", "ARCHIVED"]).default("DRAFT"),
  isPreview: z.boolean().default(false),
  videoProvider: z.enum(["LOCAL", "VDOCIPHER", "BUNNY"]).default("LOCAL"),
  providerVideoId: z.string().min(1).max(200).optional().or(z.literal("")),
  videoThumbnail: z.string().max(500).optional().or(z.literal("")),
});

export type CourseInput = z.infer<typeof courseSchema>;
export type ModuleInput = z.infer<typeof moduleSchema>;
export type LessonInput = z.infer<typeof lessonSchema>;
