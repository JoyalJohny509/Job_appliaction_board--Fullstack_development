import Link from "next/link";
import { SearchFilters } from "@/components/SearchFilters";
import { JobCard } from "@/components/JobCard";

export const dynamic = "force-dynamic";
import * as jobService from "@/lib/services/job.service";
import * as categoryService from "@/lib/services/category.service";
import { parseWorkMode, parseEmploymentType } from "@/lib/enum-labels";
import { WorkMode, EmploymentType } from "@prisma/client";
import type { JobFilters } from "@/lib/types";

function value(input: string | string[] | undefined) {
  return Array.isArray(input) ? input[0] : input;
}

export default async function JobsPage({
  searchParams
}: {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  const resolvedSearchParams = await searchParams;

  // Map query params to database filters
  const workModeParam = value(resolvedSearchParams.workMode);
  const workModeVal = workModeParam ? parseWorkMode(workModeParam) : undefined;

  const employmentTypeParam = value(resolvedSearchParams.employmentType);
  const employmentTypeVal = employmentTypeParam ? parseEmploymentType(employmentTypeParam) : undefined;

  const filters: JobFilters = {
    keyword: value(resolvedSearchParams.keyword),
    company: value(resolvedSearchParams.company),
    location: value(resolvedSearchParams.location),
    salary: value(resolvedSearchParams.salary),
    experience: value(resolvedSearchParams.experience),
    category: value(resolvedSearchParams.category),
    level: value(resolvedSearchParams.level),
    workMode: workModeVal,
    employmentType: employmentTypeVal,
  };

  // Fetch jobs and categories in parallel from database services
  const [jobs, categories] = await Promise.all([
    jobService.listJobs(filters),
    categoryService.listCategories()
  ]);

  return (
    <section className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      <div className="mb-6">
        <p className="eyebrow">Job Search</p>
        <h1 className="mt-2 text-4xl font-black text-ink">Find the next role</h1>
        <p className="mt-3 max-w-2xl text-sm leading-6 text-ink/65">
          Search by keyword, company, location, salary, experience, category, work mode, and employment type.
        </p>
      </div>

      <SearchFilters defaults={resolvedSearchParams} categories={categories} />

      <div className="mt-8 flex items-center justify-between">
        <p className="text-sm font-semibold text-ink/60">{jobs.length} matching jobs</p>
        <Link className="text-sm font-bold text-mint" href="/jobs">
          Clear filters
        </Link>
      </div>

      <div className="mt-4 grid gap-4 lg:grid-cols-2">
        {jobs.map((job) => (
          <JobCard key={job.id} job={job} />
        ))}
      </div>

      {jobs.length === 0 ? (
        <div className="mt-6 rounded-lg border border-line bg-white p-8 text-center">
          <h2 className="text-xl font-black text-ink">No jobs found</h2>
          <p className="mt-2 text-sm text-ink/60">Try a wider location, category, or salary range.</p>
        </div>
      ) : null}
    </section>
  );
}
