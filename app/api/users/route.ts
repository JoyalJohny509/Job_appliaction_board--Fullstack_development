import { NextResponse } from "next/server";
import { requireRole } from "@/lib/api-guard";
import * as userService from "@/lib/services/user.service";

export async function GET() {
  try {
    const auth = await requireRole("ADMIN");
    if (auth.error) return auth.error;

    const list = await userService.listUsers();
    return NextResponse.json({ users: list });
  } catch (error) {
    console.error("Error listing users:", error);
    return NextResponse.json({ error: "An unexpected error occurred." }, { status: 500 });
  }
}
