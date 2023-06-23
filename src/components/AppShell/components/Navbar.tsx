import React from 'react';
import { Link, NavLink } from 'react-router-dom';
import { Logo } from 'components/Logo';
import Icon from 'components/Icon';
import Divider, { Variant } from 'components/Divider';
import AccountCard from './AccountCard';
import NotificationsOverview from 'components/NotificationsOverview';
import useRole from 'hooks/useRole';
import Layout, { FieldType } from 'components/Form';
import { useForm } from 'react-hook-form';
import { twConfig } from 'utils/misc';
import NavbarMenuItem from './NavbarMenuItem';

const navigations = [
  {
    label: 'Home',
    icon: 'home',
    linkTo: '/home',
    dataTestId: 'office-home-page',
    iconSize: 24,
    disabled: true,
  },
  {
    label: 'Feed',
    icon: 'feed',
    linkTo: '/feed',
    dataTestId: 'office-feed-page',
    iconSize: 24,
  },
  {
    label: 'People',
    icon: 'people',
    linkTo: '/users',
    dataTestId: 'office-people-page',
    iconSize: 24,
  },
  {
    label: 'Apps',
    icon: 'launcher',
    linkTo: '/apps',
    dataTestId: 'office-apps-page',
    iconSize: 24,
    disabled: true,
  },
  {
    label: 'Discover',
    icon: 'explore',
    linkTo: '/discover',
    dataTestId: 'office-discover-page',
    iconSize: 26,
    disabled: true,
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
          {navigations.map((nav) =>
            nav.disabled ? (
              <div
                className="flex flex-col items-center"
                data-testid={nav.dataTestId}
                key={nav.label}
              >
                <Icon
                  name={nav.icon}
                  size={nav.iconSize}
                  stroke={twConfig.theme.colors.neutral['200']}
                  disabled
                />
                <div className="text-sm text-neutral-200 cursor-default">
                  {nav.label}
                </div>
              </div>
            ) : (
              <NavbarMenuItem nav={nav} key={nav.label} />
            ),
          )}
        </div>
        <div className="mx-8 h-full py-2">
          <Divider variant={Variant.Vertical} />
        </div>
        <div className="flex items-center space-x-8">
          {isAdmin && (
            <NavLink
              to="/admin"
              className={({ isActive }) =>
                `${isActive ? 'text-primary-500' : 'text-neutral-500'} group`
              }
            >
              {({ isActive }) => (
                <div
                  className="flex flex-col items-center"
                  data-testid="office-admin-page"
                >
                  <Icon name="admin" size={24} isActive={isActive} />
                  <div className="text-sm mt-[1px] group-hover:text-primary-500">
                    Admin
                  </div>
                </div>
              )}
            </NavLink>
          )}
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
