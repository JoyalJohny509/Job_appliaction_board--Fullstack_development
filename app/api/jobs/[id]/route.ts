import { NextResponse } from "next/server";
import { deleteJob, getJobWithCompany, updateJob } from "@/lib/data";

export async function GET(_request: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const job = getJobWithCompany(id);
  if (!job) {
    return NextResponse.json({ error: "Job not found." }, { status: 404 });
  }
  return NextResponse.json({ job });
}

export async function PUT(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const body = await request.json();
  const job = updateJob(id, body);
  if (!job) {
    return NextResponse.json({ error: "Job not found." }, { status: 404 });
  }
  return NextResponse.json({ job });
}

export async function DELETE(_request: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const deleted = deleteJob(id);
  if (!deleted) {
    return NextResponse.json({ error: "Job not found." }, { status: 404 });
  }
  return NextResponse.json({ ok: true });
}
