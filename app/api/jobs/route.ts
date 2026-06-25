import { NextResponse } from "next/server";
import { createJob, listJobs } from "@/lib/data";
import { EmploymentType, Job, WorkMode } from "@/lib/types";

function workMode(value: string | null): WorkMode | undefined {
  return value === "Remote" || value === "Hybrid" || value === "On-site" ? value : undefined;
}

function employmentType(value: string | null): EmploymentType | undefined {
  return value === "Full Time" || value === "Part Time" || value === "Contract" || value === "Internship"
    ? value
    : undefined;
}

function level(value: string | null): Job["level"] | undefined {
  return value === "Entry Level" || value === "Mid Level" || value === "Senior" ? value : undefined;
}

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const jobs = listJobs({
    keyword: searchParams.get("keyword") ?? undefined,
    company: searchParams.get("company") ?? undefined,
    location: searchParams.get("location") ?? undefined,
    salary: searchParams.get("salary") ?? undefined,
    experience: searchParams.get("experience") ?? undefined,
    category: searchParams.get("category") ?? undefined,
    workMode: workMode(searchParams.get("workMode")),
    employmentType: employmentType(searchParams.get("employmentType")),
    level: level(searchParams.get("level"))
  });

  return NextResponse.json({ jobs });
}

export async function POST(request: Request) {
  const body = await request.json();

  if (!body.title || !body.description || !body.companyId) {
    return NextResponse.json({ error: "Job title, description, and company are required." }, { status: 400 });
  }

  const job = createJob({
    ...body,
    employmentType: employmentType(body.employmentType) ?? "Full Time",
    workMode: workMode(body.workMode) ?? "Hybrid",
    level: level(body.level) ?? "Mid Level"
  });

  return NextResponse.json({ job }, { status: 201 });
}
