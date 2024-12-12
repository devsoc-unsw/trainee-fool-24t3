import { describe, expect, test } from 'vitest';
import request from 'supertest';
import app from '../src/index';
import prisma from '../src/prisma';

describe('GET /society/events endpoint', () => {
  test('Create and get society events successfully', async () => {
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
      .post('/society/create')
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
          banner:
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

    const getRes = await request(app).get('/society/events').query({
      id: socId,
    });

    expect(getRes.status).toBe(200);
    expect(getRes.body.length).toBe(10);
  });

  test('Create and get events by different societies successfully', async () => {
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
      .post('/society/create')
      .set('Cookie', sessionID)
      .send({
        name: 'Rizzsoc',
        userId: newUser.id,
      });

    const society2Res = await request(app)
      .post('/society/create')
      .set('Cookie', sessionID)
      .send({
        name: 'Rizzysoc',
        userId: newUser.id,
      });

    const socId = societyRes.body.id;
    const soc2Id = society2Res.body.id;
    expect(societyRes.status).toBe(200);
    const start = new Date();

    for (let i = 0; i < 10; i++) {
      const response = await request(app)
        .post('/event')
        .set('Cookie', sessionID)
        .send({
          banner:
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

    for (let i = 0; i < 5; i++) {
      const response = await request(app)
        .post('/event')
        .set('Cookie', sessionID)
        .send({
          banner:
            'https://img-cdn.inc.com/image/upload/f_webp,q_auto,c_fit/images/panoramic/Island-Entertainment-viral-tiktok-inc_539684_hnvnix.jpg',
          name: 'tiktokrizzyparty' + i,
          startDateTime: new Date(),
          endDateTime: new Date(start.getTime() + 864000 + i),
          location: 'tampa, florida',
          description: 'fein! fein! fein! fein! fein so good she honor roll',
          societyId: soc2Id,
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
    expect(pageTwo.body.length).toBe(5);

    const soc1Events = await request(app).get('/society/events').query({
      id: socId,
    });

    expect(soc1Events.status).toBe(200);
    expect(soc1Events.body.length).toBe(10);

    const soc2Events = await request(app).get('/society/events').query({
      id: soc2Id,
    });

    expect(soc2Events.status).toBe(200);
    expect(soc2Events.body.length).toBe(5);
  }, 20000);

  test("Get society events when society doesn't exist", async () => {
    const response = await request(app).get('/society/events').query({
      id: 1,
    });

    expect(response.status).toBe(404);
  });

  test('Get society events when none exist', async () => {
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
      .post('/society/create')
      .set('Cookie', sessionID)
      .send({
        name: 'Rizzsoc',
        userId: newUser.id,
      });

    const socId = society.body.id;
    const response = await request(app).get('/society/events').query({
      id: socId,
    });

    expect(response.status).toBe(404);
  });
});
