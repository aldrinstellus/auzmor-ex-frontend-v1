import { ReactNode, createContext, useState, useEffect, FC } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import { getItem, removeAllItems, setItem } from 'utils/persist';
import { fetchMe } from 'queries/account';
import UserOnboard from 'components/UserOnboard';
import { Role } from 'utils/enum';
import PageLoader from 'components/PageLoader';
import { getLearnUrl, getSubDomain, userChannel } from 'utils/misc';
import { ILocation } from 'queries/location';
import { IDepartment } from 'queries/department';
import Smartlook from 'smartlook-client';
import { getRemainingTime } from 'utils/time';
import SubscriptionExpired from 'components/SubscriptionExpired';
import AccountDeactivated from 'components/AccountDeactivated';
import { useBrandingStore } from 'stores/branding';
import { INotificationSettings } from 'queries/users';
import useProduct from 'hooks/useProduct';
import { ProductEnum, getProduct } from 'utils/apiService';

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
  notificationSettings?: INotificationSettings;
  preferences?: Record<string, any>;
}

export interface IBranding {
  primaryColor?: string;
  secondaryColor?: string;
  pageTitle?: string;
  favicon?: { blurHash?: string; id: string; original: string };
  logo?: { blurHash?: string; id: string; original: string };
  loginConfig: {
    layout: 'LEFT' | 'CENTER' | 'RIGHT'; // default: RIGHT
    backgroundType: 'IMAGE' | 'VIDEO' | 'COLOR'; // default: IMAGE
    image?: { blurHash?: string; id: string; original: string };
    video?: { blurHash?: string; id: string; original: string };
    text?: string;
    color?: string;
  };
}

interface IAuthContext {
  user: IUser | null;
  loggedIn: boolean;
  sessionExpired: boolean;
  accountDeactivated: boolean;
  reset: () => void;
  updateUser: (user: IUser) => void;
  setUser: (user: IUser | null) => void;
  setShowOnboard: (flag: boolean) => void;
}

export const AuthContext = createContext<IAuthContext>({
  user: null,
  loggedIn: false,
  sessionExpired: false,
  accountDeactivated: false,
  reset: () => {},
  updateUser: () => {},
  setUser: () => {},
  setShowOnboard: () => {},
});

const AuthProvider: FC<AuthContextProps> = ({ children }) => {
  const [loading, setLoading] = useState(true);
  const queryClient = useQueryClient();
  const [showOnboard, setShowOnboard] = useState(false);
  const [loggedIn, setLoggedIn] = useState(false);
  const [user, setUser] = useState<IUser | null>(null);
  const [sessionExpired, setSessionExpired] = useState(false);
  const [accountDeactivated, setAccountDeactivated] = useState(false);
  const { isLxp } = useProduct();

  const setBranding = useBrandingStore((state) => state.setBranding);

  const setupSession = async () => {
    const query = new URLSearchParams(window.location.search.substring(1));
    let token = query.get('accessToken');
    setShowOnboard(!!query.get('showOnboard'));

    const regionUrl = query.get('regionUrl');
    if (regionUrl) {
      setItem('regionUrl', regionUrl);
      query.delete('regionUrl');
    }

    const visitToken = query.get('visitToken');
    if (visitToken) {
      setItem('visitToken', visitToken);
      query.delete('visitToken');
    }

    const viewAsRole = query.get('role');
    if (viewAsRole) {
      setItem('viewAsRole', viewAsRole);
      query.delete('role');
    }

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
        setLoggedIn(true);
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
          notificationSettings: data?.notificationSettings,
          subscription: {
            type: data?.org?.subscription.type,
            daysRemaining: Math.max(
              getRemainingTime(data?.org?.subscription?.subscriptionExpiresAt),
              0,
            ),
          },
          preferences: data?.preferences,
        });
        setBranding(data.branding, isLxp);
      } catch (e: any) {
        if (e?.response?.status === 401) {
          removeAllItems();
          queryClient.clear();
        }
      }
    }
    if (
      !!!token &&
      getProduct() === ProductEnum.Lxp &&
      !!getSubDomain(window.location.host)
    ) {
      window.location.replace(getLearnUrl());
    } else {
      setLoading(false);
    }
  };

  const initSmartlook = () => {
    if (process.env.REACT_APP_SMARTLOOK_KEY) {
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

  const accountDeactivatedCallback = () => setAccountDeactivated(true);

  useEffect(() => {
    initSmartlook();
    setupSession();
    window.document.addEventListener('session_expired', sessionExpiredCallback);
    window.document.addEventListener(
      'account_deactivated',
      accountDeactivatedCallback,
    );
    return () => {
      window.document.removeEventListener(
        'session_expired',
        sessionExpiredCallback,
      );
      window.document.removeEventListener(
        'account_deactivated',
        accountDeactivatedCallback,
      );
    };
  }, []);

  const reset = () => {
    setUser(null); // set user
    queryClient.clear();
    removeAllItems();
    setSessionExpired(false);
  };

  useEffect(() => {
    userChannel.onmessage = (data: any) => {
      if (data?.data?.payload?.type === 'SIGN_OUT') {
        reset();
        if (isLxp) {
          window.location.replace(`${getLearnUrl()}`);
        } else {
          window.location.replace(`${window.location.origin}/logout`);
        }
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
    <AuthContext.Provider
      value={{
        user,
        sessionExpired,
        accountDeactivated,
        reset,
        loggedIn,
        updateUser,
        setUser,
        setShowOnboard,
      }}
    >
      {children}
      {showOnboard && <UserOnboard />}
      {sessionExpired && user?.id && <SubscriptionExpired />}
      {accountDeactivated && user?.id && <AccountDeactivated />}
    </AuthContext.Provider>
  );
};

export default AuthProvider;
