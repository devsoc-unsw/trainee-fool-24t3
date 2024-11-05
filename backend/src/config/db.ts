import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export function getDb() {
    return prisma;
}

export async function startDb() {
    await prisma.$connect();
}

export async function stopDb() {
    await prisma.$disconnect();
}