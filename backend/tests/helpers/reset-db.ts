
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

export default async () => {
  await prisma.$transaction([
    //add more as we work on more tables and such
    prisma.user.deleteMany()
  ])
}