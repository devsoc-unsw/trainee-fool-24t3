import { expect, test, vi, describe } from "vitest"; // 👈🏻 Added the `vi` import
import prisma from "../src/prisma";
import request from "supertest";
import app from "../src/index";
import { beforeEach } from "node:test";

describe("POST /user/keyword endpoint", () => {
  test("Keyword successfully associated", async () => {
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

    const response = await request(app).post("/auth/login").send({
      username: newUser.username,
      password: "testpassword",
    });

    expect(response.status).toBe(200);

    const sessionID = response.headers["set-cookie"];

    const keywordRes = await request(app)
      .post("/keyword")
      .set("Cookie", sessionID)
      .send({
        text: "skibidi12",
      });
      
    expect(keywordRes.status).toBe(200);

    const res = await request(app)
      .post("/user/keyword")
      .set("Cookie", sessionID)
      .send({
        keywordId: keywordRes.body.id,
      });
    expect(res.status).toBe(200);
  });

  test("Keyword doesn't exist", async () => {
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

    const response = await request(app).post("/auth/login").send({
      username: newUser.username,
      password: "testpassword",
    });

    expect(response.status).toBe(200);

    const sessionID = response.headers["set-cookie"];

    const res = await request(app)
      .post("/user/keyword")
      .set("Cookie", sessionID)
      .send({
        keywordId: -230,
      });
    expect(res.status).toBe(404);
    expect(res.body.message).toBe("Invalid keyword.");
  });
});

describe("DELETE /user/keyword endpoint", () => {
  test("Keyword successfully disassociated", async () => {
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

    const response = await request(app).post("/auth/login").send({
      username: newUser.username,
      password: "testpassword",
    });

    expect(response.status).toBe(200);

    const sessionID = response.headers["set-cookie"];

    const keywordRes = await request(app)
      .post("/keyword")
      .set("Cookie", sessionID)
      .send({
        text: "mfw2",
      });

    expect(keywordRes.status).toBe(200);

    await request(app)
      .post("/user/keyword")
      .set("Cookie", sessionID)
      .send({
        keywordId: keywordRes.body.id,
      });
    
    const res = await request(app)
      .delete("/user/keyword")
      .set("Cookie", sessionID)
      .send({
        keywordId: keywordRes.body.id,
      });
    expect(res.status).toBe(200);
  });

  test("Keyword doesn't exist", async () => {
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

    const response = await request(app).post("/auth/login").send({
      username: newUser.username,
      password: "testpassword",
    });

    expect(response.status).toBe(200);

    const sessionID = response.headers["set-cookie"];

    const res = await request(app)
      .delete("/user/keyword")
      .set("Cookie", sessionID)
      .send({
        keywordId: -230,
      });
    expect(res.status).toBe(400);
    expect(res.body.message).toBe("Invalid keyword.");
  });
});

describe("/user/keywords endpoint", () => {
  test("Multiple keywords successfully listed", async () => {
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

    const response = await request(app).post("/auth/login").send({
      username: newUser.username,
      password: "testpassword",
    });

    expect(response.status).toBe(200);

    const sessionID = response.headers["set-cookie"];

    // add and link keyword 1
    let keywordRes = await request(app)
      .post("/keyword")
      .set("Cookie", sessionID)
      .send({
        text: "skibidi59",
      });

    expect(keywordRes.status).toBe(200);

    await request(app)
      .post("/user/keyword")
      .set("Cookie", sessionID)
      .send({
        keywordId: keywordRes.body.id,
      });
    
    // add and link keyword 2
    keywordRes = await request(app)
      .post("/keyword")
      .set("Cookie", sessionID)
      .send({
        text: "toilet39",
      });
    
    expect(keywordRes.status).toBe(200);

    await request(app)
      .post("/user/keyword")
      .set("Cookie", sessionID)
      .send({
        keywordId: keywordRes.body.id,
      });

    const res = await request(app)
      .get("/user/keywords")
      .set("Cookie", sessionID);
    expect(res.status).toBe(200);
    expect(res.body.length).toBe(2);
    expect(res.body.map((x) => x.text)).toContain('skibidi59');
    expect(res.body.map((x) => x.text)).toContain('toilet39');
  });

  test("Zero keywords successfully listed", async () => {
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

    const response = await request(app).post("/auth/login").send({
      username: newUser.username,
      password: "testpassword",
    });

    expect(response.status).toBe(200);

    const sessionID = response.headers["set-cookie"];
    
    const res = await request(app)
      .get("/user/keywords")
      .set("Cookie", sessionID)
    expect(res.status).toBe(200);
    expect(res.body.length).toBe(0);
  });
});
