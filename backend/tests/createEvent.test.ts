import { expect, test, vi, describe } from "vitest"; // 👈🏻 Added the `vi` import
import prisma from "../src/prisma";
import request from "supertest";
import app from "../src/index";
import { beforeEach } from "node:test";

describe("Tests", () => {
    test("Session Invalid", async () => {
        const { status, body } = await request(app).post("/event/create").send({
            banner: "asdasd",
            name: "tiktokrizzparty",
            startTimeDate: Date.now(),
            endTimeDate: Date.now(),
            location: "tampa, florida",
            description: "fein! fein! fein! fein! fein so good she honor roll"
        });
        expect(status).toBe(401);
        expect(body.message).toBe("User session invalid")
    })

    test("Session Valid(Does not interact with db pls update!)", async () => {
        const { status, body } = await request(app).post("/auth/register").send({
            username: "shinjisatoo",
            password: "testpassword",
            email: "longseason1996@gmail.com",
            userType: "ATTENDEE",
          });

        const response = await request(app).post("/auth/login").send({
            username: "shinjisatoo",
            password: "testpassword",
        });
        
        expect(response.status).toBe(200)
    })
})