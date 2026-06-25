import { NextResponse } from "next/server";
import { createCompany, createUser, users } from "@/lib/data";
import { UserRole } from "@/lib/types";

function publicUser(user: (typeof users)[number]) {
  const { password: _password, ...safeUser } = user;
  return safeUser;
}

export async function POST(request: Request) {
  const body = await request.json();
  const role = body.role === "EMPLOYER" ? "EMPLOYER" : ("JOB_SEEKER" as UserRole);
  const name = role === "EMPLOYER" ? body.companyName : body.name;

  if (!name || !body.email || !body.password) {
    return NextResponse.json({ error: "Name, email, and password are required." }, { status: 400 });
  }

  if (users.some((user) => user.email.toLowerCase() === String(body.email).toLowerCase())) {
    return NextResponse.json({ error: "An account with that email already exists." }, { status: 409 });
  }

  const user = createUser({
    name,
    email: body.email,
    password: body.password,
    role,
    phone: body.phone,
    location: body.location
  });

  const company =
    role === "EMPLOYER"
      ? createCompany({
          ownerId: user.id,
          companyName: body.companyName,
          website: body.website,
          location: body.location
        })
      : undefined;

  return NextResponse.json({ user: publicUser(user), company }, { status: 201 });
}
