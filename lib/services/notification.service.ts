import { prisma } from "@/lib/prisma";

/**
 * List all notifications for a user, ordered by creation date descending.
 */
export async function listNotifications(userId: string) {
  return prisma.notification.findMany({
    where: { userId },
    orderBy: {
      createdAt: "desc",
    },
  });
}

/**
 * Mark a specific notification as read.
 */
export async function markAsRead(id: string) {
  return prisma.notification.update({
    where: { id },
    data: { isRead: true },
  });
}

/**
 * Mark all notifications as read for a specific user.
 */
export async function markAllAsRead(userId: string) {
  return prisma.notification.updateMany({
    where: {
      userId,
      isRead: false,
    },
    data: { isRead: true },
  });
}

/**
 * Create a notification for a user.
 */
export async function createNotification(userId: string, message: string) {
  return prisma.notification.create({
    data: {
      userId,
      message,
      isRead: false,
    },
  });
}
