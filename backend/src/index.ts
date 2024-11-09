import express, { Request, Response } from "express";
import session from "express-session";
import cors from "cors";
import { LoginBody, TypedRequest } from "./requestTypes";
import bcrypt from "bcrypt";
import { LoginErrors } from "./interfaces";
import { PrismaClient, Prisma, UserType, User } from "@prisma/client";
import prisma from "./prisma";

const app = express();
const SERVER_PORT = 5180;

app.use(cors());
app.use(express.json());

app.get("/", (req: Request, res: Response) => {
  console.log("Hello, TypeScript with Express :)))!");
  res.send("Hello, TypeScript with Express :)))!");
});

app.post("/auth/register", async (req: TypedRequest<LoginBody>, res: Response) => {
  const { username, email, password, userType } = req.body;
  
  // check database for existing user with same username
  const errorCheck: LoginErrors = {
    matchingCredentials: true,
  };

  const results = await prisma.user.findFirst({
    where: {
      OR: [{ username: username }, { email: email }],
    },
  });

  if (results) {
    errorCheck.matchingCredentials = true;
    return res.status(400).json(errorCheck);
  }

  const saltRounds: number = 10;
  const salt = await bcrypt.genSalt(saltRounds);
  const hashedPassword = await bcrypt.hash(password, salt);

  //add user prisma
  const newUser = await prisma.user.create({
    data: {
      username,
      email,
      password: hashedPassword,
      salt,
      userType,
      dateJoined: new Date(),
      profilePicture: null,
    },
    select: {
      id: true,
      username:true
    }
  });

  return res.status(201).json({
    newUser
  });
});

app.get("/hello", () => {
  console.log("Hello World!");
})

app.listen(SERVER_PORT, () => {
  console.log(`Server running on port http://localhost:${SERVER_PORT}`);
});

export default app
