import { NextResponse } from "next/server";
import { getSession } from "@/lib/auth";
import * as companyService from "@/lib/services/company.service";

export async function GET() {
  try {
    const session = await getSession();
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // If the user is an employer, fetch and return their company details too
    let company = null;
    if (session.user.role === "EMPLOYER") {
      company = await companyService.findCompanyByOwnerId(session.user.id);
    }

    return NextResponse.json({
      user: session.user,
      company,
    });
  } catch (error) {
    console.error("Error in /api/auth/me:", error);
    return NextResponse.json({ error: "An unexpected error occurred." }, { status: 500 });
  }
}
