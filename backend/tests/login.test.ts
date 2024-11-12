//test/sample.test.ts
import { expect, test, vi, describe } from "vitest"; // 👈🏻 Added the `vi` import
import prisma from "../src/prisma";
import request from "supertest";
import app from "../src/index";
import { beforeEach } from "node:test";
import { createClient } from "redis";

/*beforeEach( () => {
    prisma.$transaction([
        //add more as we work on more tables and such
        prisma.user.deleteMany()
    ])
})*/
describe("Tests", () => {
  test("Login Successful", async () => {
    const { status, body } = await request(app).post("/auth/register").send({
      username: "shinjisatoo",
      password: "testpassword",
      email: "longseason1996@gmail.com",
      userType: "ATTENDEE",
    });

    const newUser = await prisma.user.findFirst({
      where: {
        id: body.newUser.id,
      },
    });
    console.log("return from reg", body.newUser)
    expect(status).toBe(201);
    expect(newUser).not.toBeNull();

    const response = await request(app).post("/auth/login").send({
      username: "shinjisatoo",
      password: "testpassword",
    });

    console.log(response.error);
    expect(response.status).toBe(200);

    if (newUser == null) return;
    console.log(newUser)
    const response2 = await request(app).get("/user").send({
      userId: newUser.id,
    });
    expect(response2.status).toBe(200);
  });
});
