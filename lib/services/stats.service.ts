import { prisma } from "@/lib/prisma";
import { JobStatus, ApplicationStatus } from "@prisma/client";

/**
 * Get aggregated statistics for the admin/employer dashboards.
 * Uses Promise.all to fetch counts and aggregates in parallel for performance.
 */
export async function getDashboardStats() {
  const [
    totalUsers,
    totalCompanies,
    totalJobs,
    openJobs,
    applications,
    acceptedApplications,
    viewsAggregate,
  ] = await Promise.all([
    prisma.user.count(),
    prisma.company.count(),
    prisma.job.count(),
    prisma.job.count({
      where: { status: JobStatus.OPEN },
    }),
    prisma.application.count(),
    prisma.application.count({
      where: { status: ApplicationStatus.ACCEPTED },
    }),
    prisma.job.aggregate({
      _sum: {
        views: true,
      },
    }),
  ]);

  const totalViews = viewsAggregate._sum.views ?? 0;
  const acceptanceRate = applications > 0
    ? Math.round((acceptedApplications / applications) * 100)
    : 0;

  return {
    totalUsers,
    totalCompanies,
    totalJobs,
    openJobs,
    applications,
    dailyActiveUsers: 128, // Hardcoded placeholder as per spec
    views: totalViews,
    acceptanceRate,
    hiringRate: 28, // Hardcoded placeholder as per spec
  };
}
