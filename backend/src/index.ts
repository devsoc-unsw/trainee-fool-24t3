import express, { Request, Response } from "express";
import session, { Session } from "express-session";
import cors from "cors";
import {
  DiscordLoginBody,
  LoginBody,
  TypedRequest,
  CreateSocietyBody,
  CreateEventBody,
  societyIdBody,
  eventIdBody
} from "./requestTypes";
import bcrypt from "bcrypt";
import { LoginErrors, SanitisedUser } from "./interfaces";
import { PrismaClient, Prisma, UserType, User } from "@prisma/client";
import prisma from "./prisma";
import RedisStore from "connect-redis";
import { createClient } from "redis";
import dayjs, { Dayjs } from "dayjs";
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
  prefix: "session:",
});

const app = express();
const SERVER_PORT = 5180;

app.use(cors());
app.use(express.json());

if (process.env["SESSION_SECRET"] === undefined) {
  console.error("Session secret not provided in .env file");
  process.exit(1);
}

if (
  process.env["DATABASE_URL"] === undefined ||
  process.env["DIRECT_URL"] === undefined
) {
  console.error("Database URL or Direct URL not provided in .env file.");
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

app.get("/", (req: Request, res: Response) => {
  console.log("Hello, TypeScript with Express :)))!");
  res.send("Hello, TypeScript with Express :)))!");
});

app.post(
  "/auth/register",
  async (req: TypedRequest<LoginBody>, res: Response) => {
    const { username, email, password, userType } = req.body;

    if (!username || !email || !password || !userType) {
      return res.status(400).json({ error: "Missing required fields" });
    }

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
        username: true,
      },
    });

    return res.status(201).json({
      newUser,
    });
  }
);

app.post("/auth/login", async (req: TypedRequest<LoginBody>, res: Response) => {
  try {
    const { username, password } = req.body;

    if (!username || !password) {
      return res.status(400).json({ error: "Missing required fields" });
    }

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
    req.session.cookie.expires = dayjs().add(1, "week").toDate();
    req.session.save(); // Explicitly save session to Redis
    return res.status(200).json({ message: "ok" });
  } catch (error) {
    return res.status(500).json({ error: "Error logging in" });
  }
});

app.post(
  "/discord/login",
  async (req: TypedRequest<DiscordLoginBody>, res: Response) => {
    const sessionFromDB = await validateSession(
      req.session ? req.session : null
    );
    if (!sessionFromDB) {
      return res.status(401).json({ message: "Invalid session provided." });
    }

    if (!req.body.discordID || typeof req.body.discordID !== "number") {
      return res
        .status(400)
        .json({ error: "Body is missing discordID, or it is not a number." });
    }

    await redisClient.set(`discord:${req.body.discordID}`, req.session.id);
    return res.status(200).json({ message: "ok" });
  }
);

app.post(
  "/discord/logout",
  async (req: TypedRequest<DiscordLoginBody>, res: Response) => {
    const providedSession = await validateSession(
      req.session ? req.session : null
    );
    if (!providedSession) {
      return res.status(401).json({ message: "Invalid session provided." });
    }

    if (!req.body.discordID || typeof req.body.discordID !== "number") {
      return res
        .status(400)
        .json({ error: "Body is missing discordID, or it is not a number." });
    }

    const sessionString = await redisClient.get(
      `discord:${req.body.discordID}`
    );

    if (!sessionString) {
      return res
        .status(400)
        .json({ error: "No session is associated with this Discord account." });
    }

    const session = JSON.parse(sessionString);

    if (!providedSession.id !== session.id) {
      return res.status(401).json({ message: "Invalid session provided." });
    }

    await redisClient.del(`discord_${req.body.discordID}`);
    return res.status(200).json({
      message:
        "The association between a Pyramids session and this Discord account has been removed.",
    });
  }
);

/**
 * Validates a given session object, checking if it exists in Redis and if it has expired.
 * @param session The session object to validate.
 * @returns The session object if it is valid, false if it is not.
 */
const validateSession = async (session: any) => {
  if (!session || !session.id) {
    return false;
  }

  const sessionFromDB = await redisClient.get(`session:${session.id}`);
  if (sessionFromDB === null) {
    return false;
  }

  const sessionData = JSON.parse(sessionFromDB);
  if (sessionData.cookie.expires < Date.now()) {
    await redisClient.del(`session:${session.id}`);
    return false;
  }

  return sessionData;
};

/**
 * Retrieves a SanitisedUser object based on a provided ID.
 * Note that a SanitisedUser does not include a User's password or salt.
 * @param userID
 * @returns SanitisedUser if the user exists, null otherwise.
 */
const getUserFromID = async (userID: number): Promise<SanitisedUser | null> => {
  const user = await prisma.user.findFirst({
    where: {
      id: userID,
    },
  });
  if (user) {
    return {
      id: user.id,
      username: user.username,
      email: user.email,
      userType: user.userType,
      dateJoined: user.dateJoined,
      profilePicture: user.profilePicture,
    };
  } else {
    return null;
  }
};

app.get("/user", async (req, res: Response) => {
  const sessionFromDB = await validateSession(req.session ? req.session : null);
  if (!sessionFromDB) {
    return res.status(401).json({ message: "Invalid session provided." });
  }

  const userID = sessionFromDB.userId;

  const user: User | null = await prisma.user.findFirst({
    where: {
      id: userID,
    },
  });

  if (user === null) {
    return res.status(404).json({
      message:
        "User not found, though session is valid? This shouldn't happen.",
    });
  }

  // returns a sanitised version of the User obj
  return res.status(200).json({
    id: user.id,
    username: user.username,
    email: user.email,
    userType: user.userType,
    dateJoined: user.dateJoined,
    profilePicture: user.profilePicture,
  });
});

app.post(
  "/society/create",
  async (req: TypedRequest<CreateSocietyBody>, res: Response) => {
    const society = req.body;
    if (!society.name) {
      return res.status(400).json({ message: "Invalid input." });
    }

    if (!society.profilePicture) {
      society.profilePicture = null;
    }

    const sessionFromDB = await validateSession(
      req.session ? req.session : null
    );

    if (!sessionFromDB) {
      return res.status(401).json({ message: "Invalid session provided." });
    }

    try {
      const newSociety = await prisma.society.create({
        data: {
          name: society.name,
          admin: {
            connect: {
              id: sessionFromDB.userId,
            },
          },
        },
      });

      return res.status(200).json(newSociety);
    } catch (e) {
      return res.status(400).json({message:"invalid society input"});
    }
  }
);

app.post(
  "/event/create",
  async (req: TypedRequest<CreateEventBody>, res: Response) => {
    //Session validation
    const event = req.body;

    const sessionFromDB = await validateSession(
      req.session ? req.session : null
    );
    if (!sessionFromDB) {
      return res.status(401).json({ message: "Invalid session provided." });
    }

    //Sanitize Inputs/Check Validity
    if (!isValidDate(event.startDateTime, event.endDateTime)) {
      return res.status(400).json({ message: "Invalid date" });
    }

    try {
      const eventRes = await prisma.event.create({
        data: {
          banner: event.banner,
          name: event.name,
          startDateTime: dayjs(event.startDateTime).toISOString(),
          endDateTime: dayjs(event.endDateTime).toISOString(),
          location: event.location,
          description: event.description,
          society: {
            connect: {
              id: event.societyId,
            },
          },
        },
      });
      return res.status(200).json({ eventRes });
    } catch (e) {
      return res.status(400).json({message:"Invalid event input"})
    }
  }
);

function isValidDate(startDate: Date, endDate: Date): boolean {
  const parsedStartDate = dayjs(startDate);
  const parsedEndDate = dayjs(endDate);

  return !(
    parsedStartDate.isAfter(parsedEndDate) ||
    parsedStartDate.isSame(parsedEndDate) ||
    parsedStartDate.isBefore(dayjs(), 'day')
  );
}

app.get("/user/societies", async (req, res: Response) => {
  const sessionFromDB = await validateSession(req.session ? req.session : null);
  if (!sessionFromDB) {
    return res.status(401).json({ message: "Invalid session provided." });
  }

  const userID = sessionFromDB.userId;

  const societies_joined = await prisma.society.findMany({
    where: {
      members: {
        some: {
          id: userID,
        },
      },
    },
  });

  const societies = {
    joined: societies_joined,
    administering: null,
  };

  return res.status(200).json(societies);
});

app.get("/societies", async (req, res: Response) => {
  const societies = await prisma.society.findMany({
    orderBy: {
      id: "asc",
    },
  });
  return res.status(200).json(societies);
});

//Lets a user join a society
app.post("/user/society/join",
  async (req: TypedRequest<societyIdBody>, res: Response) => {
    //get userid from session
    const sessionFromDB = await validateSession(
      req.session ? req.session : null
    );
    if (!sessionFromDB) {
      return res.status(401).json({ message: "Invalid session provided." });
    }

    const userID = sessionFromDB.userId;

    //Make sure a society actually exists
    const societyId = await prisma.society.findFirst({
      where: {
        id: req.body.societyId
      },
      select: {
        id: true
      }
    })

    if (!societyId) {
      return res.status(400).json({message: "Invalid society"})
    }

    //Connect society and user
    const result = await prisma.society.update({
      where: {
        id: req.body.societyId,
      },
      data: {
        members: {
          connect: {
            id: userID,
          },
        },
      },
    });

    return res.status(200).json({message: "ok"});
  }
);

app.delete("/user/society", async (req: TypedRequest<societyIdBody>, res: Response) => {
  const sessionFromDB = await validateSession(
    req.session ? req.session : null
  );
  if (!sessionFromDB) {
    return res.status(401).json({ message: "Invalid session provided." });
  }

  const userID = sessionFromDB.userId;

  const societyId = await prisma.society.findFirst({
    where: {
      id: req.body.societyId
    },
    select: {
      id: true
    }
  })

  if (!societyId) {
    return res.status(400).json({message: "Invalid society"})
  }

  const result = await prisma.society.update({
    where: {
      id: societyId.id,
    },
    data: {
      members: {
        disconnect: {
          id: userID,
        },
      },
    },
  });

  return res.status(200).json({message: "ok"});
})

app.post("/user/event/attend", async (req: TypedRequest<eventIdBody>, res:Response) => {
  const sessionFromDB = await validateSession(
    req.session ? req.session : null
  );
  if (!sessionFromDB) {
    return res.status(401).json({ message: "Invalid session provided." });
  }

  const userID = sessionFromDB.userId;

  const event = await prisma.event.findFirst({
    where: {
      id: req.body.eventId
    },
    select: {
      id: true
    }
  })

  if (!event) {
    return res.status(400).json({message: "Invalid Event"})
  }

  const result = await prisma.event.update({
    where: {
      id: event.id,
    },
    data: {
      attendees: {
        connect: {
          id: userID,
        },
      }
    },
  });

  return res.status(200).json({message: "ok"})
})

app.delete("/user/event", async (req: TypedRequest<eventIdBody>, res:Response) => {
  const sessionFromDB = await validateSession(
    req.session ? req.session : null
  );
  if (!sessionFromDB) {
    return res.status(401).json({ message: "Invalid session provided." });
  }

  const userID = sessionFromDB.userId;

  const event = await prisma.event.findFirst({
    where: {
      id: req.body.eventId
    },
    select: {
      id: true
    }
  })

  if (!event) {
    return res.status(400).json({message: "Invalid Event"})
  }

  const result = await prisma.event.update({
    where: {
      id: event.id,
    },
    data: {
      attendees: {
        disconnect: {
          id: userID,
        },
      },
    },
  });

  return res.status(200).json({message: "ok"})
});

//For retrieving the data in the individual event view card
app.get("/event/details", async (req: TypedRequest<eventIdBody>, res:Response) => {
  const event = await prisma.event.findFirst({
    where:{
      id: req.body.eventId
    }
  })

  if (!event) {
    return res.status(400).json({message: "invalid society"});
  }

  return res.status(200).json(event)
});

//this is a bit messy
app.delete("/event", async(req: TypedRequest<eventIdBody>, res:Response) => {
  const sessionFromDB = await validateSession(
    req.session ? req.session : null
  );
  if (!sessionFromDB) {
    return res.status(401).json({ message: "Invalid session provided." });
  }

  const userID = sessionFromDB.userId;
  
  //400 if event doesn't exist
  const event = await prisma.event.findFirst({
    where: {
      id: req.body.eventId
    },
    select: {
      id: true, 
      societyId: true
    }
  })

  if (!event) {
    return res.status(400).json({message: "event doesn't exist"});
  }

  //find society associated with event, then check to see if the user is an admin, return 401.
  const society = await prisma.society.findFirst({
    where: {
      id: event.societyId,
      admin: {
        id: userID
      }
    },
    select: {
      id: true
    }
  })

  if (!society) {
    return res.status(401).json({message:"User is not an admin!"});
  }

  //200 if deletion is successful
  try {
    await prisma.event.delete({
      where: {
        id: event.id
      }
    })
  } catch (e) {
    return res.status(400).json({message: "Deletion failed"});
  }

  return res.status(200).json({message:"ok"});
})

app.delete("/society", async(req: TypedRequest<societyIdBody>, res: Response) => {
  const sessionFromDB = await validateSession(
    req.session ? req.session : null
  );
  if (!sessionFromDB) {
    return res.status(401).json({ message: "Invalid session provided." });
  }

  const userID = sessionFromDB.userId;
  const society = await prisma.society.findFirst({
    where: {
      id: req.body.societyId,
      admin: {
        id: userID
      }
    },
    select: {
      id: true
    }
  })

  if (!society) {
    return res.status(401).json({message:"User is not an admin!"});
  }

  //200 if deletion is successful
  try {
    await prisma.society.delete({
      where: {
        id: society.id
      }
    })
  } catch (e) {
    return res.status(400).json({message: "Deletion failed"});
  }

  return res.status(200).json({message:"ok"});
})

app.get("/hello", () => {
  console.log("Hello World!");
});

if (process.env["NODE_ENV"] !== "test") {
  app.listen(SERVER_PORT, () => {
    console.log(`Server running on port http://localhost:${SERVER_PORT}`);
  });
}

export default app;
