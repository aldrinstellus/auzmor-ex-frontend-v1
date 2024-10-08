import { IUser } from 'contexts/AuthContext';
import { NavigateFunction } from 'react-router-dom';
import { useBrandingStore } from 'stores/branding';
import { ApiEnum } from 'utils/permissions/enums/apiEnum';
import { getItem, removeItem, setItem } from 'utils/persist';
import { getRemainingTime } from 'utils/time';
import { usePermissions } from './usePermissions';

export const useNavigateWithToken = () => {
  const setBranding = useBrandingStore((state) => state.setBranding);
  const { getApi } = usePermissions();
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

    setItem(process.env.REACT_APP_SESSION_KEY || 'uat', token);

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
        const fetchMe = getApi(ApiEnum.GetMeApi);
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
            name: user?.org.name,
          },
          profileImage:
            user?.profileImage?.small || user?.profileImage?.original,
          permissions: user?.permissions,
          timezone: user?.timeZone,
          department: user?.department,
          workLocation: user?.workLocation,
          outOfOffice: user?.outOfOffice,
          integrations: user?.org?.integrations ?? [],
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
        if (setShowOnboard) {
          setShowOnboard(true);
        }
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
