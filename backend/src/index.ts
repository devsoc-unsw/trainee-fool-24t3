import express, { Request, Response } from "express";
import session from "express-session";
import cors from "cors";
import { LoginBody, TypedRequest, UserIdBody } from "./requestTypes";
import bcrypt from "bcrypt";
import { LoginErrors } from "./interfaces";
import { PrismaClient, Prisma, UserType, User } from "@prisma/client";
import prisma from "./prisma";
import RedisStore from "connect-redis";
import { createClient } from "redis";
import { generateOTP } from "./routes/OTP/generateOTP";
import { removeExpiredOTPs } from "./routes/OTP/deleteExpired";
declare module "express-session" {
  interface SessionData {
    userId: number;
  }
}

// Initialize client.
if (process.env["REDIS_PORT"] === undefined) {
  console.error("Redis port not provided in .env file");
  process.exit(1);
}
let redisClient = createClient({
  url: `redis://localhost:${process.env["REDIS_PORT"]}`,
});
redisClient.connect().catch(console.error);

// Initialize store.
let redisStore = new RedisStore({
  client: redisClient,
  prefix: "pyramids:",
});

const app = express();
const SERVER_PORT = 5180;
const SALT_ROUNDS = 10;

app.use(cors());
app.use(express.json());

if (process.env["SESSION_SECRET"] === undefined) {
  console.error("Session secret not provided in .env file");
  process.exit(1);
}

// Initialize session storage.
app.use(
  session({
    store: redisStore,
    resave: false, // required: force lightweight session keep alive (touch)
    saveUninitialized: false, // recommended: only save session when data exists
    secret: process.env["SESSION_SECRET"],
  })
);

// OTP removing cron job
removeExpiredOTPs.start();

app.get("/", (req: Request, res: Response) => {
  console.log("Hello, TypeScript with Express :)))!");
  res.send("Hello, TypeScript with Express :)))!");
});

app.post(
  "/auth/register",
  async (req: TypedRequest<LoginBody>, res: Response) => {
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

    const saltRounds: number = SALT_ROUNDS;
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
        username: true,
      },
    });

    return res.status(201).json({
      newUser,
    });
  }
);

app.post("/auth/otp", async(req: Request, res: Response) => {
  try {
    const { email } = req.body;
    
    if(!email) {
      throw new Error("Email address expected.");
    }

    const result = await generateOTP(email, SALT_ROUNDS); 

    if (result) {
      return res.status(200).json({ message: "ok" });
    } else {
      return res.status(400).json( {message: "Unexpected error while generating OTP."} );
    }

  } catch(error) {
    return res.status(400).json({ message: (error as Error).message });
  }
});

app.post("/auth/login", async (req: TypedRequest<LoginBody>, res: Response) => {
  try {
    const { username, password } = req.body;

    // Find user
    const user = await prisma.user.findFirst({
      where: {
        username: username,
      },
    });

    if (!user) {
      return res.status(400).json({ error: "User doesnt exist!" });
    }

    // Check password
    const validPassword = await bcrypt.compare(password, user.password);
    if (!validPassword) {
      return res.status(400).json({ error: "Invalid password" });
    }

    // Set user session
    req.session.userId = user.id;
    req.session.save(); // Explicitly save session to Redis
    return res.status(200).json({ message: "ok" });
  } catch (error) {
    return res.status(500).json({ error: "Error logging in" });
  }
});

app.get("/user", async (req: TypedRequest<UserIdBody>, res: Response) => {
  console.log("SESSIONUSERID:", req.session.userId);
  console.log("USERIDBODY:", req.body.userId);
  if (req.session.userId === req.body.userId) {
    return res.status(200).json({ message: "ok" });
  } else {
    return res.status(401).json({ message: "nah" });
  }
});

app.get("/hello", () => {
  console.log("Hello World!");
});

if (process.env["NODE_ENV"] !== "test") {
  app.listen(SERVER_PORT, () => {
    console.log(`Server running on port http://localhost:${SERVER_PORT}`);
  });
}

export default app;
