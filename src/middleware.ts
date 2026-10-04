import { NextRequest, NextResponse } from "next/server";
import { verifySession } from "@/lib/session";

export async function middleware(request: NextRequest) {
  const pathname = request.nextUrl.pathname;

  // Routes admin nécessitant le rôle ADMIN
  const adminRoutes = ["/admin"];
  const isAdminRoute = adminRoutes.some((route) => pathname.startsWith(route));

  if (isAdminRoute) {
    const session = await verifySession();
    if (!session || session.role !== "ADMIN") {
      return NextResponse.redirect(new URL("/login?error=admin_required", request.url));
    }
    return NextResponse.next();
  }

  // Routes étudiant nécessitant une session
  const studentRoutes = ["/student", "/dashboard"];
  const isStudentRoute = studentRoutes.some((route) => pathname.startsWith(route));

  if (isStudentRoute) {
    const session = await verifySession();
    if (!session) {
      return NextResponse.redirect(new URL("/login", request.url));
    }
    return NextResponse.next();
  }

  // Redirect authenticated users away from auth pages to their dashboard
  if (pathname === "/login" || pathname === "/register") {
    const session = await verifySession();
    if (session) {
      const redirectUrl = session.role === "ADMIN" ? "/admin" : "/student/dashboard";
      return NextResponse.redirect(new URL(redirectUrl, request.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/((?!api|_next/static|_next/image|favicon.ico).*)",
  ],
};
