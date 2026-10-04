import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { verifyPassword } from "@/lib/auth";
import { loginSchema } from "@/lib/auth-schemas";
import { createSession } from "@/lib/session";

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const email = formData.get("email") as string;
    const password = formData.get("password") as string;

    // Validate input
    const validation = loginSchema.safeParse({ email, password });

    if (!validation.success) {
      return NextResponse.json(
        { error: validation.error.issues[0].message },
        { status: 400 }
      );
    }

    // Find user
    const user = await prisma.user.findUnique({
      where: { email },
    });

    if (!user || !user.isActive) {
      return NextResponse.json(
        { error: "Invalid email or password" },
        { status: 401 }
      );
    }

    // Verify password
    const passwordValid = await verifyPassword(password, user.passwordHash);

    if (!passwordValid) {
      return NextResponse.json(
        { error: "Invalid email or password" },
        { status: 401 }
      );
    }

    // Create session
    await createSession({
      userId: user.id,
      email: user.email,
      role: user.role,
    });

    // Redirect based on role
    const redirectUrl = user.role === "ADMIN" ? "/admin" : "/student/dashboard";
    return NextResponse.redirect(new URL(redirectUrl, request.url), {
      status: 303,
    });
  } catch (error) {
    console.error("Login error:", error);
    return NextResponse.json(
      { error: "Failed to login. Please try again." },
      { status: 500 }
    );
  }
}
