import { prisma } from "@/lib/prisma";
import type { ApplicationStatus } from "@prisma/client";

/**
 * Create an application. Uses a database transaction to atomically:
 * 1. Create the application record.
 * 2. Fetch the job title.
 * 3. Create a notification for the applicant.
 */
export async function createApplication(data: {
  jobId: string;
  userId: string;
  resume: string;
  coverLetter?: string | null;
}) {
  return prisma.$transaction(async (tx) => {
    const application = await tx.application.create({
      data: {
        jobId: data.jobId,
        userId: data.userId,
        resume: data.resume,
        coverLetter: data.coverLetter,
      },
    });

    const job = await tx.job.findUnique({
      where: { id: data.jobId },
      select: { title: true },
    });

    const jobTitle = job?.title ?? "job";

    await tx.notification.create({
      data: {
        userId: data.userId,
        message: `Application submitted for ${jobTitle}.`,
        isRead: false,
      },
    });

    return application;
  });
}

/**
 * List all applications matching the filters.
 * Includes the job (with its company) and the user (with password omitted).
 */
export async function listApplications(filters: { jobId?: string; userId?: string } = {}) {
  const where: any = {};
  if (filters.jobId) where.jobId = filters.jobId;
  if (filters.userId) where.userId = filters.userId;

  const applications = await prisma.application.findMany({
    where,
    include: {
      job: {
        include: {
          company: true,
        },
      },
      user: true,
    },
    orderBy: {
      appliedAt: "desc",
    },
  });

  return applications.map((app) => {
    const { password, ...safeUser } = app.user;
    return {
      ...app,
      user: safeUser,
    };
  });
}

/**
 * Find a specific application by its ID.
 * Includes the job and user (with password omitted).
 */
export async function findApplicationById(id: string) {
  const app = await prisma.application.findUnique({
    where: { id },
    include: {
      job: {
        include: {
          company: true,
        },
      },
      user: true,
    },
  });

  if (!app) return null;

  const { password, ...safeUser } = app.user;
  return {
    ...app,
    user: safeUser,
  };
}

/**
 * Update the status of an application.
 */
export async function updateApplicationStatus(id: string, status: ApplicationStatus) {
  return prisma.application.update({
    where: { id },
    data: { status },
  });
}
