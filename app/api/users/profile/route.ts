import { NextResponse } from "next/server";
import { updateUserProfile, users } from "@/lib/data";

export async function PUT(request: Request) {
  const userId = request.headers.get("x-demo-user-id") ?? "usr-ava";
  const body = await request.json();
  const user = updateUserProfile(userId, body);

  if (!user) {
    return NextResponse.json({ error: "User not found." }, { status: 404 });
  }

  const { password: _password, ...safeUser } = user;
  return NextResponse.json({ user: safeUser });
}

export async function GET(request: Request) {
  const userId = request.headers.get("x-demo-user-id") ?? "usr-ava";
  const user = users.find((item) => item.id === userId);
  if (!user) {
    return NextResponse.json({ error: "User not found." }, { status: 404 });
  }
  const { password: _password, ...safeUser } = user;
  return NextResponse.json({ user: safeUser });
}
