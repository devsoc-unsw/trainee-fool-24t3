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
  banner: Base64Image;
  name: string;
  startDateTime: Date;
  endDateTime: Date;
  location: string;
  description: string;
  societyId: number;
}

interface Base64Image {
  buffer: string;
  metadata: {
    name: string;
    type: string;
    size: number;
  };
}

export interface UpdateEventBody extends CreateEventBody {
  id: number;
}

//strictNullChecks being set to false broke some more code, so I'm just gonna make it string|null
export interface CreateSocietyBody {
  name: string;
  description?: string;
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

export interface keywordIdBody {
  keywordId: number;
}

export interface eventDetailsBody {}
