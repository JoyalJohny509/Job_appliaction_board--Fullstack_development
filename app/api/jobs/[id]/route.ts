import { NextResponse } from "next/server";
import { requireRole } from "@/lib/api-guard";
import * as jobService from "@/lib/services/job.service";
import * as companyService from "@/lib/services/company.service";
import { parseWorkMode, parseEmploymentType } from "@/lib/enum-labels";
import { WorkMode, EmploymentType } from "@prisma/client";

export async function GET(_request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const job = await jobService.findJobById(id);
    if (!job) {
      return NextResponse.json({ error: "Job not found." }, { status: 404 });
    }

    // Increment views asynchronously so we don't block the response
    jobService.incrementJobViews(id).catch((err) => {
      console.error(`Failed to increment views for job ${id}:`, err);
    });

    return NextResponse.json({ job });
  } catch (error) {
    console.error("Error getting job:", error);
    return NextResponse.json({ error: "An unexpected error occurred." }, { status: 500 });
  }
}

export async function PUT(request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const auth = await requireRole("EMPLOYER", "ADMIN");
    if (auth.error) return auth.error;

    const { id } = await params;
    const body = await request.json();

    // Fetch the job to check ownership
    const job = await jobService.findJobById(id);
    if (!job) {
      return NextResponse.json({ error: "Job not found." }, { status: 404 });
    }

    // Verify company ownership if caller is an employer
    if (auth.user.role === "EMPLOYER") {
      const company = await companyService.findCompanyByOwnerId(auth.user.id);
      if (!company || job.companyId !== company.id) {
        return NextResponse.json({ error: "Access denied. You do not own this job listing." }, { status: 403 });
      }
    }

    // Parse enums if they are being updated
    const updateData: any = { ...body };
    if (body.workMode) {
      updateData.workMode = parseWorkMode(body.workMode) || (body.workMode as WorkMode);
    }
    if (body.employmentType) {
      updateData.employmentType = parseEmploymentType(body.employmentType) || (body.employmentType as EmploymentType);
    }

    // Exclude fields that shouldn't be manually updated
    delete updateData.id;
    delete updateData.companyId;
    delete updateData.views;
    delete updateData.createdAt;

    const updated = await jobService.updateJob(id, updateData);
    return NextResponse.json({ job: updated });
  } catch (error: any) {
    console.error("Error updating job:", error);
    return NextResponse.json({ error: error.message || "An unexpected error occurred." }, { status: 500 });
  }
}

export async function DELETE(_request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const auth = await requireRole("EMPLOYER", "ADMIN");
    if (auth.error) return auth.error;

    const { id } = await params;

    // Fetch the job to check ownership
    const job = await jobService.findJobById(id);
    if (!job) {
      return NextResponse.json({ error: "Job not found." }, { status: 404 });
    }

    // Verify company ownership if caller is an employer
    if (auth.user.role === "EMPLOYER") {
      const company = await companyService.findCompanyByOwnerId(auth.user.id);
      if (!company || job.companyId !== company.id) {
        return NextResponse.json({ error: "Access denied. You do not own this job listing." }, { status: 403 });
      }
    }

    await jobService.deleteJob(id);
    return NextResponse.json({ ok: true });
  } catch (error: any) {
    console.error("Error deleting job:", error);
    return NextResponse.json({ error: error.message || "An unexpected error occurred." }, { status: 500 });
  }
}
