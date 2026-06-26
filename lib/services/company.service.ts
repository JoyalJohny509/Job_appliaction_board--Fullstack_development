import { prisma } from "@/lib/prisma";
import type { Company } from "@/lib/types";

/**
 * Find a company by its ID.
 */
export async function findCompanyById(id: string): Promise<Company | null> {
  return prisma.company.findUnique({
    where: { id },
  }) as Promise<Company | null>;
}

/**
 * Find a company by its owner's user ID.
 */
export async function findCompanyByOwnerId(ownerId: string): Promise<Company | null> {
  return prisma.company.findUnique({
    where: { ownerId },
  }) as Promise<Company | null>;
}

/**
 * Create a new company. Auto-generates logo initials from the company name if not provided.
 */
export async function createCompany(data: {
  ownerId: string;
  companyName: string;
  website?: string | null;
  description?: string | null;
  logo?: string | null;
  industry?: string | null;
  employees?: string | null;
  location?: string | null;
}): Promise<Company> {
  const logo =
    data.logo ||
    data.companyName
      .trim()
      .split(/\s+/)
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);

  return prisma.company.create({
    data: {
      ownerId: data.ownerId,
      companyName: data.companyName,
      website: data.website,
      description: data.description,
      logo,
      industry: data.industry,
      employees: data.employees,
      location: data.location,
    },
  }) as Promise<Company>;
}

/**
 * Update an existing company's details.
 */
export async function updateCompany(
  id: string,
  data: Partial<{
    companyName: string;
    website: string | null;
    description: string | null;
    logo: string | null;
    industry: string | null;
    employees: string | null;
    location: string | null;
  }>
): Promise<Company> {
  return prisma.company.update({
    where: { id },
    data,
  }) as Promise<Company>;
}

/**
 * List all companies, ordered by creation date descending.
 */
export async function listCompanies(): Promise<Company[]> {
  return prisma.company.findMany({
    orderBy: { createdAt: "desc" },
  }) as Promise<Company[]>;
}

/**
 * Verify a company.
 */
export async function verifyCompany(id: string): Promise<Company> {
  return prisma.company.update({
    where: { id },
    data: { isVerified: true },
  }) as Promise<Company>;
}

/**
 * Unverify a company.
 */
export async function unverifyCompany(id: string): Promise<Company> {
  return prisma.company.update({
    where: { id },
    data: { isVerified: false },
  }) as Promise<Company>;
}
