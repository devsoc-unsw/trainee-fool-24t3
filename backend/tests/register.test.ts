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
  test("register test", async () => {
    const { status, body } = await request(app).post("/auth/register").send({
      username: "shinjisatoo",
      password: "testpassword",
      email: "longseason1997@gmail.com",
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
      username: "shinjisatoo",
      id: newUser?.id,
    });
  });

  test("Email already exists", async () => {
    await request(app).post("/auth/register").send({
      username: "shinjisatoo",
      password: "testpassword",
      email: "longseason1996@gmail.com",
      userType: "ATTENDEE",
    });

    const { status, body } = await request(app).post("/auth/register").send({
      username: "shinjisatoo2",
      password: "testpassword2",
      email: "longseason1996@gmail.com",
      userType: "ATTENDEE",
    });

    expect(status).toBe(400);
  })

  test("Username already exists", async () => {
    await request(app).post("/auth/register").send({
      username: "shinjisatoo",
      password: "testpassword",
      email: "longseason1996@gmail.com",
      userType: "ATTENDEE",
    });

    const { status, body } = await request(app).post("/auth/register").send({
      username: "shinjisatoo",
      password: "testpassword2",
      email: "longseason1997@gmail.com",
      userType: "ATTENDEE",
    });

    expect(status).toBe(400);
  })
});
