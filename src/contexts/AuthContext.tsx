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
  profileImage?: string;
}

interface IAuthContext {
  user: IUser | null;
  reset: () => void;
  updateUser: (user: IUser) => void;
}

export const AuthContext = createContext<IAuthContext>({
  user: null,
  reset: () => {},
  updateUser: () => {},
});

const AuthProvider: React.FC<AuthContextProps> = ({ children }) => {
  const [loading, setLoading] = useState(true);
  const queryClient = useQueryClient();
  const [showOnboard, setShowOnboard] = useState<boolean>(false);
  const [user, setUser] = useState<IUser | null>(null);

  const setupSession = async () => {
    const query = new URLSearchParams(window.location.search.substring(1));
    let token = query.get('accessToken');
    const _showOnboard = query.get('showOnboard');
    setShowOnboard(!!_showOnboard);

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
      const userData = await fetchMe();
      setUser({
        id: userData?.result?.data?.id,
        name: userData?.result?.data?.fullName,
        email: userData?.result?.data?.workEmail,
        organization: {
          id: userData?.result?.data?.org.id,
          domain: userData?.result?.data?.org.domain,
        },
        profileImage:
          userData?.result?.data.profileImage?.originalUrl || undefined,
      });
    }
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

  const updateUser = (user: IUser) => setUser((u) => ({ ...u, ...user }));

  if (loading) {
    return <>Loading...</>;
  }
  return (
    <AuthContext.Provider value={{ user, reset, updateUser }}>
      {children}
      {showOnboard && <></>}
    </AuthContext.Provider>
  );
};

export default AuthProvider;
