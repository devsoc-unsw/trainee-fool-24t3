import { describe, expect, test } from "vitest";
import request from "supertest";
import app from "../src/index";
import prisma from "../src/prisma";

describe("/event endpoint", () => {
  test("Create and get event successfully", async () => {
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

    const societyRes = await request(app)
      .post("/society/create")
      .set("Cookie", sessionID)
      .send({
        name: "Rizzsoc",
        userId: newUser.id,
      });

    const socId = societyRes.body.id;
    expect(societyRes.status).toBe(200);
    const start = new Date();

    const response = await request(app)
      .post("/event/create")
      .set("Cookie", sessionID)
      .send({
        banner:
          "https://img-cdn.inc.com/image/upload/f_webp,q_auto,c_fit/images/panoramic/Island-Entertainment-viral-tiktok-inc_539684_hnvnix.jpg",
        name: "tiktokrizzparty",
        startDateTime: new Date(),
        endDateTime: new Date(start.getTime() + 86400000),
        location: "tampa, florida",
        description: "fein! fein! fein! fein! fein so good she honor roll",
        societyId: socId,
      });

    expect(response.status).toBe(200);

    const getRes = await request(app)
      .get("/event")
      .set("Cookie", sessionID)
      .query({
        id: response.body.id,
      });

    expect(getRes.status).toBe(200);
    expect(getRes.body.name).toBe("tiktokrizzparty");
  });

  test("Get nonexistent event", async () => {
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

    expect(status).toBe(201);

    const loginres = await request(app).post("/auth/login").send({
      username: "shinjisatoo",
      password: "testpassword",
    });
    let sessionID = loginres.headers["set-cookie"];

    const response = await request(app)
      .get("/event")
      .set("Cookie", sessionID)
      .query({
        id: 1,
      });

    expect(response.status).toBe(404);
  });

  test("Don't provide event id", async () => {
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

    expect(status).toBe(201);
    expect(newUser).not.toBeNull();

    const loginres = await request(app).post("/auth/login").send({
      username: "shinjisatoo",
      password: "testpassword",
    });
    let sessionID = loginres.headers["set-cookie"];

    const response = await request(app).get("/event").set("Cookie", sessionID);

    expect(response.status).toBe(400);
  });
});
