import { NextRequest, NextResponse } from "next/server";
import { destroySession } from "@/lib/session";

export async function POST(request: NextRequest) {
  try {
    await destroySession();
    return NextResponse.redirect(new URL("/", request.url), {
      status: 303,
    });
  } catch (error) {
    console.error("Logout error:", error);
    return NextResponse.json(
      { error: "Failed to logout" },
      { status: 500 }
    );
  }
}
