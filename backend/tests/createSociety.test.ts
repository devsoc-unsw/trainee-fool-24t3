import { expect, test, vi, describe } from "vitest"; // 👈🏻 Added the `vi` import
import prisma from "../src/prisma";
import request from "supertest";
import app from "../src/index";
import { beforeEach } from "node:test";

describe("'/society/create endpoint", () => {
  test("Successful Creation", async () => {
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

    if (newUser == null) return;
    expect(status).toBe(201);
    expect(newUser).not.toBeNull();

    const response = await request(app).post("/auth/login").send({
      username: newUser.username,
      password: "testpassword",
    });

    expect(response.status).toBe(200);

    const sessionID = response.headers["set-cookie"];
    const response2 = await request(app)
      .get("/user")
      .set("Cookie", sessionID)
      .send({
        userId: newUser.id,
      });
    expect(response2.status).toBe(200);

    
    const societyRes = await request(app).post("/society/create")
    .set("Cookie", sessionID)
    .send({
      name: "Rizzsoc",
      userId: newUser.id,
    });
    
    expect(societyRes.status).toBe(200);
  });
});
