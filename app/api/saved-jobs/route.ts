import { NextResponse } from "next/server";
import { requireAuth } from "@/lib/api-guard";
import * as savedJobService from "@/lib/services/saved-job.service";

export async function GET() {
  try {
    const auth = await requireAuth();
    if (auth.error) return auth.error;

    const savedJobs = await savedJobService.getSavedJobs(auth.user.id);
    return NextResponse.json({ savedJobs });
  } catch (error) {
    console.error("Error listing saved jobs:", error);
    return NextResponse.json({ error: "An unexpected error occurred." }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const auth = await requireAuth();
    if (auth.error) return auth.error;

    const body = await request.json();
    if (!body.jobId) {
      return NextResponse.json({ error: "jobId is required." }, { status: 400 });
    }

    const saved = await savedJobService.saveJob(auth.user.id, body.jobId);
    return NextResponse.json({ savedJob: saved }, { status: 201 });
  } catch (error: any) {
    console.error("Error saving job:", error);
    return NextResponse.json({ error: error.message || "An unexpected error occurred." }, { status: 500 });
  }
}

export async function DELETE(request: Request) {
  try {
    const auth = await requireAuth();
    if (auth.error) return auth.error;

    const { searchParams } = new URL(request.url);
    let jobId = searchParams.get("jobId");

    if (!jobId) {
      try {
        const body = await request.json();
        jobId = body.jobId;
      } catch (_) {}
    }

    if (!jobId) {
      return NextResponse.json({ error: "jobId is required." }, { status: 400 });
    }

    await savedJobService.unsaveJob(auth.user.id, jobId);
    return NextResponse.json({ ok: true });
  } catch (error: any) {
    console.error("Error unsaving job:", error);
    return NextResponse.json({ error: error.message || "An unexpected error occurred." }, { status: 500 });
  }
}
