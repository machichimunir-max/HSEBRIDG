import { z } from "zod";

const envSchema = z.object({
  NODE_ENV: z.enum(["development", "test", "production"]).default("development"),
  DATABASE_URL: z.string().min(1, "DATABASE_URL is required"),
  NEXTAUTH_SECRET: z.string().min(1, "NEXTAUTH_SECRET is required").optional(),
  JWT_SECRET: z.string().min(1, "JWT_SECRET is required").optional(),
  VIDEO_PROVIDER: z.enum(["local", "vdocipher", "bunny"]).default("local"),
  VIDEO_PROVIDER_API_KEY: z.string().optional(),
  VIDEO_PROVIDER_LIBRARY_ID: z.string().optional(),
  APP_URL: z.string().url().default("http://localhost:3000"),
});

export const env = envSchema.parse(process.env);
