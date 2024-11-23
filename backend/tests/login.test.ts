//test/sample.test.ts
import { expect, test, vi, describe } from 'vitest'; // 👈🏻 Added the `vi` import
import prisma from '../src/prisma';
import request from 'supertest';
import app from '../src/index';
import { beforeEach } from 'node:test';
import { createClient } from 'redis';

describe('/login endpoint', () => {
  test('Login Successful', async () => {
    const { status, body } = await request(app).post('/auth/register').send({
      username: 'shinjisatoo',
      password: 'testpassword',
      email: 'longseason1996@gmail.com',
      userType: 'ATTENDEE',
    });

    const newUser = await prisma.user.findFirst({
      where: {
        id: body.newUser.id,
      },
    });

    if (newUser == null) return;
    expect(status).toBe(201);
    expect(newUser).not.toBeNull();

    const response = await request(app).post('/auth/login').send({
      username: newUser.username,
      password: 'testpassword',
    });

    expect(response.status).toBe(200);

    const sessionID = response.headers['set-cookie'];
    const response2 = await request(app)
      .get('/user')
      .set('Cookie', sessionID)
      .send({
        userId: newUser.id,
      });
    expect(response2.status).toBe(200);
  });

  test('Unauthorized User', async () => {
    const { status, body } = await request(app).post('/auth/register').send({
      username: 'shinjisatoo',
      password: 'testpassword',
      email: 'longseason1997@gmail.com',
      userType: 'ATTENDEE',
    });

    const newUser = await prisma.user.findFirst({
      where: {
        id: body.newUser.id,
      },
    });
    if (newUser == null) return;
    expect(status).toBe(201);
    expect(newUser).not.toBeNull();

    const response2 = await request(app).get('/user').send({
      userId: newUser.id,
    });
    expect(response2.status).toBe(401);
  });

  test('Wrong password', async () => {
    const { status, body } = await request(app).post('/auth/register').send({
      username: 'shinjisatoo',
      password: 'testpassword',
      email: 'longseason1997@gmail.com',
      userType: 'ATTENDEE',
    });

    const response = await request(app).post('/auth/login').send({
      username: body.newUser.username,
      password: 'wrongpassword',
    });

    expect(response.status).toBe(400);
  });

  test('Nonexistent Username', async () => {
    const { status, body } = await request(app).post('/auth/register').send({
      username: 'shinjisatoo',
      password: 'testpassword',
      email: 'longseason1997@gmail.com',
      userType: 'ATTENDEE',
    });

    const response = await request(app).post('/auth/login').send({
      username: "Idon'texistlol",
      password: 'testpassword',
    });

    expect(response.status).toBe(400);
  });
});
