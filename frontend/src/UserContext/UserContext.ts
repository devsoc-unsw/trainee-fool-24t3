import { createContext, Dispatch, SetStateAction } from 'react';

export interface User {
  id: number;
  username: string;
  email: string;
  dateJoined: string;
  profilePicture: string | undefined;
}

export interface Society {
  id: number;
  discordId: null;
  name: string;
  profilePicture: string | null;
  userId: number;
}

export interface Societies {
  administering: Society[];
  joined: Society[];
}

export interface UserContextType {
  user: User | null;
  societies: Societies | null;
  setUser: Dispatch<SetStateAction<User | null>> | undefined;
  setSocieties: Dispatch<SetStateAction<Societies | null>> | undefined;
  society: Society | null;
  setSociety: Dispatch<SetStateAction<Society | null>> | undefined;
}

export const UserContext = createContext<UserContextType>({
  user: null,
  societies: null,
  society: null,
  setUser: undefined,
  setSocieties: undefined,
  setSociety: undefined,
});
