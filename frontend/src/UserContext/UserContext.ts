import { createContext, Dispatch, SetStateAction } from "react";

export interface User {
  id: number;
  username: string;
  email: string;
  dateJoined: string;
  profilePicture: string | undefined;
}

export interface UserContextType {
  user: User | null;
  setUser: Dispatch<SetStateAction<User | null>> | undefined;
}

export const UserContext = createContext<UserContextType>({
  user: null,
  setUser: undefined,
});
