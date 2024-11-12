import { UserType } from "@prisma/client";

export interface User {
  //id Int @id @default(autoincrement())
  username: string;
  email: string;
  password: string;
  salt: string;
  dateJoined: Date;
  userType: UserType;
  profilePicture: string | null;
  //attendee: Attendee?
  //society: Society?
}

export interface LoginErrors {
  usernameNotFound?: boolean;
  passwordInvalid?: boolean;
  matchingCredentials?: boolean;
}
