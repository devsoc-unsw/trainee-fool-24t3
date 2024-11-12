//Cleans up the local db
import { PrismaClient } from "@prisma/client";
import { createClient } from "redis";

const prisma = new PrismaClient();

let redisClient = createClient({
  url: `redis://localhost:${process.env['REDIS_PORT']}`
});
redisClient.connect().catch(console.error);


export default async () => {
  await prisma.user.deleteMany({});
  await redisClient.flushDb();
};
