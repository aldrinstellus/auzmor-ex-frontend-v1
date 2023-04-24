import React, { ReactNode, createContext, useState, useEffect } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import { getItem, removeAllItems, setItem } from 'utils/persist';
import apiService from 'utils/apiService';

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
  const [loading, setLoading] = useState(true);
  const queryClient = useQueryClient();
  const [user, setUser] = useState<IUser | null>(null);

  const fetchMe = async () => {
    const { data } = await apiService.get('/users/me');
  };

  //@ts-ignore
  useEffect(() => {
    // Read token from url
    const query = new URLSearchParams(window.location.search.substring(1));
    let token = query.get('accessToken');

    // set/update to localstorage
    if (token) {
      setItem(process.env.SESSION_KEY || 'uat', token);
    }

    // if token in LS, make /me api call and update setUser
    token = getItem(process.env.SESSION_KEY || 'uat');
    if (token) {
      //call /me
      fetchMe();
      setUser({
        id: 'id123',
        name: 'dhruvin',
        email: 'dhruvin.m@american-technology.net',
      });
    }
    // console.log(token);
    setLoading(false);
    // if not token, do nothing
  }, []);

  const reset = () => {
    setUser(null); // set user
    queryClient.clear();
    removeAllItems();
  };
  if (loading) {
    return <>Loading...</>;
  }
  return (
    <AuthContext.Provider value={{ user, reset }}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthProvider;
