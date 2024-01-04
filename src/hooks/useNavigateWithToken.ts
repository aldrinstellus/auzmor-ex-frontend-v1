import { IUser } from 'contexts/AuthContext';
import { fetchMe } from 'queries/account';
import { NavigateFunction } from 'react-router-dom';
import { useBrandingStore } from 'stores/branding';
import { getItem, removeItem, setItem } from 'utils/persist';
import { getRemainingTime } from 'utils/time';

export const useNavigateWithToken = () => {
  const setBranding = useBrandingStore((state) => state.setBranding);
  const navigateWithToken = async (
    token: string,
    redirectUrl: string,
    setUser: (user: IUser | null) => void,
    navigate: NavigateFunction,
    setShowOnboard?: (flag: boolean) => void,
  ) => {
    let url = getItem('redirect_post_login_to') || '/feed';
    if (url === '/') url = '/feed';
    removeItem('redirect_post_login_to');

    setItem(process.env.SESSION_KEY || 'uat', token);

    if (setShowOnboard) {
      setShowOnboard(true);
    }

    if (process.env.NODE_ENV === 'development') {
      if (token) {
        url = `${url}?accessToken=${token}`;
      }
      if (setShowOnboard) {
        url += '&showOnboard=true';
      }
      window.location.replace(`http://localhost:3000${url}`);
      return;
    } else {
      if (
        `${window.location.protocol}//${window.location.host}` === redirectUrl
      ) {
        const userData = await fetchMe();
        const user = userData?.result?.data;
        setUser({
          id: user?.id,
          name: user?.fullName,
          email: user?.workEmail,
          role: user?.role,
          organization: {
            id: user?.org.id,
            domain: user?.org.domain,
          },
          profileImage:
            user?.profileImage?.small || user?.profileImage?.original,
          permissions: user?.permissions,
          timezone: user?.timeZone,
          department: user?.department,
          workLocation: user?.workLocation,
          outOfOffice: user?.outOfOffice,
          notificationSettings: user?.notificationSettings,
          subscription: {
            type: user?.org?.subscription.type,
            daysRemaining: Math.max(
              getRemainingTime(user?.org?.subscription?.subscriptionExpiresAt),
              0,
            ),
          },
        });
        setBranding(user.branding);
        navigate(url);
      } else {
        if (token) {
          url = `${url}?accessToken=${token}`;
        }
        if (setShowOnboard) {
          url += '&showOnboard=true';
        }
        window.location.replace(`${redirectUrl}${url}`);
      }
    }
  };
  return navigateWithToken;
};
