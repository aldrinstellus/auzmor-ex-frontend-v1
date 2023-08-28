import React from 'react';
import { Link } from 'react-router-dom';
import { Logo } from 'components/Logo';
import Divider, { Variant } from 'components/Divider';
import AccountCard from './AccountCard';
import NotificationsOverview from 'components/NotificationsOverview';
import useRole from 'hooks/useRole';
import Layout, { FieldType } from 'components/Form';
import { useForm } from 'react-hook-form';
import NavbarMenuItem from './NavbarMenuItem';

const navigations = [
  {
    label: 'Home',
    icon: 'homeOutline',
    hoverIcon: 'homeFilled',
    linkTo: '/home',
    dataTestId: 'office-home-page',
    iconSize: 24,
    disabled: true,
  },
  {
    label: 'Feed',
    icon: 'feedOutline',
    hoverIcon: 'feedFilled',
    linkTo: '/feed',
    dataTestId: 'office-feed-page',
    iconSize: 24,
  },
  {
    label: 'People',
    icon: 'peopleOutline',
    hoverIcon: 'peopleFilled',
    linkTo: '/users',
    dataTestId: 'office-people-page',
    iconSize: 24,
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
    label: 'Discover',
    icon: 'exploreOutline',
    hoverIcon: 'exploreFilled',
    linkTo: '/discover',
    dataTestId: 'office-discover-page',
    iconSize: 26,
    disabled: true,
  },
];

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
  const { isAdmin } = useRole();

  const { control } = useForm({
    mode: 'onChange',
  });

  return (
    <header className="sticky top-0 z-50">
      <div className="bg-white shadow h-16 w-full flex items-center justify-center px-8">
        <Link to="/feed" data-testid="auzmor-office">
          <Logo />
        </Link>
        <div className="mx-8 w-[40%]">
          <Layout
            fields={[
              {
                type: FieldType.Input,
                control,
                name: 'globalSearch',
                className: '',
                placeholder: 'Search name, channel, page, document etc.,',
                dataTestId: 'global-search',
                disabled: true,
              },
            ]}
          />
        </div>
        <div className="flex items-center space-x-8">
          {navigations.map((nav) => (
            <NavbarMenuItem nav={nav} key={nav.label} />
          ))}
        </div>
        <div className="mx-8 h-full py-2">
          <Divider variant={Variant.Vertical} />
        </div>
        <div className="flex items-center space-x-8">
          {isAdmin &&
            adminNavigations.map((nav) => (
              <NavbarMenuItem nav={nav} key={nav.label} />
            ))}
          <div>
            <NotificationsOverview />
          </div>
          <div>
            <AccountCard />
          </div>
        </div>
      </div>
    </header>
  );
};

export default Navbar;
