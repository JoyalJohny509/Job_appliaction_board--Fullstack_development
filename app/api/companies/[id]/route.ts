import { NextResponse } from "next/server";
import { companies, updateCompany } from "@/lib/data";

export async function GET(_request: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const company = companies.find((item) => item.id === id);
  if (!company) {
    return NextResponse.json({ error: "Company not found." }, { status: 404 });
  }
  return NextResponse.json({ company });
}

export async function PUT(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const body = await request.json();
  const company = updateCompany(id, body);
  if (!company) {
    return NextResponse.json({ error: "Company not found." }, { status: 404 });
  }
  return NextResponse.json({ company });
}
