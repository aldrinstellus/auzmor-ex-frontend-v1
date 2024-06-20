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
import useProduct from 'hooks/useProduct';
import { getLearnUrl } from 'utils/misc';
import GlobalSearch from './GlobalSearch';
import IconButton, { Size } from 'components/IconButton';

const learnNavigations = [
  {
    icon: 'messageQuestionOutline',
    hoverIcon: 'messageQuestionFilled',
    linkTo: `${getLearnUrl()}?openHelpSupport=true`,
    dataTestId: 'learn-help-support-page',
    iconSize: 24,
    ariaLabel: 'help and support',
  },
];

const Navbar = () => {
  const { isLxp } = useProduct();
  const { isAdmin } = useRole();
  const { user } = useAuth();
  const [showSubscriptionBanner, setShowSubscriptionBanner] = useState(
    user?.subscription?.type === 'TRIAL' &&
      user?.subscription?.daysRemaining > -1,
  );

  const adminNavigations = [
    {
      label: 'Admin',
      icon: 'adminOutline',
      hoverIcon: 'adminFilled',
      linkTo: '/admin',
      dataTestId: 'office-admin-page',
      iconSize: 24,
    },
  ];

  const navigations = [
    {
      label: 'Feed',
      icon: 'feedOutline',
      hoverIcon: 'feedFilled',
      linkTo: '/feed',
      dataTestId: 'office-feed-page',
      iconSize: 24,
    },
    {
      label: 'Teams',
      icon: 'usersOutline',
      hoverIcon: 'usersFilled',
      linkTo: '/teams',
      dataTestId: 'office-team-page',
      iconSize: 24,
      isActive: isLxp && location.pathname.includes('/teams'),
      hidden: !isLxp,
    },
    {
      label: 'People',
      icon: 'peopleOutline',
      hoverIcon: 'peopleFilled',
      linkTo: '/users',
      dataTestId: 'office-people-page',
      iconSize: 24,
      isActive:
        location.pathname.includes('/users') ||
        location.pathname.includes('/teams'),
      hidden: isLxp,
    },
    {
      label: 'Learning Hub',
      icon: 'lifeBuoyOutline',
      hoverIcon: 'lifeBuoyFilled',
      linkTo: `${getLearnUrl()}/user`,
      dataTestId: 'learn-page', // need to change
      iconSize: 24,
      isActive: false, // Since this is for Learning Hub, it's not active by default
      hidden: !isLxp,
    },
    {
      label: 'Apps',
      icon: 'launcherOutline',
      hoverIcon: 'launcherFilled',
      linkTo: '/apps',
      dataTestId: 'office-apps-page',
      iconSize: 24,
    },
    {
      label: 'Channels',
      icon: 'exploreOutline',
      hoverIcon: 'exploreFilled',
      linkTo: '/channels',
      dataTestId: 'discover-page',
      iconSize: 24,
      isActive: location.pathname.includes('/channels'),
      hidden: process.env.REACT_APP_ENV === 'PRODUCTION',
    },
  ].filter((each) => !!!each?.hidden);

  return (
    <nav className="w-full sticky top-0 z-50">
      <div className="bg-white shadow h-16 w-full py-[2px] px-8">
        <div className="bg-white h-full w-full max-w-[1440px] flex items-center py-0.5 mx-auto justify-between">
          <Link to="/feed" data-testid="office-logo">
            <Logo />
          </Link>

          {process.env.REACT_APP_ENV != 'PRODUCTION' && (
            <div className="flex-1" aria-label="global search">
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
              {!isLxp &&
                isAdmin &&
                adminNavigations.map((nav) => (
                  <li key={nav.dataTestId} className="flex">
                    <NavbarMenuItem nav={nav} />
                  </li>
                ))}
              {isLxp &&
                learnNavigations.map((nav) => (
                  <li key={nav.dataTestId}>
                    <IconButton
                      icon={nav.icon}
                      size={Size.Large}
                      onClick={() => {
                        window.open(nav.linkTo);
                      }}
                      ariaLabel="help and support"
                      className="bg-white hover:bg-white"
                    />
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
