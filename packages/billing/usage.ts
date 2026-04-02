import { prisma } from "@ai-tools-suite/db/client";
import { PLANS } from "./plans";

export async function checkUsageLimit(userId: string): Promise<{
  allowed: boolean;
  used: number;
  limit: number;
  plan: string;
}> {
  const subscription = await prisma.subscription.findUnique({
    where: { userId },
  });

  const plan = subscription?.plan ?? "free";
  const limit = plan === "pro" ? Infinity : PLANS.FREE.monthlyGenerations;

  // Count jobs created this calendar month
  const startOfMonth = new Date();
  startOfMonth.setDate(1);
  startOfMonth.setHours(0, 0, 0, 0);

  const used = await prisma.contentJob.count({
    where: {
      userId,
      createdAt: { gte: startOfMonth },
    },
  });

  return {
    allowed: used < limit,
    used,
    limit: limit === Infinity ? -1 : limit,
    plan,
  };
}