import React from 'react';

import { Link, NavLink } from 'react-router-dom';
import { Logo } from 'components/Logo';

const navigations = [
  {
    label: 'Home',
    icon: 1,
    linkTo: '/home',
  },
  {
    label: 'Feed',
    icon: 2,
    linkTo: '/feed',
  },
  {
    label: 'People',
    icon: 3,
    linkTo: '/users',
  },
  {
    label: 'Apps',
    icon: 4,
    linkTo: '/apps',
  },
  {
    label: 'Discover',
    icon: 5,
    linkTo: '/discover',
  },
];

const Navbar = () => {
  return (
    <header className="sticky top-0 z-50">
      {/* add media query classes - make it responsiveness */}
      <div className="bg-white shadow h-16 w-full flex items-center justify-center px-8">
        <Link to="/">
          <Logo />
        </Link>
        <div className="mx-8 w-[40%]">
          <div className="w-full border px-4 border-1 border-solid py-2 rounded-full flex items-center justify-between">
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
                <span>{nav.icon}</span>
                <div className="text-sm">{nav.label}</div>
              </div>
            </NavLink>
          ))}
        </div>
        {/* replace with divider component library */}
        <div className="mx-8">
          <div>|</div>
        </div>
        <div className="flex items-center space-x-8">
          <NavLink
            to="/admin"
            className={({ isActive }) =>
              isActive ? 'text-primary-500' : 'text-neutral-500'
            }
          >
            <div className="flex flex-col items-center">
              <span>6</span>
              <div className="text-sm">Admin</div>
            </div>
          </NavLink>
          {/* replace with component library - Notification Icon */}
          <div>N</div>
          {/* replace with component library (dropdown) - avatar component */}
          <div>Avatar</div>
        </div>
      </div>
    </header>
  );
};

export default Navbar;
