//test/sample.test.ts
import { expect, test, vi, describe } from "vitest";
import prisma from "../src/prisma";
import request from "supertest";
import app from "../src/index";
import { SanitisedUser } from "../src/interfaces";

describe("/user endpoint", () => {
  test("login success, fetch /user", async () => {
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
    if (newUser == null) return;

    const loginResponse = await request(app).post("/auth/login").send({
      username: newUser.username,
      password: "testpassword",
    });

    expect(loginResponse.status).toBe(200);

    const sessionID = loginResponse.headers["set-cookie"];
    const userResponse = await request(app)
      .get("/user")
      .set("Cookie", sessionID);

    expect(userResponse.status).toBe(200);

    const userBody: SanitisedUser = userResponse.body;

    expect(userBody.id == newUser.id);
    expect(userBody.username == newUser.username);
    expect(userBody.email == newUser.email);
    expect(userBody.dateJoined == newUser.dateJoined);
    expect(userBody.profilePicture == newUser.profilePicture);
  });

  test("fetch /user without session", async () => {
    const response2 = await request(app).get("/user");
    expect(response2.status).toBe(401);
  });

  test("fetch /user with invalid session", async () => {
    const response2 = await request(app)
      .get("/user")
      .set("Cookie", "invalid_session");
    expect(response2.status).toBe(401);
  });
});
