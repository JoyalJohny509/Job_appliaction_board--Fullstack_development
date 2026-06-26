import { NextResponse } from "next/server";
import { requireRole } from "@/lib/api-guard";
import * as applicationService from "@/lib/services/application.service";
import * as companyService from "@/lib/services/company.service";
import { ApplicationStatus } from "@prisma/client";

const VALID_STATUSES = Object.values(ApplicationStatus);

export async function PUT(request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const auth = await requireRole("EMPLOYER", "ADMIN");
    if (auth.error) return auth.error;

    const { id } = await params;
    const body = await request.json();

    if (!body.status) {
      return NextResponse.json({ error: "Status is required." }, { status: 400 });
    }

    const statusInput = String(body.status).toUpperCase() as ApplicationStatus;
    if (!VALID_STATUSES.includes(statusInput)) {
      return NextResponse.json({ error: "Invalid application status." }, { status: 400 });
    }

    // Fetch the application first to verify ownership
    const application = await applicationService.findApplicationById(id);
    if (!application) {
      return NextResponse.json({ error: "Application not found." }, { status: 404 });
    }

    // Verify company ownership if caller is an employer
    if (auth.user.role === "EMPLOYER") {
      const company = await companyService.findCompanyByOwnerId(auth.user.id);
      if (!company || application.job.companyId !== company.id) {
        return NextResponse.json({ error: "Access denied. You do not own this job listing." }, { status: 403 });
      }
    }

    // Update status
    const updated = await applicationService.updateApplicationStatus(id, statusInput);
    return NextResponse.json({ application: updated });
  } catch (error: any) {
    console.error("Error updating application status:", error);
    return NextResponse.json({ error: "An unexpected error occurred." }, { status: 500 });
  }
}
