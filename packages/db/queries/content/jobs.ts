import { prisma } from "../../client";

export async function createContentJob(
  userId: string,
  input: string,
  platform: string
) {
  return prisma.contentJob.create({
    data: { userId, input, platform, output: {}, status: "pending" },
  });
}

export async function updateContentJob(
  id: string,
  output: object,
  status: string
) {
  return prisma.contentJob.update({
    where: { id },
    data: { output, status },
  });
}

export async function getContentJobsByUser(userId: string) {
  return prisma.contentJob.findMany({
    where: { userId },
    orderBy: { createdAt: "desc" },
  });
}