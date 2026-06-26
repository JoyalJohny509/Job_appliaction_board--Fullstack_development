import { NextResponse } from "next/server";
import { getSession } from "@/lib/auth";
import type { Role, SafeUser } from "@/lib/types";

/**
 * Require an authenticated session. Returns the user or a 401 response.
 */
export async function requireAuth(): Promise<
  { user: SafeUser; error?: never } | { user?: never; error: NextResponse }
> {
  const session = await getSession();
  if (!session) {
    return {
      error: NextResponse.json({ error: "Authentication required." }, { status: 401 }),
    };
  }
  return { user: session.user };
}

/**
 * Require an authenticated session with one of the given roles.
 * Returns the user or a 401/403 response.
 */
export async function requireRole(
  ...roles: Role[]
): Promise<{ user: SafeUser; error?: never } | { user?: never; error: NextResponse }> {
  const result = await requireAuth();
  if (result.error) return result;

  if (!roles.includes(result.user.role)) {
    return {
      error: NextResponse.json(
        { error: "You do not have permission to perform this action." },
        { status: 403 }
      ),
    };
  }
  return { user: result.user };
}
