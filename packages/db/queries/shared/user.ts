import { prisma } from "../../client";

export async function getUserById(id: string) {
  return prisma.user.findUnique({ where: { id } });
}

export async function getUserByEmail(email: string) {
  return prisma.user.findUnique({ where: { email } });
}

export async function createUser(email: string) {
  return prisma.user.create({
    data: { email },
  });
}

export async function upsertUser(email: string) {
  return prisma.user.upsert({
    where: { email },
    update: {},
    create: { email },
  });
}