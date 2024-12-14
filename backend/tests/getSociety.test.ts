import { describe, expect, test } from 'vitest';
import request from 'supertest';
import app from '../src/index';
import prisma from '../src/prisma';

describe('GET /society endpoint', () => {
  test('Create and get society successfully', async () => {
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

    expect(societyRes.status).toBe(200);

    const getRes = await request(app).get('/society').query({
      id: societyRes.body.id,
    });

    expect(getRes.status).toBe(200);
    expect(getRes.body.name).toBe('Rizzsoc');
  });

  test('Get nonexistent society', async () => {
    const response = await request(app).get('/society').query({
      id: 1,
    });

    expect(response.status).toBe(404);
  });

  test("Don't provide society id", async () => {
    const response = await request(app).get('/society');

    expect(response.status).toBe(400);
  });
});
