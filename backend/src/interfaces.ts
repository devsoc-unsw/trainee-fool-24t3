import { UserType } from "@prisma/client";
import { OTPToken } from "./routes/OTP/OTPToken";

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
  otpToken: OTPToken | undefined;
}

export interface LoginErrors {
  usernameNotFound?: boolean;
  passwordInvalid?: boolean;
  matchingCredentials?: boolean;
}
