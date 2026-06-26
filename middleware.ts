import { NextRequest, NextResponse } from "next/server";
import { jwtVerify } from "jose";

const COOKIE_NAME = "hirepath-token";

/** Routes that require authentication and the roles allowed to access them. */
const PROTECTED_ROUTES: { prefix: string; roles: string[] }[] = [
  { prefix: "/dashboard/job-seeker", roles: ["JOB_SEEKER"] },
  { prefix: "/dashboard/employer", roles: ["EMPLOYER"] },
  { prefix: "/dashboard/admin", roles: ["ADMIN"] },
];

/** Routes that logged-in users should be redirected away from. */
const AUTH_ROUTES = ["/auth/login", "/auth/signup"];

/** Role-to-dashboard mapping for redirect after login or when visiting auth pages. */
const ROLE_DASHBOARDS: Record<string, string> = {
  JOB_SEEKER: "/dashboard/job-seeker",
  EMPLOYER: "/dashboard/employer",
  ADMIN: "/dashboard/admin",
};

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const token = request.cookies.get(COOKIE_NAME)?.value;

  let payload: { userId: string; role: string } | null = null;

  if (token) {
    try {
      const secret = new TextEncoder().encode(process.env.JWT_SECRET ?? "");
      const { payload: decoded } = await jwtVerify(token, secret);
      payload = {
        userId: decoded.sub as string,
        role: decoded.role as string,
      };
    } catch {
      // Invalid or expired token — treat as unauthenticated
    }
  }

  /* ── Redirect logged-in users away from auth pages ─────────────── */
  if (payload && AUTH_ROUTES.some((route) => pathname.startsWith(route))) {
    const dashboard = ROLE_DASHBOARDS[payload.role] ?? "/";
    return NextResponse.redirect(new URL(dashboard, request.url));
  }

  /* ── Protect dashboard routes ──────────────────────────────────── */
  for (const route of PROTECTED_ROUTES) {
    if (pathname.startsWith(route.prefix)) {
      if (!payload) {
        const loginUrl = new URL("/auth/login", request.url);
        loginUrl.searchParams.set("callbackUrl", pathname);
        return NextResponse.redirect(loginUrl);
      }
      if (!route.roles.includes(payload.role)) {
        const dashboard = ROLE_DASHBOARDS[payload.role] ?? "/";
        return NextResponse.redirect(new URL(dashboard, request.url));
      }
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/dashboard/:path*", "/auth/:path*"],
};
