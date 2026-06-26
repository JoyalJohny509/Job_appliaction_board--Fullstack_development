import { NextResponse } from "next/server";
import { requireRole } from "@/lib/api-guard";
import * as companyService from "@/lib/services/company.service";

export async function GET() {
  try {
    const list = await companyService.listCompanies();
    return NextResponse.json({ companies: list });
  } catch (error) {
    console.error("Error listing companies:", error);
    return NextResponse.json({ error: "An unexpected error occurred." }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const auth = await requireRole("EMPLOYER");
    if (auth.error) return auth.error;

    const body = await request.json();
    if (!body.companyName) {
      return NextResponse.json({ error: "Company name is required." }, { status: 400 });
    }

    // Check if employer already has a company
    const existingCompany = await companyService.findCompanyByOwnerId(auth.user.id);
    if (existingCompany) {
      return NextResponse.json({ error: "An employer account can only own one company." }, { status: 409 });
    }

    const company = await companyService.createCompany({
      ownerId: auth.user.id, // Enforce current logged-in user ID
      companyName: body.companyName,
      website: body.website,
      description: body.description,
      logo: body.logo,
      industry: body.industry,
      employees: body.employees,
      location: body.location,
    });

    return NextResponse.json({ company }, { status: 201 });
  } catch (error: any) {
    console.error("Error creating company:", error);
    return NextResponse.json({ error: error.message || "An unexpected error occurred." }, { status: 500 });
  }
}
