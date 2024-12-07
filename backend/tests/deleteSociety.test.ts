import { expect, test, vi, describe } from "vitest"; // 👈🏻 Added the `vi` import
import prisma from "../src/prisma";
import request from "supertest";
import app from "../src/index";
import { beforeEach } from "node:test";

describe("'/society/create endpoint", () => {
  test("Successful Deletion", async () => {
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

    const deleteRes = await request(app).delete("/society")
    .set("Cookie", sessionID)
    .send({
        id: societyRes.body.id
    })

    expect(deleteRes.status).toBe(200);
  });

  test("User Not Admin", async () => {
    const { status, body } = await request(app).post("/auth/register").send({
        username: "shinjisatoo",
        password: "testpassword",
        email: "longseason1996@gmail.com",
        userType: "ATTENDEE",
      });
      
      const { status2, bod2y } = await request(app).post("/auth/register").send({
        username: "shinjisatoooo",
        password: "testpassworddd",
        email: "longseason199666@gmail.com",
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
      
    const loginres2 = await request(app).post("/auth/login").send({
        username: "shinjisatoooo",
        password: "testpassworddd",
     });
    const sessionID2 = loginres2.headers["set-cookie"];

      const deleteRes = await request(app).delete("/society")
      .set("Cookie", sessionID2)
      .send({
          id: societyRes.body.id
      })
  
      expect(deleteRes.status).toBe(401);
  })
});
