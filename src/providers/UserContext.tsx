import { User } from 'firebase/auth';
import {
  useState,
  useContext,
  createContext,
  ReactNode,
  useEffect,
  useRef,
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

export const useUser = (onLoad?: (user: User) => void) => {
  const onLoadRef = useRef(onLoad);
  const onLoaded = onLoadRef.current;
  const _user = useContext(UserContext);
  useEffect(() => {
    _user && onLoaded && onLoaded(_user);
  }, [_user, onLoaded]);
  return _user;
};
