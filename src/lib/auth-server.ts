"use server";

import { prisma } from "@/lib/db";
import { hashPassword, verifyPassword } from "@/lib/auth";
import { loginSchema, registerSchema } from "@/lib/auth-schemas";
import { createSession } from "@/lib/session";

export async function handleRegister(formData: FormData) {
  try {
    const email = formData.get("email") as string;
    const name = formData.get("name") as string;
    const password = formData.get("password") as string;
    const confirmPassword = formData.get("confirmPassword") as string;

    // Validate input
    const validation = registerSchema.safeParse({
      email,
      name,
      password,
      confirmPassword,
    });

    if (!validation.success) {
      return { error: validation.error.issues[0].message };
    }

    // Check if user exists
    const existingUser = await prisma.user.findUnique({
      where: { email },
    });

    if (existingUser) {
      return { error: "Email already registered" };
    }

    // Hash password
    const passwordHash = await hashPassword(password);

    // Create user
    const user = await prisma.user.create({
      data: {
        email,
        name: name || null,
        passwordHash,
        role: "STUDENT",
      },
    });

    // Create session
    await createSession({
      userId: user.id,
      email: user.email,
      role: user.role,
    });

    return { success: true, userId: user.id };
  } catch (error) {
    console.error("Registration error:", error);
    return { error: "Failed to register. Please try again." };
  }
}

export async function handleLogin(formData: FormData) {
  try {
    const email = formData.get("email") as string;
    const password = formData.get("password") as string;

    // Validate input
    const validation = loginSchema.safeParse({ email, password });

    if (!validation.success) {
      return { error: validation.error.issues[0].message };
    }

    // Find user
    const user = await prisma.user.findUnique({
      where: { email },
    });

    if (!user || !user.isActive) {
      return { error: "Invalid email or password" };
    }

    // Verify password
    const passwordValid = await verifyPassword(password, user.passwordHash);

    if (!passwordValid) {
      return { error: "Invalid email or password" };
    }

    // Create session
    await createSession({
      userId: user.id,
      email: user.email,
      role: user.role,
    });

    return { success: true, userId: user.id, role: user.role };
  } catch (error) {
    console.error("Login error:", error);
    return { error: "Failed to login. Please try again." };
  }
}

export async function handleLogout() {
  try {
    const { destroySession } = await import("@/lib/session");
    await destroySession();
    return { success: true };
  } catch (error) {
    return { error: "Failed to logout" };
  }
}
