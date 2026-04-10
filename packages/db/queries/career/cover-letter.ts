import { prisma } from "../../client";

export async function createCoverLetter(
  userId: string,
  jobTitle: string,
  company: string,
  output: string
) {
  return prisma.coverLetter.create({
    data: { userId, jobTitle, company, output },
  });
}

export async function getCoverLettersByUser(userId: string) {
  return prisma.coverLetter.findMany({
    where: { userId },
    orderBy: { createdAt: "desc" },
  });
}