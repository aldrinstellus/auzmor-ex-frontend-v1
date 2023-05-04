import React from 'react';

import { Link, NavLink } from 'react-router-dom';
import { Logo } from 'components/Logo';
import Icon from 'components/Icon';
import Divider, { Variant } from 'components/Divider';
import AccountCard from './AccountCard';

const navigations = [
  {
    label: 'Home',
    icon: 'home',
    linkTo: '/home',
    iconSize: 24,
  },
  {
    label: 'Feed',
    icon: 'feed',
    linkTo: '/feed',
    iconSize: 24,
  },
  {
    label: 'People',
    icon: 'people',
    linkTo: '/users',
    iconSize: 24,
  },
  {
    label: 'Apps',
    icon: 'launcher',
    linkTo: '/apps',
    iconSize: 24,
  },
  {
    label: 'Discover',
    icon: 'explore',
    linkTo: '/discover',
    iconSize: 26,
  },
];

const Navbar = () => {
  return (
    <header className="sticky top-0 z-40">
      <div className="bg-white shadow h-16 w-full flex items-center justify-center px-8">
        <Link to="/">
          <Logo />
        </Link>
        <div className="mx-8 w-[40%]">
          <div className="w-full border px-4 border-solid py-2 rounded-22xl flex items-center justify-between">
            <span className="text-gray-300 text-sm">
              Search name, channel, page, document etc.,
            </span>
            <div className="ml-5">Q</div>
          </div>
        </div>
        <div className="flex items-center space-x-8">
          {navigations.map((nav) => (
            <NavLink
              to={nav.linkTo}
              key={nav.label}
              className={({ isActive }) =>
                isActive ? 'text-primary-500' : 'text-neutral-500'
              }
            >
              <div className="flex flex-col items-center">
                <Icon name={nav.icon} size={nav.iconSize} />
                <div className="text-sm">{nav.label}</div>
              </div>
            </NavLink>
          ))}
        </div>
        <div className="mx-8 h-full py-2">
          <Divider variant={Variant.Vertical} />
        </div>
        <div className="flex items-center space-x-8">
          <NavLink
            to="/admin"
            className={({ isActive }) =>
              isActive ? 'text-primary-500' : 'text-neutral-500'
            }
          >
            <div className="flex flex-col items-center">
              <Icon name="admin" size={22} />
              <div className="text-sm mt-[1px]">Admin</div>
            </div>
          </NavLink>
          <div>
            <Icon name="notification" size={26} />
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
