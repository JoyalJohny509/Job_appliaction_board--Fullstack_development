import { NextResponse } from "next/server";
import { requireRole } from "@/lib/api-guard";
import * as jobService from "@/lib/services/job.service";
import * as companyService from "@/lib/services/company.service";
import { parseWorkMode, parseEmploymentType } from "@/lib/enum-labels";
import { WorkMode, EmploymentType } from "@prisma/client";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);

    const keyword = searchParams.get("keyword") || undefined;
    const company = searchParams.get("company") || undefined;
    const location = searchParams.get("location") || undefined;
    const salary = searchParams.get("salary") || undefined;
    const experience = searchParams.get("experience") || undefined;
    const category = searchParams.get("category") || undefined;
    const level = searchParams.get("level") || undefined;

    const workModeParam = searchParams.get("workMode");
    const workModeVal = workModeParam
      ? (parseWorkMode(workModeParam) || (Object.values(WorkMode).includes(workModeParam as any) ? (workModeParam as WorkMode) : undefined))
      : undefined;

    const employmentTypeParam = searchParams.get("employmentType");
    const employmentTypeVal = employmentTypeParam
      ? (parseEmploymentType(employmentTypeParam) || (Object.values(EmploymentType).includes(employmentTypeParam as any) ? (employmentTypeParam as EmploymentType) : undefined))
      : undefined;

    const jobs = await jobService.listJobs({
      keyword,
      company,
      location,
      salary,
      experience,
      category,
      level,
      workMode: workModeVal,
      employmentType: employmentTypeVal,
    });

    return NextResponse.json({ jobs });
  } catch (error) {
    console.error("Error listing jobs:", error);
    return NextResponse.json({ error: "An unexpected error occurred." }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const auth = await requireRole("EMPLOYER", "ADMIN");
    if (auth.error) return auth.error;

    const body = await request.json();

    if (!body.title || !body.description || !body.companyId) {
      return NextResponse.json({ error: "Job title, description, and company are required." }, { status: 400 });
    }

    // Verify company ownership if caller is an employer
    if (auth.user.role === "EMPLOYER") {
      const company = await companyService.findCompanyByOwnerId(auth.user.id);
      if (!company || company.id !== body.companyId) {
        return NextResponse.json({ error: "Access denied. You do not own the specified company." }, { status: 403 });
      }
    }

    // Parse enum values
    const workModeVal = parseWorkMode(body.workMode) || (body.workMode as WorkMode) || WorkMode.HYBRID;
    const employmentTypeVal = parseEmploymentType(body.employmentType) || (body.employmentType as EmploymentType) || EmploymentType.FULL_TIME;

    const job = await jobService.createJob({
      companyId: body.companyId,
      title: body.title,
      description: body.description,
      salary: body.salary,
      salaryMin: body.salaryMin ? Number(body.salaryMin) : undefined,
      experience: body.experience,
      level: body.level,
      employmentType: employmentTypeVal,
      workMode: workModeVal,
      location: body.location,
      category: body.category,
      categoryId: body.categoryId,
      responsibilities: body.responsibilities,
      skills: body.skills,
      education: body.education,
      benefits: body.benefits,
      deadline: body.deadline,
      vacancies: body.vacancies ? Number(body.vacancies) : undefined,
      tags: body.tags,
      featured: body.featured,
      status: body.status,
    });

    return NextResponse.json({ job }, { status: 201 });
  } catch (error: any) {
    console.error("Error creating job:", error);
    return NextResponse.json({ error: error.message || "An unexpected error occurred." }, { status: 500 });
  }
}
