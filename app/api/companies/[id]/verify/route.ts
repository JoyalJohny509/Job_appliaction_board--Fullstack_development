import { NextResponse } from "next/server";
import { requireRole } from "@/lib/api-guard";
import * as companyService from "@/lib/services/company.service";

export async function PUT(request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const auth = await requireRole("ADMIN");
    if (auth.error) return auth.error;

    const { id } = await params;
    const body = await request.json();
    const shouldVerify = body.isVerified === true;

    // Verify company exists first
    const company = await companyService.findCompanyById(id);
    if (!company) {
      return NextResponse.json({ error: "Company not found." }, { status: 404 });
    }

    let updated;
    if (shouldVerify) {
      updated = await companyService.verifyCompany(id);
    } else {
      updated = await companyService.unverifyCompany(id);
    }

    return NextResponse.json({ company: updated });
  } catch (error: any) {
    console.error("Error toggling company verification:", error);
    return NextResponse.json({ error: error.message || "An unexpected error occurred." }, { status: 500 });
  }
}
