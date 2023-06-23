import { User } from 'firebase/auth';
import {
  useState,
  useContext,
  createContext,
  ReactNode,
  useEffect,
} from 'react';
import { useAuthState } from 'react-firebase-hooks/auth';
import { auth } from '../firebase';

type IUser = User | null | undefined;

const UserContext = createContext<IUser>(undefined);

export function UserProvider({ children }: { children: ReactNode }) {
  // const [user] = useAuthState(auth);
  const [user, setUser] = useState<IUser>();
  useEffect(() => {
    const unsub = auth.onAuthStateChanged((u) => setUser(u));
    return () => unsub();
  }, []);
  return <UserContext.Provider value={user}>{children}</UserContext.Provider>;
}

export const useUser = () => useContext(UserContext);
