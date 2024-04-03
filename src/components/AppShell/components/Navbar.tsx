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
import useProduct from 'hooks/useProduct';
import { getLearnUrl } from 'utils/misc';
import Icon from 'components/Icon';

const learnNavigations = [
  {
    icon: 'messageQuestionOutline',
    hoverIcon: 'messageQuestionFilled',
    linkTo: `${getLearnUrl()}?openHelpSupport=true`,
    dataTestId: 'learn-help-support-page',
    iconSize: 24,
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
  // const navigate = useNavigate();

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

  // const discoverOptions = [
  //   {
  //     icon: 'news',
  //     label: t('discover.channels'),
  //     labelClassName: 'text-xs font-medium',
  //     stroke: 'text-neutral-900',
  //     dataTestId: 'channel-page',
  //     onClick: () => {
  //       navigate('/channels');
  //     },
  //   },
  // ];

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
      hidden: isLxp,
    },
    // {
    //   label: t('discover.title'),
    //   icon: 'exploreOutline',
    //   hoverIcon: 'exploreFilled',
    //   linkTo: '',
    //   dataTestId: 'discover-page',
    //   iconSize: 24,
    //   isActive: location.pathname.includes('/channels'),
    //   render: function () {
    //     return (
    //       <PopupMenu
    //         triggerNode={<NavbarMenuButton nav={this} />}
    //         menuItems={discoverOptions}
    //         className="mt-16 w-[202px] "
    //       />
    //     );
    //   },
    // },
  ].filter((each) => !!!each?.hidden);

  return (
    <div className="w-full sticky top-0 z-50">
      <div className="bg-white shadow h-16 w-full py-[2px] px-8">
        <div className="bg-white h-full w-full max-w-[1440px] flex items-center py-0.5 mx-auto justify-between">
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
          <div className="flex items-center gap-8 h-full">
            <div className="flex items-center gap-6">
              {navigations.map((nav) => (
                <NavbarMenuItem nav={nav} key={nav.dataTestId} />
              ))}
            </div>
            <Divider className="h-full" variant={Variant.Vertical} />
            <div className="flex items-center gap-6">
              {!isLxp &&
                isAdmin &&
                adminNavigations.map((nav) => (
                  <NavbarMenuItem nav={nav} key={nav.dataTestId} />
                ))}
              <div className=" flex gap-6 items-center">
                {isLxp &&
                  learnNavigations.map((nav) => (
                    <Icon
                      name={nav.icon}
                      size={nav.iconSize}
                      key={nav.dataTestId}
                      onClick={() => {
                        window.open(nav.linkTo);
                      }}
                    />
                  ))}
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
