import { prisma } from "../../client";

export async function createJobMatch(
  userId: string,
  resumeId: string,
  jobPosting: string,
  matchScore: number,
  gaps: object
) {
  return prisma.jobMatch.create({
    data: { userId, resumeId, jobPosting, matchScore, gaps },
  });
}

export async function getJobMatchesByUser(userId: string) {
  return prisma.jobMatch.findMany({
    where: { userId },
    orderBy: { createdAt: "desc" },
  });
}