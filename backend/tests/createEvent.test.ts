import { expect, test, describe } from 'vitest';
import prisma from '../src/prisma';
import request from 'supertest';
import app from '../src/index';
import { beforeEach } from 'node:test';
import dayjs from 'dayjs';

describe('/event endpoint', () => {
  test('Session Invalid', async () => {
    const start = new Date();
    const { status, body } = await request(app)
      .post('/event')
      .send({
        banner: 'asdasd',
        name: 'tiktokrizzparty',
        startDateTime: start,
        endDateTime: new Date(start.getTime() + 86400000),
        location: 'tampa, florida',
        description: 'fein! fein! fein! fein! fein so good she honor roll',
      });

    expect(status).toBe(401);
    expect(body.message).toBe('Invalid session provided.');
  });

  test('Create Record', async () => {
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

    const response = await request(app)
      .post('/event')
      .set('Cookie', sessionID)
      .send({
        banner:
          'https://img-cdn.inc.com/image/upload/f_webp,q_auto,c_fit/images/panoramic/Island-Entertainment-viral-tiktok-inc_539684_hnvnix.jpg',
        name: 'tiktokrizzparty',
        startDateTime: new Date(),
        endDateTime: new Date(start.getTime() + 86400000),
        location: 'tampa, florida',
        description: 'fein! fein! fein! fein! fein so good she honor roll',
        societyId: socId,
      });

    expect(response.status).toBe(200);
    expect(response.body.name).toBe('tiktokrizzparty');
  });

  test('Invalid Date(end before start)', async () => {
    const { status, body } = await request(app).post('/auth/register').send({
      username: 'shinjisatoo',
      password: 'testpassword',
      email: 'longseason1996@gmail.com',
    });

    const loginres = await request(app).post('/auth/login').send({
      username: 'shinjisatoo',
      password: 'testpassword',
    });
    let sessionID = loginres.headers['set-cookie'];

    const response = await request(app)
      .post('/event')
      .set('Cookie', sessionID)
      .send({
        banner:
          'https://img-cdn.inc.com/image/upload/f_webp,q_auto,c_fit/images/panoramic/Island-Entertainment-viral-tiktok-inc_539684_hnvnix.jpg',
        name: 'tiktokrizzparty',
        startDateTime: dayjs().add(30, 'm'),
        endDateTime: dayjs().add(15, 'm'),
        location: 'tampa, florida',
        description: 'fein! fein! fein! fein! fein so good she honor roll',
      });

    expect(response.status).toBe(400);
  });
});
