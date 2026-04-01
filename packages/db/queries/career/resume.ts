import { prisma } from "../../client";

export async function createResume(userId: string, raw: string) {
  return prisma.resume.create({ data: { userId, raw } });
}

export async function updateResume(
  id: string,
  optimized: string,
  score: number
) {
  return prisma.resume.update({
    where: { id },
    data: { optimized, score },
  });
}

export async function getResumesByUser(userId: string) {
  return prisma.resume.findMany({
    where: { userId },
    orderBy: { createdAt: "desc" },
  });
}