import { expect, test, vi, describe } from "vitest"; // 👈🏻 Added the `vi` import
import prisma from "../src/prisma";
import request from "supertest";
import app from "../src/index";
import { beforeEach } from "node:test";
import dayjs from "dayjs";

describe("Session Tests", () => {
    test("Session Invalid", async () => {
        const { status, body } = await request(app).post("/event/create").send({
            banner: "asdasd",
            name: "tiktokrizzparty",
            startTimeDate: dayjs(),
            endTimeDate: dayjs().add(1, 'd'),
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

        const loginres = await request(app).post("/auth/login").send({
            username: "shinjisatoo",
            password: "testpassword",
        });
        let sessionID = loginres.headers["set-cookie"];

        const response = await request(app)
        .post("/event/create")
        .set("Cookie", sessionID)
        .send({
            banner: "https://img-cdn.inc.com/image/upload/f_webp,q_auto,c_fit/images/panoramic/Island-Entertainment-viral-tiktok-inc_539684_hnvnix.jpg",
            name: "tiktokrizzparty",
            startTimeDate: dayjs().add(30, 'm'),
            endTimeDate: dayjs().add(60, 'm'),
            location: "tampa, florida",
            description: "fein! fein! fein! fein! fein so good she honor roll"
        });

        expect(response.status).toBe(200)
    })

    test("Invalid Date(end before start)", async () => {
        const { status, body } = await request(app).post("/auth/register").send({
            username: "shinjisatoo",
            password: "testpassword",
            email: "longseason1996@gmail.com",
            userType: "ATTENDEE",
          });

        const loginres = await request(app).post("/auth/login").send({
            username: "shinjisatoo",
            password: "testpassword",
        });
        let sessionID = loginres.headers["set-cookie"];
        
        const response = await request(app)
        .post("/event/create")
        .set("Cookie", sessionID)
        .send({
            banner: "https://img-cdn.inc.com/image/upload/f_webp,q_auto,c_fit/images/panoramic/Island-Entertainment-viral-tiktok-inc_539684_hnvnix.jpg",
            name: "tiktokrizzparty",
            startTimeDate: dayjs().add(30, 'm'),
            endTimeDate: dayjs().add(15, 'm'),
            location: "tampa, florida",
            description: "fein! fein! fein! fein! fein so good she honor roll"
        });

        expect(response.status).toBe(400)
    })
})
