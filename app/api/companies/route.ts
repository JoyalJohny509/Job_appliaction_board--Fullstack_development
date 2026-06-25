import { NextResponse } from "next/server";
import { companies, createCompany } from "@/lib/data";

export async function GET() {
  return NextResponse.json({ companies });
}

export async function POST(request: Request) {
  const body = await request.json();

  if (!body.ownerId || !body.companyName) {
    return NextResponse.json({ error: "Owner and company name are required." }, { status: 400 });
  }

  const company = createCompany(body);
  return NextResponse.json({ company }, { status: 201 });
}
