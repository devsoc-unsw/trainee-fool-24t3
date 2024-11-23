//Moved the logic for making a new Prisma client over here
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient();

export default prisma