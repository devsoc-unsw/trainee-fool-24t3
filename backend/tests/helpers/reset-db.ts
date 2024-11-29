//Cleans up the local db
import { PrismaClient } from "@prisma/client";
import { createClient } from "redis";

const prisma = new PrismaClient();

let redisClient = createClient({
  url: `redis://localhost:${process.env["REDIS_PORT"]}`,
});

export default async () => {
  await redisClient.connect();
  await prisma.user.deleteMany();
  await redisClient.flushDb();
  await redisClient.quit();
};
