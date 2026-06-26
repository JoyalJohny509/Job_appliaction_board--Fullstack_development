import { NextResponse } from "next/server";
import { requireRole } from "@/lib/api-guard";
import * as companyService from "@/lib/services/company.service";

export async function GET(_request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const company = await companyService.findCompanyById(id);
    if (!company) {
      return NextResponse.json({ error: "Company not found." }, { status: 404 });
    }
    return NextResponse.json({ company });
  } catch (error) {
    console.error("Error getting company:", error);
    return NextResponse.json({ error: "An unexpected error occurred." }, { status: 500 });
  }
}

export async function PUT(request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const auth = await requireRole("EMPLOYER", "ADMIN");
    if (auth.error) return auth.error;

    const { id } = await params;
    const body = await request.json();

    // Verify company exists
    const company = await companyService.findCompanyById(id);
    if (!company) {
      return NextResponse.json({ error: "Company not found." }, { status: 404 });
    }

    // Verify ownership if caller is an employer
    if (auth.user.role === "EMPLOYER" && company.ownerId !== auth.user.id) {
      return NextResponse.json({ error: "Access denied. You do not own this company profile." }, { status: 403 });
    }

    // Exclude ownerId and isVerified from manual updates for security
    const { ownerId, isVerified, ...updateData } = body;

    const updated = await companyService.updateCompany(id, updateData);
    return NextResponse.json({ company: updated });
  } catch (error: any) {
    console.error("Error updating company:", error);
    return NextResponse.json({ error: error.message || "An unexpected error occurred." }, { status: 500 });
  }
}
