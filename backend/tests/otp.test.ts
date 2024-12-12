//test/sample.test.ts
import { expect, test, vi, describe } from "vitest"; // 👈🏻 Added the `vi` import
import request from "supertest";
import app from "../src/index";
import { createClient } from "redis";
import prisma from "../src/prisma";

describe("Password change", () => {
  test("Forgot password OTP", async () => {
    const redisClient = createClient({
      url: `redis://localhost:${process.env["REDIS_PORT"]}`,
    });
    await redisClient.connect().catch(console.error);

    expect(redisClient).not.toBeUndefined();
    
    const { status, body } = await request(app).post("/auth/register").send({
      username: "richard grayson",
      password: "iheartkori",
      email: "pyramidstestdump@gmail.com"
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

      //testing token expiration
      const expRes = await request(app).post("/auth/otp/generate").send({
          email: "pyramidstestdump@gmail.com"
      });
      const expResToken = expRes.body.message;
      expect(expRes.status).toBe(200);
      expect(expResToken).not.toBeUndefined();

      const expToken  = await redisClient.get(newUser.email);

      expect(expToken).not.toBeNull();
      expect(expToken).toEqual(expResToken);

      await new Promise(resolve => setTimeout(resolve, 1000));

      const checkGenTokens = await redisClient.get(newUser.email);
      expect(checkGenTokens).toBeNull();

      //verification
      const genRes = await request(app).post("/auth/otp/generate").send({
        email: "pyramidstestdump@gmail.com"
      });
      const resToken = genRes.body.message;

      let verToken  = await redisClient.get(newUser.email);
      expect(verToken).not.toBeNull();
      expect(verToken).toEqual(resToken);
      
      const verRes = await request(app).post("/auth/otp/verify").send({
        email: "pyramidstestdump@gmail.com",
        token: resToken
      });

      expect(verRes.status).toBe(200);

      verToken  = await redisClient.get(newUser.email);
      expect(verToken).not.toBeNull();

      await new Promise(resolve => setTimeout(resolve, 1000));

      const checkVerTokens = await redisClient.get(newUser.email);
      expect(checkVerTokens).toBeNull();

      //forgot password
      const oldPassRes = await request(app).post("/auth/login").send({
        username: "richard grayson",
        password: "iheartkori"
      });
      expect(oldPassRes.status).toBe(200);

      const fGenRes = await request(app).post("/auth/otp/generate").send({
        email: "pyramidstestdump@gmail.com"
      });
      const fResToken = fGenRes.body.message;

      let fVerToken  = await redisClient.get(newUser.email);
      expect(fVerToken).not.toBeNull();
      expect(fVerToken).toEqual(fResToken);
      
      const fVerRes = await request(app).post("/auth/otp/verify").send({
        email: "pyramidstestdump@gmail.com",
        token: fResToken
      });

      expect(fVerRes.status).toBe(200);

      fVerToken  = await redisClient.get(newUser.email);
      expect(fVerToken).not.toBeNull();

      const forgotRes = await request(app).post("/auth/password/forgot").send({
        email: "pyramidstestdump@gmail.com",
        token: fResToken,
        newPassword: "oraclefan1"
      });

      //console.log(forgotRes.error.text);
      expect(forgotRes.status).toBe(200);

      await new Promise(resolve => setTimeout(resolve, 1000));

      const fCheckVerTokens = await redisClient.get(newUser.email);
      expect(fCheckVerTokens).toBeNull();

      const oldPassFailRes = await request(app).post("/auth/login").send({
        username: "richard grayson",
        password: "iheartkori"
      });
      expect(oldPassFailRes.status).toBe(400);
      expect(oldPassFailRes.body.error).toBe("Invalid password");

      const loginRes = await request(app).post("/auth/login").send({
        username: "richard grayson",
        password: "oraclefan1",
      });
      
      expect(loginRes.status).toBe(200);
    }
  }, 200000);

  test("Update password", async () => {
    const redisClient = createClient({
      url: `redis://localhost:${process.env["REDIS_PORT"]}`,
    });
    await redisClient.connect().catch(console.error);

    expect(redisClient).not.toBeUndefined();
    
    const { status, body } = await request(app).post("/auth/register").send({
      username: "richard grayson",
      password: "iheartkori",
      email: "pyramidstestdump@gmail.com"
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
      const oldPassRes = await request(app).post("/auth/login").send({
        username: "richard grayson",
        password: "iheartkori"
      });
      expect(oldPassRes.status).toBe(200);

      const sessionID = oldPassRes.headers["set-cookie"];

      const updateResFail = await request(app).post("/auth/password/update")
      .set("Cookie", sessionID).send({
        oldPassword: "1234",
        newPassword: "newPassword"
      });
      expect(updateResFail.status).toBe(400);
      expect(updateResFail.body.message).toBe("Unable to update password. Current password is incorrect.");

      const updateRes = await request(app).post("/auth/password/update")
      .set("Cookie", sessionID).send({
        oldPassword: "iheartkori",
        newPassword: "batgirlfan123"
      });
      expect(updateRes.status).toBe(200);

      const oldPassResFail = await request(app).post("/auth/login").send({
        username: "richard grayson",
        password: "iheartkori"
      });
      expect(updateResFail.status).toBe(400);

      const newPassRes = await request(app).post("/auth/login").send({
        username: "richard grayson",
        password: "batgirlfan123"
      });
      expect(newPassRes.status).toBe(200);
    }
  });
});
