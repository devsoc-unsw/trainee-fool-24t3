import { expect, test, vi, describe } from "vitest"; // 👈🏻 Added the `vi` import
import prisma from "../src/prisma";
import request from "supertest";
import app from "../src/index";
import { beforeEach } from "node:test";
import dayjs from "dayjs";
import { create } from "domain";

/*
    This may or may not be the ugliest test I've ever written. :D
*/
describe("Delete Event Endpoint", () => {
  test("Delete Event", async () => {
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

    const createRes = await request(app)
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

    expect(createRes.status).toBe(200);

    const deleteRes = await request(app)
      .delete("/event")
      .set("Cookie", sessionID)
      .send({
        eventId: createRes.body.id,
      });

    expect(deleteRes.status).toBe(200);
  });

  test("Not Admin", async () => {
    const { status, body } = await request(app).post("/auth/register").send({
      username: "shinjisatoo",
      password: "testpassword",
      email: "longseason1996@gmail.com",
    });

    const { status2, bod2y } = await request(app).post("/auth/register").send({
      username: "shinjisatoooo",
      password: "testpassworddd",
      email: "longseason199666@gmail.com",
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

    const createRes = await request(app)
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

    expect(createRes.status).toBe(200);

    const loginres2 = await request(app).post("/auth/login").send({
      username: "shinjisatoooo",
      password: "testpassworddd",
    });
    sessionID = loginres2.headers["set-cookie"];

    const deleteRes = await request(app)
      .delete("/event")
      .set("Cookie", sessionID)
      .send({
        eventId: createRes.body.id,
      });

    expect(deleteRes.status).toBe(401);
  });
});
