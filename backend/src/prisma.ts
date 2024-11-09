import { PrismaClient } from '@prisma/client'


const prisma = new PrismaClient();
console.log("Prisma config:", process.env['DATABASE_URL']);

export default prisma