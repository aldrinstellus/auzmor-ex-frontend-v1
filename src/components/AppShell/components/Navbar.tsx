import React, { useEffect, useRef, useState } from 'react';

import { Link, NavLink } from 'react-router-dom';
import { Logo } from 'components/Logo';
import Icon from 'components/Icon';
import Divider, { Variant } from 'components/Divider';
import AccountCard from './AccountCard';
import Notifications from 'components/Notifications';
import useRole from 'hooks/useRole';
import notifications from './dummy.json';
import { useGetNotifications } from 'queries/notifications';
import Spinner from 'components/Spinner';
import queryClient from 'utils/queryClient';

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

export enum NotificationType {
  ALL = 'All',
  MENTIONS = 'Mentions',
}

const Navbar = () => {
  const notifRef = useRef<HTMLDivElement>(null);
  const { isAdmin } = useRole();

  const [showNotifications, setShowNotifications] = useState<boolean>(false);
  const [notificationType, setNotificationType] = useState<NotificationType>(
    NotificationType.ALL,
  );

  useEffect(() => {
    const checkIfClickedOutside = (e: any) => {
      // If the menu is open and the clicked target is not within the menu,
      // then close the menu
      if (
        showNotifications &&
        notifRef.current &&
        !notifRef.current.contains(e.target)
      ) {
        setShowNotifications(false);
      }
    };

    document.addEventListener('mousedown', checkIfClickedOutside);

    return () => {
      // Cleanup the event listener
      document.removeEventListener('mousedown', checkIfClickedOutside);
    };
  }, [showNotifications]);

  const { data, isLoading, isError } = useGetNotifications(
    notificationType === NotificationType.MENTIONS,
  );

  useEffect(() => {
    console.log({ notificationType });
    console.log(notificationType === NotificationType.MENTIONS);
    queryClient.invalidateQueries(['get-notifications']);
  }, [notificationType]);

  useEffect(() => {
    console.log({ data });
  }, [data]);

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
          {isAdmin && (
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
          )}
          <div ref={notifRef} className="relative cursor-pointer">
            <div
              className="box-border font-bold flex flex-row justify-center items-center p-1 gap-4 border-none relative"
              onClick={() => setShowNotifications(!showNotifications)}
            >
              {!isLoading && (
                <div className="absolute rounded-full bg-red-600 text-white text-xxs -top-1 -right-1.5 flex w-4 h-4 items-center justify-center">
                  {/* Get unread notif count here */}10
                </div>
              )}
              {isLoading && (
                <Spinner
                  className="absolute -top-1 -right-1.5 w-3 h-3 border-2"
                  color="#dc2626"
                />
              )}

              <Icon name="notification" size={26} disabled={true} />
            </div>
            {showNotifications && (
              <Notifications
                notifications={notifications.data}
                setShowNotifications={setShowNotifications}
                isLoading={isLoading}
                setNotificationType={setNotificationType}
              />
            )}
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
