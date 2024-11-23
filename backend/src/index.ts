import express, { Request, Response } from 'express';
import session from 'express-session';
import cors from 'cors';
import { LoginBody, TypedRequest } from './requestTypes';
import bcrypt from 'bcrypt';
import { LoginErrors, SanitisedUser } from './interfaces';
import { PrismaClient, Prisma, UserType, User } from '@prisma/client';
import prisma from './prisma';
import RedisStore from 'connect-redis';
import { createClient } from 'redis';
import dayjs from 'dayjs';
declare module 'express-session' {
  interface SessionData {
    userId: number;
  }
}

// Initialize client.
if (process.env['REDIS_PORT'] === undefined) {
  console.error('Redis port not provided in .env file');
  process.exit(1);
}
let redisClient = createClient({
  url: `redis://localhost:${process.env['REDIS_PORT']}`,
});
redisClient.connect().catch(console.error);

// Initialize store.
let redisStore = new RedisStore({
  client: redisClient,
  prefix: 'session:',
});

const app = express();
const SERVER_PORT = 5180;

app.use(cors());
app.use(express.json());

if (process.env['SESSION_SECRET'] === undefined) {
  console.error('Session secret not provided in .env file');
  process.exit(1);
}

if (
  process.env['DATABASE_URL'] === undefined ||
  process.env['DIRECT_URL'] === undefined
) {
  console.error('Database URL or Direct URL not provided in .env file.');
  process.exit(1);
}

// Initialize session storage.
app.use(
  session({
    store: redisStore,
    resave: false, // required: force lightweight session keep alive (touch)
    saveUninitialized: false, // recommended: only save session when data exists
    secret: process.env['SESSION_SECRET'],
  })
);

app.get('/', (req: Request, res: Response) => {
  console.log('Hello, TypeScript with Express :)))!');
  res.send('Hello, TypeScript with Express :)))!');
});

app.post(
  '/auth/register',
  async (req: TypedRequest<LoginBody>, res: Response) => {
    const { username, email, password, userType } = req.body;

    if (!username || !email || !password || !userType) {
      return res.status(400).json({ error: 'Missing required fields' });
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

app.post('/auth/login', async (req: TypedRequest<LoginBody>, res: Response) => {
  try {
    const { username, password } = req.body;

    if (!username || !password) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    // Find user
    const user = await prisma.user.findFirst({
      where: {
        username: username,
      },
    });

    if (!user) {
      return res.status(400).json({ error: 'User doesnt exist!' });
    }

    // Check password
    const validPassword = await bcrypt.compare(password, user.password);
    if (!validPassword) {
      return res.status(400).json({ error: 'Invalid password' });
    }

    // Set user session
    req.session.userId = user.id;
    req.session.cookie.expires = dayjs().add(1, 'week').toDate();
    req.session.save(); // Explicitly save session to Redis
    return res.status(200).json({ message: 'ok' });
  } catch (error) {
    return res.status(500).json({ error: 'Error logging in' });
  }
});

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

app.get('/user', async (req, res: Response) => {
  const sessionFromDB = await validateSession(req.session ? req.session : null);
  if (!sessionFromDB) {
    return res.status(401).json({ message: 'Invalid session provided.' });
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

app.get('/hello', () => {
  console.log('Hello World!');
});

if (process.env['NODE_ENV'] !== 'test') {
  app.listen(SERVER_PORT, () => {
    console.log(`Server running on port http://localhost:${SERVER_PORT}`);
  });
}

export default app;
