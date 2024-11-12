//test/sample.test.ts
import { expect, test, vi, describe } from "vitest"; // 👈🏻 Added the `vi` import
import prisma from "../src/prisma";
import request from "supertest";
import app from "../src/index";

describe("Tests", () => {

  test("Email already exists", async () => {
    console.log("hello world")
  })
});
