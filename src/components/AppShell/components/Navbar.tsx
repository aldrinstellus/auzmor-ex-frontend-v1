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

const Navbar = () => {
  const { isLxp } = useProduct();
  const { isAdmin } = useRole();
  const { user } = useAuth();
  const [showSubscriptionBanner, setShowSubscriptionBanner] = useState(
    user?.subscription?.type === 'TRIAL' &&
      user?.subscription?.daysRemaining > -1,
  );

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
      label: 'Feed',
      icon: 'feedOutline',
      hoverIcon: 'feedFilled',
      linkTo: '/feed',
      dataTestId: 'office-feed-page',
      iconSize: 24,
    },
    {
      label: isLxp ? 'Learning Hub' : 'People',
      icon: 'peopleOutline',
      hoverIcon: 'peopleFilled',
      linkTo: isLxp ? getLearnUrl() : '/users',
      dataTestId: 'office-people-page',
      iconSize: 24,
      isActive:
        location.pathname.includes('/users') ||
        location.pathname.includes('/teams'),
    },
    {
      label: 'Apps',
      icon: 'launcherOutline',
      hoverIcon: 'launcherFilled',
      linkTo: '/apps',
      dataTestId: 'office-apps-page',
      iconSize: 24,
      hidden: isLxp,
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
                <NavbarMenuItem nav={nav} key={nav.label} />
              ))}
            </div>
            <Divider className="h-full" variant={Variant.Vertical} />
            <div className="flex items-center gap-6">
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
