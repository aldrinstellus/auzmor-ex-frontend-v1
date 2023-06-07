import React from 'react';
import { Link, NavLink, useLocation } from 'react-router-dom';
import { Logo } from 'components/Logo';
import Icon from 'components/Icon';
import Divider, { Variant } from 'components/Divider';
import AccountCard from './AccountCard';
import NotificationsOverview from 'components/NotificationsOverview';
import useRole from 'hooks/useRole';
import Layout, { FieldType } from 'components/Form';
import { useForm } from 'react-hook-form';

const navigations = [
  {
    label: 'Home',
    icon: 'home',
    linkTo: '/home',
    dataTestId: 'offie-home-page',
    iconSize: 24,
    disabled: true,
  },
  {
    label: 'Feed',
    icon: 'feed',
    linkTo: '/feed',
    dataTestId: 'office-feedpage',
    iconSize: 24,
  },
  {
    label: 'People',
    icon: 'people',
    linkTo: '/users',
    dataTestId: 'offie-people-page',
    iconSize: 24,
  },
  {
    label: 'Apps',
    icon: 'launcher',
    linkTo: '/apps',
    dataTestId: 'offie-apps-page',
    iconSize: 24,
    disabled: true,
  },
  {
    label: 'Discover',
    icon: 'explore',
    linkTo: '/discover',
    dataTestId: 'offie-discover-page',
    iconSize: 26,
    disabled: true,
  },
];

const Navbar = () => {
  const { isAdmin } = useRole();
  const location = useLocation();

  const { control } = useForm({
    mode: 'onChange',
  });

  return (
    <header className="sticky top-0 z-40">
      <div className="bg-white shadow h-16 w-full flex items-center justify-center px-8">
        <Link to="/" data-testid="auzmor-office">
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
            <>
              <NavLink
                to={nav.disabled ? location.pathname : nav.linkTo}
                key={nav.label}
                className={({ isActive }) =>
                  isActive ? 'text-primary-500' : 'text-neutral-500'
                }
              >
                <div
                  className="flex flex-col items-center"
                  data-testid={nav.dataTestId}
                >
                  <Icon name={nav.icon} size={nav.iconSize} />
                  <div className="text-sm">{nav.label}</div>
                </div>
              </NavLink>
            </>
          ))}
        </div>
        <div className="mx-8 h-full py-2">
          <Divider variant={Variant.Vertical} />
        </div>
        <div className="flex items-center space-x-8">
          {isAdmin && (
            <NavLink
              to="/admin"
              className={({ isActive }) =>
                isActive ? 'text-primary-500' : 'text-neutral-500'
              }
            >
              <div
                className="flex flex-col items-center"
                data-testid="office-admin-page"
              >
                <Icon name="admin" size={22} />
                <div className="text-sm mt-[1px]">Admin</div>
              </div>
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
