import { prisma } from "../../client";

export async function getSubscription(userId: string) {
  return prisma.subscription.findUnique({ where: { userId } });
}

export async function createFreeSubscription(userId: string) {
  return prisma.subscription.create({
    data: { userId, plan: "free", status: "active" },
  });
}

export async function updateSubscriptionPlan(
  userId: string,
  plan: string,
  stripeId?: string
) {
  return prisma.subscription.update({
    where: { userId },
    data: { plan, stripeId },
  });
}