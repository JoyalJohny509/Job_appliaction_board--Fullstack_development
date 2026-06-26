import { prisma } from "@/lib/prisma";
import type { Role, SafeUser } from "@/lib/types";

/**
 * Find a user by their email address. Used during login.
 * Note: This includes the password field, which is needed for authentication.
 */
export async function findUserByEmail(email: string) {
  return prisma.user.findUnique({
    where: { email },
  });
}

/**
 * Find a user by their ID, excluding the password field.
 */
export async function findUserById(id: string): Promise<SafeUser | null> {
  const user = await prisma.user.findUnique({
    where: { id },
  });
  if (!user) return null;
  const { password, ...safeUser } = user;
  return safeUser as SafeUser;
}

/**
 * Create a new user. The password must already be hashed by the caller.
 * Auto-generates initials for the profile picture if not provided.
 */
export async function createUser(data: {
  name: string;
  email: string;
  password: string;
  role?: Role;
  phone?: string;
  location?: string;
}): Promise<SafeUser> {
  // Generate profile picture initials from name
  const initials = data.name
    .trim()
    .split(/\s+/)
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);

  const user = await prisma.user.create({
    data: {
      name: data.name,
      email: data.email,
      password: data.password,
      role: data.role ?? "JOB_SEEKER",
      phone: data.phone,
      location: data.location,
      profilePicture: initials,
    },
  });

  const { password, ...safeUser } = user;
  return safeUser as SafeUser;
}

/**
 * Update a user's profile fields, excluding password.
 */
export async function updateUserProfile(
  id: string,
  data: Partial<{
    name: string;
    phone: string | null;
    location: string | null;
    profilePicture: string | null;
    resume: string | null;
  }>
): Promise<SafeUser> {
  const user = await prisma.user.update({
    where: { id },
    data,
  });

  const { password, ...safeUser } = user;
  return safeUser as SafeUser;
}

/**
 * List all users, ordered by creation date descending, excluding passwords.
 */
export async function listUsers(): Promise<SafeUser[]> {
  const users = await prisma.user.findMany({
    orderBy: { createdAt: "desc" },
  });

  return users.map(({ password, ...safeUser }) => safeUser as SafeUser);
}

/**
 * Ban a user by setting isBanned to true.
 */
export async function banUser(id: string): Promise<SafeUser> {
  const user = await prisma.user.update({
    where: { id },
    data: { isBanned: true },
  });

  const { password, ...safeUser } = user;
  return safeUser as SafeUser;
}

/**
 * Unban a user by setting isBanned to false.
 */
export async function unbanUser(id: string): Promise<SafeUser> {
  const user = await prisma.user.update({
    where: { id },
    data: { isBanned: false },
  });

  const { password, ...safeUser } = user;
  return safeUser as SafeUser;
}
