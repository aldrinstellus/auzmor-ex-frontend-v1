import { Link } from 'react-router-dom';

// components
import { Logo } from 'components/Logo';
import Divider, { Variant } from 'components/Divider';
import NotificationsOverview from 'components/NotificationsOverview';
import AccountCard from './AccountCard';
import NavbarMenuItem from './NavbarMenuItem';

// hooks
import useRole from 'hooks/useRole';
import useAuth from 'hooks/useAuth';
import { useState } from 'react';
import SubscriptionBanner from './SubscriptionBanner';
import { useTranslation } from 'react-i18next';
// import { useState } from 'react';

const Navbar = () => {
  const { isAdmin } = useRole();
  const { user } = useAuth();
  const [showSubscriptionBanner, setShowSubscriptionBanner] = useState(
    user?.subscription?.type === 'TRIAL' &&
      user?.subscription?.daysRemaining > -1,
  );

  const { t } = useTranslation('navbar');

  const adminNavigations = [
    {
      label: t('admin'),
      icon: 'adminOutline',
      hoverIcon: 'adminFilled',
      linkTo: '/admin',
      dataTestId: 'office-admin-page',
      iconSize: 24,
    },
  ];

  // const { control } = useForm({
  //   mode: 'onChange',
  // });

  const navigations = [
    // {
    //   label: 'Home',
    //   icon: 'homeOutline',
    //   hoverIcon: 'homeFilled',
    //   linkTo: '/home',
    //   dataTestId: 'office-home-page',
    //   iconSize: 24,
    //   disabled: true,
    // },
    {
      label: t('feed'),
      icon: 'feedOutline',
      hoverIcon: 'feedFilled',
      linkTo: '/feed',
      dataTestId: 'office-feed-page',
      iconSize: 24,
    },
    {
      label: t('people'),
      icon: 'peopleOutline',
      hoverIcon: 'peopleFilled',
      linkTo: '/users',
      dataTestId: 'office-people-page',
      iconSize: 24,
      isActive:
        location.pathname.includes('/users') ||
        location.pathname.includes('/teams'),
    },
    {
      label: t('apps'),
      icon: 'launcherOutline',
      hoverIcon: 'launcherFilled',
      linkTo: '/apps',
      dataTestId: 'office-apps-page',
      iconSize: 24,
    },
    // {
    //   label: 'Discover',
    //   icon: 'exploreOutline',
    //   hoverIcon: 'exploreFilled',
    //   linkTo: '/discover',
    //   dataTestId: 'office-discover-page',
    //   iconSize: 26,
    //   disabled: true,
    // },
  ];

  return (
    <div className="w-full sticky top-0 z-50">
      <div className="bg-white shadow h-16 w-full py-[2px]">
        <div className="bg-white h-full w-full max-w-[1440px] flex items-center py-0.5 px-8 mx-auto justify-between">
          <Link to="/feed" data-testid="office-logo">
            <Logo />
          </Link>
          <div className="flex-1" />
          {/* <div className="flex-1">
          <Layout
            fields={[
              {
                type: FieldType.Input,
                control,
                name: 'globalSearch',
                className: 'px-5 py-3',
                placeholder: 'Search name, channel, page, document etc.,',
                dataTestId: 'global-search',
                disabled: false,
              },
            ]}
          />
        </div> */}
          <div className="flex items-center gap-[60px] h-full">
            <div className="flex items-center gap-10">
              {navigations.map((nav) => (
                <NavbarMenuItem nav={nav} key={nav.label} />
              ))}
            </div>
            <Divider className="h-full" variant={Variant.Vertical} />
            <div className="flex items-center gap-10">
              {isAdmin &&
                adminNavigations.map((nav) => (
                  <NavbarMenuItem nav={nav} key={nav.label} />
                ))}
              <div>
                <NotificationsOverview />
              </div>
              <div className="p-2">
                <AccountCard />
              </div>
            </div>
          </div>
        </div>
      </div>
      {showSubscriptionBanner && (
        <SubscriptionBanner
          closeBanner={() => setShowSubscriptionBanner(false)}
        />
      )}
    </div>
  );
};

export default Navbar;
