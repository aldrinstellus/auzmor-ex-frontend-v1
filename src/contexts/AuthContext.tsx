import { ReactNode, createContext, useState, useEffect, FC } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import { getItem, removeAllItems, setItem } from 'utils/persist';
import { fetchMe } from 'queries/account';
import UserOnboard from 'components/UserOnboard';
import { Role } from 'utils/enum';
import PageLoader from 'components/PageLoader';
import { userChannel } from 'utils/misc';
import { ILocation } from 'queries/location';
import { IDepartment } from 'queries/department';
import Smartlook from 'smartlook-client';
import { getRemainingTime } from 'utils/time';
import SubscriptionExpired from 'components/SubscriptionExpired';

type AuthContextProps = {
  children: ReactNode;
};

interface IOrganization {
  id: string;
  domain: string;
}

interface ISubscription {
  type: string;
  daysRemaining: number;
}

export interface IUser {
  id: string;
  name: string;
  email: string;
  role: Role;
  organization: IOrganization;
  subscription?: ISubscription;
  workLocation?: ILocation;
  preferredName?: string;
  designation?: Record<string, any>;
  department?: IDepartment;
  location?: string;
  profileImage?: string;
  coverImage?: string;
  permissions?: [];
  timezone?: string;
  outOfOffice?: Record<string, any>;
}

interface IAuthContext {
  user: IUser | null;
  sessionExpired: boolean;
  reset: () => void;
  updateUser: (user: IUser) => void;
}

export const AuthContext = createContext<IAuthContext>({
  user: null,
  sessionExpired: false,
  reset: () => {},
  updateUser: () => {},
});

const AuthProvider: FC<AuthContextProps> = ({ children }) => {
  const [loading, setLoading] = useState(true);
  const queryClient = useQueryClient();
  const [showOnboard, setShowOnboard] = useState<boolean>(false);
  const [user, setUser] = useState<IUser | null>(null);
  const [sessionExpired, setSessionExpired] = useState(false);

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
          profileImage:
            data?.profileImage?.small || data?.profileImage?.original,
          permissions: data?.permissions,
          timezone: data?.timeZone,
          department: data?.department,
          workLocation: data?.workLocation,
          outOfOffice: data?.outOfOffice,
          subscription: {
            type: data?.org?.subscription.type,
            daysRemaining: Math.max(
              getRemainingTime(data?.org?.subscription?.subscriptionExpiresAt),
              0,
            ),
          },
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

  const initSmartlook = () => {
    // @ts-ignores
    if (['production', 'staging', 'qa'].includes(process.env.REACT_APP_ENV)) {
      // @ts-ignores
      Smartlook.init(process.env.REACT_APP_SMARTLOOK_KEY);
    }
  };

  const setupSmartlookIdentity = () => {
    if (user) {
      Smartlook.identify(user.id, {
        uid: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
      });
    }
  };

  const sessionExpiredCallback = () => setSessionExpired(true);

  useEffect(() => {
    initSmartlook();
    setupSession();
    window.document.addEventListener('session_expired', sessionExpiredCallback);

    return () => {
      window.document.removeEventListener(
        'session_expired',
        sessionExpiredCallback,
      );
    };
  }, []);

  const reset = () => {
    setUser(null); // set user
    queryClient.clear();
    removeAllItems();
  };

  useEffect(() => {
    userChannel.onmessage = (data: any) => {
      if (data?.data?.payload?.type === 'SIGN_OUT') {
        reset();
        return window.location.replace(`${window.location.origin}/logout`);
      }
    };
  }, []);

  useEffect(() => {
    if (user) {
      setupSmartlookIdentity();
    }
  }, [user]);

  const updateUser = (user: IUser) => setUser((u) => ({ ...u, ...user }));

  if (loading) {
    return (
      <div className="h-screen w-screen">
        <PageLoader />
      </div>
    );
  }

  return (
    <AuthContext.Provider value={{ user, sessionExpired, reset, updateUser }}>
      {children}
      {showOnboard && <UserOnboard />}
      {sessionExpired && user?.id && <SubscriptionExpired />}
    </AuthContext.Provider>
  );
};

export default AuthProvider;
