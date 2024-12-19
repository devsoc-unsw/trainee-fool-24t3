import { describe, expect, test } from 'vitest';
import request from 'supertest';
import app from '../src/index';
import prisma from '../src/prisma';

describe('/events endpoint', () => {
  test('Create and get events successfully', async () => {
    const { status, body } = await request(app).post('/auth/register').send({
      username: 'shinjisatoo',
      password: 'testpassword',
      email: 'longseason1996@gmail.com',
    });

    const newUser = await prisma.user.findFirst({
      where: {
        id: body.newUser.id,
      },
    });

    if (newUser == null) return;
    expect(status).toBe(201);
    expect(newUser).not.toBeNull();

    const loginres = await request(app).post('/auth/login').send({
      username: 'shinjisatoo',
      password: 'testpassword',
    });
    let sessionID = loginres.headers['set-cookie'];

    const societyRes = await request(app)
      .post('/society')
      .set('Cookie', sessionID)
      .send({
        name: 'Rizzsoc',
        userId: newUser.id,
      });

    const socId = societyRes.body.id;
    expect(societyRes.status).toBe(200);
    const start = new Date();

    for (let i = 0; i < 10; i++) {
      const response = await request(app)
        .post('/event')
        .set('Cookie', sessionID)
        .send({
          image:
            'https://img-cdn.inc.com/image/upload/f_webp,q_auto,c_fit/images/panoramic/Island-Entertainment-viral-tiktok-inc_539684_hnvnix.jpg',
          name: 'tiktokrizzparty' + i,
          startDateTime: new Date(),
          endDateTime: new Date(start.getTime() + 864000 + i),
          location: 'tampa, florida',
          description: 'fein! fein! fein! fein! fein so good she honor roll',
          societyId: socId,
        });

      expect(response.status).toBe(200);
    }

    const getRes = await request(app).get('/events');

    expect(getRes.status).toBe(200);
    expect(getRes.body.length).toBe(10);
  });

  test('Create and get events successfully, events are provided by pages', async () => {
    const { status, body } = await request(app).post('/auth/register').send({
      username: 'shinjisatoo',
      password: 'testpassword',
      email: 'longseason1996@gmail.com',
    });

    const newUser = await prisma.user.findFirst({
      where: {
        id: body.newUser.id,
      },
    });

    if (newUser == null) return;
    expect(status).toBe(201);
    expect(newUser).not.toBeNull();

    const loginres = await request(app).post('/auth/login').send({
      username: 'shinjisatoo',
      password: 'testpassword',
    });
    let sessionID = loginres.headers['set-cookie'];

    const societyRes = await request(app)
      .post('/society')
      .set('Cookie', sessionID)
      .send({
        name: 'Rizzsoc',
        userId: newUser.id,
      });

    const socId = societyRes.body.id;
    expect(societyRes.status).toBe(200);
    const start = new Date();

    for (let i = 0; i < 25; i++) {
      const response = await request(app)
        .post('/event')
        .set('Cookie', sessionID)
        .send({
          image:
            'https://img-cdn.inc.com/image/upload/f_webp,q_auto,c_fit/images/panoramic/Island-Entertainment-viral-tiktok-inc_539684_hnvnix.jpg',
          name: 'tiktokrizzparty' + i,
          startDateTime: new Date(),
          endDateTime: new Date(start.getTime() + 864000 + i),
          location: 'tampa, florida',
          description: 'fein! fein! fein! fein! fein so good she honor roll',
          societyId: socId,
        });

      expect(response.status).toBe(200);
    }

    const getRes = await request(app).get('/events');

    expect(getRes.status).toBe(200);
    expect(getRes.body.length).toBe(10);

    const pageOne = await request(app).get('/events').query({
      page: 1,
    });

    expect(pageOne.status).toBe(200);
    expect(pageOne.body).toStrictEqual(getRes.body);

    const pageTwo = await request(app).get('/events').query({
      page: 2,
    });

    expect(pageTwo.status).toBe(200);
    expect(pageTwo.body).not.toStrictEqual(pageOne.body);
    expect(pageTwo.body.length).toBe(10);

    const pageThree = await request(app).get('/events').query({
      page: 3,
    });

    expect(pageThree.status).toBe(200);
    expect(pageThree.body.length).toBe(5);
  }, 20000);

  test('Get events when none exist', async () => {
    const { status, body } = await request(app).post('/auth/register').send({
      username: 'shinjisatoo',
      password: 'testpassword',
      email: 'longseason1996@gmail.com',
    });

    const newUser = await prisma.user.findFirst({
      where: {
        id: body.newUser.id,
      },
    });

    expect(status).toBe(201);

    const loginres = await request(app).post('/auth/login').send({
      username: 'shinjisatoo',
      password: 'testpassword',
    });
    let sessionID = loginres.headers['set-cookie'];

    const response = await request(app).get('/events');

    expect(response.status).toBe(404);
  });

  test('Provide invalid page', async () => {
    const response = await request(app).get('/events').query({
      page: 0,
    });

    expect(response.status).toBe(400);
  });

  test('Get events before when query param specified', async () => {
    const { status, body } = await request(app).post('/auth/register').send({
      username: 'shinjisatoo',
      password: 'testpassword',
      email: 'longseason1996@gmail.com',
    });

    const newUser = await prisma.user.findFirst({
      where: {
        id: body.newUser.id,
      },
    });

    if (newUser == null) return;
    expect(status).toBe(201);
    expect(newUser).not.toBeNull();

    const loginres = await request(app).post('/auth/login').send({
      username: 'shinjisatoo',
      password: 'testpassword',
    });
    let sessionID = loginres.headers['set-cookie'];

    const society = await request(app)
      .post('/society')
      .set('Cookie', sessionID)
      .send({
        name: 'Rizzsoc',
        userId: newUser.id,
      });

    expect(society.status).toBe(200);
    const socId = society.body.id;

    const society2 = await request(app)
      .post('/society')
      .set('Cookie', sessionID)
      .send({
        name: 'Rizzsoc2',
        userId: newUser.id,
      });

    expect(society2.status).toBe(200);
    const socId2 = society2.body.id;

    const endDates: Date[] = [];

    for (let i = 0; i < 5; i++) {
      const startDate = new Date(new Date().getTime() + 864000 * i);
      const endDate = new Date(startDate);
      endDate.setDate(startDate.getDate() + i + 1);

      const response = await request(app)
        .post('/event')
        .set('Cookie', sessionID)
        .send({
          image:
            'https://img-cdn.inc.com/image/upload/f_webp,q_auto,c_fit/images/panoramic/Island-Entertainment-viral-tiktok-inc_539684_hnvnix.jpg',
          name: 'tiktokrizzyparty' + i,
          startDateTime: startDate,
          endDateTime: new Date(startDate.getTime() + 960000 + i),
          location: 'tampa, florida',
          description: 'fein! fein! fein! fein! fein so good she honor roll',
          societyId: socId,
        });

      const response2 = await request(app)
        .post('/event')
        .set('Cookie', sessionID)
        .send({
          image:
            'https://img-cdn.inc.com/image/upload/f_webp,q_auto,c_fit/images/panoramic/Island-Entertainment-viral-tiktok-inc_539684_hnvnix.jpg',
          name: 'tiktokrizziestparty' + i,
          startDateTime: startDate,
          endDateTime: new Date(startDate.getTime() + 960000 + i),
          location: 'tampa, florida',
          description: 'fein! fein! fein! fein! fein so good she honor roll',
          societyId: socId2,
        });

      endDates.push(endDate);
      expect(response.status).toBe(200);
      expect(response2.status).toBe(200);
    }

    const getRes = await request(app).get('/events').query({
      before: endDates[3],
    });

    getRes.body.forEach((event) => {
      expect(new Date(event.endDateTime).getTime()).toBeLessThanOrEqual(
        endDates[3].getTime()
      );
    });

    expect(getRes.body.length).toBe(10);
  });

  test('Get events before when query param specified, but no relevant events exist', async () => {
    const { status, body } = await request(app).post('/auth/register').send({
      username: 'shinjisatoo',
      password: 'testpassword',
      email: 'longseason1996@gmail.com',
    });

    const newUser = await prisma.user.findFirst({
      where: {
        id: body.newUser.id,
      },
    });

    if (newUser == null) return;
    expect(status).toBe(201);
    expect(newUser).not.toBeNull();

    const loginres = await request(app).post('/auth/login').send({
      username: 'shinjisatoo',
      password: 'testpassword',
    });
    let sessionID = loginres.headers['set-cookie'];

    const society = await request(app)
      .post('/society')
      .set('Cookie', sessionID)
      .send({
        name: 'Rizzsoc',
        userId: newUser.id,
      });

    expect(society.status).toBe(200);
    const socId = society.body.id;

    for (let i = 0; i < 5; i++) {
      const startDate = new Date(new Date().getTime() + 864000 * i);
      const endDate = new Date(startDate);
      endDate.setDate(startDate.getDate() + i + 1);

      const response = await request(app)
        .post('/event')
        .set('Cookie', sessionID)
        .send({
          image:
            'https://img-cdn.inc.com/image/upload/f_webp,q_auto,c_fit/images/panoramic/Island-Entertainment-viral-tiktok-inc_539684_hnvnix.jpg',
          name: 'tiktokrizzyparty' + i,
          startDateTime: startDate,
          endDateTime: endDate,
          location: 'tampa, florida',
          description: 'fein! fein! fein! fein! fein so good she honor roll',
          societyId: socId,
        });

      expect(response.status).toBe(200);
    }

    const getRes = await request(app)
      .get('/events')
      .query({
        id: socId,
        before: new Date(Date.parse('2022-01-01')),
      });

    expect(getRes.status).toBe(404);
  });

  test("Get events after when query param specified, don't include events from before", async () => {
    const { status, body } = await request(app).post('/auth/register').send({
      username: 'aftereventsuser',
      password: 'testpassword',
      email: 'afterevents@example.com',
    });

    const newUser = await prisma.user.findFirst({
      where: {
        id: body.newUser.id,
      },
    });

    if (newUser == null) return;
    expect(status).toBe(201);
    expect(newUser).not.toBeNull();

    const loginres = await request(app).post('/auth/login').send({
      username: 'aftereventsuser',
      password: 'testpassword',
    });
    let sessionID = loginres.headers['set-cookie'];

    const society = await request(app)
      .post('/society')
      .set('Cookie', sessionID)
      .send({
        name: 'AfterEventsSoc',
        userId: newUser.id,
      });

    expect(society.status).toBe(200);
    const socId = society.body.id;

    // Create 5 events with increasing date ranges
    for (let i = 0; i < 5; i++) {
      const startDate = new Date();
      startDate.setDate(startDate.getDate() + i + 1);
      const endDate = new Date(startDate);
      endDate.setDate(startDate.getDate() + i + 2);

      const response = await request(app)
        .post('/event')
        .set('Cookie', sessionID)
        .send({
          image: 'https://example.com/image.jpg',
          name: 'afterevents' + i,
          startDateTime: startDate,
          endDateTime: endDate,
          location: 'test location',
          description: 'Test event description',
          societyId: socId,
        });

      expect(response.status).toBe(200);
    }

    // Query for events after the second event's start date
    const threeDaysLater = new Date();
    threeDaysLater.setDate(threeDaysLater.getDate() + 3);

    const getRes = await request(app).get('/events').query({
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

  test('Get events after when query param specified, covers all events', async () => {
    const { status, body } = await request(app).post('/auth/register').send({
      username: 'aftereventsuser',
      password: 'testpassword',
      email: 'afterevents@example.com',
    });

    const newUser = await prisma.user.findFirst({
      where: {
        id: body.newUser.id,
      },
    });

    if (newUser == null) return;
    expect(status).toBe(201);
    expect(newUser).not.toBeNull();

    const loginres = await request(app).post('/auth/login').send({
      username: 'aftereventsuser',
      password: 'testpassword',
    });
    let sessionID = loginres.headers['set-cookie'];

    const society = await request(app)
      .post('/society')
      .set('Cookie', sessionID)
      .send({
        name: 'AfterEventsSoc',
        userId: newUser.id,
      });

    const society2 = await request(app)
      .post('/society')
      .set('Cookie', sessionID)
      .send({
        name: 'AfterEventsSoc2',
        userId: newUser.id,
      });

    expect(society.status).toBe(200);
    expect(society2.status).toBe(200);
    const socId = society.body.id;
    const socId2 = society2.body.id;

    // Create 5 events with increasing date ranges
    for (let i = 0; i < 5; i++) {
      const startDate = new Date();
      const endDate = new Date(startDate);
      endDate.setDate(startDate.getDate() + 5);

      const response = await request(app)
        .post('/event')
        .set('Cookie', sessionID)
        .send({
          image: 'https://example.com/image.jpg',
          name: 'afterevents' + i,
          startDateTime: startDate,
          endDateTime: endDate,
          location: 'test location',
          description: 'Test event description',
          societyId: socId,
        });

      const response2 = await request(app)
        .post('/event')
        .set('Cookie', sessionID)
        .send({
          image: 'https://example.com/image.jpg',
          name: 'afterevents2' + i,
          startDateTime: startDate,
          endDateTime: endDate,
          location: 'test location',
          description: 'Test event description',
          societyId: socId2,
        });

      expect(response.status).toBe(200);
      expect(response2.status).toBe(200);
    }

    // Query for events after the second event's start date
    const getRes = await request(app)
      .get('/events')
      .query({
        after: new Date(Date.parse('2020-01-01')),
      });

    expect(getRes.status).toBe(200);
    expect(getRes.body.length).toEqual(10);

    // Verify all returned events start after the specified date
    getRes.body.forEach((event) => {
      expect(new Date(event.startDateTime).getTime()).toBeGreaterThanOrEqual(
        new Date(Date.parse('2020-01-01')).getTime()
      );
    });
  });

  test('Get events before and after when query params specify, covers all events, use pagination', async () => {
    const { status, body } = await request(app).post('/auth/register').send({
      username: 'aftereventsuser',
      password: 'testpassword',
      email: 'afterevents@example.com',
    });

    const newUser = await prisma.user.findFirst({
      where: {
        id: body.newUser.id,
      },
    });

    if (newUser == null) return;
    expect(status).toBe(201);
    expect(newUser).not.toBeNull();

    const loginres = await request(app).post('/auth/login').send({
      username: 'aftereventsuser',
      password: 'testpassword',
    });
    let sessionID = loginres.headers['set-cookie'];

    const society = await request(app)
      .post('/society')
      .set('Cookie', sessionID)
      .send({
        name: 'AfterEventsSoc',
        userId: newUser.id,
      });

    const society2 = await request(app)
      .post('/society')
      .set('Cookie', sessionID)
      .send({
        name: 'AfterEventsSoc2',
        userId: newUser.id,
      });

    expect(society.status).toBe(200);
    const socId = society.body.id;
    expect(society2.status).toBe(200);
    const socId2 = society2.body.id;

    for (let i = 0; i < 6; i++) {
      const startDate = new Date();
      const endDate = new Date(startDate);
      endDate.setDate(startDate.getDate() + 5);

      const response = await request(app)
        .post('/event')
        .set('Cookie', sessionID)
        .send({
          image: 'https://example.com/image.jpg',
          name: 'afterevents' + i,
          startDateTime: startDate,
          endDateTime: endDate,
          location: 'test location',
          description: 'Test event description',
          societyId: socId,
        });

      const response2 = await request(app)
        .post('/event')
        .set('Cookie', sessionID)
        .send({
          image: 'https://example.com/image.jpg',
          name: 'afterevents2' + i,
          startDateTime: startDate,
          endDateTime: endDate,
          location: 'test location',
          description: 'Test event description',
          societyId: socId2,
        });

      expect(response.status).toBe(200);
      expect(response2.status).toBe(200);
    }

    const beforeThisDate = new Date();
    beforeThisDate.setDate(beforeThisDate.getDate() + 99);

    const getRes = await request(app)
      .get('/events')
      .query({
        before: beforeThisDate,
        after: new Date(Date.parse('2020-01-01')),
      });

    expect(getRes.status).toBe(200);
    expect(getRes.body.length).toEqual(10); // pagination moment

    // Verify all returned events start after the specified date
    getRes.body.forEach((event) => {
      expect(new Date(event.startDateTime).getTime()).toBeGreaterThanOrEqual(
        new Date(Date.parse('2020-01-01')).getTime()
      );

      expect(new Date(event.startDateTime).getTime()).toBeLessThanOrEqual(
        beforeThisDate.getTime()
      );
    });

    const getRes2 = await request(app)
      .get('/events')
      .query({
        before: beforeThisDate,
        after: new Date(Date.parse('2020-01-01')),
        page: 2,
      });

    expect(getRes2.status).toBe(200);
    expect(getRes2.body.length).toEqual(2);
  });

  test('Get events before and after when query params specify, covers no events', async () => {
    const { status, body } = await request(app).post('/auth/register').send({
      username: 'aftereventsuser',
      password: 'testpassword',
      email: 'afterevents@example.com',
    });

    const newUser = await prisma.user.findFirst({
      where: {
        id: body.newUser.id,
      },
    });

    if (newUser == null) return;
    expect(status).toBe(201);
    expect(newUser).not.toBeNull();

    const loginres = await request(app).post('/auth/login').send({
      username: 'aftereventsuser',
      password: 'testpassword',
    });
    let sessionID = loginres.headers['set-cookie'];

    const society = await request(app)
      .post('/society')
      .set('Cookie', sessionID)
      .send({
        name: 'AfterEventsSoc',
        userId: newUser.id,
      });

    expect(society.status).toBe(200);
    const socId = society.body.id;

    const beforeThisDate = new Date();
    beforeThisDate.setDate(beforeThisDate.getDate() + 99);

    const getRes = await request(app)
      .get('/events')
      .query({
        before: beforeThisDate,
        after: new Date(Date.parse('2020-01-01')),
      });

    expect(getRes.status).toBe(404);
  });
});
