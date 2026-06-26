import { NextResponse } from "next/server";
import * as userService from "@/lib/services/user.service";
import { verifyPassword, signToken, setSessionCookie } from "@/lib/auth";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    
    if (!body.email || !body.password) {
      return NextResponse.json({ error: "Email and password are required." }, { status: 400 });
    }

    const user = await userService.findUserByEmail(body.email);

    if (!user || !(await verifyPassword(body.password, user.password))) {
      return NextResponse.json({ error: "Invalid email or password." }, { status: 401 });
    }

    if (user.isBanned) {
      return NextResponse.json({ error: "This account has been banned." }, { status: 403 });
    }

    // Exclude password from response
    const { password, ...safeUser } = user;

    // Sign JWT token and set session cookie
    const token = await signToken({ userId: user.id, role: user.role });
    await setSessionCookie(token);

    return NextResponse.json({
      user: safeUser,
    });
  } catch (error: any) {
    console.error("Error during login:", error);
    return NextResponse.json({ error: error.message || "An unexpected error occurred." }, { status: 500 });
  }
}
