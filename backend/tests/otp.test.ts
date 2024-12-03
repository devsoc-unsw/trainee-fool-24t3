//test/sample.test.ts
import { expect, test, vi, describe } from "vitest"; // 👈🏻 Added the `vi` import
import request from "supertest";
import app from "../src/index";
import { createClient } from "redis";
import { afterEach, beforeEach } from "node:test";
import prisma from "../src/prisma";

let redisClient: ReturnType<typeof createClient>;

beforeEach(async () => {
  redisClient = createClient({
    url: `redis://localhost:${process.env["REDIS_PORT"]}`,
  });
  await redisClient.connect().catch(console.error);
});

afterEach(async () => {
  await redisClient.flushDb();
  await redisClient.quit();
});

describe("Tests", () => {
  test("otp create test", async () => {
    
    const { status, body } = await request(app).post("/auth/register").send({
      username: "richard grayson",
      password: "iheartkori&barbs",
      email: "pyramidstestdump@gmail.com",
      userType: "ATTENDEE",
    });

    const newUser = await prisma.user.findFirst({
      where: {
        id: body.newUser.id,
      },
    });
    
    expect(status).toBe(201);
    expect(newUser).not.toBeNull();
    expect(body.newUser).toStrictEqual({
      username: "richard grayson",
      id: newUser?.id,
    });

    if(newUser) {
        const response = await request(app).post("/auth/otp").send({
            email: "pyramidstestdump@gmail.com"
        });
        expect(response.status).toBe(200);

        const hash  = await redisClient.get(newUser.email);

        expect(hash).not.toBeNull();

        if(hash) {
            console.log(hash);

            await new Promise(resolve => setTimeout(resolve, 70000));

            const checkTokens = await redisClient.get(newUser.email);
            expect(checkTokens).toBeNull();
        }
    }
  }, 200000);
});
