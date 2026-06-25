import { NextResponse } from "next/server";
import { users } from "@/lib/data";

export async function POST(request: Request) {
  const body = await request.json();
  const user = users.find((item) => item.email.toLowerCase() === String(body.email).toLowerCase());

  if (!user || user.password !== body.password) {
    return NextResponse.json({ error: "Invalid email or password." }, { status: 401 });
  }

  if (user.isBanned) {
    return NextResponse.json({ error: "This account has been banned." }, { status: 403 });
  }

  const { password: _password, ...safeUser } = user;
  return NextResponse.json({
    user: safeUser,
    token: `demo-token-${user.role.toLowerCase()}-${user.id}`
  });
}
