import { NextResponse } from "next/server";
import { requireAuth } from "@/lib/api-guard";
import * as userService from "@/lib/services/user.service";

export async function GET() {
  try {
    const auth = await requireAuth();
    if (auth.error) return auth.error;

    // Return the authenticated user (excludes password)
    return NextResponse.json({ user: auth.user });
  } catch (error) {
    console.error("Error getting user profile:", error);
    return NextResponse.json({ error: "An unexpected error occurred." }, { status: 500 });
  }
}

export async function PUT(request: Request) {
  try {
    const auth = await requireAuth();
    if (auth.error) return auth.error;

    const body = await request.json();

    // Sanitize update data to prevent privilege escalation or credential modification
    const allowedUpdates = {
      name: body.name,
      phone: body.phone,
      location: body.location,
      profilePicture: body.profilePicture,
      resume: body.resume,
    };

    // Remove undefined fields so they aren't overwritten with null/empty values
    Object.keys(allowedUpdates).forEach(
      (key) => (allowedUpdates as any)[key] === undefined && delete (allowedUpdates as any)[key]
    );

    const updated = await userService.updateUserProfile(auth.user.id, allowedUpdates);
    return NextResponse.json({ user: updated });
  } catch (error: any) {
    console.error("Error updating user profile:", error);
    return NextResponse.json({ error: error.message || "An unexpected error occurred." }, { status: 500 });
  }
}
