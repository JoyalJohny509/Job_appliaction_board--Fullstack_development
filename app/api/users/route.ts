import { NextResponse } from "next/server";
import { users } from "@/lib/data";

export async function GET() {
  return NextResponse.json({
    users: users.map(({ password: _password, ...user }) => user)
  });
}
