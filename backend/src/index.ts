import express, { Request, Response } from 'express';
import session, { Session } from 'express-session';
import cors from 'cors';
import {
  DiscordLoginBody,
  LoginBody,
  TypedRequest,
  CreateSocietyBody,
  CreateEventBody,
  societyIdBody,
  eventIdBody,
  RegisterBody,
  UpdateEventBody,
  CreateKeywordBody,
  keywordIdBody,
} from './requestTypes';
import bcrypt from 'bcrypt';
import { LoginErrors, SanitisedUser } from './interfaces';
import { PrismaClient, Prisma, User, Image } from '@prisma/client';
import prisma from './prisma';
import RedisStore from 'connect-redis';
import { createClient } from 'redis';
import dayjs, { Dayjs } from 'dayjs';
import { generateOTP } from './routes/OTP/generateOTP';
import assert from 'assert';
import { verifyOTP } from './routes/OTP/verifyOTP';
import {
  findUserFromId,
  updateUserPasswordFromEmail,
} from './routes/User/user';
import {
  getFile,
  getFileUrl,
  storageClient,
  uploadFile,
} from './config/storage';

declare module 'express-session' {
  interface SessionData {
    userId: number;
  }
}

// Initialize client.
if (
  process.env['REDIS_PORT'] === undefined ||
  process.env['REDIS_PORT'] === ''
) {
  console.log(process.env);
  console.error('Redis port not provided in .env file');
  process.exit(1);
}

let allowed_origins;
if (
  process.env['ALLOWED_ORIGINS'] === undefined ||
  process.env['ALLOWED_ORIGINS'] === ''
) {
  console.log('Warning: ALLOWED_ORIGINS not specified. Using wildcard *.');
  allowed_origins = ['*'];
} else {
  allowed_origins = process.env['ALLOWED_ORIGINS']?.split(',');
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
const SALT_ROUNDS = 10;

app.use(
  cors({
    origin: allowed_origins,
    credentials: true,
  })
);
app.use(express.json({ limit: '20mb' }));

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

if (
  (process.env['NODE_ENV'] !== 'test' &&
    process.env['EMAIL_KEY'] === undefined) ||
  process.env['EMAIL_KEY'] === ''
) {
  console.log('`EMAIL_KEY` not provided in .env file.');
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
  async (req: TypedRequest<RegisterBody>, res: Response) => {
    const { username, email, password } = req.body;

    if (!username || !email || !password) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    const results = await prisma.user.findFirst({
      where: {
        OR: [{ username: username }, { email: email }],
      },
    });

    if (results) {
      return res
        .status(400)
        .json({ error: 'Account with same credentials already exists' });
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
        dateJoined: new Date(),
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

app.post('/auth/otp/generate', async (req: Request, res: Response) => {
  const { email }: { email: string } = req.body;

  if (!email) {
    return res.status(400).json({ message: 'Missing required fields' });
  }

  let token;
  try {
    token = await generateOTP(email);
  } catch (e) {
    return res.status(500).json({ message: (e as Error).message });
  }

  if (token) {
    const expiryTime = process.env['OTP_EXPIRES'];

    try {
      await redisClient.set(email, token, {
        EX: parseInt(expiryTime as string),
      });
    } catch {
      return res.status(500).json({
        message: 'OTP expiration time not set in environment variable.',
      });
    }

    if (process.env['NODE_ENV'] === 'test') {
      return res.status(200).json({ message: token });
    }
    return res.status(200).json({ message: 'ok' });
  } else {
    return res
      .status(400)
      .json({ message: 'Unexpected error while generating OTP.' });
  }
});

app.post('/auth/otp/verify', async (req: Request, res: Response) => {
  try {
    const { email, token } = req.body;

    if (!email) {
      throw new Error('Email address expected.');
    }

    if (!token) {
      throw new Error('One time code expected.');
    }

    const otp = await redisClient.get(email);

    verifyOTP(token, otp);

    const expiryTime = process.env['OTP_EXPIRES'];

    try {
      await redisClient.set(email, token, {
        EX: parseInt(expiryTime as string),
      });
    } catch {
      console.error('OTP expiration time not set in environment variable.');
    }

    return res.status(200).json({ message: 'ok' });
  } catch (error) {
    return res.status(400).json({ message: (error as Error).message });
  }
});

app.post('/auth/password/forgot', async (req: Request, res: Response) => {
  try {
    const { email, token, password } = req.body;

    if (!email) {
      throw new Error('Email is expected.');
    }

    if (!token) {
      throw new Error('One time code required to reset password.');
    }

    if (!password) {
      throw new Error('New password is invalid.');
    }

    const otp = await redisClient.get(email);

    verifyOTP(token, otp);

    await updateUserPasswordFromEmail(email, password, SALT_ROUNDS);

    await redisClient.del(email);

    return res.status(200).json({ message: 'ok' });
  } catch (error) {
    return res.status(400).json({
      message: `Unable to update password. ${(error as Error).message}`,
    });
  }
});

app.post('/auth/password/update', async (req: Request, res: Response) => {
  try {
    const { oldPassword, newPassword } = req.body;

    if (!oldPassword) {
      throw new Error('Unable to validate existing password.');
    }

    if (!newPassword) {
      throw new Error('Invalid new password.');
    }

    const currentId = req.session.userId;

    if (!currentId) {
      throw new Error('Invalid session.');
    }

    // validate old password
    const user = await findUserFromId(currentId);

    const validPassword = await bcrypt.compare(oldPassword, user.password);
    if (!validPassword) {
      throw new Error('Current password is incorrect.');
    }

    // save new password
    await updateUserPasswordFromEmail(user.email, newPassword, SALT_ROUNDS);

    // refresh session
    req.session.cookie.expires = dayjs().add(1, 'week').toDate();
    req.session.save();

    return res.status(200).json({ message: 'ok' });
  } catch (error) {
    return res.status(400).json({
      message: `Unable to update password. ${(error as Error).message}`,
    });
  }
});

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
      include: {
        profilePicture: true,
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
    return res.status(200).json({
      id: user.id,
      username: user.username,
      email: user.email,
      dateJoined: user.dateJoined,
      profilePicture: user.profilePicture,
    } as SanitisedUser);
  } catch (error) {
    return res.status(500).json({ error: 'Error logging in' });
  }
});

app.post('/auth/logout', async (req: Request, res: Response) => {
  req.session.destroy(() => {
    return res.status(200).json({ message: 'ok' });
  });
});

app.post(
  '/discord/login',
  async (req: TypedRequest<DiscordLoginBody>, res: Response) => {
    const sessionFromDB = await validateSession(
      req.session ? req.session : null
    );
    if (!sessionFromDB) {
      return res.status(401).json({ message: 'Invalid session provided.' });
    }

    if (!req.body.discordID || typeof req.body.discordID !== 'number') {
      return res
        .status(400)
        .json({ error: 'Body is missing discordID, or it is not a number.' });
    }

    await redisClient.set(`discord:${req.body.discordID}`, req.session.id);
    return res.status(200).json({ message: 'ok' });
  }
);

app.post(
  '/discord/logout',
  async (req: TypedRequest<DiscordLoginBody>, res: Response) => {
    const providedSession = await validateSession(
      req.session ? req.session : null
    );
    if (!providedSession) {
      return res.status(401).json({ message: 'Invalid session provided.' });
    }

    if (!req.body.discordID || typeof req.body.discordID !== 'number') {
      return res
        .status(400)
        .json({ error: 'Body is missing discordID, or it is not a number.' });
    }

    const sessionString = await redisClient.get(
      `discord:${req.body.discordID}`
    );

    if (!sessionString) {
      return res
        .status(400)
        .json({ error: 'No session is associated with this Discord account.' });
    }

    const session = JSON.parse(sessionString);

    if (!providedSession.id !== session.id) {
      return res.status(401).json({ message: 'Invalid session provided.' });
    }

    await redisClient.del(`discord_${req.body.discordID}`);
    return res.status(200).json({
      message:
        'The association between a Pyramids session and this Discord account has been removed.',
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
    include: {
      profilePicture: true,
    },
  });
  if (user) {
    return {
      id: user.id,
      username: user.username,
      email: user.email,
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
  const user = await getUserFromID(userID);

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
    dateJoined: user.dateJoined,
    profilePicture: user.profilePicture,
  });
});

app.get('/society', async (req, res: Response) => {
  if (!req.query['id']) {
    return res.status(400).json({ message: 'Missing `id` query parameter.' });
  }

  const societyID = Number(req.query['id']);

  if (isNaN(societyID)) {
    return res.status(400).json({ message: 'Invalid `id` query parameter.' });
  }

  const society = await prisma.society.findFirst({
    where: {
      id: societyID,
    },
  });

  if (!society) {
    return res.status(404).json({ message: 'Society not found.' });
  }

  return res.status(200).json(society);
});

app.get('/society/events', async (req, res: Response) => {
  if (!req.query['id']) {
    return res.status(400).json({ message: 'Missing `id` query parameter.' });
  }

  const before = req.query['before']
    ? new Date(req.query['before'] as string)
    : undefined;
  const after = req.query['after']
    ? new Date(req.query['after'] as string)
    : undefined;

  const societyID = Number(req.query['id']);

  const society = await prisma.society.findFirst({
    where: {
      id: societyID,
    },
  });

  if (!society) {
    return res.status(404).json({ message: 'Society not found.' });
  }

  // Find events that pertain to the society
  const events = await prisma.event.findMany({
    where: {
      society: {
        id: societyID,
      },
      ...(before && {
        startDateTime: {
          lte: before,
        },
      }),
      ...(after && {
        startDateTime: {
          gte: after,
        },
      }),
    },
    orderBy: {
      startDateTime: 'asc',
    },
  });

  if (!events || events.length === 0) {
    return res.status(404).json({
      message:
        'The society does not have any events, or none exist within the provided filters.',
    });
  }

  return res.status(200).json(events);
});

app.post(
  '/society',
  async (req: TypedRequest<CreateSocietyBody>, res: Response) => {
    const society = req.body;
    if (!society.name) {
      return res.status(400).json({ message: 'Invalid input.' });
    }

    if (!society.profilePicture) {
      society.profilePicture = null;
    }

    const sessionFromDB = await validateSession(
      req.session ? req.session : null
    );

    if (!sessionFromDB) {
      return res.status(401).json({ message: 'Invalid session provided.' });
    }

    try {
      const newSociety = await prisma.society.create({
        data: {
          name: society.name,
          description: society.description ? society.description : null,
          admin: {
            connect: {
              id: sessionFromDB.userId,
            },
          },
        },
      });

      return res.status(200).json(newSociety);
    } catch (e) {
      return res.status(400).json({ message: 'invalid society input' });
    }
  }
);

app.post(
  '/event',
  async (req: TypedRequest<CreateEventBody>, res: Response) => {
    //Session validation
    const event = req.body;

    const sessionFromDB = await validateSession(
      req.session ? req.session : null
    );
    if (!sessionFromDB) {
      return res.status(401).json({ message: 'Invalid session provided.' });
    }

    //Sanitize Inputs/Check Validity
    if (!isValidDate(event.startDateTime, event.endDateTime)) {
      return res.status(400).json({ message: 'Invalid date' });
    }

    // upload image to storage and get link
    let imagePath = '';
    try {
      if (event.image && storageClient) {
        const metadata = event.image.metadata;
        const base64Data = event.image.buffer.split(',')[1];
        if (base64Data) {
          imagePath = await uploadFile(
            base64Data,
            metadata.type,
            event.societyId,
            event.name
          );
        } else {
          throw new Error('Invalid base64 string.');
        }
      }
    } catch (error) {
      return res.status(400).json({ message: `Unable to upload image.` });
    }

    const myImage: Image = {
      url: imagePath,
      profilePictureUserID: 1,
      societyPictureID: 1,
      imageColoursID: 1,
      eventPictureID: 1,
    };

    try {
      const eventRes = await prisma.event.create({
        data: {
          picture: myImage,
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
      return res.status(200).json(eventRes);
    } catch (e) {
      console.log(e);
      return res.status(400).json({ message: 'Invalid event input' });
    }
  }
);

app.put('/event', async (req: TypedRequest<UpdateEventBody>, res: Response) => {
  const sessionFromDB = await validateSession(req.session ? req.session : null);
  if (!sessionFromDB) {
    return res.status(401).json({ message: 'Invalid session provided.' });
  }

  if (!req.body['id']) {
    return res.status(400).json({ message: 'Missing `id` query parameter.' });
  }

  const eventID = Number(req.body['id']);

  const event = await prisma.event.findFirst({
    where: {
      id: eventID,
    },
    include: {
      picture: true,
    },
  });

  if (!event) {
    return res.status(404).json({ message: 'Event not found.' });
  }

  if (!isValidDate(req.body.startDateTime, req.body.endDateTime)) {
    return res.status(400).json({ message: 'Invalid date' });
  }

  // upload image to storage and get link
  let imagePath;
  try {
    if (Object.keys(event.picture).length > 0) {
      const base64Data = req.body.image.buffer.split(',')[1];
      if (base64Data) {
        const metadata = req.body.image.metadata;

        imagePath = await uploadFile(
          base64Data,
          metadata.type,
          event.societyId,
          event.name
        );
      } else {
        throw new Error('Invalid base64 string.');
      }
    } else {
      throw new Error('No image submitted.');
    }
  } catch (error) {
    return res.status(400).json({ error: (error as Error).message });
  }

  try {
    const eventRes = await prisma.event.update({
      where: {
        id: eventID,
      },
      data: {
        picture: imagePath,
        name: req.body.name,
        startDateTime: dayjs(req.body.startDateTime).toISOString(),
        endDateTime: dayjs(req.body.endDateTime).toISOString(),
        location: req.body.location,
        description: req.body.description,
      },
    });

    return res.status(200).json(eventRes);
  } catch (e) {
    return res.status(400).json({ message: 'Invalid event input' });
  }
});

app.get('/event', async (req: Request, res: Response) => {
  const sessionFromDB = await validateSession(req.session ? req.session : null);
  if (!sessionFromDB) {
    return res.status(401).json({ message: 'Invalid session provided.' });
  }

  if (!req.query['id']) {
    return res.status(400).json({ message: 'Missing `id` query parameter.' });
  }

  const eventID = Number(req.query['id']);

  const event = await prisma.event.findFirst({
    where: {
      id: eventID,
    },
  });

  if (!event) {
    return res.status(404).json({ message: 'Event not found.' });
  }

  return res.status(200).json(event);
});

function isValidDate(startDate: Date, endDate: Date): boolean {
  const parsedStartDate = dayjs(startDate);
  const parsedEndDate = dayjs(endDate);

  return !(
    parsedStartDate.isAfter(parsedEndDate) ||
    parsedStartDate.isSame(parsedEndDate) ||
    parsedStartDate.isBefore(dayjs(), 'day')
  );
}

app.get('/events', async (req, res: Response) => {
  const page = Number(req.query['page']) - 1 || 0;

  if (page < 0 || isNaN(page)) {
    return res.status(400).json({
      message: 'Invalid page specified. Note that a page must be 1 or greater.',
    });
  }

  const before = req.query['before']
    ? new Date(req.query['before'] as string)
    : undefined;
  const after = req.query['after']
    ? new Date(req.query['after'] as string)
    : undefined;

  const events = await prisma.event.findMany({
    where: {
      ...(before && {
        startDateTime: {
          lte: before,
        },
      }),
      ...(after && {
        startDateTime: {
          gte: after,
        },
      }),
    },
    orderBy: {
      startDateTime: 'asc',
    },
    skip: page * 10,
    take: 10,
  });

  if (!events || events.length === 0) {
    return res.status(404).json({ message: 'No events found.' });
  }

  return res.status(200).json(events);
});

app.get('/user/events', async (req, res: Response) => {
  const sessionFromDB = await validateSession(req.session ? req.session : null);
  if (!sessionFromDB) {
    return res.status(401).json({ message: 'Invalid session provided.' });
  }

  const userID = sessionFromDB.userId;

  // pagination is optional for /user/events

  let page = undefined;
  if (req.query['page']) {
    page = Number(req.query['page']) - 1;
    if (page < 0 || isNaN(page)) {
      return res.status(400).json({
        message:
          'Invalid page specified. Note that a page must be 1 or greater.',
      });
    }
  }

  const before = req.query['before']
    ? new Date(req.query['before'] as string)
    : undefined;
  const after = req.query['after']
    ? new Date(req.query['after'] as string)
    : undefined;

  const events = await prisma.event.findMany({
    where: {
      ...(before && {
        startDateTime: {
          lte: before,
        },
      }),
      ...(after && {
        startDateTime: {
          gte: after,
        },
      }),
      attendees: {
        some: {
          id: userID,
        },
      },
    },
    orderBy: {
      startDateTime: 'asc',
    },
    ...(page !== undefined && {
      skip: page * 10,
      take: 10,
    }),
  });

  if (!events || events.length === 0) {
    return res.status(404).json({ message: 'No events found.' });
  }

  return res.status(200).json(events);
});

app.get('/user/societies', async (req, res: Response) => {
  const sessionFromDB = await validateSession(req.session ? req.session : null);
  if (!sessionFromDB) {
    return res.status(401).json({ message: 'Invalid session provided.' });
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

  const societies_administering = await prisma.society.findMany({
    where: {
      admin: {
        id: userID,
      },
    },
  });

  const societies = {
    joined: societies_joined,
    administering: societies_administering,
  };

  return res.status(200).json(societies);
});

app.get('/societies', async (req, res: Response) => {
  const societies = await prisma.society.findMany({
    orderBy: {
      id: 'asc',
    },
  });
  return res.status(200).json(societies);
});

//Lets a user join a society
app.post(
  '/user/society/join',
  async (req: TypedRequest<societyIdBody>, res: Response) => {
    //get userid from session
    const sessionFromDB = await validateSession(
      req.session ? req.session : null
    );
    if (!sessionFromDB) {
      return res.status(401).json({ message: 'Invalid session provided.' });
    }

    const userID = sessionFromDB.userId;

    //Make sure a society actually exists
    const societyId = await prisma.society.findFirst({
      where: {
        id: req.body.societyId,
      },
      select: {
        id: true,
      },
    });

    if (!societyId) {
      return res.status(400).json({ message: 'Invalid society' });
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

    return res.status(200).json({ message: 'ok' });
  }
);

app.delete(
  '/user/society',
  async (req: TypedRequest<societyIdBody>, res: Response) => {
    const sessionFromDB = await validateSession(
      req.session ? req.session : null
    );
    if (!sessionFromDB) {
      return res.status(401).json({ message: 'Invalid session provided.' });
    }

    const userID = sessionFromDB.userId;

    const societyId = await prisma.society.findFirst({
      where: {
        id: req.body.societyId,
      },
      select: {
        id: true,
      },
    });

    if (!societyId) {
      return res.status(400).json({ message: 'Invalid society' });
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

    return res.status(200).json({ message: 'ok' });
  }
);

app.post(
  '/user/event',
  async (req: TypedRequest<eventIdBody>, res: Response) => {
    const sessionFromDB = await validateSession(
      req.session ? req.session : null
    );
    if (!sessionFromDB) {
      return res.status(401).json({ message: 'Invalid session provided.' });
    }

    const userID = sessionFromDB.userId;

    const event = await prisma.event.findFirst({
      where: {
        id: req.body.eventId,
      },
      select: {
        id: true,
      },
    });

    if (!event) {
      return res.status(400).json({ message: 'Invalid Event' });
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
        },
      },
    });

    return res.status(200).json({ message: 'ok' });
  }
);

app.delete(
  '/user/event',
  async (req: TypedRequest<eventIdBody>, res: Response) => {
    const sessionFromDB = await validateSession(
      req.session ? req.session : null
    );
    if (!sessionFromDB) {
      return res.status(401).json({ message: 'Invalid session provided.' });
    }

    const userID = sessionFromDB.userId;

    const event = await prisma.event.findFirst({
      where: {
        id: req.body.eventId,
      },
      select: {
        id: true,
      },
    });

    if (!event) {
      return res.status(400).json({ message: 'Invalid Event' });
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

    return res.status(200).json({ message: 'ok' });
  }
);

//For retrieving the data in the individual event view card
app.get(
  '/event/details',
  async (req: TypedRequest<eventIdBody>, res: Response) => {
    const event = await prisma.event.findFirst({
      where: {
        id: req.body.eventId,
      },
    });

    if (!event) {
      return res.status(400).json({ message: 'invalid society' });
    }

    return res.status(200).json(event);
  }
);

//this is a bit messy
app.delete('/event', async (req: TypedRequest<eventIdBody>, res: Response) => {
  const sessionFromDB = await validateSession(req.session ? req.session : null);
  if (!sessionFromDB) {
    return res.status(401).json({ message: 'Invalid session provided.' });
  }

  const userID = sessionFromDB.userId;

  //400 if event doesn't exist
  const event = await prisma.event.findFirst({
    where: {
      id: req.body.eventId,
    },
    select: {
      id: true,
      societyId: true,
    },
  });

  if (!event) {
    return res.status(400).json({ message: "event doesn't exist" });
  }

  //find society associated with event, then check to see if the user is an admin, return 401.
  const society = await prisma.society.findFirst({
    where: {
      id: event.societyId,
      admin: {
        id: userID,
      },
    },
    select: {
      id: true,
    },
  });

  if (!society) {
    return res.status(401).json({ message: 'User is not an admin!' });
  }

  //200 if deletion is successful
  try {
    await prisma.event.delete({
      where: {
        id: event.id,
      },
    });
  } catch (e) {
    return res.status(400).json({ message: 'Deletion failed' });
  }

  return res.status(200).json({ message: 'ok' });
});

app.delete(
  '/society',
  async (req: TypedRequest<societyIdBody>, res: Response) => {
    const sessionFromDB = await validateSession(
      req.session ? req.session : null
    );
    if (!sessionFromDB) {
      return res.status(401).json({ message: 'Invalid session provided.' });
    }

    const userID = sessionFromDB.userId;
    const society = await prisma.society.findFirst({
      where: {
        id: req.body.societyId,
        admin: {
          id: userID,
        },
      },
      select: {
        id: true,
      },
    });

    if (!society) {
      return res.status(401).json({ message: 'User is not an admin!' });
    }

    //200 if deletion is successful
    try {
      await prisma.society.delete({
        where: {
          id: society.id,
        },
      });
    } catch (e) {
      return res.status(400).json({ message: 'Deletion failed' });
    }

    return res.status(200).json({ message: 'ok' });
  }
);

// gets keywords a user is associated with
app.get('/user/keywords', async (req, res: Response) => {
  const sessionFromDB = await validateSession(req.session ? req.session : null);
  if (!sessionFromDB) {
    return res.status(401).json({ message: 'Invalid session provided.' });
  }

  const userID = sessionFromDB.userId;

  let userKeywords = await prisma.user.findFirst({
    where: {
      id: userID,
    },
    select: {
      keywords: true,
    },
  });

  if (userKeywords === null) return res.status(404).json([]);

  return res.status(200).json(userKeywords.keywords);
});

// creates a keyword
app.post(
  '/keyword',
  async (req: TypedRequest<CreateKeywordBody>, res: Response) => {
    const sessionFromDB = await validateSession(
      req.session ? req.session : null
    );

    if (!sessionFromDB) {
      return res.status(401).json({ message: 'Invalid session provided.' });
    }

    const { text } = req.body;
    if (!text) {
      return res.status(400).json({ message: 'Invalid input.' });
    }

    const keywordExists = await prisma.keyword.findFirst({
      where: {
        text: text,
      },
    });

    if (keywordExists) {
      return res.status(400).json({ message: 'Keyword already exists.' });
    }

    try {
      const newKeyword = await prisma.keyword.create({
        data: {
          text: text,
        },
      });
      return res.status(200).json(newKeyword);
    } catch (e) {
      return res.status(400).json({ message: 'Invalid keyword input.' });
    }
  }
);

// associates a user with a keyword
app.post(
  '/user/keyword',
  async (req: TypedRequest<keywordIdBody>, res: Response) => {
    //get userid from session
    const sessionFromDB = await validateSession(
      req.session ? req.session : null
    );
    if (!sessionFromDB) {
      return res.status(401).json({ message: 'Invalid session provided.' });
    }
    const userID = sessionFromDB.userId;

    //Make sure keyword exists
    const keywordExists = await prisma.keyword.findFirst({
      where: {
        id: req.body.keywordId,
      },
      select: {
        id: true,
      },
    });

    if (!keywordExists) {
      return res.status(404).json({ message: 'Invalid keyword.' });
    }

    //Connect keyword and user
    await prisma.keyword.update({
      where: {
        id: req.body.keywordId,
      },
      data: {
        subscribers: {
          connect: {
            id: userID,
          },
        },
      },
    });

    await prisma.user.update({
      where: {
        id: userID,
      },
      data: {
        keywords: {
          connect: {
            id: req.body.keywordId,
          },
        },
      },
    });

    return res.status(200).json({ message: 'ok' });
  }
);

// disassociates a user with a keyword
app.delete(
  '/user/keyword',
  async (req: TypedRequest<keywordIdBody>, res: Response) => {
    //get userid from session
    const sessionFromDB = await validateSession(
      req.session ? req.session : null
    );
    if (!sessionFromDB) {
      return res.status(401).json({ message: 'Invalid session provided.' });
    }
    const userID = sessionFromDB.userId;

    //Make sure keyword exists
    const societyId = await prisma.keyword.findFirst({
      where: {
        id: req.body.keywordId,
      },
      select: {
        id: true,
      },
    });

    if (!societyId) {
      return res.status(400).json({ message: 'Invalid keyword.' });
    }

    //Disconnect keyword and user
    await prisma.keyword.update({
      where: {
        id: req.body.keywordId,
      },
      data: {
        subscribers: {
          disconnect: {
            id: userID,
          },
        },
      },
    });

    await prisma.user.update({
      where: {
        id: userID,
      },
      data: {
        keywords: {
          disconnect: {
            id: req.body.keywordId,
          },
        },
      },
    });

    return res.status(200).json({ message: 'ok' });
  }
);

app.get('/hello', () => {
  console.log('Hello World!');
});

if (process.env['NODE_ENV'] !== 'test') {
  app.listen(SERVER_PORT, () => {
    console.log(`Server running on port http://localhost:${SERVER_PORT}`);
  });
}

export default app;
