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
  password: string;
}

export interface RegisterBody extends LoginBody {
  email: string;
}

export interface UserIdBody {
  userId: number;
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

export interface UpdateEventBody extends CreateEventBody {
  id: number;
}

//strictNullChecks being set to false broke some more code, so I'm just gonna make it string|null
export interface CreateSocietyBody {
  name: string;
  profilePicture: string | null;
}

export interface CreateKeywordBody {
  text: string;
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

export interface eventDetailsBody {}
