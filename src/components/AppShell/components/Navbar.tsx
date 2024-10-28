import { Link, NavLink, useLocation } from 'react-router-dom';

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
import useProduct from 'hooks/useProduct';
import { getLearnUrl } from 'utils/misc';
import GlobalSearch from './GlobalSearch';
import IconButton, { Size } from 'components/IconButton';
import Icon from 'components/Icon';

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
  const { pathname } = useLocation();
  const [showSubscriptionBanner, setShowSubscriptionBanner] = useState(
    user?.subscription?.type === 'TRIAL' &&
      user?.subscription?.daysRemaining > -1,
  );

  const { t } = useTranslation('navbar');

  const backBtn = {
    show: false,
    linkTo: '',
    label: '',
    for: '',
  };

  if (user?.organization.type === 'LMS') {
    switch (pathname) {
      case '/user/apps':
        backBtn.show = true;
        backBtn.linkTo = getLearnUrl('user');
        backBtn.label = t('backToHome');
        backBtn.for = t('appLauncher');
        break;
      case '/apps':
        backBtn.show = true;
        backBtn.linkTo = getLearnUrl();
        backBtn.label = t('backToHome');
        backBtn.for = t('appLauncher');
        break;
    }
  }

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
      label: t('teams'),
      icon: 'usersOutline',
      hoverIcon: 'usersFilled',
      linkTo: '/teams',
      dataTestId: 'office-team-page',
      iconSize: 24,
      isActive: isLxp && location.pathname.includes('/teams'),
      hidden: !isLxp,
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
      hidden: isLxp,
    },
    {
      label: t('learningHub'),
      icon: 'lifeBuoyOutline',
      hoverIcon: 'lifeBuoyFilled',
      linkTo: `${getLearnUrl()}/user`,
      dataTestId: 'learn-page', // need to change
      iconSize: 24,
      isActive: false, // Since this is for Learning Hub, it's not active by default
      hidden: !isLxp,
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
          <div className="flex items-center gap-2">
            <Link
              to={backBtn.show ? backBtn.linkTo : '/feed'}
              data-testid="office-logo"
              aria-label={`${
                user?.organization.name || user?.organization.domain
              } logo`}
            >
              <Logo />
            </Link>
            {backBtn.show && (
              <div className="text-neutral-900 text-base font-bold">
                {backBtn.for}
              </div>
            )}
          </div>
          {!backBtn.show && process.env.REACT_APP_ENV != 'PRODUCTION' && (
            <div className="flex-1" title="global search">
              <GlobalSearch />
            </div>
          )}
          {!backBtn.show && (
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
                        className="bg-white hover:bg-white active:bg-white"
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
          )}
          {backBtn.show && (
            <NavLink
              to={backBtn.linkTo}
              key={'backBtnNavbar'}
              className="my-[5px] nav-item text-[15px] gap-[8px] transition ease duration-150 group-hover/item:text-primary-500 flex items-center px-4 py-2 border rounded-17xl group"
            >
              <Icon
                name={'arrowLeft'}
                size={18}
                dataTestId={`backBtnNavbarIcon`}
              />
              {backBtn.label}
            </NavLink>
          )}
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
