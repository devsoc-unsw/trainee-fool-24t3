import { describe, expect, test } from "vitest";
import request from "supertest";
import app from "../src/index";
import prisma from "../src/prisma";

describe("GET /user/events endpoint", () => {
  test("Create and get events you're attending successfully", async () => {
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

    // create a second user, who will be attending the events
    const { status: status2, body: body2 } = await request(app)
      .post("/auth/register")
      .send({
        username: "shinjisatoo2",
        password: "testpassword",
        email: "longseason1997@gmail.com",
      });

    const newUser2 = await prisma.user.findFirst({
      where: {
        id: body2.newUser.id,
      },
    });

    expect(status2).toBe(201);

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

    const events: Number[] = [];
    for (let i = 0; i < 10; i++) {
      const response = await request(app)
        .post("/event")
        .set("Cookie", sessionID)
        .send({
          banner:
            "https://img-cdn.inc.com/image/upload/f_webp,q_auto,c_fit/images/panoramic/Island-Entertainment-viral-tiktok-inc_539684_hnvnix.jpg",
          name: "tiktokrizzparty" + i,
          startDateTime: new Date(),
          endDateTime: new Date(start.getTime() + 864000 + i),
          location: "tampa, florida",
          description: "fein! fein! fein! fein! fein so good she honor roll",
          societyId: socId,
        });

      expect(response.status).toBe(200);
      events.push(response.body.id);
    }

    // log in as second user
    const loginres2 = await request(app).post("/auth/login").send({
      username: "shinjisatoo2",
      password: "testpassword",
    });
    expect(loginres2.status).toBe(200);
    sessionID = loginres2.headers["set-cookie"];

    // attend five of the events
    for (let i = 0; i < 5; i++) {
      await request(app).post("/user/event").set("Cookie", sessionID).send({
        eventId: events[i],
      });
    }

    const getRes = await request(app)
      .get("/user/events")
      .set("Cookie", sessionID);

    expect(getRes.status).toBe(200);
    expect(getRes.body.length).toBe(5);
  });

  test("Attend many events", async () => {
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

    // create a second user, who will be attending the events
    const { status: status2, body: body2 } = await request(app)
      .post("/auth/register")
      .send({
        username: "shinjisatoo2",
        password: "testpassword",
        email: "longseason1997@gmail.com",
      });

    const newUser2 = await prisma.user.findFirst({
      where: {
        id: body2.newUser.id,
      },
    });

    expect(status2).toBe(201);

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

    const events: Number[] = [];
    for (let i = 0; i < 20; i++) {
      const response = await request(app)
        .post("/event")
        .set("Cookie", sessionID)
        .send({
          banner:
            "https://img-cdn.inc.com/image/upload/f_webp,q_auto,c_fit/images/panoramic/Island-Entertainment-viral-tiktok-inc_539684_hnvnix.jpg",
          name: "tiktokrizzparty" + i,
          startDateTime: new Date(),
          endDateTime: new Date(start.getTime() + 864000 + i),
          location: "tampa, florida",
          description: "fein! fein! fein! fein! fein so good she honor roll",
          societyId: socId,
        });

      expect(response.status).toBe(200);
      events.push(response.body.id);
    }

    // log in as second user
    const loginres2 = await request(app).post("/auth/login").send({
      username: "shinjisatoo2",
      password: "testpassword",
    });
    expect(loginres2.status).toBe(200);
    sessionID = loginres2.headers["set-cookie"];

    // attend fifteen of the events
    for (let i = 0; i < 15; i++) {
      await request(app).post("/user/event").set("Cookie", sessionID).send({
        eventId: events[i],
      });
    }

    const getRes = await request(app)
      .get("/user/events")
      .set("Cookie", sessionID);

    expect(getRes.status).toBe(200);
    expect(getRes.body.length).toBe(15);
  });

  test("Create and get events successfully, user events are provided by pages", async () => {
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

    const { status: status2, body: body2 } = await request(app)
      .post("/auth/register")
      .send({
        username: "shinjisatoo2",
        password: "testpassword",
        email: "longseason1997@gmail.com",
      });

    expect(status2).toBe(201);

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

    const events: Number[] = [];

    for (let i = 0; i < 25; i++) {
      const response = await request(app)
        .post("/event")
        .set("Cookie", sessionID)
        .send({
          banner:
            "https://img-cdn.inc.com/image/upload/f_webp,q_auto,c_fit/images/panoramic/Island-Entertainment-viral-tiktok-inc_539684_hnvnix.jpg",
          name: "tiktokrizzparty" + i,
          startDateTime: new Date(),
          endDateTime: new Date(start.getTime() + 864000 + i),
          location: "tampa, florida",
          description: "fein! fein! fein! fein! fein so good she honor roll",
          societyId: socId,
        });

      expect(response.status).toBe(200);
      events.push(response.body.id);
    }

    // log in as second user
    const loginres2 = await request(app).post("/auth/login").send({
      username: "shinjisatoo2",
      password: "testpassword",
    });
    expect(loginres2.status).toBe(200);
    sessionID = loginres2.headers["set-cookie"];

    // attend 22 of the events
    for (let i = 0; i < 22; i++) {
      await request(app).post("/user/event").set("Cookie", sessionID).send({
        eventId: events[i],
      });
    }

    const pageOne = await request(app)
      .get("/user/events")
      .set("Cookie", sessionID)
      .query({
        page: 1,
      });

    expect(pageOne.status).toBe(200);
    expect(pageOne.body.length).toBe(10);

    const pageTwo = await request(app)
      .get("/user/events")
      .set("Cookie", sessionID)
      .query({
        page: 2,
      });

    expect(pageTwo.status).toBe(200);
    expect(pageTwo.body.length).toBe(10);
    expect(pageTwo.body).not.toStrictEqual(pageOne.body);

    const pageThree = await request(app)
      .get("/user/events")
      .set("Cookie", sessionID)
      .query({
        page: 3,
      });

    expect(pageThree.status).toBe(200);
    expect(pageThree.body.length).toBe(2);
  }, 20000);

  test("Get user events when not attending any", async () => {
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
      .get("/user/events")
      .set("Cookie", sessionID);

    expect(response.status).toBe(404);
  });

  test("Unauthenticated request", async () => {
    const response = await request(app).get("/user/events").query({
      page: 0,
    });

    expect(response.status).toBe(401);
  });

  test("Get user events when before query param specified", async () => {
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

    const society = await request(app)
      .post("/society/create")
      .set("Cookie", sessionID)
      .send({
        name: "Rizzsoc",
        userId: newUser.id,
      });

    expect(society.status).toBe(200);
    const socId = society.body.id;

    // make a second user
    const loginRes2 = await request(app).post("/auth/register").send({
      username: "shinjisatoo2",
      password: "testpassword",
      email: "longseason1997@gmail.com",
    });

    expect(loginRes2.status).toBe(201);

    const events: Number[] = [];

    for (let i = 0; i < 5; i++) {
      const startDate = new Date(new Date().getTime() + 864000 * i);
      const endDate = new Date(startDate);
      endDate.setDate(startDate.getDate() + i + 1);

      const response = await request(app)
        .post("/event")
        .set("Cookie", sessionID)
        .send({
          banner:
            "https://img-cdn.inc.com/image/upload/f_webp,q_auto,c_fit/images/panoramic/Island-Entertainment-viral-tiktok-inc_539684_hnvnix.jpg",
          name: "tiktokrizzyparty" + i,
          startDateTime: startDate,
          endDateTime: new Date(startDate.getTime() + 960000 + i),
          location: "tampa, florida",
          description: "fein! fein! fein! fein! fein so good she honor roll",
          societyId: socId,
        });

      expect(response.status).toBe(200);
      events.push(response.body.id);
    }

    // log in as second user
    const loginres2 = await request(app).post("/auth/login").send({
      username: "shinjisatoo2",
      password: "testpassword",
    });
    let sessionID2 = loginres2.headers["set-cookie"];

    // attend all the events
    for (let i = 0; i < 5; i++) {
      await request(app).post("/user/event").set("Cookie", sessionID2).send({
        eventId: events[i],
      });
    }

    const future = new Date(Date.now());
    future.setDate(future.getDate() + 200);

    const getRes = await request(app)
      .get("/user/events")
      .set("Cookie", sessionID2)
      .query({
        before: future,
      });

    expect(getRes.status).toBe(200);

    getRes.body.forEach((event) => {
      expect(new Date(event.endDateTime).getTime()).toBeLessThanOrEqual(
        future.getTime()
      );
    });

    expect(getRes.body.length).toBe(5);
  });

  test("Get user events before when query param specified, but no relevant events exist", async () => {
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

    const society = await request(app)
      .post("/society/create")
      .set("Cookie", sessionID)
      .send({
        name: "Rizzsoc",
        userId: newUser.id,
      });

    expect(society.status).toBe(200);
    const socId = society.body.id;

    // make a second user
    const loginRes2 = await request(app).post("/auth/register").send({
      username: "shinjisatoo2",
      password: "testpassword",
      email: "longseason1997@gmail.com",
    });

    expect(loginRes2.status).toBe(201);

    const events: Number[] = [];

    for (let i = 0; i < 5; i++) {
      const startDate = new Date(new Date().getTime() + 864000 * i);
      const endDate = new Date(startDate);
      endDate.setDate(startDate.getDate() + i + 1);

      const response = await request(app)
        .post("/event")
        .set("Cookie", sessionID)
        .send({
          banner:
            "https://img-cdn.inc.com/image/upload/f_webp,q_auto,c_fit/images/panoramic/Island-Entertainment-viral-tiktok-inc_539684_hnvnix.jpg",
          name: "tiktokrizzyparty" + i,
          startDateTime: startDate,
          endDateTime: new Date(startDate.getTime() + 960000 + i),
          location: "tampa, florida",
          description: "fein! fein! fein! fein! fein so good she honor roll",
          societyId: socId,
        });

      expect(response.status).toBe(200);
      events.push(response.body.id);
    }

    // log in as second user
    const loginres2 = await request(app).post("/auth/login").send({
      username: "shinjisatoo2",
      password: "testpassword",
    });
    let sessionID2 = loginres2.headers["set-cookie"];

    // attend all the events
    for (let i = 0; i < 5; i++) {
      await request(app).post("/user/event").set("Cookie", sessionID2).send({
        eventId: events[i],
      });
    }

    const before = new Date(Date.now());
    before.setDate(before.getDate() - 200);

    const getRes = await request(app)
      .get("/user/events")
      .set("Cookie", sessionID2)
      .query({
        before,
      });

    expect(getRes.status).toBe(404);
  });

  test("Get user events after when query param specified, don't include events from before", async () => {
    const { status, body } = await request(app).post("/auth/register").send({
      username: "aftereventsuser",
      password: "testpassword",
      email: "afterevents@example.com",
    });

    const newUser = await prisma.user.findFirst({
      where: {
        id: body.newUser.id,
      },
    });

    if (newUser == null) return;
    expect(status).toBe(201);
    expect(newUser).not.toBeNull();

    // create second user
    const loginRes2 = await request(app).post("/auth/register").send({
      username: "beforeeventsuser",
      password: "testpassword",
      email: "beforeevents@example.com",
    });

    const loginres = await request(app).post("/auth/login").send({
      username: "aftereventsuser",
      password: "testpassword",
    });
    let sessionID = loginres.headers["set-cookie"];

    const society = await request(app)
      .post("/society/create")
      .set("Cookie", sessionID)
      .send({
        name: "AfterEventsSoc",
        userId: newUser.id,
      });

    expect(society.status).toBe(200);
    const socId = society.body.id;

    // Create 5 events with increasing date ranges
    const events: Number[] = [];
    for (let i = 0; i < 5; i++) {
      const startDate = new Date();
      startDate.setDate(startDate.getDate() + i + 1);
      const endDate = new Date(startDate);
      endDate.setDate(startDate.getDate() + i + 2);

      const response = await request(app)
        .post("/event")
        .set("Cookie", sessionID)
        .send({
          banner: "https://example.com/banner.jpg",
          name: "afterevents" + i,
          startDateTime: startDate,
          endDateTime: endDate,
          location: "test location",
          description: "Test event description",
          societyId: socId,
        });

      expect(response.status).toBe(200);
      events.push(response.body.id);
    }

    // login as second user
    const loginres2 = await request(app).post("/auth/login").send({
      username: "beforeeventsuser",
      password: "testpassword",
    });
    let sessionID2 = loginres2.headers["set-cookie"];

    // attend all the events
    for (let i = 0; i < 5; i++) {
      await request(app).post("/user/event").set("Cookie", sessionID2).send({
        eventId: events[i],
      });
    }

    // Query for events after the second event's start date
    const threeDaysLater = new Date();
    threeDaysLater.setDate(threeDaysLater.getDate() + 3);

    const getRes = await request(app)
      .get("/user/events")
      .set("Cookie", sessionID2)
      .query({
        id: socId,
        after: threeDaysLater,
      });

    expect(getRes.status).toBe(200);
    expect(getRes.body.length).toEqual(2);
    getRes.body.forEach((event) => {
      expect(new Date(event.startDateTime).getTime()).toBeGreaterThanOrEqual(
        new Date().getTime()
      );
    });
  });

  test("Get events after when query param specified, covers all events", async () => {
    const { status, body } = await request(app).post("/auth/register").send({
      username: "aftereventsuser",
      password: "testpassword",
      email: "afterevents@example.com",
    });

    const newUser = await prisma.user.findFirst({
      where: {
        id: body.newUser.id,
      },
    });

    if (newUser == null) return;
    expect(status).toBe(201);
    expect(newUser).not.toBeNull();

    // create second user
    const loginRes2 = await request(app).post("/auth/register").send({
      username: "beforeeventsuser",
      password: "testpassword",
      email: "beforeevents@example.com",
    });

    const loginres = await request(app).post("/auth/login").send({
      username: "aftereventsuser",
      password: "testpassword",
    });
    let sessionID = loginres.headers["set-cookie"];

    const society = await request(app)
      .post("/society/create")
      .set("Cookie", sessionID)
      .send({
        name: "AfterEventsSoc",
        userId: newUser.id,
      });

    const society2 = await request(app)
      .post("/society/create")
      .set("Cookie", sessionID)
      .send({
        name: "AfterEventsSoc2",
        userId: newUser.id,
      });

    expect(society.status).toBe(200);
    expect(society2.status).toBe(200);
    const socId = society.body.id;
    const socId2 = society2.body.id;

    // Create 5 events with increasing date ranges
    const events: Number[] = [];
    for (let i = 0; i < 5; i++) {
      const startDate = new Date();
      const endDate = new Date(startDate);
      endDate.setDate(startDate.getDate() + 5);

      const response = await request(app)
        .post("/event")
        .set("Cookie", sessionID)
        .send({
          banner: "https://example.com/banner.jpg",
          name: "afterevents" + i,
          startDateTime: startDate,
          endDateTime: endDate,
          location: "test location",
          description: "Test event description",
          societyId: socId,
        });

      const response2 = await request(app)
        .post("/event")
        .set("Cookie", sessionID)
        .send({
          banner: "https://example.com/banner.jpg",
          name: "afterevents2" + i,
          startDateTime: startDate,
          endDateTime: endDate,
          location: "test location",
          description: "Test event description",
          societyId: socId2,
        });

      expect(response.status).toBe(200);
      expect(response2.status).toBe(200);
      events.push(response.body.id);
      events.push(response2.body.id);
    }

    // login as second user
    const loginres2 = await request(app).post("/auth/login").send({
      username: "beforeeventsuser",
      password: "testpassword",
    });
    let sessionID2 = loginres2.headers["set-cookie"];

    // attend all of the events
    for (let i = 0; i < 10; i++) {
      await request(app).post("/user/event").set("Cookie", sessionID2).send({
        eventId: events[i],
      });
    }

    // Query for events after the second event's start date
    const getRes = await request(app)
      .get("/user/events")
      .set("Cookie", sessionID2)
      .query({
        after: new Date(Date.parse("2020-01-01")),
      });

    expect(getRes.status).toBe(200);
    expect(getRes.body.length).toEqual(10);

    // Verify all returned events start after the specified date
    getRes.body.forEach((event) => {
      expect(new Date(event.startDateTime).getTime()).toBeGreaterThanOrEqual(
        new Date(Date.parse("2020-01-01")).getTime()
      );
    });
  });

  test("Get user events before and after when query params specify, covers all events being attended, use pagination", async () => {
    const { status, body } = await request(app).post("/auth/register").send({
      username: "aftereventsuser",
      password: "testpassword",
      email: "afterevents@example.com",
    });

    const newUser = await prisma.user.findFirst({
      where: {
        id: body.newUser.id,
      },
    });

    if (newUser == null) return;
    expect(status).toBe(201);
    expect(newUser).not.toBeNull();

    // create second user
    const loginRes2 = await request(app).post("/auth/register").send({
      username: "beforeeventsuser",
      password: "testpassword",
      email: "beforeevents@example.com",
    });

    const loginres = await request(app).post("/auth/login").send({
      username: "aftereventsuser",
      password: "testpassword",
    });
    let sessionID = loginres.headers["set-cookie"];

    const society = await request(app)
      .post("/society/create")
      .set("Cookie", sessionID)
      .send({
        name: "AfterEventsSoc",
        userId: newUser.id,
      });

    const society2 = await request(app)
      .post("/society/create")
      .set("Cookie", sessionID)
      .send({
        name: "AfterEventsSoc2",
        userId: newUser.id,
      });

    expect(society.status).toBe(200);
    const socId = society.body.id;
    expect(society2.status).toBe(200);
    const socId2 = society2.body.id;

    const events: Number[] = [];
    for (let i = 0; i < 6; i++) {
      const startDate = new Date();
      const endDate = new Date(startDate);
      endDate.setDate(startDate.getDate() + 5);

      const response = await request(app)
        .post("/event")
        .set("Cookie", sessionID)
        .send({
          banner: "https://example.com/banner.jpg",
          name: "afterevents" + i,
          startDateTime: startDate,
          endDateTime: endDate,
          location: "test location",
          description: "Test event description",
          societyId: socId,
        });

      const response2 = await request(app)
        .post("/event")
        .set("Cookie", sessionID)
        .send({
          banner: "https://example.com/banner.jpg",
          name: "afterevents2" + i,
          startDateTime: startDate,
          endDateTime: endDate,
          location: "test location",
          description: "Test event description",
          societyId: socId2,
        });

      expect(response.status).toBe(200);
      expect(response2.status).toBe(200);
      events.push(response.body.id);
      events.push(response2.body.id);
    }

    // login as second user
    const loginres2 = await request(app).post("/auth/login").send({
      username: "beforeeventsuser",
      password: "testpassword",
    });
    let sessionID2 = loginres2.headers["set-cookie"];

    // attend all the events
    for (let i = 0; i < 12; i++) {
      await request(app).post("/user/event").set("Cookie", sessionID2).send({
        eventId: events[i],
      });
    }

    const beforeThisDate = new Date();
    beforeThisDate.setDate(beforeThisDate.getDate() + 99);

    const getRes = await request(app)
      .get("/user/events")
      .set("Cookie", sessionID2)
      .query({
        before: beforeThisDate,
        after: new Date(Date.parse("2020-01-01")),
        page: 1,
      });

    expect(getRes.status).toBe(200);
    expect(getRes.body.length).toEqual(10); // pagination moment

    // Verify all returned events start after the specified date
    getRes.body.forEach((event) => {
      expect(new Date(event.startDateTime).getTime()).toBeGreaterThanOrEqual(
        new Date(Date.parse("2020-01-01")).getTime()
      );

      expect(new Date(event.startDateTime).getTime()).toBeLessThanOrEqual(
        beforeThisDate.getTime()
      );
    });

    const getRes2 = await request(app)
      .get("/user/events")
      .set("Cookie", sessionID2)
      .query({
        before: beforeThisDate,
        after: new Date(Date.parse("2020-01-01")),
        page: 2,
      });

    expect(getRes2.status).toBe(200);
    expect(getRes2.body.length).toEqual(2);
  });

  test("Get events before and after when query params specify, covers no events", async () => {
    const { status, body } = await request(app).post("/auth/register").send({
      username: "aftereventsuser",
      password: "testpassword",
      email: "afterevents@example.com",
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
      username: "aftereventsuser",
      password: "testpassword",
    });
    let sessionID = loginres.headers["set-cookie"];

    const society = await request(app)
      .post("/society/create")
      .set("Cookie", sessionID)
      .send({
        name: "AfterEventsSoc",
        userId: newUser.id,
      });

    expect(society.status).toBe(200);
    const socId = society.body.id;

    const beforeThisDate = new Date();
    beforeThisDate.setDate(beforeThisDate.getDate() + 99);

    const getRes = await request(app)
      .get("/user/events")
      .set("Cookie", sessionID)
      .query({
        before: beforeThisDate,
        after: new Date(Date.parse("2020-01-01")),
      });

    expect(getRes.status).toBe(404);
  });
});
