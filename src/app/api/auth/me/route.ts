import { NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/session";

export async function GET() {
  try {
    const user = await getCurrentUser();

    if (!user) {
      return NextResponse.json({ user: null }, { status: 200 });
    }

    return NextResponse.json({
      user: {
        email: user.email,
        role: user.role,
        userId: user.userId,
      }
    });
  } catch (error) {
    return NextResponse.json({ user: null }, { status: 200 });
  }
}
