import React, { ReactNode, createContext, useState, useEffect } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import { removeAllItems } from 'utils/persist';

type AuthContextProps = {
  children: ReactNode;
};

interface IUser {
  id: string;
  name: string;
  email: string;
}

interface IAuthContext {
  user: IUser | null;
  reset: () => void;
}

export const AuthContext = createContext<IAuthContext>({
  user: null,
  reset: () => {},
});

const AuthProvider: React.FC<AuthContextProps> = ({ children }) => {
  const queryClient = useQueryClient();
  const [user, setUser] = useState<IUser | null>(null);

  useEffect(() => {
    // read the token from url
    // set/update to localstorage
    // if token in LS, make /me api call and update setUser
    // if not token, do nothing
  }, []);

  const reset = () => {
    setUser(null); // set user
    queryClient.clear();
    removeAllItems();
  };

  return (
    <AuthContext.Provider value={{ user, reset }}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthProvider;
