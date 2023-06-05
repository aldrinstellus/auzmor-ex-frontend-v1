import React, { ReactNode, createContext, useState, useEffect } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import { getItem, removeAllItems, setItem } from 'utils/persist';
import { fetchMe } from 'queries/account';
import UserOnboard from 'components/UserOnboard';
import { Role } from 'utils/enum';
import PageLoader from 'components/PageLoader';

type AuthContextProps = {
  children: ReactNode;
};

interface IOrganization {
  id: string;
  domain: string;
}

export interface IUser {
  id: string;
  name: string;
  email: string;
  role: Role;
  organization: IOrganization;
  workLocation?: string;
  preferredName?: string;
  designation?: string;
  // department?: string;
  location?: string;
  profileImage?: string;
  coverImage?: string;
  permissions?: [];
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
      try {
        const userData = await fetchMe();
        const data = userData?.result?.data;
        setUser({
          id: data?.id,
          name: data?.fullName,
          email: data?.workEmail,
          role: data?.role,
          organization: {
            id: data?.org.id,
            domain: data?.org.domain,
          },
          profileImage: data?.profileImage?.original,
        });
      } catch (e: any) {
        if (e?.response?.status === 401) {
          removeAllItems();
          queryClient.clear();
        }
      }
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
    return (
      <div className="h-screen w-screen">
        <PageLoader />
      </div>
    );
  }
  return (
    <AuthContext.Provider value={{ user, reset, updateUser }}>
      {children}
      {showOnboard && <UserOnboard />}
    </AuthContext.Provider>
  );
};

export default AuthProvider;
