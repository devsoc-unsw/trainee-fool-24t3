//test/sample.test.ts
import { expect, test, vi, describe } from "vitest"; // 👈🏻 Added the `vi` import
import { createUser } from "./script";
import prisma from "./helpers/prisma";
import request from "sync-request-curl";

vi.mock("../libs/prisma");

describe("Tests", () => {
  test("Hello World", async () => {
    const res = request("GET", "http://localhost:5180/register");
    console.log(res);
  });
});
