import { NextResponse } from "next/server";
import { applications, createApplication, getJobWithCompany, users } from "@/lib/data";

const allowedExtensions = [".pdf", ".doc", ".docx"];
const maxSize = 5 * 1024 * 1024;

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const jobId = searchParams.get("jobId");
  const userId = searchParams.get("userId");
  const rows = applications
    .filter((application) => (!jobId || application.jobId === jobId) && (!userId || application.userId === userId))
    .map((application) => ({
      ...application,
      job: getJobWithCompany(application.jobId),
      user: users.find((user) => user.id === application.userId)
    }));

  return NextResponse.json({ applications: rows });
}

export async function POST(request: Request) {
  const contentType = request.headers.get("content-type") ?? "";
  let jobId = "";
  let userId = "usr-ava";
  let coverLetter = "";
  let resume = "";

  if (contentType.includes("multipart/form-data")) {
    const form = await request.formData();
    jobId = String(form.get("jobId") ?? "");
    userId = String(form.get("userId") ?? "usr-ava");
    coverLetter = String(form.get("coverLetter") ?? "");
    const file = form.get("resume");

    if (!(file instanceof File)) {
      return NextResponse.json({ error: "Resume file is required." }, { status: 400 });
    }

    const filename = file.name.toLowerCase();
    if (!allowedExtensions.some((extension) => filename.endsWith(extension))) {
      return NextResponse.json({ error: "Resume must be a PDF, DOC, or DOCX file." }, { status: 400 });
    }

    if (file.size > maxSize) {
      return NextResponse.json({ error: "Resume must be 5 MB or smaller." }, { status: 400 });
    }

    resume = file.name;
  } else {
    const body = await request.json();
    jobId = body.jobId;
    userId = body.userId ?? "usr-ava";
    coverLetter = body.coverLetter ?? "";
    resume = body.resume;
  }

  if (!jobId || !resume) {
    return NextResponse.json({ error: "Job and resume are required." }, { status: 400 });
  }

  const application = createApplication({ jobId, userId, coverLetter, resume });
  return NextResponse.json({ application }, { status: 201 });
}
