import { expect, test, vi, describe } from "vitest"; // 👈🏻 Added the `vi` import
import prisma from "../src/prisma";
import request from "supertest";
import app from "../src/index";
import { beforeEach } from "node:test";

describe("/join endpoint", () => {
  test("Join Successful", async () => {
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
    
    const societyRes = await request(app).post("/society/create")
    .set("Cookie", sessionID)
    .send({
      name: "Rizzsoc"
    });

    expect(societyRes.status).toBe(200);

    const joinRes = await request(app).post("/user/society/join")
    .set("Cookie", sessionID)
    .send({
        societyId: societyRes.body.id,
    })
    expect(joinRes.status).toBe(200);
  });

  test("Society doesn't exist", async () => {
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
    
    const societyRes = await request(app).post("/society/create")
    .set("Cookie", sessionID)
    .send({
      name: "Rizzsoc"
    });

    expect(societyRes.status).toBe(200);

    const joinRes = await request(app).post("/user/society/join")
    .set("Cookie", sessionID)
    .send({
        societyId: -230,
    })
    expect(joinRes.status).toBe(400);
  });
});

describe("/leave endpoint", () => {
    test("Leave: Successful", async () => {
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
        
        const societyRes = await request(app).post("/society/create")
        .set("Cookie", sessionID)
        .send({
            name: "Rizzsoc"
        });

        expect(societyRes.status).toBe(200);

        const joinRes = await request(app).delete("/user/society")
        .set("Cookie", sessionID)
        .send({
            societyId: societyRes.body.id,
        })
        expect(joinRes.status).toBe(200);
    });

    test("Leave: Successful", async () => {
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
        
        const societyRes = await request(app).post("/society/create")
        .set("Cookie", sessionID)
        .send({
            name: "Rizzsoc"
        });

        expect(societyRes.status).toBe(200);

        const joinRes = await request(app).delete("/user/society")
        .set("Cookie", sessionID)
        .send({
            societyId: -230,
        })
        expect(joinRes.status).toBe(400);
    });
})
