//test/sample.test.ts
import { expect, test, vi, describe } from "vitest"; // 👈🏻 Added the `vi` import
import prisma from "../src/prisma";
import request from "supertest";
import app from "../src/index";

describe("Tests", () => {
  test("register test", async () => {
    const { status, body } = await request(app).post("/auth/register").send({
      username: "richard grayson",
      password: "iheartkori&barbs",
      email: "nightwing1@gmail.com",
      userType: "ATTENDEE",
    });

    const newUser = await prisma.user.findFirst({
      where: {
        id: body.newUser.id,
      },
    });
    
    expect(status).toBe(201);
    expect(newUser).not.toBeNull();
    expect(body.newUser).toStrictEqual({
      username: "richard grayson",
      id: newUser?.id,
    });

    if(newUser) {
        const response = await request(app).post("/auth/otp").send({
            email: "nightwing1@gmail.com"
        });
        expect(response.status).toBe(200);

        const tokens = await prisma.otpToken.findMany({
            where: {
                userId: newUser.id
            }
        });

        expect(tokens.length).toBe(1);
        
        const newToken = await prisma.otpToken.findFirst({
            where: {
                userId: newUser.id
            }
        });
        expect(newToken).not.toBeNull();

        if(newToken) {
            console.log(newToken.token);

            await new Promise(resolve => setTimeout(resolve, 120000));

            const checkTokens = await prisma.otpToken.findFirst({
                where: {
                    userId: newUser.id
                }
            });
            expect(checkTokens).toBeNull();
        }
    }
  }, 100000);
});
