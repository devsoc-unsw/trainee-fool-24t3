import { UserType } from "@prisma/client";
import { Dayjs } from "dayjs";


export interface TypedRequest<T> extends Express.Request {
  body: T;
}

export interface TypedRequestQuery<T> extends Express.Request {
  query: T;
}

export interface TypedResponse<T> extends Express.Response {
  body: T;
}

export interface LoginBody {
  username: string;
  email: string;
  password: string;
  userType: UserType;
}

export interface UserIdBody {
  userId: number
}

export interface CreateEventBody {
  banner: string;
  name: string;
  startDateTime: Date; 
  endDateTime: Date; 
  location: string;
  description: string;
  societyId: number;
}

export interface CreateSocietyBody {
  name:string
  profilePicture: string 
}

export interface DiscordLoginBody {
  discordID: number;
}

export interface societyIdBody {
  societyId: number;
}

export interface eventIdBody {
  eventId: number;
}

