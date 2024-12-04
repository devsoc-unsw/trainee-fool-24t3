import { expect, test, vi, describe } from "vitest"; // 👈🏻 Added the `vi` import
import prisma from "../src/prisma";
import request from "supertest";
import app from "../src/index";
import { beforeEach } from "node:test";
import dayjs from "dayjs";

describe('/attend endpoint', () => {
    test('Attend successful', async () => {
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

        const loginres = await request(app).post("/auth/login").send({
            username: "shinjisatoo",
            password: "testpassword",
        });
        let sessionID = loginres.headers["set-cookie"];

        const societyRes = await request(app).post("/society/create")
        .set("Cookie", sessionID)
        .send({
            name: "Rizzsoc",
            userId: newUser.id,
        });
        
        const socId = societyRes.body.id
        expect(societyRes.status).toBe(200);
        var start = new Date()

        const eventRes = await request(app)
        .post("/event/create")
        .set("Cookie", sessionID)
        .send({
            banner: "https://img-cdn.inc.com/image/upload/f_webp,q_auto,c_fit/images/panoramic/Island-Entertainment-viral-tiktok-inc_539684_hnvnix.jpg",
            name: "tiktokrizzparty",
            startDateTime: new Date(),
            endDateTime: new Date(start.getTime() + 86400000),
            location: "tampa, florida",
            description: "fein! fein! fein! fein! fein so good she honor roll",
            societyId: socId
        });

        const attendRes = await request(app).post("/user/event/attend")
        .set("Cookie", sessionID)
        .send({
            eventId: eventRes.body.numId
        })

        expect(attendRes.status).toBe(200);
    })

    test('Event invalid', async () => {
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

        const loginres = await request(app).post("/auth/login").send({
            username: "shinjisatoo",
            password: "testpassword",
        });
        let sessionID = loginres.headers["set-cookie"];

        const societyRes = await request(app).post("/society/create")
        .set("Cookie", sessionID)
        .send({
            name: "Rizzsoc",
            userId: newUser.id,
        });
        
        const socId = societyRes.body.id
        expect(societyRes.status).toBe(200);
        var start = new Date()

        const eventRes = await request(app)
        .post("/event/create")
        .set("Cookie", sessionID)
        .send({
            banner: "https://img-cdn.inc.com/image/upload/f_webp,q_auto,c_fit/images/panoramic/Island-Entertainment-viral-tiktok-inc_539684_hnvnix.jpg",
            name: "tiktokrizzparty",
            startDateTime: new Date(),
            endDateTime: new Date(start.getTime() + 86400000),
            location: "tampa, florida",
            description: "fein! fein! fein! fein! fein so good she honor roll",
            societyId: socId
        });

        const attendRes = await request(app).post("/user/event/attend")
        .set("Cookie", sessionID)
        .send({
            eventId: -123
        })
        
        expect(attendRes.status).toBe(400);
    })
})

describe('/unattend endpoint', () => {
    test('Unattend successful', async () => {
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

        const loginres = await request(app).post("/auth/login").send({
            username: "shinjisatoo",
            password: "testpassword",
        });
        let sessionID = loginres.headers["set-cookie"];

        const societyRes = await request(app).post("/society/create")
        .set("Cookie", sessionID)
        .send({
            name: "Rizzsoc",
            userId: newUser.id,
        });
        
        const socId = societyRes.body.id
        expect(societyRes.status).toBe(200);
        var start = new Date()

        const eventRes = await request(app)
        .post("/event/create")
        .set("Cookie", sessionID)
        .send({
            banner: "https://img-cdn.inc.com/image/upload/f_webp,q_auto,c_fit/images/panoramic/Island-Entertainment-viral-tiktok-inc_539684_hnvnix.jpg",
            name: "tiktokrizzparty",
            startDateTime: new Date(),
            endDateTime: new Date(start.getTime() + 86400000),
            location: "tampa, florida",
            description: "fein! fein! fein! fein! fein so good she honor roll",
            societyId: socId
        });

        const attendRes = await request(app).post("/user/event/unattend")
        .set("Cookie", sessionID)
        .send({
            eventId: eventRes.body.numId
        })
        
        expect(attendRes.status).toBe(200);
    })

    test('Event invalid', async () => {
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

        const loginres = await request(app).post("/auth/login").send({
            username: "shinjisatoo",
            password: "testpassword",
        });
        let sessionID = loginres.headers["set-cookie"];

        const societyRes = await request(app).post("/society/create")
        .set("Cookie", sessionID)
        .send({
            name: "Rizzsoc",
            userId: newUser.id,
        });
        
        const socId = societyRes.body.id
        expect(societyRes.status).toBe(200);
        var start = new Date()

        const eventRes = await request(app)
        .post("/event/create")
        .set("Cookie", sessionID)
        .send({
            banner: "https://img-cdn.inc.com/image/upload/f_webp,q_auto,c_fit/images/panoramic/Island-Entertainment-viral-tiktok-inc_539684_hnvnix.jpg",
            name: "tiktokrizzparty",
            startDateTime: new Date(),
            endDateTime: new Date(start.getTime() + 86400000),
            location: "tampa, florida",
            description: "fein! fein! fein! fein! fein so good she honor roll",
            societyId: socId
        });

        const attendRes = await request(app).post("/user/event/unattend")
        .set("Cookie", sessionID)
        .send({
            eventId: -123
        })
        console.log(attendRes)
        expect(attendRes.status).toBe(400);
    })
})