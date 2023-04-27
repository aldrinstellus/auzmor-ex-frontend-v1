import React from 'react';

import { Link, NavLink } from 'react-router-dom';
import { Logo } from 'components/Logo';
import Icon from 'components/Icon';
import useAuth from 'hooks/useAuth';
import Divider, { Variant } from 'components/Divider';
import Avatar from 'components/Avatar';

const navigations = [
  {
    label: 'Home',
    icon: 'home',
    linkTo: '/home',
  },
  {
    label: 'Feed',
    icon: 'feed',
    linkTo: '/feed',
  },
  {
    label: 'People',
    icon: 'people',
    linkTo: '/users',
  },
  {
    label: 'Apps',
    icon: 'launcher',
    linkTo: '/apps',
  },
  {
    label: 'Discover',
    icon: 'explore',
    linkTo: '/discover',
  },
];

const Navbar = () => {
  const { user } = useAuth();

  return (
    <header className="sticky top-0 z-40">
      {/* add media query classes - make it responsiveness */}
      <div className="bg-white shadow h-16 w-full flex items-center justify-center px-8">
        <Link to="/">
          <Logo />
        </Link>
        <div className="mx-8 w-[40%]">
          <div className="w-full border px-4 border-solid py-2 rounded-full flex items-center justify-between">
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
                <Icon name={nav.icon} />
                <div className="text-sm mt-[2px]">{nav.label}</div>
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
              <Icon name="admin" />
              <div className="text-sm">Admin</div>
            </div>
          </NavLink>
          <div>
            <Icon name="notification" />
          </div>
          <div>
            <Avatar name={user?.name || 'U'} size={32} />
          </div>
        </div>
      </div>
    </header>
  );
};

export default Navbar;
