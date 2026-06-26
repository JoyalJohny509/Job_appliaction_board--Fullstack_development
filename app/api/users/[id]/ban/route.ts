import { NextResponse } from "next/server";
import { requireRole } from "@/lib/api-guard";
import * as userService from "@/lib/services/user.service";

export async function PUT(request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const auth = await requireRole("ADMIN");
    if (auth.error) return auth.error;

    const { id } = await params;
    const body = await request.json();
    const shouldBan = body.isBanned === true;

    // Verify the user exists first
    const existingUser = await userService.findUserById(id);
    if (!existingUser) {
      return NextResponse.json({ error: "User not found." }, { status: 404 });
    }

    // Prevent administrators from banning themselves
    if (existingUser.id === auth.user.id) {
      return NextResponse.json({ error: "You cannot ban your own account." }, { status: 400 });
    }

    let user;
    if (shouldBan) {
      user = await userService.banUser(id);
    } else {
      user = await userService.unbanUser(id);
    }

    return NextResponse.json({ user });
  } catch (error: any) {
    console.error("Error toggling user ban status:", error);
    return NextResponse.json({ error: error.message || "An unexpected error occurred." }, { status: 500 });
  }
}
