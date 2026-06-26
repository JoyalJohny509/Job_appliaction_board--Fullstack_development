import { NextResponse } from "next/server";
import * as userService from "@/lib/services/user.service";
import * as companyService from "@/lib/services/company.service";
import { hashPassword, signToken, setSessionCookie } from "@/lib/auth";
import type { Role } from "@/lib/types";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const role = body.role === "EMPLOYER" ? "EMPLOYER" : ("JOB_SEEKER" as Role);
    const name = role === "EMPLOYER" ? body.companyName : body.name;

    if (!name || !body.email || !body.password) {
      return NextResponse.json({ error: "Name, email, and password are required." }, { status: 400 });
    }

    // Check if the user already exists
    const existingUser = await userService.findUserByEmail(body.email);
    if (existingUser) {
      return NextResponse.json({ error: "An account with that email already exists." }, { status: 409 });
    }

    // Hash password
    const hashedPassword = await hashPassword(body.password);

    // Create user
    const user = await userService.createUser({
      name,
      email: body.email,
      password: hashedPassword,
      role,
      phone: body.phone,
      location: body.location,
    });

    // Create company if user is an employer
    let company = null;
    if (role === "EMPLOYER") {
      company = await companyService.createCompany({
        ownerId: user.id,
        companyName: body.companyName,
        website: body.website,
        location: body.location,
      });
    }

    // Sign JWT token and set session cookie
    const token = await signToken({ userId: user.id, role: user.role });
    await setSessionCookie(token);

    return NextResponse.json({ user, company }, { status: 201 });
  } catch (error: any) {
    console.error("Error during registration:", error);
    return NextResponse.json({ error: error.message || "An unexpected error occurred." }, { status: 500 });
  }
}
