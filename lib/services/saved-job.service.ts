import { prisma } from "@/lib/prisma";

/**
 * Save a job for a user (bookmark). Uses upsert to prevent duplicates.
 */
export async function saveJob(userId: string, jobId: string) {
  return prisma.savedJob.upsert({
    where: {
      userId_jobId: {
        userId,
        jobId,
      },
    },
    update: {}, // Do nothing if already saved
    create: {
      userId,
      jobId,
    },
  });
}

/**
 * Unsave a job for a user.
 */
export async function unsaveJob(userId: string, jobId: string) {
  return prisma.savedJob.delete({
    where: {
      userId_jobId: {
        userId,
        jobId,
      },
    },
  });
}

/**
 * Get all saved jobs for a user, including job details and the hiring company.
 */
export async function getSavedJobs(userId: string) {
  return prisma.savedJob.findMany({
    where: { userId },
    include: {
      job: {
        include: {
          company: true,
        },
      },
    },
    orderBy: {
      createdAt: "desc",
    },
  });
}

/**
 * Checks if a job has been saved by a user.
 */
export async function isJobSaved(userId: string, jobId: string): Promise<boolean> {
  const record = await prisma.savedJob.findUnique({
    where: {
      userId_jobId: {
        userId,
        jobId,
      },
    },
  });
  return record !== null;
}
