// BaseUsers are not themselves stored in the database and
// should not be used by you. They serve as a starting ground
// for the other two user types.
// With SanitisedUser, IDs are represented just as regular numbers.
// With the actual User, which is stored in the DB, IDs are handled
// by Prisma and do not need to be noted in these type definitions,

import { Image } from '@prisma/client';

// hence its omission.
interface BaseUser {
  username: string;
  email: string;
  dateJoined: Date;
  profilePicture: Image | null;
  //attendee: Attendee?
  //society: Society?
}

export interface SanitisedUser extends BaseUser {
  id: number;
}

export interface User extends BaseUser {
  //id Int @id @default(autoincrement())
  password: string;
  salt: string;
}

export interface LoginErrors {
  usernameNotFound?: boolean;
  passwordInvalid?: boolean;
  matchingCredentials?: boolean;
}
