import { prisma } from "@/lib/prisma";
import { JobStatus } from "@prisma/client";

/**
 * List all categories along with a count of their open jobs.
 * Maps the Prisma count result to the display-friendly CategoryWithCount interface.
 */
export async function listCategories() {
  const categories = await prisma.category.findMany({
    include: {
      _count: {
        select: {
          jobs: {
            where: { status: JobStatus.OPEN },
          },
        },
      },
    },
    orderBy: {
      name: "asc",
    },
  });

  return categories.map((cat) => ({
    id: cat.id,
    name: cat.name,
    openJobs: cat._count.jobs,
  }));
}

/**
 * Find a category by its unique name.
 */
export async function findCategoryByName(name: string) {
  return prisma.category.findUnique({
    where: { name },
  });
}

/**
 * Create a new category.
 */
export async function createCategory(name: string) {
  return prisma.category.create({
    data: { name },
  });
}
