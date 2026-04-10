import { prisma } from "@ai-tools-suite/db/client";
import { PLANS } from "./plans";

type ProductType = "content" | "career";

export async function checkUsageLimit(
  userId: string,
  product: ProductType = "content"
): Promise<{
  allowed: boolean;
  used: number;
  limit: number;
  plan: string;
}> {
  const subscription = await prisma.subscription.findUnique({
    where: { userId },
  });

  const plan = subscription?.plan ?? "free";
  const freeLimit = product === "content"
    ? PLANS.FREE.monthlyGenerations
    : 5; // career toolkit free tier
  const limit = plan === "pro" ? Infinity : freeLimit;

  const startOfMonth = new Date();
  startOfMonth.setDate(1);
  startOfMonth.setHours(0, 0, 0, 0);

  let used = 0;

  if (product === "content") {
    used = await prisma.contentJob.count({
      where: { userId, createdAt: { gte: startOfMonth } },
    });
  } else {
    // Count all career-related jobs this month
    const [resumes, coverLetters, jobMatches] = await Promise.all([
      prisma.resume.count({ where: { userId, createdAt: { gte: startOfMonth } } }),
      prisma.coverLetter.count({ where: { userId, createdAt: { gte: startOfMonth } } }),
      prisma.jobMatch.count({ where: { userId, createdAt: { gte: startOfMonth } } }),
    ]);
    used = resumes + coverLetters + jobMatches;
  }

  return {
    allowed: used < limit,
    used,
    limit: limit === Infinity ? -1 : limit,
    plan,
  };
}