import React from 'react';
import Avatar from 'components/Avatar';
import useAuth from 'hooks/useAuth';
import Popover from 'components/Popover';
import Button, { Size, Variant } from 'components/Button';
import clsx from 'clsx';
import { useMutation } from '@tanstack/react-query';
import { logout } from 'queries/account';
import { Link, useNavigate } from 'react-router-dom';
import Icon from 'components/Icon';
import { twConfig } from 'utils/misc';

const AccountCard = () => {
  const navigate = useNavigate();
  const { user, reset } = useAuth();

  const logoutMutation = useMutation(logout, {
    onSuccess: async () => {
      reset();
      navigate('/logout');
    },
  });

  const menuItemStyle = clsx({
    'px-4 py-3 border-t text-sm hover:bg-primary-50 cursor-pointer': true,
  });

  return (
    <>
      <Popover
        triggerNode={
          <Avatar
            dataTestId="my-profile-avatar"
            name={user?.name || 'U'}
            size={32}
            image={user?.profileImage}
          />
        }
        className="-right-2 top-[52px] rounded-9xl"
        contentRenderer={(close) => (
          <div className="rounded-9xl flex flex-col items-center w-64 shadow overflow-hidden">
            <div className="px-4 py-5 flex flex-col items-center">
              <Avatar
                size={80}
                name={user?.name || 'U'}
                image={user?.profileImage}
                // showActiveIndicator
              />
              <div
                className="text-sm font-bold mt-4"
                data-testId="user-menu-user-name"
              >
                {user?.name}
              </div>
              <div
                className="text-neutral-500 text-xs"
                data-testId="user-menu-user-email"
              >
                {user?.email}
              </div>
            </div>
            <div className="px-4 w-full">
              <Button
                dataTestId="user-menu-profile"
                variant={Variant.Secondary}
                label="Go to my profile"
                onClick={() => {
                  navigate('/profile', { state: { userId: user?.id } });
                  close();
                }}
                size={Size.Small}
                className="w-full"
              />
            </div>
            <div className="w-full pt-4">
              <Link to="/settings">
                <div
                  className={`flex ${menuItemStyle}`}
                  data-testId="user-menu-user-settings"
                  onClick={close}
                >
                  <Icon
                    name="settingOutline"
                    size={20}
                    className="mr-2.5"
                    stroke={twConfig.theme.colors.neutral['900']}
                  />
                  <div className="text-neutral-900 text-sm">User Settings</div>
                </div>
              </Link>
              <div
                className={`flex ${menuItemStyle}`}
                data-testId="user-menu-admin-settings"
                onClick={close}
              >
                <Icon
                  name="settingThreeOutline"
                  size={20}
                  className="mr-2.5"
                  stroke={twConfig.theme.colors.neutral['900']}
                />
                <div className="text-neutral-900 text-sm">Admin Settings</div>
              </div>
              <div
                className={`flex ${menuItemStyle}`}
                onClick={() => {
                  logoutMutation.mutate();
                  close();
                }}
                data-testId="user-menu-signout-cta"
              >
                <Icon
                  name="logoutOutline"
                  size={20}
                  className="mr-2.5"
                  stroke={twConfig.theme.colors.neutral['900']}
                />
                <div className="text-neutral-900 text-sm">Sign out</div>
              </div>
            </div>
          </div>
        )}
      />
    </>
  );
};

export default AccountCard;
