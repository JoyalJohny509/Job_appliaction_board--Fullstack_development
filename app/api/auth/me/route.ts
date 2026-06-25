import { NextResponse } from "next/server";
import { users } from "@/lib/data";

export async function GET(request: Request) {
  const userId = request.headers.get("x-demo-user-id") ?? "usr-ava";
  const user = users.find((item) => item.id === userId) ?? users[0];
  const { password: _password, ...safeUser } = user;
  return NextResponse.json({ user: safeUser });
}
