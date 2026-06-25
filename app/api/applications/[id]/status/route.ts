import { NextResponse } from "next/server";
import { updateApplicationStatus } from "@/lib/data";
import { ApplicationStatus } from "@/lib/types";

const statuses: ApplicationStatus[] = ["Pending", "Reviewed", "Interview", "Accepted", "Rejected"];

export async function PUT(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const body = await request.json();

  if (!statuses.includes(body.status)) {
    return NextResponse.json({ error: "Invalid application status." }, { status: 400 });
  }

  const application = updateApplicationStatus(id, body.status);
  if (!application) {
    return NextResponse.json({ error: "Application not found." }, { status: 404 });
  }

  return NextResponse.json({ application });
}
