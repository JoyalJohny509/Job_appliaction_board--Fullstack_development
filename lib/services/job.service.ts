import { prisma } from "@/lib/prisma";
import type { Job, JobFilters, JobWithCompany } from "@/lib/types";
import { WorkMode, EmploymentType, JobStatus } from "@prisma/client";

/**
 * Find a job by its ID, including the company and category.
 */
export async function findJobById(id: string) {
  return prisma.job.findUnique({
    where: { id },
    include: {
      company: true,
      category: true,
    },
  });
}

/**
 * List jobs based on the provided filters.
 * Returns only open jobs (status = OPEN), ordered by featured DESC, views DESC.
 */
export async function listJobs(filters: JobFilters = {}): Promise<JobWithCompany[]> {
  const keyword = filters.keyword?.trim();
  const company = filters.company?.trim();
  const location = filters.location?.trim();
  const minSalary = filters.salary ? Number(filters.salary) : undefined;

  const where: any = {
    status: JobStatus.OPEN,
  };

  // Build keyword search condition
  if (keyword) {
    where.OR = [
      { title: { contains: keyword, mode: "insensitive" } },
      { description: { contains: keyword, mode: "insensitive" } },
      { location: { contains: keyword, mode: "insensitive" } },
      { skills: { has: keyword } }, // Note: Postgres array exact match (case sensitive)
      { tags: { has: keyword } },
      { company: { companyName: { contains: keyword, mode: "insensitive" } } },
      { category: { name: { contains: keyword, mode: "insensitive" } } },
    ];
  }

  // Filter by company name
  if (company) {
    where.company = {
      companyName: { contains: company, mode: "insensitive" },
    };
  }

  // Filter by location
  if (location) {
    where.location = {
      contains: location,
      mode: "insensitive",
    };
  }

  // Filter by minimum salary
  if (minSalary !== undefined && !isNaN(minSalary)) {
    where.salaryMin = {
      gte: minSalary,
    };
  }

  // Filter by experience
  if (filters.experience) {
    where.experience = {
      contains: filters.experience,
      mode: "insensitive",
    };
  }

  // Filter by category (either ID or name)
  if (filters.category) {
    where.OR = where.OR || [];
    where.OR.push({
      category: {
        name: { equals: filters.category, mode: "insensitive" },
      },
    });
    where.OR.push({
      categoryId: filters.category,
    });
  }

  // Filter by work mode (Prisma enum)
  if (filters.workMode) {
    where.workMode = filters.workMode;
  }

  // Filter by employment type (Prisma enum)
  if (filters.employmentType) {
    where.employmentType = filters.employmentType;
  }

  // Filter by job level
  if (filters.level) {
    where.level = filters.level;
  }

  const jobs = await prisma.job.findMany({
    where,
    include: {
      company: true,
      category: true,
    },
    orderBy: [
      { featured: "desc" },
      { views: "desc" },
      { createdAt: "desc" },
    ],
  });

  return jobs as unknown as JobWithCompany[];
}

/**
 * Create a new job. Resolves the category name to a categoryId if needed.
 * Sets fallback defaults for missing optional fields.
 */
export async function createJob(data: {
  companyId: string;
  title: string;
  description: string;
  salary?: string | null;
  salaryMin?: number | null;
  experience?: string | null;
  level?: string | null;
  employmentType?: EmploymentType;
  workMode?: WorkMode;
  location?: string;
  category?: string; // category name
  categoryId?: string | null;
  responsibilities?: string[];
  skills?: string[];
  education?: string | null;
  benefits?: string[];
  deadline?: Date | string;
  vacancies?: number;
  tags?: string[];
  featured?: boolean;
  status?: JobStatus;
}): Promise<Job> {
  let categoryId = data.categoryId;

  // If category name is passed, resolve it to an ID
  if (!categoryId && data.category) {
    const existingCategory = await prisma.category.findFirst({
      where: { name: { equals: data.category, mode: "insensitive" } },
    });
    if (existingCategory) {
      categoryId = existingCategory.id;
    }
  }

  const jobDeadline = data.deadline
    ? new Date(data.deadline)
    : new Date(Date.now() + 60 * 24 * 60 * 60 * 1000); // Default 60 days from now

  return prisma.job.create({
    data: {
      companyId: data.companyId,
      title: data.title,
      description: data.description,
      salary: data.salary ?? "Competitive",
      salaryMin: data.salaryMin ?? 0,
      experience: data.experience ?? "1+ years",
      level: data.level ?? "Mid Level",
      employmentType: data.employmentType ?? EmploymentType.FULL_TIME,
      workMode: data.workMode ?? WorkMode.HYBRID,
      location: data.location ?? "Remote",
      categoryId,
      responsibilities: data.responsibilities ?? [
        "Own the role outcomes",
        "Collaborate with cross-functional teams",
      ],
      skills: data.skills ?? [],
      education: data.education ?? "Relevant experience or education",
      benefits: data.benefits ?? ["Flexible work", "Health coverage"],
      deadline: jobDeadline,
      vacancies: data.vacancies ?? 1,
      tags: data.tags ?? [],
      status: data.status ?? JobStatus.OPEN,
      featured: data.featured ?? false,
      views: 0,
    },
  }) as unknown as Job;
}

/**
 * Update an existing job.
 */
export async function updateJob(id: string, data: Partial<Job>): Promise<Job> {
  return prisma.job.update({
    where: { id },
    data: data as any,
  }) as unknown as Job;
}

/**
 * Delete a job. (Foreign key cascade is handled at the database level).
 */
export async function deleteJob(id: string): Promise<Job> {
  return prisma.job.delete({
    where: { id },
  }) as unknown as Job;
}

/**
 * Increment the views counter of a job by 1.
 */
export async function incrementJobViews(id: string): Promise<Job> {
  return prisma.job.update({
    where: { id },
    data: {
      views: {
        increment: 1,
      },
    },
  }) as unknown as Job;
}
