import { UserType } from "@prisma/client";

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
