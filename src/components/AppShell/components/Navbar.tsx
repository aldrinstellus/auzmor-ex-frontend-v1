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
import GlobalSearch from './GlobalSearch';

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

  const navigations = [
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
      hidden: false,
    },
    {
      label: t('apps'),
      icon: 'launcherOutline',
      hoverIcon: 'launcherFilled',
      linkTo: '/apps',
      dataTestId: 'office-apps-page',
      iconSize: 24,
    },
    {
      label: t('channels'),
      icon: 'exploreOutline',
      hoverIcon: 'exploreFilled',
      linkTo: '/channels',
      dataTestId: 'channels-page',
      iconSize: 24,
      isActive: location.pathname.includes('/channels'),
      hidden: process.env.REACT_APP_ENV === 'PRODUCTION', // hide for office and lxp
    },
  ].filter((each) => !!!each?.hidden);

  return (
    <nav className="w-full sticky top-0 z-50">
      <div className="bg-white shadow h-16 w-full py-[2px] px-8">
        <div className="bg-white h-full w-full max-w-[1440px] flex items-center py-0.5 gap-8 mx-auto justify-between">
          <Link
            to="/feed"
            data-testid="office-logo"
            aria-label={`${
              user?.organization.name || user?.organization.domain
            } logo`}
          >
            <Logo />
          </Link>

          {process.env.REACT_APP_ENV != 'PRODUCTION' && (
            <div className="flex-1" title="global search">
              <GlobalSearch />
            </div>
          )}
          <div className="flex items-center gap-8 h-full">
            <ul className="flex items-center gap-6">
              {navigations.map((nav) => (
                <li key={nav.dataTestId} className="flex">
                  <NavbarMenuItem nav={nav} />
                </li>
              ))}
            </ul>
            <Divider className="h-full" variant={Variant.Vertical} />
            <ul className="flex items-center gap-6">
              {isAdmin &&
                adminNavigations.map((nav) => (
                  <li key={nav.dataTestId} className="flex">
                    <NavbarMenuItem nav={nav} />
                  </li>
                ))}

              <li>
                <NotificationsOverview />
              </li>
              <li>
                <AccountCard />
              </li>
            </ul>
          </div>
        </div>
      </div>
      {showSubscriptionBanner && (
        <SubscriptionBanner
          closeBanner={() => setShowSubscriptionBanner(false)}
        />
      )}
    </nav>
  );
};

export default Navbar;
