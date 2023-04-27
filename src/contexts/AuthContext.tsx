import React, { ReactNode, createContext, useState, useEffect } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import { getItem, removeAllItems, setItem } from 'utils/persist';
import { fetchMe } from 'queries/account';

type AuthContextProps = {
  children: ReactNode;
};

interface IOrganization {
  id: string;
  domain: string;
}

interface IUser {
  id: string;
  name: string;
  email: string;
  organization: IOrganization;
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

  const setupSession = async () => {
    const query = new URLSearchParams(window.location.search.substring(1));
    let token = query.get('accessToken');

    if (token) {
      setItem(process.env.SESSION_KEY || 'uat', token);
      query.delete('accessToken');

      const queryParams = query.toString();

      let updatedUrl = `${window.location.protocol}//${window.location.host}${window.location.pathname}`;
      if (queryParams) {
        updatedUrl += `?${queryParams}`;
      }

      window.history.pushState({ path: updatedUrl }, '', updatedUrl);
    }

    // if token in LS, make /me api call and update setUser
    token = getItem(process.env.SESSION_KEY || 'uat');
    if (token) {
      try {
        const userData = await fetchMe();
        console.log(userData);
        setUser({
          id: userData.user.id,
          name: userData.user.name,
          email: userData.user.workEmail,
          organization: {
            id: userData.organization.id,
            domain: userData.organization.domain,
          },
        });
      } catch (e) {
        setUser({
          id: 'userData.user.id',
          name: 'userData.user.name',
          email: 'userData.user.workEmail',
          organization: {
            id: 'userData.organization.id',
            domain: 'userData.organization.domain',
          },
        });
      }
    }
    // console.log(token);
    setLoading(false);
  };

  useEffect(() => {
    setupSession();
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
