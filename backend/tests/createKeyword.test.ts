import { expect, test, vi, describe } from "vitest"; // 👈🏻 Added the `vi` import
import prisma from "../src/prisma";
import request from "supertest";
import app from "../src/index";
import { beforeEach } from "node:test";
import dayjs from "dayjs";

describe('/keyword endpoint', () => {
  test("Invalid session", async () => {
    const { body, status } = await request(app).post("/keyword").send({
      text: "skibidi",
    });

    expect(status).toBe(401);
    expect(body.message).toBe("Invalid session provided.");
  });

  test('Keyword successfully created', async () => {
    const { status, body } = await request(app).post("/auth/register").send({
      username: "shinjisatoo",
      password: "testpassword",
      email: "longseason1996@gmail.com",
    });

    const newUser = await prisma.user.findFirst({
      where: {
        id: body.newUser.id,
      },
    });

    if (newUser == null) return;
    expect(status).toBe(201);
    expect(newUser).not.toBeNull();

    const loginres = await request(app).post("/auth/login").send({
      username: "shinjisatoo",
      password: "testpassword",
    });
    let sessionID = loginres.headers["set-cookie"];

    const response = await request(app)
      .post("/keyword")
      .set("Cookie", sessionID)
      .send({
        text: "skibidi toilet yes yes ghvsbdkakbhf",
      });

    expect(response.status).toBe(200);
  });

  test('DDuplicate keyword rejected', async () => {
    const { status, body } = await request(app).post("/auth/register").send({
      username: "shinjisatoo",
      password: "testpassword",
      email: "longseason1996@gmail.com",
    });

    const newUser = await prisma.user.findFirst({
      where: {
        id: body.newUser.id,
      },
    });

    if (newUser == null) return;
    expect(status).toBe(201);
    expect(newUser).not.toBeNull();

    const loginres = await request(app).post("/auth/login").send({
      username: "shinjisatoo",
      password: "testpassword",
    });
    let sessionID = loginres.headers["set-cookie"];

    await request(app)
      .post("/keyword")
      .set("Cookie", sessionID)
      .send({
        text: "skibidi",
      });
    
    const response = await request(app)
      .post("/keyword")
      .set("Cookie", sessionID)
      .send({
        text: "skibidi",
      });

    expect(response.status).toBe(400);
    expect(response.body.message).toBe("Keyword already exists.");
  });

  test('Invalid keyword input', async () => {
    const { status, body } = await request(app).post("/auth/register").send({
      username: "shinjisatoo",
      password: "testpassword",
      email: "longseason1996@gmail.com",
    });

    const newUser = await prisma.user.findFirst({
      where: {
        id: body.newUser.id,
      },
    });

    if (newUser == null) return;
    expect(status).toBe(201);
    expect(newUser).not.toBeNull();

    const loginres = await request(app).post("/auth/login").send({
      username: "shinjisatoo",
      password: "testpassword",
    });
    let sessionID = loginres.headers["set-cookie"];

    const response = await request(app)
      .post("/keyword")
      .set("Cookie", sessionID)
      .send({
        text: "",
      });

    expect(response.status).toBe(400);
    expect(response.body.message).toBe("Invalid input.");
  });
});