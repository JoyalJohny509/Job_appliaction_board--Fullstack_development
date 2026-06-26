import { SignJWT, jwtVerify } from "jose";
import bcrypt from "bcryptjs";
import { cookies } from "next/headers";
import { prisma } from "@/lib/prisma";
import type { SafeUser, Session, TokenPayload } from "@/lib/types";

export const COOKIE_NAME = "hirepath-token";

function getSecretKey(): Uint8Array {
  const secret = process.env.JWT_SECRET;
  if (!secret) {
    throw new Error("JWT_SECRET environment variable is not defined");
  }
  return new TextEncoder().encode(secret);
}

/**
 * Hashes a plain text password using bcryptjs.
 */
export async function hashPassword(plain: string): Promise<string> {
  return bcrypt.hash(plain, 12);
}

/**
 * Verifies a plain text password against a hash using bcryptjs.
 */
export async function verifyPassword(plain: string, hash: string): Promise<boolean> {
  return bcrypt.compare(plain, hash);
}

/**
 * Signs a TokenPayload into a JWT token.
 */
export async function signToken(payload: TokenPayload): Promise<string> {
  const secretKey = getSecretKey();
  const expiry = process.env.JWT_EXPIRY || "7d";

  return new SignJWT({ userId: payload.userId, role: payload.role })
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setSubject(payload.userId)
    .setExpirationTime(expiry)
    .sign(secretKey);
}

/**
 * Verifies a JWT token and returns its payload, or null if invalid.
 */
export async function verifyToken(token: string): Promise<TokenPayload | null> {
  try {
    const secretKey = getSecretKey();
    const { payload } = await jwtVerify(token, secretKey);
    
    if (typeof payload.userId === "string" && typeof payload.role === "string") {
      return {
        userId: payload.userId,
        role: payload.role as any, // Cast to Role
      };
    }
    return null;
  } catch (error) {
    return null;
  }
}

/**
 * Reads the session cookie, verifies the token, and returns the authenticated user session.
 */
export async function getSession(): Promise<Session | null> {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get(COOKIE_NAME)?.value;
    if (!token) {
      return null;
    }

    const payload = await verifyToken(token);
    if (!payload) {
      return null;
    }

    const user = await prisma.user.findUnique({
      where: { id: payload.userId },
    });

    if (!user || user.isBanned) {
      return null;
    }

    // Exclude password from the returned user object
    const { password, ...safeUser } = user;
    return { user: safeUser as SafeUser };
  } catch (error) {
    return null;
  }
}

/**
 * Sets the httpOnly session cookie in the response headers.
 */
export async function setSessionCookie(token: string): Promise<void> {
  const cookieStore = await cookies();
  cookieStore.set(COOKIE_NAME, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: 7 * 24 * 60 * 60, // 7 days in seconds
  });
}

/**
 * Clears the session cookie.
 */
export async function clearSessionCookie(): Promise<void> {
  const cookieStore = await cookies();
  cookieStore.delete(COOKIE_NAME);
}
